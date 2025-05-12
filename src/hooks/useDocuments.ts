
import { useState, useEffect } from 'react';
import { Document } from '@/types';
import { useToast } from '@/components/ui/use-toast';

// Mock sample documents for demonstration
const SAMPLE_DOCUMENTS: Document[] = [
  {
    id: '1',
    name: 'company-faq.txt',
    content: 'Acme Corp was founded in 2010 by Jane Smith. We focus on creating sustainable technology solutions for small businesses. Our headquarters are located in San Francisco, California. We currently employ over 500 people worldwide and are growing rapidly. Our core values are innovation, sustainability, and customer satisfaction.',
    chunks: [
      'Acme Corp was founded in 2010 by Jane Smith. We focus on creating sustainable technology solutions for small businesses.',
      'Our headquarters are located in San Francisco, California. We currently employ over 500 people worldwide and are growing rapidly.',
      'Our core values are innovation, sustainability, and customer satisfaction.'
    ],
    dateAdded: new Date('2024-05-10')
  },
  {
    id: '2',
    name: 'product-specs.txt',
    content: 'The XYZ-1000 is our flagship product. It features a dual-core processor, 8GB RAM, and 512GB SSD storage. The battery life is approximately 10 hours under normal usage conditions. It comes with a 1-year limited warranty that can be extended to 3 years for an additional fee. The product dimensions are 12.8 x 8.9 x 0.7 inches and it weighs 2.8 pounds.',
    chunks: [
      'The XYZ-1000 is our flagship product. It features a dual-core processor, 8GB RAM, and 512GB SSD storage.',
      'The battery life is approximately 10 hours under normal usage conditions. It comes with a 1-year limited warranty that can be extended to 3 years for an additional fee.',
      'The product dimensions are 12.8 x 8.9 x 0.7 inches and it weighs 2.8 pounds.'
    ],
    dateAdded: new Date('2024-05-11')
  },
  {
    id: '3',
    name: 'services-overview.txt',
    content: 'Our company offers three main service tiers: Basic, Professional, and Enterprise. The Basic plan costs $29.99 per month and includes up to 5 users. The Professional plan is $59.99 per month for up to 20 users. The Enterprise plan pricing is custom and supports unlimited users with dedicated support. All plans include 24/7 monitoring, automated backups, and security updates. Premium features such as custom integration and priority support are available in higher-tier plans.',
    chunks: [
      'Our company offers three main service tiers: Basic, Professional, and Enterprise. The Basic plan costs $29.99 per month and includes up to 5 users.',
      'The Professional plan is $59.99 per month for up to 20 users. The Enterprise plan pricing is custom and supports unlimited users with dedicated support.',
      'All plans include 24/7 monitoring, automated backups, and security updates. Premium features such as custom integration and priority support are available in higher-tier plans.'
    ],
    dateAdded: new Date('2024-05-12')
  }
];

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>(SAMPLE_DOCUMENTS);
  const { toast } = useToast();

  const addDocument = (document: Document) => {
    setDocuments((prev) => [...prev, document]);
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    toast({
      description: 'Document removed successfully.'
    });
  };

  return {
    documents,
    addDocument,
    removeDocument
  };
};
