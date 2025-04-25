import {FileText, Upload} from "lucide-react";
import React from "react";

const UploadFileForm = ({ fileRef, name, onChange, accept, value }) => {
  const formatFileSize = (size) => {
    if (size <= 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div
      className="w-full bg-[#111111] border border-[#1A1A1A] rounded-lg p-3 text-white focus:outline-none
    hover:border-green-500 transition-colors duration-200 cursor-pointer group/uploadArea"
      onClick={() => fileRef.current?.click()}
    >
      <input
        type="file"
        name={name}
        onChange={onChange}
        accept={accept}
        className="hidden"
        ref={fileRef}
      />
      {!value ? (
        <div className="flex items-center justify-center py-2 md:py-3">
          <Upload className="h-7 w-7 md:h-8 md:w-8 text-gray-500 group-hover/uploadArea:text-green-500
          transition duration-200" />
        </div>
      ) : (
        <div className="flex items-center justify-center py-1 md:py-2">
          <div className="w-full flex items-center justify-start gap-3">
            <FileText className="h-7 w-7 md:h-8 md:w-8 text-gray-500 group-hover/uploadArea:text-green-500
            transition duration-200" />
            <div>
              <p className="text-gray-400 group-hover/uploadArea:text-green-500 transition duration-200
              text-sm md:text-base font-medium truncate max-w-[180px]">
                {value.name}
              </p>
              <p className="text-gray-400 group-hover/uploadArea:text-green-500 transition duration-200
              text-xs md:text-sm">
                {formatFileSize(value.size)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadFileForm;