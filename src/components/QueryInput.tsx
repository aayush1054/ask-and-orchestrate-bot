
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const QueryInput = ({ onSubmit, isLoading, disabled }: QueryInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    onSubmit(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="relative">
        <Textarea
          placeholder={
            disabled 
              ? "Please upload at least one document to start querying..." 
              : "Enter your question, e.g., 'What are the key features of the product?' or 'Calculate 15% of 85'"
          }
          className="min-h-[100px] pr-12 resize-none"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || disabled}
        />
        <Button 
          size="icon" 
          type="submit" 
          className="absolute bottom-2 right-2"
          disabled={!inputValue.trim() || isLoading || disabled}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-xs text-muted-foreground">
        Press Enter to submit or Shift+Enter for a new line
      </div>
    </form>
  );
};
