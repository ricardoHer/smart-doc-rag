export default function Header({ currentView, onViewChange, hasFiles }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900">SmartDoc RAG</h1>

          {hasFiles && (
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onViewChange("chat")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === "chat"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => onViewChange("upload")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === "upload"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Upload
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!hasFiles && (
            <button
              onClick={() => onViewChange("upload")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
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
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Upload Document
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
