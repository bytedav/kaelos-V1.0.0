import React from 'react';
import { ContactFormSection } from '../components/ContactFormSection';

export const ContactoPage: React.FC = () => {
  return (
    <div className="animate-fade-in bg-white min-h-screen py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111215] tracking-tight leading-tight">
            Tenemos una solución para ti
          </h1>
        </div>
        <div className="max-w-3xl mx-auto">
          <ContactFormSection noWrapper={true} />
        </div>
      </div>
    </div>
  );
};

export default ContactoPage;
