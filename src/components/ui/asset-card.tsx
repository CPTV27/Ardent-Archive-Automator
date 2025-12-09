import { clsx } from 'clsx';
// FIX: Relative import to the types folder
import { AssetMetadata } from '../../types'; 

interface AssetCardProps {
  metadata: AssetMetadata;
  imageUrl: string;
  className?: string;
}

export function AssetCard({ metadata, imageUrl, className }: AssetCardProps) {
  const isCommercial = metadata.assetType === 'Commercial';
  const isDocument = metadata.assetType === 'Document';

  const borderColor = isCommercial ? 'border-yellow-600' : isDocument ? 'border-blue-500' : 'border-gray-600';
  const badgeColor = isCommercial ? 'bg-yellow-600/20 text-yellow-500' : isDocument ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-600/20 text-gray-400';

  return (
    <div className={clsx("relative flex bg-neutral-900 border-l-4 rounded-r-lg shadow-xl overflow-hidden font-mono text-sm", borderColor, className)}>
      <div className="w-32 h-32 relative bg-black flex-shrink-0">
        <img src={imageUrl} alt="Asset" className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-neutral-900" />
      </div>

      <div className="flex-1 p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className={clsx("px-2 py-0.5 rounded text-xs uppercase tracking-wider font-bold", badgeColor)}>
            {metadata.assetType}
          </span>
          <span className="text-neutral-500 text-xs">CONFIDENCE: {((metadata.confidenceScore || 0) * 100).toFixed(0)}%</span>
        </div>

        <div className="mt-2 space-y-1">
          {isCommercial && (
            <>
              <h3 className="text-yellow-500 text-lg font-bold leading-none">{metadata.explicitData?.title || "Unknown Title"}</h3>
              <p className="text-neutral-300">{metadata.explicitData?.artist || "Unknown Artist"}</p>
            </>
          )}

          {isDocument && (
            <>
              <h3 className="text-blue-400 text-lg font-bold leading-none">{metadata.explicitData?.client || "Unknown Client"}</h3>
              <p className="text-neutral-300">{metadata.explicitData?.date || "No Date Found"}</p>
            </>
          )}

          {!isCommercial && !isDocument && (
            <>
               <h3 className="text-gray-300 text-lg font-bold leading-none">Visual Asset</h3>
               <div className="flex flex-wrap gap-1 mt-1">
                 {metadata.visualCues?.slice(0, 3).map(tag => (
                   <span key={tag} className="text-xs text-neutral-500 bg-neutral-800 px-1 rounded">{tag}</span>
                 ))}
               </div>
            </>
          )}
        </div>

        {metadata.potentialSessionGuess && (
          <div className="mt-3 pt-2 border-t border-neutral-800">
             <p className="text-xs text-neutral-500">LIKELY SESSION:</p>
             <p className="text-yellow-600 font-bold animate-pulse">{metadata.potentialSessionGuess}</p>
          </div>
        )}
      </div>
    </div>
  );
}