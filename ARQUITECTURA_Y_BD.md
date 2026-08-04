# Arquitectura de Base de Datos e Integración Cloudflare R2

Este documento recopila la **ingeniería inversa completa de la base de datos** del proyecto Kaelos / MotoMarket, así como el **flujo técnico automatizado** para conectar Cloudflare R2 con Supabase / PostgreSQL / Firebase. Sirve como referencia arquitectónica para cualquier desarrollador o IA que continúe con la implementación del panel de control.

---

## 1. Deducción e Ingeniería Inversa del Esquema de BD

A partir del análisis del código fuente (`server.ts`, `src/types/content.ts`, `src/utils/storage.ts`, componentes y endpoints), el sistema administra las siguientes entidadaes y estructuras de datos:

### A. Tabla `motorbikes` (Catálogo de Motocicletas)
Almacena todas las motos (motos nuevas, ocasión, ofertas).

```sql
CREATE TABLE IF NOT EXISTS motorbikes (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  cc INT NOT NULL,
  year INT NOT NULL,
  kms INT NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2), -- Precio previo para ofertas/descuentos
  image VARCHAR(1000) NOT NULL, -- URL pública alojada en Cloudflare R2
  gallery TEXT[],               -- Array de URLs de imágenes secundarias
  category VARCHAR(50) NOT NULL, -- 'scooter', 'naked', 'trail', 'custom', 'deportiva', etc.
  condition VARCHAR(50) NOT NULL, -- 'nueva', 'ocasion', 'oferta'
  status VARCHAR(50) NOT NULL DEFAULT 'disponible', -- 'disponible', 'reservada', 'vendida'
  badge VARCHAR(100),           -- Ej: 'Oportunidad', 'Últimas unidades', 'Ahorra 500€'
  power VARCHAR(50),           -- Ej: '15 CV'
  license VARCHAR(50),         -- Ej: 'A1 / B', 'A2', 'A'
  warranty VARCHAR(100),       -- Ej: '3 años oficial'
  location VARCHAR(100),       -- Ej: 'Barcelona', 'Madrid'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

### B. Tabla `orders` (Solicitudes de Compra y Financiamiento)
Almacena las solicitudes creadas desde la vista de financiación y checkout.

```sql
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(100) PRIMARY KEY,
  bike_id VARCHAR(100) REFERENCES motorbikes(id) ON DELETE SET NULL,
  payment_mode VARCHAR(20) NOT NULL, -- 'contado' | 'financiado'
  selected_pack VARCHAR(20) DEFAULT 'economico', -- 'basico' | 'economico' | 'premium'
  selected_term INT,                 -- Meses de financiación (ej: 36, 48, 60, 72, 84)
  down_payment DECIMAL(10,2) DEFAULT 0, -- Entrada aportada
  total_price DECIMAL(10,2) NOT NULL,
  monthly_fee DECIMAL(10,2),         -- Cuota mensual estimada
  use_old_bike BOOLEAN DEFAULT FALSE, -- Indica si el cliente desea entregar/tasar su moto actual
  full_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pendiente', -- 'pendiente', 'contactado', 'aprobado', 'cancelado'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

### C. Tabla `reservations` (Reservas Online de Motos)
Registra el apartado preventivo de una moto por parte de un cliente.

```sql
CREATE TABLE IF NOT EXISTS reservations (
  id VARCHAR(100) PRIMARY KEY,
  bike_id VARCHAR(100) REFERENCES motorbikes(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  deposit_amount DECIMAL(10,2) NOT NULL DEFAULT 100.00,
  status VARCHAR(50) NOT NULL DEFAULT 'activa', -- 'activa', 'completada', 'expirada', 'cancelada'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

### D. Tabla `leads_tasacion` (Solicitudes de Tasación "Vende tu Moto")
Captura los datos de clientes que quieren tasar o vender su moto usada.

```sql
CREATE TABLE IF NOT EXISTS leads_tasacion (
  id VARCHAR(100) PRIMARY KEY,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INT NOT NULL,
  kms INT NOT NULL,
  condition VARCHAR(100),
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50) NOT NULL,
  photos TEXT[], -- URLs en R2 de las fotos de la moto del cliente
  status VARCHAR(50) DEFAULT 'pendiente_contacto',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

### E. Tabla `push_subscriptions` (Suscripciones Web Push)
Almacena los tokens Web Push para notificaciones a usuarios.

```sql
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(100),
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 2. Flujo Automatizado de Subida a Cloudflare R2 + Registro en Base de Datos

Cuando un empleado interactúa con el **Panel de Administración (Backoffice)** para subir o actualizar una moto, el proceso debe ser completamente transparente y automático:

```
+------------------+         1. Solicitar Presigned URL          +-------------------+
|  Empleado en     | -----------------------------------------> |  Servidor Backend |
|  Panel Admin     |                                            | (Express/Node API)|
+------------------+                                            +-------------------+
        |                                                                 |
        | 2. Retornar Presigned Upload URL + Key R2                       | 2. Genera R2 URL
        |<----------------------------------------------------------------+  con AWS SDK
        |
        | 3. Subida directa del binario (Sin sobrecargar backend)
        |----------------------------------------------------------> +-------------------+
        |                                                            | Cloudflare R2     |
        | 4. Confirmación 200 OK HTTP                                | Bucket Object     |
        |<---------------------------------------------------------- +-------------------+
        |
        | 5. Guardar Moto en BD (Enviar json con URL pública R2)
        |----------------------------------------------------------> +-------------------+
        |                                                            | Base de Datos     |
        | 6. Trigger / Webhook opcional -> Disparar Notificaciones   | (Supabase/Postgres|
        |<---------------------------------------------------------- +-------------------+
```

---

## 3. Código de Ejemplo para Integración de Cloudflare R2

### Backend API (Express.js + `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner`)

Cloudflare R2 es 100% compatible con la API de Amazon S3.

```typescript
// server/services/r2Service.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'kaelos-motos';
const PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN || 'https://pub-motos.kaelos.com';

/**
 * Genera una URL firmada de subida temporal para que el cliente suba la imagen directo a R2
 */
export async function generateUploadUrl(fileName: string, contentType: string) {
  const fileKey = `motos/${Date.now()}-${fileName.replace(/\s+/g, '-')}`;
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    ContentType: contentType,
  });

  // URL de subida (valida por 5 minutos)
  const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 300 });

  // URL pública final que se guardará en la base de datos
  const publicUrl = `${PUBLIC_DOMAIN}/${fileKey}`;

  return { uploadUrl, publicUrl, fileKey };
}
```

### Endpoint API para el Panel de Empleado

```typescript
// En server.ts
app.post('/api/admin/motos/upload-url', async (req, res) => {
  try {
    const { fileName, contentType } = req.body;
    const data = await generateUploadUrl(fileName, contentType);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: 'Error al generar la URL de subida R2', details: err.message });
  }
});

// Guardar Moto con la URL de R2
app.post('/api/admin/motos', async (req, res) => {
  try {
    const bikeData = req.body; // Incluye bikeData.image que es la publicUrl de R2
    
    // Inserción en Supabase / PostgreSQL
    // const newBike = await db.insert(motorbikes).values(bikeData);

    // Opcional: Enviar notificación push si es una nueva oferta u ocasión
    // if (bikeData.condition === 'oferta') {
    //   await sendWebPushNotification('¡Nueva Oferta Disponible!', `Descubre la nueva ${bikeData.name}`);
    // }

    res.json({ success: true, bike: bikeData });
  } catch (err: any) {
    res.status(500).json({ error: 'Error al registrar la moto en BD' });
  }
});
```

### Código Frontend en el Panel de Empleado (Subida Automática)

```typescript
async function handleCreateMoto(formValues: any, selectedFile: File) {
  // 1. Obtener la URL firmada de R2
  const resUrl = await fetch('/api/admin/motos/upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName: selectedFile.name, contentType: selectedFile.type }),
  });
  const { uploadUrl, publicUrl } = await resUrl.json();

  // 2. Subir directamente el archivo a Cloudflare R2
  await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': selectedFile.type },
    body: selectedFile,
  });

  // 3. Guardar el producto en la BD con la URL final de la imagen
  const motoData = {
    ...formValues,
    image: publicUrl, // URL pública en Cloudflare R2
  };

  const saveRes = await fetch('/api/admin/motos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(motoData),
  });

  return await saveRes.json();
}
```

---

## 4. Resumen de Ventajas de la Arquitectura R2 + BD

1. **Sin costos de egreso / ancho de banda:** Cloudflare R2 no cobra por la descarga/transferencia de datos.
2. **Capa gratuita ilimitada en el tiempo:** 10 GB al mes de almacenamiento gratis y 10,000,000 de lecturas.
3. **Alto rendimiento:** La subida va directamente al CDN global de Cloudflare sin pasar ni ralentizar el servidor web Node.js/Express.
4. **Desacoplamiento perfecto:** La base de datos solo guarda la referencia de texto (`image_url`), manteniendo la base de datos ligera y ágil.
