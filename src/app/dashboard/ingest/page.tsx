
'use client';

import React, { useState, useCallback } from 'react';
import { AssetType } from '@/types';
import { AssetCard } from '@/components/ui/asset-card';
import { Upload, Loader2, RefreshCw } from 'lucide-react';

interface AnalysisResult {
  asset: {
    id: string;
    url: string;
    type: AssetType;
    aiRawResponse: any;
  };
  success: boolean;
}

export default function IngestPage() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'IDLE' | 'UPLOADING' | 'ANALYZING' | 'COMPLETE' | 'ERROR'>('IDLE');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (uploadedFile: File) => {
    setFile(uploadedFile);
    setPreview(URL.createObjectURL(uploadedFile));
    setStatus('IDLE');
    setResult(null);
    // Auto-process on drop for smoother UX?
    // Let's require a click for now to confirm preview, or we can auto-trigger:
    // processFile(uploadedFile); 
  };

  const processFile = async () => {
    if (!file) return;

    setStatus('UPLOADING');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      setStatus('ANALYZING');
      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
      setStatus('COMPLETE');
    } catch (err: any) {
      console.error(err);
      setStatus('ERROR');
      setErrorMsg(err.message || "Failed to process artifact");
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setStatus('IDLE');
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-serif text-ardent-cream mb-2">Ingest Artifact</h2>
        <p className="text-ardent-cream/50">Drag and drop assets to catalog them into the archive.</p>
      </div>

      {/* Main Upload Zone */}
      {!result ? (
        <div className="transition-all duration-500 ease-in-out">
          <div 
            className={`
              w-full min-h-[400px] rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden group
              ${dragActive 
                ? 'border-ardent-gold bg-ardent-gold/10 scale-[1.02]' 
                : 'border-ardent-gold/40 hover:border-ardent-gold bg-black/20 hover:bg-black/40'}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              onChange={handleChange}
              accept="image/*,application/pdf"
              disabled={status === 'UPLOADING' || status === 'ANALYZING'}
            />

            {/* Content State Switcher */}
            {preview ? (
               <div className="relative w-full h-full p-8 flex flex-col items-center justify-center">
                 <img src={preview} alt="Preview" className="max-h-[300px] object-contain shadow-2xl rounded-md" />
                 
                 {status === 'IDLE' && (
                   <div className="mt-8 z-30 pointer-events-auto">
                     <button 
                       onClick={(e) => { e.stopPropagation(); processFile(); }}
                       className="px-8 py-3 bg-ardent-gold hover:bg-ardent-goldHover text-ardent-black font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-ardent-gold/20 transform hover:-translate-y-0.5 transition-all"
                     >
                       Begin Analysis
                     </button>
                     <p className="text-center mt-3 text-xs text-white/30 cursor-pointer hover:text-white" onClick={reset}>Cancel</p>
                   </div>
                 )}
               </div>
            ) : (
              <div className="text-center p-8 pointer-events-none z-10 group-hover:scale-105 transition-transform duration-300">
                 <div className="w-20 h-20 bg-ardent-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 text-ardent-gold border border-ardent-gold/20">
                   <Upload className="w-10 h-10" />
                 </div>
                 <p className="text-xl font-medium text-ardent-cream mb-2">Drop Artifact Here</p>
                 <p className="text-sm text-ardent-cream/40">Support for Images (JPG, PNG) and PDF</p>
              </div>
            )}

            {/* Loading Overlay */}
            {(status === 'UPLOADING' || status === 'ANALYZING') && (
              <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-40 flex flex-col items-center justify-center">
                <div className="relative">
                  <Loader2 className="w-16 h-16 text-ardent-gold animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-8 h-8 bg-ardent-gold/20 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <p className="text-ardent-gold mt-6 tracking-[0.2em] uppercase text-sm font-bold animate-pulse">
                  {status === 'UPLOADING' ? 'Uploading Asset...' : 'AI Analysis Running...'}
                </p>
                <p className="text-white/30 text-xs mt-2">Classifying & Extracting Metadata</p>
              </div>
            )}
          </div>
          
          {status === 'ERROR' && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-center text-red-200 text-sm">
              Error: {errorMsg}
              <button onClick={reset} className="ml-2 underline hover:text-white">Try Again</button>
            </div>
          )}
        </div>
      ) : (
        /* Result View */
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl text-ardent-gold font-serif">Analysis Complete</h3>
              <button 
                onClick={reset}
                className="flex items-center text-xs text-ardent-cream/50 hover:text-ardent-cream transition-colors"
              >
                <RefreshCw className="w-3 h-3 mr-1" /> Process Another
              </button>
           </div>

           <AssetCard 
             type={result.asset.type} 
             data={result.asset.type === 'COMMERCIAL' ? result.asset.aiRawResponse.commercialData : 
                   result.asset.type === 'DOCUMENT' ? result.asset.aiRawResponse.documentData : 
                   result.asset.aiRawResponse.visualData} 
             imageUrl={preview || ''}
             className="w-full"
           />

           <div className="mt-8 flex justify-end gap-3 opacity-50 pointer-events-none grayscale">
             {/* Placeholder for future actions */}
             <button className="px-4 py-2 border border-white/10 rounded text-sm text-white/40">Edit Metadata</button>
             <button className="px-4 py-2 bg-white/10 rounded text-sm text-white/40">Confirm & Archive</button>
           </div>
           <p className="text-center text-xs text-white/20 mt-2">Actions disabled in Ingest Preview</p>
        </div>
      )}
    </div>
  );
}
