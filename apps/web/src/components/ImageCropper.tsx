import React, { useState, useRef } from 'react';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import getCroppedImg from '../utils/cropImage';
import { X, Check, Loader2 } from 'lucide-react';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedFile: File, previewUrl: string) => void;
  onCancel: () => void;
}

export default function ImageCropper({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleConfirmCrop = async () => {
    if (!completedCrop || !imgRef.current) return;
    try {
      setIsCropping(true);
      
      // Calculate scale since image might be rendered smaller than actual size
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      const pixelCrop = {
        x: completedCrop.x * scaleX,
        y: completedCrop.y * scaleY,
        width: completedCrop.width * scaleX,
        height: completedCrop.height * scaleY,
      };

      const croppedFile = await getCroppedImg(imageSrc, pixelCrop);
      if (croppedFile) {
        const previewUrl = URL.createObjectURL(croppedFile);
        onCropComplete(croppedFile, previewUrl);
      }
    } catch (e) {
      console.error('Error cropping image:', e);
    } finally {
      setIsCropping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-4xl max-h-[70vh] bg-zinc-900 rounded-t-2xl overflow-y-auto shadow-2xl border border-zinc-800 flex items-center justify-center p-4">
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          className="max-h-[65vh]"
        >
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Crop me"
            className="max-h-[65vh] object-contain"
          />
        </ReactCrop>
      </div>
      
      {/* Controls */}
      <div className="w-full max-w-4xl bg-zinc-900 border border-t-0 border-zinc-800 rounded-b-2xl p-5 shadow-2xl flex items-center justify-between">
        <p className="text-zinc-400 text-xs">
          Drag the corners to adjust vertical &amp; horizontal size freely.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            disabled={isCropping}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
          <button
            onClick={handleConfirmCrop}
            disabled={isCropping || !completedCrop?.width || !completedCrop?.height}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-500/20 disabled:opacity-50"
          >
            {isCropping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Confirm Crop
          </button>
        </div>
      </div>
    </div>
  );
}
