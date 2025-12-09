
import React from 'react';
import { AssetType } from '@/types';
import { FileText, Music, Image as ImageIcon, Calendar, User, Tag, HelpCircle, Hash } from 'lucide-react';

interface AssetCardProps {
  type: AssetType;
  data: any; // The raw AI response data
  imageUrl?: string;
  className?: string;
}

export function AssetCard({ type, data, imageUrl, className = '' }: AssetCardProps) {
  
  // Icon and Color helper
  const getHeaderInfo = () => {
    switch (type) {
      case AssetType.COMMERCIAL:
        return { 
          icon: <Music className="w-5 h-5" />, 
          color: 'text-ardent-gold', 
          borderColor: 'border-ardent-gold',
          label: 'Commercial Release'
        };
      case AssetType.DOCUMENT:
        return { 
          icon: <FileText className="w-5 h-5" />, 
          color: 'text-ardent-cream', 
          borderColor: 'border-white/20',
          label: 'Studio Document'
        };
      case AssetType.VISUAL:
        return { 
          icon: <ImageIcon className="w-5 h-5" />, 
          color: 'text-blue-400', 
          borderColor: 'border-blue-400/30',
          label: 'Visual Asset'
        };
      default:
        return { 
          icon: <HelpCircle className="w-5 h-5" />, 
          color: 'text-gray-400', 
          borderColor: 'border-gray-600',
          label: 'Unknown Asset'
        };
    }
  };

  const { icon, color, borderColor, label } = getHeaderInfo();

  return (
    <div className={`bg-ardent-black/60 border ${borderColor} rounded-lg overflow-hidden shadow-2xl flex flex-col md:flex-row ${className}`}>
      
      {/* Left: Image Thumbnail */}
      {imageUrl && (
        <div className="w-full md:w-48 h-48 md:h-auto bg-black flex-shrink-0 relative border-b md:border-b-0 md:border-r border-white/10">
          <img 
            src={imageUrl} 
            alt="Asset Thumbnail" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className={`absolute top-2 left-2 ${color} bg-black/80 p-1.5 rounded-md backdrop-blur-md shadow-lg`}>
            {icon}
          </div>
        </div>
      )}

      {/* Right: Data Content */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${color} opacity-80`}>
              {label}
            </span>
            {type === AssetType.COMMERCIAL && data?.catalogNumber && (
               <span className="font-mono text-xs text-white/40">{data.catalogNumber}</span>
            )}
          </div>

          <h3 className="text-2xl font-serif text-ardent-cream leading-tight mb-4">
             {type === AssetType.COMMERCIAL ? (data?.title || 'Untitled Record') :
              type === AssetType.DOCUMENT ? `Document: ${data?.date || 'Undated'}` :
              (data?.description || 'Untitled Visual')}
          </h3>

          <div className="space-y-3">
             {/* Commercial Specifics */}
             {type === AssetType.COMMERCIAL && (
               <>
                 <MetaRow icon={<User className="w-4 h-4" />} label="Artist" value={data?.artist} />
                 <MetaRow icon={<Hash className="w-4 h-4" />} label="Cat. No" value={data?.catalogNumber} />
               </>
             )}

             {/* Document Specifics */}
             {type === AssetType.DOCUMENT && (
               <>
                 <MetaRow icon={<Calendar className="w-4 h-4" />} label="Date" value={data?.date} />
                 <MetaRow icon={<User className="w-4 h-4" />} label="Client" value={data?.client} />
                 {data?.personnel && data.personnel.length > 0 && (
                   <MetaRow icon={<User className="w-4 h-4" />} label="Personnel" value={data.personnel.join(', ')} />
                 )}
               </>
             )}

             {/* Visual Specifics */}
             {type === AssetType.VISUAL && (
               <>
                 {data?.potentialSessionGuess && (
                   <div className="bg-white/5 border border-white/10 rounded px-3 py-2">
                      <p className="text-xs text-ardent-gold uppercase tracking-wider mb-1">Likely Session</p>
                      <p className="text-ardent-cream font-medium">{data.potentialSessionGuess}</p>
                   </div>
                 )}
                 {data?.tags && (
                   <div className="flex flex-wrap gap-2 mt-2">
                     {data.tags.map((tag: string, i: number) => (
                       <span key={i} className="flex items-center text-xs text-white/60 bg-white/5 px-2 py-1 rounded-full">
                         <Tag className="w-3 h-3 mr-1 opacity-50" /> {tag}
                       </span>
                     ))}
                   </div>
                 )}
               </>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaRow({ icon, label, value }: { icon: React.ReactNode, label: string, value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center text-sm">
      <div className="w-24 flex-shrink-0 flex items-center text-white/40">
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-4 h-4 mr-2" })}
        <span>{label}</span>
      </div>
      <div className="text-ardent-cream font-medium truncate">{value}</div>
    </div>
  );
}
