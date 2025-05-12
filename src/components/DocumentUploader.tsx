
import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
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
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      e.target.value = '';
      
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
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="document" className="text-sm">Upload Document</Label>
        <div className="flex gap-2">
          <Label 
            htmlFor="document" 
            className="flex-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground"
          >
            <span className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              {isLoading ? 'Processing...' : 'Choose file'}
            </span>
          </Label>
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
      <div className="text-xs text-muted-foreground">
        <p>Only .txt files are supported (max 1MB)</p>
      </div>
    </div>
  );
};
