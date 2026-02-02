'use client';

import { useState, useRef } from 'react';
import { storageApi } from '@/lib/api';
import { Upload, X, Check, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';

interface AdminImageUploadProps {
    onUploadComplete: (url: string) => void;
    currentImageUrl?: string;
    folder?: string;
    label?: string;
}

export default function AdminImageUpload({
    onUploadComplete,
    currentImageUrl,
    folder = 'general',
    label = 'Imagen de fondo'
}: AdminImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            setError('Por favor seleccione un archivo de imagen válido.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('La imagen es demasiado grande. Máximo 5MB.');
            return;
        }

        setIsUploading(true);
        setError(null);

        // Local preview
        const localUrl = URL.createObjectURL(file);
        setPreviewUrl(localUrl);

        try {
            const publicUrl = await storageApi.uploadImage(file, folder);
            if (publicUrl) {
                setPreviewUrl(publicUrl);
                onUploadComplete(publicUrl);
            } else {
                throw new Error('Error al obtener la URL pública');
            }
        } catch (err) {
            console.error('Upload failed:', err);
            setError('Error al subir la imagen. Intente de nuevo.');
            setPreviewUrl(currentImageUrl);
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = () => {
        setPreviewUrl('');
        onUploadComplete('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-3">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1 block">
                {label}
            </label>

            <div
                className={`relative group rounded-2xl border-2 border-dashed transition-all overflow-hidden min-h-[160px] flex flex-col items-center justify-center p-4 ${previewUrl ? 'border-transparent bg-gray-50' : 'border-gray-200 hover:border-black/20 hover:bg-gray-50/50'
                    }`}
            >
                {previewUrl ? (
                    <>
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isUploading ? 'opacity-30' : 'opacity-100'}`}
                        />

                        {/* Overlay for actions */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-3 bg-white rounded-full text-gray-900 hover:scale-110 active:scale-95 transition-all shadow-xl"
                                title="Cambiar imagen"
                            >
                                <Upload size={20} />
                            </button>
                            <button
                                type="button"
                                onClick={removeImage}
                                className="p-3 bg-white rounded-full text-red-600 hover:scale-110 active:scale-95 transition-all shadow-xl"
                                title="Eliminar imagen"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center gap-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                            <ImageIcon size={28} strokeWidth={1.5} />
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-sm">Haga clic para subir</p>
                            <p className="text-[10px] font-medium uppercase tracking-wider">JPG, PNG o WEBP (máx. 5MB)</p>
                        </div>
                    </button>
                )}

                {/* Loading State */}
                {isUploading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 text-black animate-spin mb-2" />
                        <span className="text-xs font-black uppercase tracking-widest text-black">Subiendo...</span>
                    </div>
                )}

                {/* Success indicator after finish */}
                {!isUploading && previewUrl && (
                    <div className="absolute top-3 right-3 p-1.5 bg-green-500 text-white rounded-full shadow-lg scale-90">
                        <Check size={14} strokeWidth={3} />
                    </div>
                )}
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-600 px-1 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle size={14} />
                    <span className="text-xs font-bold">{error}</span>
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
        </div>
    );
}
