import { useState, useRef } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MainArea from "./components/MainArea";
import ApiDebug from "./components/ApiDebug";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentView, setCurrentView] = useState("welcome"); // 'welcome', 'upload', 'chat'
  const sidebarRef = useRef();

  const handleFileUploaded = (fileName, chunks) => {
    const newFile = {
      name: fileName,
      chunks: chunks,
      uploadedAt: new Date(),
    };

    setSelectedFile(newFile);
    setCurrentView("chat");

    // Trigger sidebar to reload documents
    if (sidebarRef.current && sidebarRef.current.loadDocuments) {
      sidebarRef.current.loadDocuments();
    }
  };

  const handleNewChat = () => {
    setCurrentView("chat");
    setSelectedFile(null);
  };

  const handleSelectFile = (file) => {
    setSelectedFile(file);
    setCurrentView("chat");
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        ref={sidebarRef}
        onNewChat={handleNewChat}
        onSelectFile={handleSelectFile}
        selectedFile={selectedFile}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header
          currentView={currentView}
          onViewChange={handleViewChange}
          hasFiles={true} // We'll check this differently now
        />

        {/* API Debug Component - Remove after verification */}
        <div className="p-4">
          <ApiDebug />
        </div>

        <MainArea
          currentView={currentView}
          onFileUploaded={handleFileUploaded}
          selectedFile={selectedFile}
        />
      </div>
    </div>
  );
}

export default App;
