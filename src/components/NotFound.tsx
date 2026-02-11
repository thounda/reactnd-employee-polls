import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * FILE: src/components/NotFound.tsx
 * DESCRIPTION: A premium, high-fidelity 404 error page.
 * Aligned with the application's "Editorial Luxury" design system.
 */

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center animate-in fade-in duration-700">
      {/* Visual background element */}
      <div className="relative mb-4 group">
        <h1 className="text-[12rem] md:text-[20rem] font-black text-slate-50 leading-none select-none tracking-tighter transition-transform duration-700 group-hover:scale-105">
          404
        </h1>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-slate-900 font-black uppercase tracking-[0.5em] text-xl md:text-3xl mt-12 italic bg-white/80 backdrop-blur-sm px-8 py-2">
            Void
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto space-y-8 -mt-8 md:-mt-16 relative z-10">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-[0.9]">
          The requested page <br />
          <span className="text-indigo-600 italic underline decoration-indigo-100 underline-offset-4">
            is no longer here.
          </span>
        </h2>
        
        <p className="max-w-xs mx-auto text-slate-400 text-[10px] font-black leading-relaxed uppercase tracking-[0.2em]">
          The poll or resource you are looking for has been moved or was never created in this reality.
        </p>

        <div className="pt-8">
          <button 
            onClick={() => navigate('/')}
            className="group relative inline-flex items-center justify-center px-12 py-5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-full overflow-hidden transition-all hover:shadow-[0_20px_50px_rgba(79,70,229,0.3)] active:scale-95"
          >
            <span className="relative z-10">Return to Safety</span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_100%] animate-gradient-x"></div>
          </button>
        </div>
      </div>

      {/* Subtle bottom accent */}
      <div className="mt-24 flex items-center justify-center space-x-4 opacity-30">
        <div className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
        <div className="w-24 h-[1px] bg-slate-900"></div>
        <div className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
      </div>

      <style>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
}

export default NotFound;

