import { useState } from "react";
import { Button } from "@/components/ui/button";
import { parseCSV } from "@/utils/questionDeck";
import { toast } from "sonner";
import { Upload } from "lucide-react";
interface FileUploaderProps {
  onDeckLoaded: (questions: any[]) => void;
}
export function FileUploader({
  onDeckLoaded
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length) {
      processFile(files[0]);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      processFile(files[0]);
    }
  };
  const processFile = (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const content = e.target?.result as string;
        const questions = parseCSV(content);
        if (questions.length === 0) {
          toast.error('No questions found in the file');
          return;
        }
        onDeckLoaded(questions);
        toast.success(`Loaded ${questions.length} questions`);
      } catch (error) {
        console.error('Error parsing CSV:', error);
        toast.error('Failed to parse the CSV file');
      }
    };
    reader.onerror = () => {
      toast.error('Failed to read the file');
    };
    reader.readAsText(file);
  };

  // Create reference for file input element
  const fileInputRef = useState<HTMLInputElement | null>(null);

  // Function to trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef[0]) {
      fileInputRef[0].click();
    }
  };
  return <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
        ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}
      `} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleFileDrop}>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="text-4xl mb-2">📁</div>
        <h3 className="text-lg font-medium">Drag & Drop a CSV file</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Or click the button below to browse your files
        </p>
        
        <div>
          <input ref={input => fileInputRef[0] = input} type="file" id="file-upload" className="sr-only" accept=".csv" onChange={handleFileChange} />
          <Button variant="outline" className="cursor-pointer" onClick={triggerFileInput}>
            <Upload className="mr-2 h-4 w-4" />
            Browse Files
          </Button>
        </div>
        
        
      </div>
    </div>;
}