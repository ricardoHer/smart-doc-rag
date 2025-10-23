# SmartDocRAG Frontend

Modern React frontend for the SmartDocRAG system, providing an intuitive interface for document upload, management, and AI-powered chat interactions.

## 🌟 Features

- **📱 Modern UI**: ChatGPT-inspired interface with responsive design
- **📂 Document Management**: Upload, list, and delete documents with sidebar navigation
- **💬 Interactive Chat**: Real-time conversation with AI about your documents
- **🔄 Live Updates**: Automatic refresh of document lists and chat messages
- **🎨 Tailwind CSS**: Beautiful, responsive styling with dark sidebar theme
- **⚡ Vite**: Fast development server with hot module replacement

## 🛠️ Technology Stack

- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **JavaScript (ES6+)**: Modern JavaScript features
- **Fetch API**: HTTP client for API communication

## 📋 Prerequisites

- Node.js 18+
- Backend API running on http://localhost:3000
- Modern web browser with JavaScript enabled

## 🚀 Installation

1. **Install dependencies:**

```bash
cd smartdocrag-ui
npm install
```

2. **Start development server:**

```bash
npm run dev
```

The application will be available at http://localhost:5173

## 📦 Available Scripts

```bash
npm run dev        # Start development server with hot reload
npm run build      # Build for production
npm run preview    # Preview production build locally
npm run lint       # Run ESLint for code quality
```

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── Sidebar.jsx      # Document list and navigation
│   ├── Header.jsx       # Top navigation bar
│   ├── MainArea.jsx     # Main content area
│   ├── UploadBox.jsx    # File upload interface
│   └── ChatBox.jsx      # Chat interface
├── services/
│   └── api.js           # API client functions
├── App.jsx              # Main application component
├── main.jsx             # Application entry point
└── index.css            # Global styles and Tailwind imports
```

## 🎯 Component Overview

### Sidebar.jsx

- **Document List**: Displays all uploaded documents from the API
- **Collapsible**: Can be collapsed for more space
- **Live Updates**: Automatically refreshes when new documents are uploaded
- **Delete Functionality**: Remove documents with confirmation dialog
- **Selection State**: Visual feedback for selected document

### ChatBox.jsx

- **Message History**: Displays conversation history with timestamps
- **Real-time Typing**: Shows AI thinking indicator
- **Context Display**: Shows which document chunks were used for answers
- **Responsive Design**: Adapts to different screen sizes

### UploadBox.jsx

- **Drag & Drop**: File upload with visual feedback
- **Progress Tracking**: Shows upload and processing progress
- **Format Validation**: Accepts only .txt files
- **Error Handling**: Clear error messages for upload issues

### MainArea.jsx

- **View Switching**: Handles different application states (welcome, upload, chat)
- **State Management**: Coordinates between upload and chat modes
- **Responsive Layout**: Adapts content based on current view

## 🔗 API Integration

The frontend communicates with the backend API through the following endpoints:

### Document Management

```javascript
// List all documents
listDocuments() → GET /documents

// Delete a document
deleteDocument(id) → DELETE /documents/{id}
```

### File Operations

```javascript
// Upload a file
uploadFile(file) → POST /upload

// Process document content
ingestDocument(fileName, content) → POST /ingest
```

### Chat Operations

```javascript
// Ask a question
askQuestion(question) → POST /query
```

## 🎨 Styling & Theme

The application uses Tailwind CSS with a custom theme:

- **Sidebar**: Dark gray theme (`bg-gray-900`) with hover effects
- **Main Area**: Light theme with clean white backgrounds
- **Chat Messages**: Differentiated styling for user vs AI messages
- **Responsive**: Mobile-first design that adapts to all screen sizes

### Key Design Elements

- **Icons**: Heroicons SVG icons for consistent visual language
- **Typography**: Inter font with multiple weights and sizes
- **Colors**: Carefully chosen gray scale with blue accent colors
- **Spacing**: Consistent spacing using Tailwind's spacing scale

## 🚦 Development

### Hot Reload

The Vite development server provides instant hot reload for:

- React component changes
- CSS/Tailwind updates
- JavaScript modifications

### Code Quality

- ESLint configuration for code consistency
- React hooks rules for proper hook usage
- Modern JavaScript features (ES6+)

## 🔧 Configuration

### Vite Configuration

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
});
```

### Tailwind Configuration

```javascript
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // Custom theme extensions
    },
  },
  plugins: [],
};
```

## 📱 Responsive Design

The interface adapts to different screen sizes:

- **Desktop**: Full sidebar with document list
- **Tablet**: Collapsible sidebar for more content space
- **Mobile**: Mobile-optimized navigation and chat interface

## 🐛 Troubleshooting

### Common Issues

**CORS Errors**

- Ensure backend is running on http://localhost:3000
- Check that CORS is properly configured in the backend

**File Upload Failures**

- Verify file format is .txt
- Check file size limitations
- Ensure backend upload endpoint is working

**Chat Not Working**

- Verify documents are uploaded and processed
- Check browser console for API errors
- Ensure OpenAI API key is configured in backend

**Styling Issues**

- Run `npm run build` to ensure Tailwind is processing correctly
- Check browser console for CSS errors
- Verify Tailwind configuration

## 🔄 State Management

The application uses React hooks for state management:

- **useState**: Local component state
- **useEffect**: Side effects and API calls
- **useRef**: Direct DOM access and component references
- **forwardRef**: Parent-child component communication

## 🎯 Performance Optimizations

- **Lazy Loading**: Components load only when needed
- **Memoization**: Prevents unnecessary re-renders
- **Efficient API Calls**: Debounced and optimized requests
- **Image Optimization**: SVG icons for crisp display at any size

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly in different browsers
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Follow React best practices
- Use functional components with hooks
- Maintain consistent code style with ESLint
- Test across different screen sizes
- Write descriptive component and function names

## 📄 License

ISC License - See backend README for full license details.

## 🔗 Related

- [Backend API Documentation](../backend/README.md)
- [Main Project Documentation](../README.md)
