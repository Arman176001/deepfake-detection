
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Upload, Image, Video } from "lucide-react";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'video/mp4'];
    
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image (JPEG, PNG) or video (MP4) file.');
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB.');
      return;
    }

    onFileUpload(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">Upload Media File</h2>
        <p className="text-muted-foreground">
          Supported formats: JPEG, PNG images and MP4 videos (max 10MB)
        </p>
      </div>

      <Card
        className={`
          relative border-2 border-dashed transition-all duration-300 cursor-pointer
          ${isDragOver 
            ? 'border-primary bg-primary/5 scale-105' 
            : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/20'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <div className="p-12 text-center">
          <div className="flex justify-center space-x-4 mb-6">
            <div className="p-4 rounded-full bg-primary/10">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div className="p-4 rounded-full bg-primary/10">
              <Image className="w-8 h-8 text-primary" />
            </div>
            <div className="p-4 rounded-full bg-primary/10">
              <Video className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mb-2">
            Drag & drop your file here
          </h3>
          <p className="text-muted-foreground mb-4">
            or click to browse your computer
          </p>
          
          <div className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            Choose File
          </div>
        </div>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,video/mp4"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};
