
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText, Plus, History, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Docs = () => {
  const navigate = useNavigate();

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
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Document
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="border rounded-lg p-6 min-h-[600px]">
                  <h1 contentEditable className="text-3xl font-bold mb-4 outline-none">Untitled Document</h1>
                  <p contentEditable className="text-gray-600 outline-none">Start typing to create your document...</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold mb-4">Document Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <History className="mr-2 h-4 w-4" /> Version History
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold mb-4">Recent Documents</h3>
                <div className="space-y-3">
                  {[
                    "Project Proposal",
                    "Meeting Notes",
                    "Weekly Report",
                  ].map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <FileText className="h-4 w-4 mr-3 text-blue-500" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
