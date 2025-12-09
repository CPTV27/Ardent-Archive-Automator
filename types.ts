// Equivalent to src/types/index.ts

export enum AssetType {
  COMMERCIAL = 'COMMERCIAL', // Stream A: Vinyl/Tapes (The strong anchors)
  DOCUMENT = 'DOCUMENT',     // Stream B: Track sheets/Letters (The context anchors)
  VISUAL = 'VISUAL',         // Stream C: Photos (The floaters)
  AUDIO = 'AUDIO'
}

export enum ProcessingStatus {
  UNPROCESSED = 'UNPROCESSED',
  ANALYZED = 'ANALYZED',
  VERIFIED = 'VERIFIED',
  ARCHIVED = 'ARCHIVED'
}

// Corresponds to the 'SessionEvent' model in Prisma
export interface SessionEvent {
  id: string;
  title: string;
  date: Date;
  client?: string;
  sourceArtifactId: string;
  // Relations are often handled via IDs in frontend state, 
  // but we keep the shape consistent with the domain.
  sourceArtifact?: Asset;
  assignedAssets?: Asset[];
}

// Corresponds to the 'Asset' model in Prisma
export interface Asset {
  id: string;
  url: string; // URL to the image/file
  type: AssetType;
  status: ProcessingStatus;
  aiRawResponse?: any; // JSON storage for full AI analysis
  
  // Relationships
  assignedSessionId?: string | null;
  assignedSession?: SessionEvent;
  
  // For the reverse relation on SessionEvent
  createdEvent?: SessionEvent;
}

// Helper types for AI Analysis responses
export interface CommercialAnalysis {
  artist: string;
  title: string;
  catalogNumber?: string;
  year?: string;
}

export interface DocumentAnalysis {
  date?: string;
  client?: string;
  personnel?: string[];
  summary?: string;
}

export interface VisualAnalysis {
  tags: string[];
  description?: string;
  potentialSessionMatches?: string[];
}