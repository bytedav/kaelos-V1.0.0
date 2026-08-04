/**
 * Utility to convert and compress uploaded binary files (DNI, receipts, vouchers)
 * into lightweight, persistent Data URLs for localStorage and database persistence.
 */

export interface StoredFileInfo {
  name: string;
  url: string;
  type?: string;
  size?: number;
  uploadedAt?: string;
}

export const compressFileToDataUrl = async (file: File): Promise<StoredFileInfo> => {
  return new Promise((resolve) => {
    // If PDF or non-image file, read as standard Data URL
    if (file.type.includes('pdf') || !file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          name: file.name,
          url: reader.result as string,
          type: file.type,
          size: file.size,
          uploadedAt: new Date().toISOString(),
        });
      };
      reader.onerror = () => {
        resolve({
          name: file.name,
          url: '',
          type: file.type,
          size: file.size,
          uploadedAt: new Date().toISOString(),
        });
      };
      reader.readAsDataURL(file);
      return;
    }

    // For image files: Compress & resize using canvas for optimal lightweight storage
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      const MAX_DIMENSION = 1200;

      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve({
          name: file.name,
          url: compressedDataUrl,
          type: 'image/jpeg',
          size: Math.round((compressedDataUrl.length * 3) / 4),
          uploadedAt: new Date().toISOString(),
        });
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            name: file.name,
            url: reader.result as string,
            type: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString(),
          });
        };
        reader.readAsDataURL(file);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          name: file.name,
          url: reader.result as string,
          type: file.type,
          size: file.size,
          uploadedAt: new Date().toISOString(),
        });
      };
      reader.readAsDataURL(file);
    };

    img.src = objectUrl;
  });
};
