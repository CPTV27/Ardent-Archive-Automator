
import React, { useState } from 'react';
import DashboardLayout from './src/app/dashboard/layout';
import IngestPage from './src/app/dashboard/ingest/page';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ingest' | 'magnets' | 'sorting'>('ingest');

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      
      {activeTab === 'ingest' && <IngestPage />}
      
      {activeTab !== 'ingest' && (
        <div className="bg-ardent-darkGray/30 border border-ardent-gold/10 rounded-xl p-8 min-h-[500px] flex flex-col items-center justify-center text-center">
          <div className="max-w-md space-y-6">
            <h2 className="text-4xl font-serif text-ardent-cream mb-2 opacity-80">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <div className="h-1 w-20 bg-ardent-gold/30 mx-auto rounded-full"></div>
            <p className="text-ardent-cream/60 leading-relaxed">
              This module is currently locked. Complete the Ingest phase to unlock workflow capabilities.
            </p>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default App;
