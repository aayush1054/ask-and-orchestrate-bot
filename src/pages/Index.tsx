
import { useState, useRef, useCallback } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { QueryInput } from '@/components/QueryInput';
import { QueryResponse } from '@/components/QueryResponse';
import { DocumentUploader } from '@/components/DocumentUploader';
import { DocumentList } from '@/components/DocumentList';
import { useDocuments } from '@/hooks/useDocuments';
import { useQueryAssistant } from '@/hooks/useQueryAssistant';
import { AgentResponse } from '@/types';

const Index = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AgentResponse | null>(null);
  const { documents, addDocument, removeDocument } = useDocuments();
  const { processQuery } = useQueryAssistant();
  const responseRef = useRef<HTMLDivElement>(null);

  const handleQuerySubmit = useCallback(async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;
    
    setIsLoading(true);
    setQuery(queryText);
    setResponse(null);
    
    try {
      const result = await processQuery(queryText, documents);
      setResponse(result);
      
      // Scroll to response after a small delay to ensure rendering
      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Error processing query:', error);
    } finally {
      setIsLoading(false);
    }
  }, [documents, isLoading, processQuery]);

  return (
    <AppLayout>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container max-w-7xl px-4 py-8 space-y-8">
          <section>
            <h1 className="text-4xl font-bold tracking-tight text-center mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                RAG-Powered Assistant
              </span>
            </h1>
            <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-8">
              Ask questions about your documents or use tools like a calculator and dictionary. 
              The assistant will retrieve relevant information and generate answers.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-6">
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Document Management</h2>
                <DocumentUploader onUpload={addDocument} />
                <DocumentList documents={documents} onRemove={removeDocument} />
              </div>
            </div>
            
            <div className="md:col-span-2 space-y-6">
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Query Assistant</h2>
                <QueryInput 
                  onSubmit={handleQuerySubmit} 
                  isLoading={isLoading}
                  disabled={documents.length === 0}
                />
                
                <div ref={responseRef}>
                  {isLoading && (
                    <div className="mt-6 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  )}
                  
                  {response && !isLoading && (
                    <QueryResponse query={query} response={response} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AppLayout>
  );
};

export default Index;
