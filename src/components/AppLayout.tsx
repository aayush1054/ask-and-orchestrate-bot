
import React from 'react';
import { Github, BrainCircuit } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/95">
      <header className="border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full">
        <div className="container flex h-16 max-w-7xl items-center">
          <div className="flex items-center gap-3 font-semibold">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent font-bold">RAG Assistant</span>
          </div>
          <div className="flex flex-1 items-center justify-end">
            <a
              href="https://github.com/yourusername/rag-assistant"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-muted/50 hover:bg-muted px-3 py-1.5 rounded-md"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container max-w-7xl py-8">
        {children}
      </main>
      
      <footer className="border-t py-6 md:py-0 bg-background/80 backdrop-blur-md">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with React + Typescript + Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
};
