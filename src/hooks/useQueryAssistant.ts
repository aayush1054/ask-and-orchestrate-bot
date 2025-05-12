
import { useState } from 'react';
import { Document, AgentResponse, VectorSearchResult, ToolType } from '@/types';
import { sleep } from '@/utils/helpers';

export const useQueryAssistant = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to determine which tool to use based on query content
  const determineQueryTool = (query: string): ToolType => {
    const lowerQuery = query.toLowerCase();
    
    // Check for calculator keywords
    if (
      lowerQuery.includes('calculate') ||
      lowerQuery.includes('compute') ||
      lowerQuery.includes('sum of') ||
      /[0-9]+\s*[\+\-\*\/]\s*[0-9]+/.test(lowerQuery)
    ) {
      return 'calculator';
    }
    
    // Check for dictionary keywords
    if (
      lowerQuery.includes('define') ||
      lowerQuery.includes('what is the meaning of') ||
      lowerQuery.includes('definition of')
    ) {
      return 'dictionary';
    }
    
    // Default to RAG
    return 'rag';
  };

  // Simple function to perform vector search (mock implementation)
  const performVectorSearch = async (query: string, documents: Document[]): Promise<VectorSearchResult[]> => {
    // This is a mock implementation that simulates vector search
    // In a real app, this would use actual vector embeddings and similarity search
    
    const results: VectorSearchResult[] = [];
    
    // Create a simple keyword-based search as a stand-in for vector search
    const queryWords = query.toLowerCase().split(/\W+/).filter(word => word.length > 3);
    
    for (const doc of documents) {
      for (let i = 0; i < doc.chunks.length; i++) {
        const chunk = doc.chunks[i];
        
        // Calculate a mock "similarity score" based on word overlap
        let matchCount = 0;
        for (const word of queryWords) {
          if (chunk.toLowerCase().includes(word)) {
            matchCount++;
          }
        }
        
        const score = queryWords.length > 0 ? matchCount / queryWords.length : 0;
        
        // Only include chunks with some relevance
        if (score > 0) {
          results.push({
            id: `${doc.id}-${i}`,
            text: chunk,
            source: doc.name,
            score: score
          });
        }
      }
    }
    
    // Sort by score (descending)
    results.sort((a, b) => b.score - a.score);
    
    // Return top 3 results
    return results.slice(0, 3);
  };

  // Mock calculator implementation
  const calculateAnswer = async (query: string): Promise<string> => {
    try {
      // Extract numbers and operation
      const mathExpression = query.replace(/calculate|compute|what is|equals|=|\?/gi, '').trim();
      
      // Security: Very basic validation to prevent unsafe code execution
      if (!/^[\d\s\+\-\*\/\.\(\)]+$/.test(mathExpression)) {
        return "I can only perform basic arithmetic operations (+, -, *, /) with numbers.";
      }
      
      // Calculate the result safely
      // eslint-disable-next-line no-new-func
      const result = Function('"use strict";return (' + mathExpression + ')')();
      
      return `The result of ${mathExpression} is ${result}`;
    } catch (error) {
      console.error('Calculation error:', error);
      return "I couldn't calculate that. Please check your expression and try again.";
    }
  };

  // Mock dictionary implementation
  const getDictionaryDefinition = async (query: string): Promise<string> => {
    // Extract the word to define
    const wordMatch = query.match(/define\s+(\w+)/) || 
                      query.match(/definition\s+of\s+(\w+)/) || 
                      query.match(/what\s+is\s+the\s+meaning\s+of\s+(\w+)/);
    
    const word = wordMatch?.[1]?.toLowerCase();
    
    // Mock dictionary with a few words
    const mockDictionary: Record<string, string> = {
      'sustainability': 'The ability to maintain or support a process continuously over time, avoiding the depletion of natural resources to maintain an ecological balance.',
      'innovation': 'The process of translating an idea or invention into a good or service that creates value for which customers will pay.',
      'technology': 'The application of scientific knowledge for practical purposes, especially in industry.',
      'integration': 'The act of combining or adding parts to make a unified whole.',
    };
    
    if (word && mockDictionary[word]) {
      return `Definition of "${word}": ${mockDictionary[word]}`;
    }
    
    return "I don't have a definition for that word. Please try another word.";
  };

  // Generate an answer based on the retrieved contexts
  const generateAnswer = async (query: string, contexts: VectorSearchResult[]): Promise<string> => {
    // In a real application, this would call an LLM API
    // For this demo, we'll create a simplified response based on the contexts
    
    if (contexts.length === 0) {
      return "I don't have enough information to answer your question.";
    }
    
    // For demo purposes, create a simple answer combining context information
    const combinedContext = contexts.map(c => c.text).join(' ');
    
    // Create some sample responses based on query patterns
    if (query.toLowerCase().includes('when') || query.toLowerCase().includes('founded')) {
      if (combinedContext.includes('founded in')) {
        const foundedMatch = combinedContext.match(/founded in (\d{4})/);
        if (foundedMatch) {
          return `Based on the information I have, the company was founded in ${foundedMatch[1]}.`;
        }
      }
    }
    
    if (query.toLowerCase().includes('who')) {
      const founderMatch = combinedContext.match(/founded (?:in \d{4} )?by ([^.]+)/);
      if (founderMatch) {
        return `According to the documents, ${founderMatch[1]} is the founder.`;
      }
    }
    
    if (query.toLowerCase().includes('where')) {
      const locationMatch = combinedContext.match(/headquarters are located in ([^.]+)/);
      if (locationMatch) {
        return `The headquarters are located in ${locationMatch[1]}.`;
      }
    }
    
    if (query.toLowerCase().includes('how many') && query.toLowerCase().includes('employee')) {
      const employeeMatch = combinedContext.match(/employ (?:over )?(\d+) people/);
      if (employeeMatch) {
        return `The company employs over ${employeeMatch[1]} people worldwide.`;
      }
    }
    
    if (query.toLowerCase().includes('price') || query.toLowerCase().includes('cost') || query.toLowerCase().includes('pricing')) {
      let answer = "Based on the information in the documents:";
      if (combinedContext.includes('Basic plan costs')) {
        const basicMatch = combinedContext.match(/Basic plan costs \$([0-9.]+)/);
        if (basicMatch) {
          answer += `\n- Basic plan: $${basicMatch[1]} per month`;
        }
      }
      if (combinedContext.includes('Professional plan is')) {
        const proMatch = combinedContext.match(/Professional plan is \$([0-9.]+)/);
        if (proMatch) {
          answer += `\n- Professional plan: $${proMatch[1]} per month`;
        }
      }
      if (combinedContext.includes('Enterprise plan')) {
        answer += "\n- Enterprise plan: Custom pricing";
      }
      return answer;
    }
    
    if (query.toLowerCase().includes('product') && 
       (query.toLowerCase().includes('spec') || query.toLowerCase().includes('feature'))) {
      let answer = "The XYZ-1000 product features include:";
      if (combinedContext.includes('processor')) {
        answer += "\n- Dual-core processor";
      }
      if (combinedContext.includes('RAM')) {
        const ramMatch = combinedContext.match(/(\d+GB) RAM/);
        if (ramMatch) answer += `\n- ${ramMatch[1]} RAM`;
      }
      if (combinedContext.includes('SSD')) {
        const ssdMatch = combinedContext.match(/(\d+GB) SSD/);
        if (ssdMatch) answer += `\n- ${ssdMatch[1]} SSD storage`;
      }
      if (combinedContext.includes('battery')) {
        const batteryMatch = combinedContext.match(/battery life is approximately (\d+) hours/);
        if (batteryMatch) answer += `\n- ${batteryMatch[1]} hours battery life`;
      }
      return answer;
    }
    
    // Generic fallback response
    return `Based on the information I have: ${contexts[0].text}`;
  };

  // Main function to process a user query
  const processQuery = async (query: string, documents: Document[]): Promise<AgentResponse> => {
    setIsProcessing(true);
    
    try {
      // Determine which tool to use
      const tool = determineQueryTool(query);
      
      // Process based on the selected tool
      switch (tool) {
        case 'calculator': {
          // Add a small delay to simulate processing time
          await sleep(1000);
          const answer = await calculateAnswer(query);
          return { tool, answer };
        }
        
        case 'dictionary': {
          // Add a small delay to simulate processing time
          await sleep(1200);
          const answer = await getDictionaryDefinition(query);
          return { tool, answer };
        }
        
        case 'rag':
        default: {
          // 1. Retrieve relevant documents
          // Add a small delay to simulate processing time
          await sleep(1500);
          const contexts = await performVectorSearch(query, documents);
          
          // 2. Generate answer based on contexts
          // Add a small delay to simulate LLM processing
          await sleep(1000);
          const answer = await generateAnswer(query, contexts);
          
          return { tool, answer, contexts };
        }
      }
    } catch (error) {
      console.error('Error processing query:', error);
      return {
        tool: 'rag',
        answer: "I'm sorry, I encountered an error while processing your query. Please try again."
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processQuery,
    isProcessing
  };
};
