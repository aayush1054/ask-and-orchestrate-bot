
import { Document } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DocumentListProps {
  documents: Document[];
  onRemove: (id: string) => void;
}

export const DocumentList = ({ documents, onRemove }: DocumentListProps) => {
  if (documents.length === 0) {
    return (
      <div className="py-4 text-center text-muted-foreground text-sm">
        No documents uploaded yet
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">Uploaded Documents</h3>
      <ScrollArea className="h-[250px]">
        <div className="space-y-2 pr-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-2 rounded-md border bg-card/50 group"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(doc.dateAdded, { addSuffix: true })}
                    {` • ${doc.chunks.length} chunks`}
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
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
