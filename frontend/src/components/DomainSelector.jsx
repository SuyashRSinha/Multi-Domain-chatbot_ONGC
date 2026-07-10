function DomainSelector({ domain, setDomain, documents = [] }) {
  const activeDocs = documents.filter((doc) => doc.domain === domain);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Workspace:
        </span>

        <div className="relative">
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="appearance-none bg-white/40 border border-white/40 hover:bg-white/60 focus:bg-white/70 rounded-full pl-4 pr-9 py-0.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-400 transition cursor-pointer shadow-sm capitalize"
          >
            <option value="hr_documents">HR & Onboarding</option>
            <option value="ongc_documents">ONGC Guidelines</option>
            <option value="technical_documents">Technical Docs</option>
            <option value="training_documents">Training Manuals</option>
            <option value="finance_documents">Finance & Audit</option>
            <option value="legal_documents">Legal & Compliance</option>
            <option value="marketing_documents">Marketing Material</option>
            <option value="medical_documents">Medical & Healthcare</option>
          </select>
          
          {/* Custom Chevron SVG */}
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Uploaded Documents List */}
      <div className="flex items-center gap-1.5 flex-wrap ml-1.5">
        {activeDocs.length > 0 ? (
          activeDocs.map((doc, index) => (
            <div
              key={index}
              title={doc.filename}
              className="inline-flex items-center gap-1.5 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 hover:bg-purple-100 dark:hover:bg-purple-900/40 px-2.5 py-0.5 rounded-full text-xs font-bold text-purple-700 dark:text-purple-300 shadow-sm transition-all duration-200 hover:scale-[1.02] max-w-[180px] cursor-default"
            >
              <svg className="w-3 h-3 text-purple-600 dark:text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span className="truncate">{doc.filename}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 flex-shrink-0 animate-pulse" title="Active knowledge source"></span>
            </div>
          ))
        ) : (
          <span className="text-[10px] text-slate-400 dark:text-slate-500 italic select-none">
            (No documents)
          </span>
        )}
      </div>
    </div>
  );
}

export default DomainSelector;