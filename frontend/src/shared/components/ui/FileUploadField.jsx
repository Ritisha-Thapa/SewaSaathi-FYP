import React, { useState, useEffect, useRef } from 'react';
import { Upload, X } from 'lucide-react';

const FileUploadField = ({ accept, file, onChange, onClear, error, showPreview = false, hint }) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (file && showPreview && file.type?.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
        setPreviewUrl(null);
    }, [file, showPreview]);

    const handleClear = (e) => {
        e.preventDefault();
        onClear();
        if (inputRef.current) inputRef.current.value = '';
    };

    if (!file) {
        return (
            <div>
                <label className="flex items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition group">
                    <div className="flex flex-col items-center gap-1.5">
                        <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#1B3C53] transition" />
                        <p className="text-sm text-gray-500 font-medium">Click to upload</p>
                        {hint && <p className="text-xs text-gray-400">{hint}</p>}
                    </div>
                    <input ref={inputRef} type="file" className="hidden" accept={accept} onChange={onChange} />
                </label>
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50">
                {showPreview && previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="preview"
                        className="w-14 h-14 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-lg bg-[#1B3C53]/10 flex items-center justify-center flex-shrink-0">
                        <Upload className="w-5 h-5 text-[#1B3C53]" />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                    type="button"
                    onClick={handleClear}
                    className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition flex-shrink-0"
                    title="Remove file"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default FileUploadField;
