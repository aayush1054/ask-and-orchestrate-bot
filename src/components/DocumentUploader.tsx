
import { useState } from 'react';
import { Upload, FileText, FileUp, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Document } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface DocumentUploaderProps {
  onUpload: (document: Document) => void;
}

export const DocumentUploader = ({ onUpload }: DocumentUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [hasUploadedFile, setHasUploadedFile] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    processFile(file);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    
    processFile(file);
  };

  const processFile = async (file: File) => {
    // Check file type (only allow text files for this simple demo)
    if (file.type !== 'text/plain') {
      toast({
        variant: 'destructive',
        title: 'Unsupported file format',
        description: 'Please upload a text (.txt) file only.'
      });
      return;
    }

    // Check file size (limit to 1MB for this demo)
    if (file.size > 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'File too large',
        description: 'Please upload a file smaller than 1MB.'
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Read the file content
      const text = await file.text();
      
      // Create a new document
      const newDoc: Document = {
        id: crypto.randomUUID(),
        name: file.name,
        content: text,
        chunks: chunkText(text),
        dateAdded: new Date()
      };
      
      onUpload(newDoc);
      
      // Show success state
      setHasUploadedFile(true);
      setTimeout(() => setHasUploadedFile(false), 3000);
      
      toast({
        title: 'Document uploaded successfully',
        description: `"${file.name}" has been added to your knowledge base.`
      });
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'There was an error processing your document.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Simple text chunking function (for demo purposes)
  const chunkText = (text: string, chunkSize: number = 500): string[] => {
    const sentences = text.split(/(?<=[.!?])\s+/);
    const chunks: string[] = [];
    let currentChunk = '';
    
    for (const sentence of sentences) {
      if ((currentChunk + sentence).length <= chunkSize || currentChunk === '') {
        currentChunk += (currentChunk ? ' ' : '') + sentence;
      } else {
        chunks.push(currentChunk);
        currentChunk = sentence;
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk);
    }
    
    return chunks;
  };

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 transition-all ${
          isDragOver ? 'bg-primary/5 border-primary/50' : 'border-muted-foreground/25 hover:border-primary/30'
        } ${isLoading ? 'opacity-75 cursor-wait' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          {hasUploadedFile ? (
            <>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Upload successful</p>
                <p className="text-xs text-muted-foreground">Your document has been added</p>
              </div>
            </>
          ) : (
            <>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center animate-bounce-subtle">
                <FileUp className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{isLoading ? 'Processing...' : 'Drop file here or click to upload'}</p>
                <p className="text-xs text-muted-foreground">Only .txt files are supported (max 1MB)</p>
              </div>
              <Label
                htmlFor="document"
                className="cursor-pointer inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-primary text-white rounded-md shadow hover:bg-primary/90 transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Upload className="h-4 w-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Select file
                  </span>
                )}
              </Label>
            </>
          )}
          <Input 
            id="document" 
            type="file"
            accept=".txt"
            onChange={handleFileChange}
            disabled={isLoading}
            className="sr-only"
          />
        </div>
      </div>
    </div>
  );
};
