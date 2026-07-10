import { useEffect, useRef, useState } from "react";
import {
  getSummaryStatus,
  downloadSummary,
} from "../services/summaryService";

import { deleteDocument } from "../services/documentService";

function DocumentList({
  documents,
  domain,
  loadDocuments,
}) {

  const [summaryStatuses, setSummaryStatuses] = useState({});

  const statusRef = useRef({});

  useEffect(() => {
    statusRef.current = summaryStatuses;
  }, [summaryStatuses]);

  useEffect(() => {

    if (documents.length === 0) return;

    let intervalId = null;

    const fetchStatus = async () => {

      const updatedStatuses = {
        ...statusRef.current,
      };

      let hasProcessingDocument = false;

      for (const document of documents) {

        const currentStatus =
          updatedStatuses[document.filename];

        if (
          currentStatus === "ready" ||
          currentStatus === "failed"
        ) {
          continue;
        }

        try {

          const response =
            await getSummaryStatus(
              document.domain,
              document.filename
            );

          updatedStatuses[document.filename] =
            response.status;

          if (
            response.status === "processing"
          ) {
            hasProcessingDocument = true;
          }

        } catch {

          updatedStatuses[document.filename] =
            "not_found";

        }

      }

      statusRef.current = updatedStatuses;

      setSummaryStatuses(updatedStatuses);

      if (
        !hasProcessingDocument &&
        intervalId
      ) {
        clearInterval(intervalId);
        intervalId = null;
      }

    };

    fetchStatus();

    intervalId = setInterval(
      fetchStatus,
      3000
    );

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };

  }, [documents]);

  console.log(documents);
console.log(domain);

  const filteredDocuments = documents.filter(
    (document) => document.domain === domain
  );

  const handleDelete = async (filename) => {

    const confirmDelete = window.confirm(
      `Delete "${filename}"?`
    );

    if (!confirmDelete) return;

    try {

      await deleteDocument(
        domain,
        filename
      );

      alert(
        `Document "${filename}" deleted successfully.`
      );

      loadDocuments();

    } catch (error) {

      console.error(error);

      alert(
        `Failed to delete document "${filename}".`
      );

    }

  };

  return (
    <div className="bg-transparent flex flex-col h-full">
      <h2 className="text-xl font-extrabold text-purple-900 tracking-tight mb-2">
        Knowledge Base Files
      </h2>
      <p className="text-xs text-slate-500 mb-6">
        Documents uploaded and processed for the selected workspace:
      </p>

      {filteredDocuments.length === 0 ? (
        <div className="border-2 border-dashed border-purple-200/40 rounded-2xl p-12 text-center text-slate-500 text-xs font-semibold">
          No files trained on this domain yet.
        </div>
      ) : (
        <ul className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
          {filteredDocuments.map((document, index) => (
            <li
              key={index}
              className="bg-white/45 border border-white/40 rounded-2xl shadow-sm p-4 hover:bg-white/60 transition duration-150 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-2.5 min-w-0">
                  <svg className="w-5 h-5 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <span className="font-semibold text-xs text-slate-800 truncate" title={document.filename}>
                    {document.filename}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(document.filename)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer flex-shrink-0"
                  title="Delete trained file"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Status Section */}
              <div className="mt-3 flex items-center justify-between">
                <div>
                  {summaryStatuses[document.filename] === "processing" && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <svg className="animate-spin h-3 w-3 text-amber-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Summarizing...
                    </span>
                  )}

                  {summaryStatuses[document.filename] === "ready" && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Summary Ready
                    </span>
                  )}

                  {summaryStatuses[document.filename] === "failed" && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                      Failed
                    </span>
                  )}
                </div>

                {summaryStatuses[document.filename] === "ready" && (
                  <button
                    onClick={() => downloadSummary(document.domain, document.filename)}
                    className="text-[10px] font-extrabold text-purple-700 bg-white hover:bg-purple-50/50 border border-purple-200 px-3 py-1 rounded-full shadow-sm transition duration-200 cursor-pointer"
                  >
                    Download Summary
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DocumentList;