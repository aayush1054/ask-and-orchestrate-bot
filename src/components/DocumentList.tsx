
import { Document } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, FileText, FileCode, FileImage, FileArchive } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DocumentListProps {
  documents: Document[];
  onRemove: (id: string) => void;
}

const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension || '')) {
    return FileImage;
  }
  if (['json', 'js', 'ts', 'html', 'css', 'jsx', 'tsx'].includes(extension || '')) {
    return FileCode;
  }
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension || '')) {
    return FileArchive;
  }
  
  return FileText;
};

export const DocumentList = ({ documents, onRemove }: DocumentListProps) => {
  if (documents.length === 0) {
    return (
      <div className="py-6 text-center text-muted-foreground text-sm border border-dashed rounded-lg bg-muted/30">
        <FileText className="mx-auto h-10 w-10 text-muted-foreground/50 mb-2" />
        <p>No documents uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-3 flex items-center">
        <span className="bg-primary/10 text-primary text-xs rounded-md px-2 py-1 mr-2">
          {documents.length}
        </span> 
        Uploaded Documents
      </h3>
      <div className="border rounded-lg overflow-hidden">
        <ScrollArea className="h-[280px]">
          <div className="divide-y">
            {documents.map((doc) => {
              const FileIcon = getFileIcon(doc.name);
              
              return (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 group hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="bg-primary/5 p-2 rounded-md">
                      <FileIcon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="overflow-hidden flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <span>{formatDistanceToNow(doc.dateAdded, { addSuffix: true })}</span>
                        <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground/30"></span>
                        <span>{doc.chunks.length} chunks</span>
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onRemove(doc.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
