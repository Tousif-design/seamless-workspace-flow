
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText, Plus, History, Share2, Save, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Image, Link } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type Document = {
  id: string;
  title: string;
  content: string;
  lastEdited: string;
};

const Docs = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      title: "Project Proposal",
      content: "<h1>Project Proposal</h1><p>This is a sample project proposal document...</p>",
      lastEdited: "2023-06-05T14:30:00",
    },
    {
      id: "2",
      title: "Meeting Notes",
      content: "<h1>Meeting Notes</h1><p>Notes from our last team meeting...</p>",
      lastEdited: "2023-06-02T09:15:00",
    },
    {
      id: "3",
      title: "Weekly Report",
      content: "<h1>Weekly Report</h1><p>Summary of progress made this week...</p>",
      lastEdited: "2023-05-28T16:45:00",
    },
  ]);

  const [activeDocument, setActiveDocument] = useState<Document>(documents[0]);
  const editorRef = useRef<HTMLDivElement>(null);
  const [documentTitle, setDocumentTitle] = useState(activeDocument.title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = activeDocument.content;
    }
    setDocumentTitle(activeDocument.title);
  }, [activeDocument]);

  const handleDocumentSelect = (doc: Document) => {
    // Save current document before switching
    saveCurrentDocument();
    setActiveDocument(doc);
  };

  const saveCurrentDocument = () => {
    if (editorRef.current) {
      const updatedDocuments = documents.map(doc => {
        if (doc.id === activeDocument.id) {
          return {
            ...doc,
            title: documentTitle,
            content: editorRef.current?.innerHTML || doc.content,
            lastEdited: new Date().toISOString(),
          };
        }
        return doc;
      });
      setDocuments(updatedDocuments);
    }
  };

  const handleSave = () => {
    saveCurrentDocument();
    toast.success("Document saved successfully");
  };

  const handleShare = () => {
    toast.success("Sharing options displayed", {
      description: "You can now share your document with others",
    });
  };

  const handleFormatText = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const createNewDocument = () => {
    // Save current document first
    saveCurrentDocument();
    
    // Create new document
    const newDoc: Document = {
      id: Date.now().toString(),
      title: "Untitled Document",
      content: "<h1>Untitled Document</h1><p>Start typing to create your document...</p>",
      lastEdited: new Date().toISOString(),
    };
    
    setDocuments([newDoc, ...documents]);
    setActiveDocument(newDoc);
    setDocumentTitle(newDoc.title);
    setIsEditingTitle(true);
    toast.success("New document created");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return "Yesterday at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
             " at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Google Docs</h1>
            <Button onClick={createNewDocument}>
              <Plus className="mr-2 h-4 w-4" /> New Document
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card className="min-h-[600px]">
                <CardHeader className="border-b p-3">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      {isEditingTitle ? (
                        <input
                          type="text"
                          value={documentTitle}
                          onChange={(e) => setDocumentTitle(e.target.value)}
                          onBlur={() => setIsEditingTitle(false)}
                          onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                          className="text-xl font-semibold outline-none border-b-2 border-blue-500 w-full"
                          autoFocus
                        />
                      ) : (
                        <h2 
                          className="text-xl font-semibold cursor-pointer hover:text-blue-600"
                          onClick={() => setIsEditingTitle(true)}
                        >
                          {documentTitle}
                        </h2>
                      )}
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={handleSave}>
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleShare}>
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1">
                      <Button variant="ghost" size="sm" onClick={() => handleFormatText('bold')}>
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleFormatText('italic')}>
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleFormatText('underline')}>
                        <Underline className="h-4 w-4" />
                      </Button>
                      <Separator orientation="vertical" className="h-6 mx-1" />
                      <Button variant="ghost" size="sm" onClick={() => handleFormatText('justifyLeft')}>
                        <AlignLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleFormatText('justifyCenter')}>
                        <AlignCenter className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleFormatText('justifyRight')}>
                        <AlignRight className="h-4 w-4" />
                      </Button>
                      <Separator orientation="vertical" className="h-6 mx-1" />
                      <Button variant="ghost" size="sm" onClick={() => handleFormatText('insertUnorderedList')}>
                        <List className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleFormatText('insertOrderedList')}>
                        <ListOrdered className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        const url = prompt('Enter link URL:');
                        if (url) handleFormatText('createLink', url);
                      }}>
                        <Link className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        const url = prompt('Enter image URL:');
                        if (url) handleFormatText('insertImage', url);
                      }}>
                        <Image className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    ref={editorRef}
                    className="min-h-[500px] outline-none p-4"
                    contentEditable
                    suppressContentEditableWarning={true}
                    onBlur={saveCurrentDocument}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Document Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <History className="mr-2 h-4 w-4" /> Version History
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className={`flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                          activeDocument.id === doc.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handleDocumentSelect(doc)}
                      >
                        <FileText className="h-4 w-4 mr-3 text-blue-500" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{doc.title}</div>
                          <div className="text-xs text-gray-500">
                            Last edited {formatDate(doc.lastEdited)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
