import React, { useRef } from 'react';
import { Camera, ImagePlus } from 'lucide-react';

interface CameraInputProps {
  onImageSelected: (base64: string) => void;
  isLoading: boolean;
}

export const CameraInput: React.FC<CameraInputProps> = ({ onImageSelected, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onImageSelected(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        capture="environment" // Hints mobile browsers to use the rear camera directly
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={isLoading}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        className="
          flex items-center justify-center gap-2
          bg-eco-600 hover:bg-eco-700 active:bg-eco-800
          text-white font-bold py-3 px-6 rounded-full
          shadow-lg shadow-eco-200 transition-all transform active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
          w-full sm:w-auto
        "
      >
        <Camera size={20} />
        <span>Scan Waste</span>
      </button>
    </>
  );
};