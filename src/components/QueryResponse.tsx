
import { AgentResponse } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface QueryResponseProps {
  query: string;
  response: AgentResponse;
}

export const QueryResponse = ({ query, response }: QueryResponseProps) => {
  const { tool, contexts, answer } = response;
  
  return (
    <div className="mt-6 space-y-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">Your question:</h3>
        <p className="font-medium">{query}</p>
      </div>
      
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-sm font-medium text-muted-foreground">Processed using:</h3>
        <Badge variant={tool === 'rag' ? 'default' : 'secondary'}>
          {tool === 'rag' ? 'Document Retrieval' : tool}
        </Badge>
      </div>
      
      <Tabs defaultValue="answer" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="answer">Answer</TabsTrigger>
          <TabsTrigger value="context" disabled={!contexts || contexts.length === 0}>
            Context{contexts && contexts.length > 0 ? ` (${contexts.length})` : ''}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="answer" className="mt-4">
          <div className="rounded-md border p-4 bg-card text-card-foreground">
            <div className="whitespace-pre-wrap">{answer}</div>
          </div>
        </TabsContent>
        
        <TabsContent value="context" className="mt-4">
          {contexts && contexts.length > 0 ? (
            <ScrollArea className="h-[300px] rounded-md border">
              <div className="p-4 space-y-4">
                {contexts.map((context, index) => (
                  <div key={index} className="rounded-md border p-3 bg-muted/50">
                    <div className="flex justify-between mb-2">
                      <Badge variant="outline">Source: {context.source}</Badge>
                      <Badge variant="outline">Relevance: {(context.score * 100).toFixed(2)}%</Badge>
                    </div>
                    <p className="text-sm">{context.text}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="rounded-md border p-4 bg-card text-muted-foreground text-center">
              No context was used for this query
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
