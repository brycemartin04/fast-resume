"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageUpload({ value, onChange, label }) {
  const [preview, setPreview] = useState(value);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload file
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onChange(data.url);
    } catch (error) {
      console.error("Upload error:", error);
      // Revert preview on error
      setPreview(value);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">{label}</label>
      <div className="flex items-center space-x-4">
        <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-white/10">
          {preview ? (
            <Image src={preview} alt="Preview" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/40">
              No image
            </div>
          )}
        </div>
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="block w-full text-sm text-white
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-medium
              file:bg-white/10 file:text-white
              hover:file:bg-white/20
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>
      {isUploading && <p className="text-sm text-white/60">Uploading...</p>}
    </div>
  );
}
