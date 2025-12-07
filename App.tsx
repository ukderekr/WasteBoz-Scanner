import React, { useState, useRef } from 'react';
import { Search, Loader2, Trash2, X, Info } from 'lucide-react';
import { searchEwcByText, searchEwcByImage } from './services/geminiService';
import { EwcCode, SearchState } from './types';
import { ResultCard } from './components/ResultCard';
import { EmptyState } from './components/EmptyState';
import { CameraInput } from './components/CameraInput';
import { InfoModal } from './components/InfoModal';

const App: React.FC = () => {
  const [state, setState] = useState<SearchState>({
    isLoading: false,
    results: [],
    error: null,
    query: '',
    imagePreview: null,
  });

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!state.query.trim()) return;

    setState(prev => ({ ...prev, isLoading: true, error: null, imagePreview: null }));

    try {
      const results = await searchEwcByText(state.query);
      setState(prev => ({ ...prev, isLoading: false, results }));
      scrollToResults();
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false, error: error.message }));
    }
  };

  const handleImageSelected = async (base64: string) => {
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null, 
      imagePreview: base64,
      query: '' // Clear text query when scanning
    }));

    try {
      const results = await searchEwcByImage(base64);
      setState(prev => ({ ...prev, isLoading: false, results }));
      scrollToResults();
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false, error: error.message }));
    }
  };

  const clearSearch = () => {
    setState({
      isLoading: false,
      results: [],
      error: null,
      query: '',
      imagePreview: null,
    });
  };

  const scrollToResults = () => {
    setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative">
      
      {/* Info Modal */}
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-100 px-6 py-4">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black tracking-tighter text-slate-800 flex items-center gap-0.5">
                <span className="text-eco-600">Waste</span>Boz
            </h1>
            <div className="flex items-center gap-2">
                {state.results.length > 0 && (
                    <button 
                        onClick={clearSearch} 
                        className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-3 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                        Clear
                    </button>
                )}
                <button
                    onClick={() => setIsInfoOpen(true)}
                    className="p-2 rounded-full text-slate-400 hover:text-eco-600 hover:bg-eco-50 transition-colors"
                    aria-label="App Information"
                >
                    <Info size={24} />
                </button>
            </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6 pb-32">
        
        {/* Search Section */}
        <div className="space-y-4">
            <div className="relative group">
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        placeholder="Describe waste (e.g. 'paint cans')..."
                        value={state.query}
                        onChange={(e) => setState(prev => ({ ...prev, query: e.target.value }))}
                        className="
                            w-full pl-12 pr-4 py-4 rounded-2xl
                            bg-white border-2 border-slate-100 
                            focus:border-eco-400 focus:ring-4 focus:ring-eco-100 
                            outline-none transition-all font-medium text-slate-700
                            placeholder:text-slate-400
                            shadow-sm
                        "
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-eco-500 transition-colors" size={20} />
                    {state.query && (
                        <button 
                            type="button"
                            onClick={() => setState(prev => ({...prev, query: ''}))}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                        >
                            <X size={16} />
                        </button>
                    )}
                </form>
            </div>
            
            <div className="flex items-center justify-center gap-3">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Or</span>
                <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            <CameraInput onImageSelected={handleImageSelected} isLoading={state.isLoading} />
        </div>

        {/* Loading State */}
        {state.isLoading && (
            <div className="flex flex-col items-center justify-center py-12 animate-in fade-in duration-500">
                <Loader2 className="animate-spin text-eco-500 mb-4" size={40} />
                <p className="text-slate-500 font-medium animate-pulse">
                    {state.imagePreview ? 'Analyzing waste image...' : 'Consulting EWC database...'}
                </p>
            </div>
        )}

        {/* Error State */}
        {state.error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-700 text-sm flex items-start gap-3 animate-in slide-in-from-bottom-2">
                <div className="mt-0.5"><X size={16} /></div>
                <p>{state.error}</p>
            </div>
        )}

        {/* Results */}
        {!state.isLoading && state.results.length === 0 && !state.error && !state.imagePreview && (
            <EmptyState />
        )}

        {/* Image Preview Context */}
        {!state.isLoading && state.imagePreview && (
            <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200 mb-6">
                 <img src={state.imagePreview} alt="Scanned waste" className="w-full h-48 object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <div className="text-white">
                        <p className="text-xs font-bold uppercase opacity-80 mb-1">Scanned Image</p>
                        <p className="font-semibold text-sm">Identifying EWC codes...</p>
                    </div>
                 </div>
            </div>
        )}

        {/* Results List */}
        {!state.isLoading && state.results.length > 0 && (
            <div ref={scrollRef} className="space-y-4 animate-in slide-in-from-bottom-8 duration-500">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-800">Results</h2>
                    <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
                        {state.results.length} found
                    </span>
                </div>
                {state.results.map((result, idx) => (
                    <ResultCard key={`${result.code}-${idx}`} data={result} />
                ))}
            </div>
        )}
      </main>

      {/* Sticky Scan Button for quick access when scrolling results (Optional, but good for mobile) */}
      {!state.isLoading && state.results.length > 0 && (
         <div className="absolute bottom-6 left-0 right-0 flex justify-center z-30 pointer-events-none">
             <div className="pointer-events-auto shadow-2xl rounded-full">
                <CameraInput onImageSelected={handleImageSelected} isLoading={state.isLoading} />
             </div>
         </div>
      )}

    </div>
  );
};

export default App;