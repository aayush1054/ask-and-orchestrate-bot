
import React from 'react';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { BrainCircuit } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-7xl items-center">
          <div className="flex items-center gap-2 font-semibold">
            <BrainCircuit className="h-5 w-5 text-primary" />
            <span>RAG Assistant</span>
          </div>
          <div className="flex flex-1 items-center justify-end">
            <a
              href="https://github.com/yourusername/rag-assistant"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <GitHubLogoIcon className="h-4 w-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </header>
      
      {children}
      
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with React + Typescript + Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
};
