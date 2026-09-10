import React, { useState, useRef, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  FileText,
  UploadCloud,
  FileCode,
  File,
  Search,
  MessageSquare,
  Sparkles,
  Send,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Cpu,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { IndexedDocument } from '../types';

export const DocumentsView: React.FC = () => {
  const {
    documents,
    uploadDocument,
    removeDocument,
    documentsLoading,
    documentsError,
    documentsStatus,
    chatMessages,
    sendChatMessage,
    isChatLoading,
    chatError
  } = useWorkspace();

  const [isDragging, setIsDragging] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<IndexedDocument | null>(documents[0] || null);
  const [inputQuestion, setInputQuestion] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedDoc((current) => current && documents.some((doc) => doc.id === current.id) ? current : documents[0] || null);
  }, [documents]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processUploadedFile(file);
    }
  };

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processUploadedFile(file);
    }
  };

  const processUploadedFile = (file: File) => {
    void uploadDocument(file);
  };

  const handleSubmitChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim() || isChatLoading) return;
    const query = inputQuestion;
    setInputQuestion('');
    sendChatMessage(query);
  };

  const defaultSuggestedQueries = [
    'What is the latency baseline for Edge Mesh Phase 3?',
    'Explain the circadian lamp schedule at sunset',
    'What are the Kyoto Studio sprint deliverables?'
  ];
  const suggestedQueries = [...chatMessages].reverse().find((message) => message.suggestions?.length)?.suggestions
    || defaultSuggestedQueries;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#EAE7DF]/60">
        <div className="flex items-center gap-2 text-[#865221] text-xs font-semibold uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" />
          <span>Local RAG & Knowledge Synthesis</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#242426] tracking-tight mt-1">
          Context & RAG Intelligence
        </h1>
        <p className="text-sm text-[#73716B]">
          Drag and drop project documentation and query grounded context with local vector retrieval.
        </p>
        <p className="text-[11px] text-[#865221] mt-2">Documents are private to your account and synced with the workspace API.</p>
        {documentsLoading && <p className="text-[11px] text-[#44664A] mt-1">Loading documents…</p>}
        {documentsStatus && <p className="text-[11px] text-[#44664A] mt-1">{documentsStatus}</p>}
        {documentsError && <p className="text-[11px] text-[#93000A] mt-1">{documentsError}</p>}
      </div>

      {/* Main 2-Column Split: Documents & Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Drag & Drop + Indexed Document List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Drag and Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-[#44664A] bg-[#C8E6C9]/20 scale-[1.01]'
                : 'border-[#EAE7DF] bg-white hover:border-[#44664A]/60 hover:bg-[#FAF9F5]'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleManualUpload}
              accept=".md,.markdown,.pdf,.docx,.txt,.json"
              className="hidden"
            />
            <div className="w-10 h-10 rounded-full bg-[#F7F3EB] flex items-center justify-center text-[#44664A] mx-auto mb-2 shadow-xs">
              <UploadCloud className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-xs sm:text-sm text-[#242426]">
              Drop Markdown, PDFs, or Text specs
            </h3>
            <p className="text-[11px] text-[#73716B] mt-0.5">
              Click to browse or drop files to index into local Kyoto context
            </p>
          </div>

          {/* Indexed Documents List */}
          <div className="bg-white rounded-2xl p-5 border border-[#EAE7DF] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#44664A]" />
                <h3 className="font-semibold text-sm text-[#242426]">Indexed Context Files</h3>
              </div>
              <span className="text-[11px] font-semibold text-[#865221] bg-[#FFDCC2] px-2 py-0.5 rounded-full">
                {documents.length} Available
              </span>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {documents.map((doc) => {
                const isSelected = selectedDoc?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#F7F3EB] border-[#44664A]/50 shadow-xs'
                        : 'bg-white border-[#EAE7DF] hover:bg-[#FAF9F5]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF9F5] border border-[#EAE7DF] flex items-center justify-center text-[#73716B] shrink-0">
                        {doc.type === 'markdown' ? (
                          <FileCode className="w-4 h-4 text-[#44664A]" />
                        ) : (
                          <FileText className="w-4 h-4 text-[#865221]" />
                        )}

                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#242426] truncate">
                          {doc.filename}
                        </div>
                        <div className="text-[10px] text-[#73716B] flex items-center gap-1.5 mt-0.5">
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>{doc.tokenCount.toLocaleString()} tokens</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                        doc.status === 'Indexed' ? 'bg-[#C6ECC8] text-[#00210B]' : 'bg-[#FFE0B2] text-[#865221]'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" /> {doc.status}
                      </span>
                      {documents.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeDocument(doc.id);
                            if (selectedDoc?.id === doc.id) {
                              setSelectedDoc(documents.find((d) => d.id !== doc.id) || null);
                            }
                          }}
                          className="p-1 text-[#8F8D86] hover:text-[#93000A] rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Document Preview snippet */}
          {selectedDoc && (
            <div className="bg-white rounded-2xl p-4 border border-[#EAE7DF] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#73716B] uppercase tracking-wider text-[10px]">
                  Document Preview: {selectedDoc.filename}
                </span>
                <span className="text-[10px] text-[#865221]">{selectedDoc.indexedAt}</span>
              </div>
              <pre className="text-xs text-[#424841] bg-[#FAF9F5] p-3 rounded-xl overflow-x-auto font-mono whitespace-pre-wrap max-h-32 border border-[#EAE7DF]/70">
                {selectedDoc.preview}
              </pre>
            </div>
          )}
          {chatError && (
            <p className="text-xs text-[#93000A] bg-[#FFF1F0] border border-[#F2C5C2] p-3 rounded-xl">
              {chatError}
            </p>
          )}
        </div>

        {/* Right Column: Grounded Q&A Chat Box (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-white rounded-2xl border border-[#EAE7DF] shadow-xs overflow-hidden h-[600px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-[#EAE7DF] bg-[#FAF9F5]/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#C8E6C9] flex items-center justify-center text-[#1C331F]">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="font-semibold text-xs sm:text-sm text-[#242426]">
                  Grounded Context Query
                </h3>
                <span className="text-[10px] text-[#73716B]">
                  RAG answers sourced exclusively from your indexed directives
                </span>
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 bg-[#F1EDE6] rounded-full text-[#424841] font-medium">
              Zero Hallucinations
            </span>
          </div>

          {/* Chat Message Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[90%] ${
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                    msg.role === 'user'
                      ? 'bg-[#FFE0B2] text-[#865221]'
                      : 'bg-[#C8E6C9] text-[#1C331F]'
                  }`}
                >
                  {msg.role === 'user' ? 'You' : <Sparkles className="w-3.5 h-3.5" />}
                </div>

                <div className="space-y-1">
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#44664A] text-white rounded-tr-xs'
                        : 'bg-[#F7F3EB] text-[#242426] border border-[#EAE7DF] rounded-tl-xs'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {msg.sourceCitations && msg.sourceCitations.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] text-[#73716B]">Sources:</span>
                      {msg.sourceCitations.map((cite, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-[#EAE7DF] text-[#424841] px-1.5 py-0.5 rounded font-mono"
                        >
                          {cite}
                        </span>
                      ))}
                    </div>
                  )}

                  {msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.actions.map((action, idx) => (
                        <span key={idx} className="text-[10px] bg-[#E6F1E7] text-[#1C331F] px-1.5 py-0.5 rounded">
                          {action}
                        </span>
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] text-[#8F8D86] px-1 block">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex items-center gap-2 text-xs text-[#73716B] bg-[#F7F3EB] p-3 rounded-2xl w-fit border border-[#EAE7DF]">
                <Sparkles className="w-3.5 h-3.5 text-[#44664A] animate-spin" />
                <span>Searching indexed context vectors...</span>
              </div>
            )}
          </div>

          {/* Quick query chips */}
          <div className="px-4 py-2 bg-[#FAF9F5] border-t border-[#EAE7DF] flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] text-[#73716B] uppercase tracking-wider shrink-0">
              Suggestions:
            </span>
            {suggestedQueries.map((query, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => sendChatMessage(query)}
                className="text-[11px] whitespace-nowrap bg-white border border-[#EAE7DF] text-[#424841] hover:text-[#242426] hover:bg-[#F1EDE6] px-2.5 py-1 rounded-full transition-colors cursor-pointer"
              >
                {query}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSubmitChat}
            className="p-3 bg-white border-t border-[#EAE7DF] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Ask anything about indexed sprint context, edge mesh specs, or circadian rules..."
              className="flex-1 text-xs sm:text-sm p-2.5 bg-[#F7F3EB] border border-[#EAE7DF] rounded-xl text-[#242426] focus:outline-none focus:ring-1 focus:ring-[#44664A]"
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim() || isChatLoading}
              className="p-2.5 bg-[#44664A] hover:bg-[#38553D] disabled:opacity-40 text-white rounded-xl transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
