export type AssetType = 'Commercial' | 'Document' | 'Visual' | 'Audio' | 'Unknown';

export interface AssetMetadata {
  assetType: AssetType;
  
  // Data for Commercial/Vinyl assets
  explicitData?: {
    title?: string | null;
    artist?: string | null;
    catalogNumber?: string | null;
    // Data for Documents
    date?: string | null;
    client?: string | null;
  };

  // Data for Visual assets
  visualCues: string[];
  potentialSessionGuess?: string | null; // The "Magnet" suggestion

  // General AI fields
  identifiedPeople: string[];
  transcribedText?: string;
  tags: string[];
  confidenceScore: number;
  reasoning?: string;
}

export interface Asset {
  id: string;
  url: string;
  type: AssetType;
  metadata: AssetMetadata;
  status: 'Unprocessed' | 'Analyzed' | 'Archived' | 'VERIFIED';
  sessionId: string | null;
}

export interface SessionEvent {
  id: string;
  title: string;
  date: string;
  client?: string | null;
  sourceArtifactId: string;
}