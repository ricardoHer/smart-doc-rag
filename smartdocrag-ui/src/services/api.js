// Use environment variable for API URL, fallback to localhost for development
const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function askQuestion(question) {
    const res = await fetch(`${apiURL}/query`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
    });
    return res.json();
}

async function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${apiURL}/upload`, {
        method: "POST",
        body: formData,
    });
    if (!res.ok) {
        throw new Error("File upload failed");
    }
    return res.json();
};

async function ingestDocument(fileName, content) {
    const res = await fetch(`${apiURL}/ingest`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName, content }),
    });
    if (!res.ok) {
        throw new Error("Document ingestion failed");
    }
    return res.json();
}

async function listDocuments() {
    const res = await fetch(`${apiURL}/documents`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch documents");
    }
    return res.json();
}

async function deleteDocument(documentId) {
    const res = await fetch(`${apiURL}/documents/${documentId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) {
        throw new Error("Failed to delete document");
    }
    return res.json();
}

export { askQuestion, uploadFile, ingestDocument, listDocuments, deleteDocument };
