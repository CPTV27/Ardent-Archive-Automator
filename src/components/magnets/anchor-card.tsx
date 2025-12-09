import { useState } from 'react';
import { Asset } from '../../types';
import { CheckCircleIcon, CalendarIcon, UserIcon, DiscIcon } from 'lucide-react';

interface AnchorCardProps {
  asset: Asset;
  onApprove: (assetId: string, finalData: { title: string; date: string; client: string }) => Promise<void>;
}

export function AnchorCard({ asset, onApprove }: AnchorCardProps) {
  const meta = asset.metadata.explicitData || {};
  const isCommercial = asset.metadata.assetType === 'Commercial';

  // State for editable fields (Archivist Verification)
  const [title, setTitle] = useState(meta.title || (isCommercial ? 'Untitled Record' : 'Untitled Session'));
  const [client, setClient] = useState(meta.client || meta.artist || 'Unknown Client');
  const [date, setDate] = useState(meta.date || new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    setIsSubmitting(true);
    await onApprove(asset.id, { title, client, date });
    setIsSubmitting(false);
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 flex flex-col gap-4 shadow-lg hover:border-ardent-gold/50 transition-colors group">
      {/* Header / Type Badge */}
      <div className="flex justify-between items-center">
        <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded ${
          isCommercial ? 'bg-yellow-900/30 text-yellow-500' : 'bg-blue-900/30 text-blue-400'
        }`}>
          {asset.metadata.assetType} Candidate
        </span>
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Requires Verification" />
      </div>

      {/* Image Preview */}
      <div className="h-32 w-full bg-black rounded overflow-hidden relative border border-white/5">
        <img src={asset.url} alt="Asset Preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Editable Fields */}
      <div className="space-y-3">
        {/* Title Input */}
        <div>
          <label className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block">Session / Release Title</label>
          <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded px-2 focus-within:border-ardent-gold/60">
            <DiscIcon className="w-3 h-3 text-neutral-600 mr-2" />
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent border-none text-ardent-cream text-sm w-full py-2 focus:ring-0 placeholder-neutral-700"
            />
          </div>
        </div>

        {/* Client/Artist Input */}
        <div>
          <label className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block">Client / Artist</label>
          <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded px-2 focus-within:border-ardent-gold/60">
            <UserIcon className="w-3 h-3 text-neutral-600 mr-2" />
            <input 
              type="text" 
              value={client} 
              onChange={(e) => setClient(e.target.value)}
              className="bg-transparent border-none text-ardent-cream text-sm w-full py-2 focus:ring-0 placeholder-neutral-700"
            />
          </div>
        </div>

        {/* Date Input */}
        <div>
          <label className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block">Session Date</label>
          <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded px-2 focus-within:border-ardent-gold/60">
            <CalendarIcon className="w-3 h-3 text-neutral-600 mr-2" />
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent border-none text-ardent-cream text-sm w-full py-2 focus:ring-0 placeholder-neutral-700" // calendar-picker-indicator styling can be tricky in Tailwind, keeping native for now
            />
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={handleApprove}
        disabled={isSubmitting}
        className="mt-2 w-full bg-ardent-gold hover:bg-ardent-goldHover text-ardent-black font-bold uppercase text-xs py-3 rounded flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span>Processing...</span>
        ) : (
          <>
            <CheckCircleIcon className="w-4 h-4" />
            Confirm Magnet
          </>
        )}
      </button>
    </div>
  );
}