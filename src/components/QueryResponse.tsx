
import { AgentResponse } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface QueryResponseProps {
  query: string;
  response: AgentResponse;
}

export const QueryResponse = ({ query, response }: QueryResponseProps) => {
  const { tool, contexts, answer } = response;
  
  return (
    <div className="mt-8 space-y-6 animate-slide-up">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Your question:</h3>
        <Card>
          <CardContent className="pt-4 pb-2">
            <p className="font-medium text-lg">{query}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Processed using:</h3>
        <Badge variant={tool === 'rag' ? 'default' : 'secondary'} className="capitalize">
          {tool === 'rag' ? 'Document Retrieval' : tool}
        </Badge>
      </div>
      
      <Tabs defaultValue="answer" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-2">
          <TabsTrigger value="answer">Answer</TabsTrigger>
          <TabsTrigger value="context" disabled={!contexts || contexts.length === 0}>
            Context{contexts && contexts.length > 0 ? ` (${contexts.length})` : ''}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="answer" className="mt-4">
          <Card className="border-primary/10 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <div className="prose prose-sm dark:prose-invert max-w-full">
                <div className="whitespace-pre-wrap">{answer}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="context" className="mt-4">
          {contexts && contexts.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <ScrollArea className="h-[350px] rounded-md">
                  <div className="p-4 space-y-4">
                    {contexts.map((context, index) => (
                      <Card key={index} className="bg-muted/40 overflow-hidden hover:bg-muted/60 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex justify-between mb-2">
                            <Badge variant="outline" className="bg-background">Source: {context.source}</Badge>
                            <Badge variant="outline" className={
                              context.score > 0.8 ? 'bg-green-500/10 text-green-600' :
                              context.score > 0.6 ? 'bg-amber-500/10 text-amber-600' :
                              'bg-red-500/10 text-red-600'
                            }>
                              Relevance: {(context.score * 100).toFixed(1)}%
                            </Badge>
                          </div>
                          <p className="text-sm mt-2 leading-relaxed">{context.text}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No context was used for this query</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
