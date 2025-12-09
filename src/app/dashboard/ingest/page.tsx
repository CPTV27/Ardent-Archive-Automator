"use client";

import { useState, useCallback } from 'react';
// FIX: Relative imports
import { AssetCard } from '../../../components/ui/asset-card';
import { AssetMetadata } from '../../../types';

export default function IngestPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{ url: string; meta: AssetMetadata }[]>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else if (e.type === "dragleave") setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    setIsAnalyzing(true);

    for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch('/api/process', { method: 'POST', body: formData });
            const data = await res.json();
            
            const previewUrl = URL.createObjectURL(file);
            setResults(prev => [{ url: previewUrl, meta: data }, ...prev]);
        } catch (err) {
            console.error("Analysis failed", err);
        }
    }
    setIsAnalyzing(false);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-yellow-500 uppercase tracking-widest">Rapid Ingest</h1>
        <p className="text-neutral-400">Drag files to analyze. The AI will categorize them automatically.</p>
      </header>

      <div 
        onDragEnter={handleDrag} 
        onDragLeave={handleDrag} 
        onDragOver={handleDrag} 
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg h-64 flex flex-col items-center justify-center transition-all cursor-pointer
          ${isDragging ? 'border-yellow-500 bg-yellow-900/20' : 'border-neutral-700 bg-neutral-900 hover:border-neutral-500'}
        `}
      >
        {isAnalyzing ? (
            <div className="animate-spin text-4xl">📀</div> 
        ) : (
            <>
                <div className="text-4xl mb-4">📥</div>
                <p className="text-neutral-300 font-mono text-sm">DROP ASSETS HERE</p>
            </>
        )}
      </div>

      <div className="mt-12 space-y-4">
        {results.map((item, idx) => (
            <AssetCard key={idx} imageUrl={item.url} metadata={item.meta} />
        ))}
      </div>
    </div>
  );
}