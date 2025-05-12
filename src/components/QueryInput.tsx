
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';

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
    // Don't clear the input immediately to provide better UX
    if (!isLoading) {
      setTimeout(() => setInputValue(''), 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative space-y-2">
      <div className="relative border border-border rounded-lg focus-within:ring-2 focus-within:ring-primary/20 transition-all hover:border-primary/40">
        <Textarea
          placeholder={
            disabled 
              ? "Please upload at least one document to start querying..." 
              : "Enter your question, e.g., 'What are the key features of the product?' or 'Calculate 15% of 85'"
          }
          className="min-h-[120px] pr-12 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || disabled}
        />
        <Button 
          size="icon" 
          type="submit" 
          className="absolute bottom-3 right-3 rounded-full h-9 w-9 transition-all hover:scale-105"
          disabled={!inputValue.trim() || isLoading || disabled}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="text-xs text-muted-foreground text-right">
        Press Enter to submit or Shift+Enter for a new line
      </div>
    </form>
  );
};
