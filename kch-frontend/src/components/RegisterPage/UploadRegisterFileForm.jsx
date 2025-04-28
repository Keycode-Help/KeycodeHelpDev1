import {FileText, Upload} from "lucide-react";
import React from "react";

const UploadRegisterFileForm = ({ fileRef, name, onChange, accept, value }) => {
  const formatFileSize = (size) => {
    if (size <= 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="border-2 border-dashed border-[#303030] rounded-lg p-4 cursor-pointer hover:border-green-600
    transition duration-200 mb-2 group/uploadArea"
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
        <div className="flex items-center justify-center py-2">
          <Upload className="h-7 w-7 md:h-8 md:w-8 text-gray-500 group-hover/uploadArea:text-green-500 transition
          duration-200" />
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText
              className="h-5 w-5 md:h-6 md:w-6 text-gray-500 group-hover/uploadArea:text-green-500 transition duration-200"
            />
            <div>
              <p className="text-gray-400 group-hover/uploadArea:text-green-500 transition duration-200
              text-sm font-medium truncate max-w-[230px]"
              >
                {value.name}
              </p>
              <p className="text-gray-400 group-hover/uploadArea:text-green-500 transition duration-200 text-xs">
                {formatFileSize(value.size)}
              </p>
            </div>
          </div>
          <Upload className="h-5 w-5 md:h-6 md:w-6 text-gray-500 group-hover/uploadArea:text-green-500
          transition duration-200"
          />
        </div>
      )}
    </div>
  )
}

export default UploadRegisterFileForm;