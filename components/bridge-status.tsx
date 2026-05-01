'use client';

import { AlertCircle, Terminal, HelpCircle, ArrowRight } from 'lucide-react';

interface BridgeStatusProps {
  type?: '404' | 'timeout' | 'acf' | 'generic';
}

export default function BridgeStatus({ type = 'generic' }: BridgeStatusProps) {
  const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

  const isCustomFieldsError = type === 'acf';

  return (
    <div className="max-w-3xl mx-auto mt-20 px-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 overflow-hidden relative shadow-2xl">
        {/* Glow */}
        <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/4 ${isCustomFieldsError ? 'bg-amber-500/10' : 'bg-red-500/10'}`} />
        
        <div className="relative z-10">
          <div className={`inline-flex items-center gap-2 px-3 py-1 border rounded-full mb-8 ${isCustomFieldsError ? 'bg-amber-500/10 border-amber-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
            <AlertCircle className={`w-3 h-3 ${isCustomFieldsError ? 'text-amber-500' : 'text-red-500'}`} />
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isCustomFieldsError ? 'text-amber-400' : 'text-red-400'}`}>
              {isCustomFieldsError ? 'Field Mapping Incomplete' : 'Bridge Interface Offline'}
            </span>
          </div>

          <h2 className="font-serif italic text-4xl md:text-5xl text-white mb-6">
            {isCustomFieldsError ? 'Smart Custom Fields' : 'Endpoint Synchronization'} <br />
            <span className="text-zinc-600 italic">{isCustomFieldsError ? 'Not found in registry.' : 'Terminated unexpectedly.'}</span>
          </h2>

          <p className="font-sans text-zinc-400 text-lg leading-relaxed mb-12 max-w-xl">
            {isCustomFieldsError 
              ? 'The system is attempting to query metadata that does not exist in the current WordPress schema (SCF). This usually means a required plugin is missing or not exposed to GraphQL.'
              : 'The headless interface cannot establish a data link with the source WordPress environment.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Terminal className="w-4 h-4 text-zinc-500" />
                <span className="font-mono text-[10px] uppercase font-bold text-zinc-300">Registry Diagnostics</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${isCustomFieldsError ? 'bg-amber-500' : 'bg-red-500'}`} />
                  <p className="text-xs text-zinc-500 leading-relaxed font-mono">
                    <span className="text-zinc-300">GraphQL Endpoint:</span> {apiUrl || 'NOT_DEFINED'}
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${isCustomFieldsError ? 'bg-amber-500' : 'bg-red-500'}`} />
                  <p className="text-xs text-zinc-500 leading-relaxed font-mono">
                    <span className="text-zinc-300">Signal Code:</span> {isCustomFieldsError ? 'SCF_FIELD_MISSING' : type === '404' ? '404 NOT FOUND' : 'SIGNAL LOSS (TIMEOUT)'}
                  </p>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-zinc-500" />
                <span className="font-mono text-[10px] uppercase font-bold text-zinc-300">Resolution Steps</span>
              </div>
              <ul className="space-y-3">
                {isCustomFieldsError ? (
                  <>
                    <li className="flex items-start gap-2 group">
                      <ArrowRight className="w-3 h-3 mt-1 text-zinc-600 group-hover:text-amber-500 transition-colors" />
                      <span className="text-xs text-zinc-500">Ensure <span className="text-zinc-300">Smart Custom Fields</span> is enabled in GraphQL.</span>
                    </li>
                    <li className="flex items-start gap-2 group">
                      <ArrowRight className="w-3 h-3 mt-1 text-zinc-600 group-hover:text-amber-500 transition-colors" />
                      <span className="text-xs text-zinc-500">Verify <span className="text-zinc-300">SCF Field Groups</span> are shared with the schema.</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start gap-2 group">
                      <ArrowRight className="w-3 h-3 mt-1 text-zinc-600 group-hover:text-amber-500 transition-colors" />
                      <span className="text-xs text-zinc-500">Check WordPress Plugin Status.</span>
                    </li>
                    <li className="flex items-start gap-2 group">
                      <ArrowRight className="w-3 h-3 mt-1 text-zinc-600 group-hover:text-amber-500 transition-colors" />
                      <span className="text-xs text-zinc-500">Enable <span className="text-zinc-300">WPGraphQL</span> core plugin.</span>
                    </li>
                    <li className="flex items-start gap-2 group">
                      <ArrowRight className="w-3 h-3 mt-1 text-zinc-600 group-hover:text-amber-500 transition-colors" />
                      <span className="text-xs text-zinc-500">Ensure <span className="text-zinc-300">Permalinks</span> is set to <span className="text-zinc-300">Post name</span>.</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-800 flex justify-between items-center">
            <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">
              {isCustomFieldsError ? 'System Core v4.2 / Error Trace: SCF-SCHEM-FAIL' : 'System Core v4.2 / Error Trace: B0X-404-RES'}
            </p>
            <div className="flex gap-4">
              {isCustomFieldsError && (
                <button 
                  onClick={() => window.location.href = apiUrl?.replace('/graphql', '/wp-admin/plugins.php') || '#'}
                  className="text-[10px] font-bold uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-2"
                >
                  Open WP Admin <ArrowRight className="w-3 h-3" />
                </button>
              )}
              <button 
                onClick={() => window.location.reload()}
                className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
              >
                Re-Sync Interface <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
