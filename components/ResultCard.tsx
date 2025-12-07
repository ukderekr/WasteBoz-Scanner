import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { EwcCode } from '../types';

interface ResultCardProps {
  data: EwcCode;
}

export const ResultCard: React.FC<ResultCardProps> = ({ data }) => {
  const isHazardous = data.hazardous || data.code.includes('*');

  return (
    <div className={`
      relative overflow-hidden rounded-xl border p-4 shadow-sm transition-all duration-200
      ${isHazardous ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}
    `}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col">
          <span className={`text-2xl font-black tracking-tight ${isHazardous ? 'text-amber-700' : 'text-eco-700'}`}>
            {data.code}
          </span>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {data.category}
          </span>
        </div>
        
        {isHazardous ? (
          <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
            <AlertTriangle size={12} />
            <span>HAZARDOUS</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 px-2 py-1 bg-eco-100 text-eco-700 rounded-full text-xs font-bold">
            <CheckCircle size={12} />
            <span>NON-HAZARDOUS</span>
          </div>
        )}
      </div>

      <p className="text-slate-700 leading-relaxed font-medium">
        {data.description}
      </p>

      {data.confidence && (
        <div className="mt-3 flex items-center gap-2">
           <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
             <div 
                className={`h-full rounded-full ${isHazardous ? 'bg-amber-500' : 'bg-eco-500'}`} 
                style={{ width: `${data.confidence}%` }}
             />
           </div>
           <span className="text-xs text-slate-400 font-mono whitespace-nowrap">
             {data.confidence}% match
           </span>
        </div>
      )}
    </div>
  );
};