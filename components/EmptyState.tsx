import React from 'react';
import { Leaf, Search, Camera } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center h-64 opacity-80">
      <div className="bg-eco-100 p-4 rounded-full mb-4">
        <Leaf size={48} className="text-eco-600" />
      </div>
      <h3 className="text-lg font-bold text-slate-700 mb-2">Ready to Recycle?</h3>
      <p className="text-sm text-slate-500 max-w-xs mx-auto">
        Search for a waste type by keyword or scan an item using your camera to find its EWC code.
      </p>
      <div className="flex gap-4 mt-6 text-slate-400 text-xs font-medium">
        <div className="flex flex-col items-center gap-1">
          <Search size={16} />
          <span>Keyword</span>
        </div>
        <div className="w-px h-8 bg-slate-200"></div>
        <div className="flex flex-col items-center gap-1">
          <Camera size={16} />
          <span>Photo</span>
        </div>
      </div>
    </div>
  );
};