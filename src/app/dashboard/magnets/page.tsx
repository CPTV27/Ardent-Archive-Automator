"use client";

import { useState } from 'react';
import { AnchorCard } from '../../../components/magnets/anchor-card';
import { Asset, SessionEvent } from '../../../types';
import { LayoutListIcon, MagnetIcon } from 'lucide-react';

// --- MOCK DATA FOR UI DEVELOPMENT ---
const MOCK_INCOMING_ASSETS: Asset[] = [
  {
    id: '1',
    url: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Big_Star_-_No_1_Record.jpg',
    type: 'Commercial',
    status: 'Analyzed',
    sessionId: null,
    metadata: {
      assetType: 'Commercial',
      confidenceScore: 0.98,
      tags: ['Vinyl', 'Cover Art'],
      visualCues: ['Neon Sign', 'Star'],
      identifiedPeople: [],
      explicitData: {
        artist: 'Big Star',
        title: '#1 Record',
        date: '1972-06-01'
      }
    }
  },
  {
    id: '2',
    url: 'https://images.squarespace-cdn.com/content/v1/5e38600889f8964d4b29b671/1626707833633-5A3V22V5Z3V6Z3V6Z3V6/Track+Sheet.jpg',
    type: 'Document',
    status: 'Analyzed',
    sessionId: null,
    metadata: {
      assetType: 'Document',
      confidenceScore: 0.85,
      tags: ['Track Sheet', 'Handwriting'],
      visualCues: ['Grid', 'Paper'],
      identifiedPeople: [],
      explicitData: {
        client: 'The Staple Singers',
        date: '1973-02-14',
        title: 'Respect Yourself Session'
      }
    }
  }
];

const MOCK_EXISTING_MAGNETS: SessionEvent[] = [
  {
    id: 'evt_1',
    title: 'Hot Buttered Soul - Recording',
    client: 'Isaac Hayes',
    date: '1969-05-15',
    sourceArtifactId: 'asset_99'
  }
];

export default function MagnetsPage() {
  const [incomingAssets, setIncomingAssets] = useState<Asset[]>(MOCK_INCOMING_ASSETS);
  const [activeMagnets, setActiveMagnets] = useState<SessionEvent[]>(MOCK_EXISTING_MAGNETS);

  const handleApproveMagnet = async (assetId: string, finalData: { title: string; date: string; client: string }) => {
    try {
      // In a real app, verify network response
      const res = await fetch('/api/magnets/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId, ...finalData })
      });

      if (!res.ok) throw new Error("Failed to create magnet");

      const newMagnet = await res.json(); // Assuming API returns the created SessionEvent

      // UI Optimistic Update
      setIncomingAssets(prev => prev.filter(a => a.id !== assetId));
      setActiveMagnets(prev => [newMagnet, ...prev]);

    } catch (error) {
      console.error("Magnet creation failed", error);
      // Fallback for demo since we don't have a real DB running in this specific view
      const mockCreatedEvent: SessionEvent = {
        id: `evt_${Date.now()}`,
        title: finalData.title,
        date: finalData.date,
        client: finalData.client,
        sourceArtifactId: assetId
      };
      setIncomingAssets(prev => prev.filter(a => a.id !== assetId));
      setActiveMagnets(prev => [mockCreatedEvent, ...prev]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-140px)]">
      
      {/* LEFT COLUMN: INCOMING ANCHORS */}
      <div className="lg:col-span-8 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <LayoutListIcon className="text-ardent-gold w-6 h-6" />
          <h2 className="text-2xl font-serif text-ardent-cream">Incoming Anchors</h2>
          <span className="bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded text-xs font-mono">
            {incomingAssets.length} PENDING
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-10 pr-2">
          {incomingAssets.length === 0 ? (
            <div className="col-span-full border border-dashed border-neutral-800 rounded-lg h-64 flex flex-col items-center justify-center text-neutral-600">
              <p>No unprocessed anchors found.</p>
              <p className="text-xs">Go to Ingest to upload more.</p>
            </div>
          ) : (
            incomingAssets.map(asset => (
              <AnchorCard 
                key={asset.id} 
                asset={asset} 
                onApprove={handleApproveMagnet} 
              />
            ))
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: ACTIVE MAGNETS (TIMELINE) */}
      <div className="lg:col-span-4 bg-neutral-900/50 border-l border-neutral-800 pl-8 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <MagnetIcon className="text-blue-400 w-6 h-6" />
          <h2 className="text-2xl font-serif text-ardent-cream">Active Magnets</h2>
        </div>

        <div className="space-y-4 overflow-y-auto pb-10">
          {activeMagnets.map((magnet) => (
            <div key={magnet.id} className="relative pl-6 py-2 border-l-2 border-neutral-700 hover:border-ardent-gold transition-colors group">
              {/* Timeline Dot */}
              <div className="absolute -left-[9px] top-3 w-4 h-4 rounded-full bg-neutral-900 border-2 border-neutral-600 group-hover:border-ardent-gold group-hover:bg-ardent-gold transition-colors" />
              
              <h4 className="text-ardent-cream font-bold leading-tight group-hover:text-ardent-gold transition-colors">
                {magnet.title}
              </h4>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-neutral-500 font-mono">{magnet.date}</span>
                <span className="text-[10px] uppercase text-neutral-600 border border-neutral-800 px-1 rounded">
                  {magnet.client}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}