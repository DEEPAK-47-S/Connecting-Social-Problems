import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import { X, Check, Loader2 } from 'lucide-react';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedFile: File, previewUrl: string) => void;
  onCancel: () => void;
}

export default function ImageCropper({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);

  const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirmCrop = async () => {
    try {
      setIsCropping(true);
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
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
      <div className="relative w-full max-w-2xl h-[60vh] bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={16 / 9}
          onCropChange={setCrop}
          onCropComplete={onCropCompleteHandler}
          onZoomChange={setZoom}
          classes={{ containerClassName: 'rounded-t-2xl' }}
        />
      </div>
      
      {/* Controls */}
      <div className="w-full max-w-2xl bg-zinc-900 border border-t-0 border-zinc-800 rounded-b-2xl p-5 shadow-2xl flex flex-col gap-4">
        <div>
          <label className="text-xs font-bold text-zinc-400 mb-2 block uppercase tracking-wider">Zoom</label>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>
        
        <div className="flex items-center justify-end gap-3 pt-2">
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
            disabled={isCropping}
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
