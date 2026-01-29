import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * File: src/components/NotFound.tsx
 * Description: A premium, responsive 404 error page.
 * Updated: Aligned with the application's editorial "high-fidelity" design system.
 */

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      {/* Visual background element */}
      <div className="relative mb-8">
        <h1 className="text-[12rem] md:text-[16rem] font-black text-slate-100 leading-none select-none tracking-tighter">
          404
        </h1>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-slate-900 font-black uppercase tracking-[0.4em] text-xl md:text-2xl mt-12 italic">
            Lost Point
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight leading-tight">
          The requested page <br />
          <span className="text-indigo-600 italic">has ceased to exist.</span>
        </h2>
        
        <p className="text-slate-400 text-sm font-medium leading-relaxed uppercase tracking-widest">
          The poll or resource you are looking for has been moved or was never created in this reality.
        </p>

        <div className="pt-8">
          <button 
            onClick={() => navigate('/')}
            className="group relative px-10 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full overflow-hidden transition-all hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-200 active:scale-95"
          >
            <span className="relative z-10">Back to Dashboard</span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>

      {/* Subtle bottom accent */}
      <div className="mt-20 flex items-center space-x-2">
        <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
        <div className="w-8 h-[1px] bg-slate-100"></div>
        <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
      </div>
    </div>
  );
}

export default NotFound;