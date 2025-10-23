import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { listDocuments, deleteDocument } from "../services/api";

const Sidebar = forwardRef(function Sidebar(
  { onNewChat, onSelectFile, selectedFile },
  ref
) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar documentos ao montar o componente
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await listDocuments();
      setDocuments(response.documents);
    } catch (err) {
      console.error("Error loading documents:", err);
      setError("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  // Expose loadDocuments function to parent component
  useImperativeHandle(ref, () => ({
    loadDocuments,
  }));

  const handleDeleteDocument = async (documentId, event) => {
    event.stopPropagation(); // Prevent triggering file selection

    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      await deleteDocument(documentId);
      // Remove from local state
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));

      // If this was the selected file, clear selection
      if (selectedFile && selectedFile.id === documentId) {
        onSelectFile(null);
      }
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("Failed to delete document");
    }
  };

  const handleSelectFile = (document) => {
    // Convert API document format to the expected format
    const fileData = {
      id: document.id,
      name: document.name,
      chunks: parseInt(document.chunks_count),
      uploadedAt: new Date(document.created_at),
    };
    onSelectFile(fileData);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <div
      className={`${
        isCollapsed ? "w-12" : "w-64"
      } bg-gray-900 text-white h-screen flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold">SmartDoc RAG</h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-gray-800 rounded"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full bg-gray-800 hover:bg-gray-700 rounded-lg p-3 text-left flex items-center gap-3 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          {!isCollapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* Files List */}
      <div className="flex-1 overflow-y-auto">
        {!isCollapsed && (
          <div className="px-4 pb-4">
            <h3 className="text-sm font-medium text-gray-300 mb-3">
              Uploaded Documents
            </h3>

            {loading ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            ) : error ? (
              <div className="text-red-400 text-sm p-2">
                <p>{error}</p>
                <button
                  onClick={loadDocuments}
                  className="text-blue-400 hover:text-blue-300 mt-1"
                >
                  Try again
                </button>
              </div>
            ) : documents.length === 0 ? (
              <p className="text-sm text-gray-500">No documents uploaded</p>
            ) : (
              <div className="space-y-2">
                {documents.map((document) => (
                  <div
                    key={document.id}
                    className={`relative group rounded-lg transition-colors ${
                      selectedFile && selectedFile.id === document.id
                        ? "bg-gray-700 text-white"
                        : "hover:bg-gray-800 text-gray-300"
                    }`}
                  >
                    <button
                      onClick={() => handleSelectFile(document)}
                      className="w-full text-left p-3 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <p
                            className="text-sm font-medium truncate"
                            title={document.name}
                          >
                            {document.name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{document.chunks_count} chunks</span>
                            <span>•</span>
                            <span>{formatDate(document.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => handleDeleteDocument(document.id, e)}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-600 transition-all"
                      title="Delete document"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        {!isCollapsed && (
          <div className="text-xs text-gray-500 text-center">
            SmartDoc RAG v0.1
          </div>
        )}
      </div>
    </div>
  );
});

export default Sidebar;
