
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, Grid, Pencil, Image, Eraser } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Jamboard = () => {
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
            <h1 className="text-3xl font-bold text-gray-900">Jamboard</h1>
            <Button className="bg-yellow-500 hover:bg-yellow-600">
              <Plus className="mr-2 h-4 w-4" /> New Board
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="space-y-2">
                  {[
                    { icon: <Pencil className="h-5 w-5" />, label: "Draw" },
                    { icon: <Eraser className="h-5 w-5" />, label: "Erase" },
                    { icon: <Image className="h-5 w-5" />, label: "Image" },
                  ].map((tool, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      {tool.icon}
                      <span className="ml-2">{tool.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="aspect-[4/3] bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <Grid className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Click and drag to start drawing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              "Brainstorming Session",
              "Project Timeline",
              "Team Workshop",
            ].map((board, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="aspect-video bg-gray-50 rounded-lg mb-3" />
                <h3 className="font-medium">{board}</h3>
                <p className="text-sm text-gray-500">Last edited 2 days ago</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jamboard;
