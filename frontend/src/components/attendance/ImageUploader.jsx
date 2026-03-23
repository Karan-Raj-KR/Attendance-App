import { useState, useRef } from 'react';
import { Upload, Camera, X, Image as ImageIcon } from 'lucide-react';
import Button from '../common/Button';

export default function ImageUploader({ onImageSelect, label = 'Upload Image', accept = 'image/*' }) {
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    setPreview(URL.createObjectURL(file));
    onImageSelect(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }

  function handleChange(e) {
    const file = e.target.files[0];
    handleFile(file);
  }

  function clear() {
    setPreview(null);
    onImageSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="space-y-3">
      {!preview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-2xl p-8
            flex flex-col items-center justify-center gap-3
            cursor-pointer transition-all duration-300
            ${dragActive
              ? 'border-indigo-400 bg-indigo-500/10'
              : 'border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/8'}
          `}
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Upload className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="text-center">
            <p className="text-white font-medium text-sm">{label}</p>
            <p className="text-slate-500 text-xs mt-1">Drag & drop or tap to browse</p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-white/10">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-52 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={clear}
            className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white/80 text-xs">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Image selected</span>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
