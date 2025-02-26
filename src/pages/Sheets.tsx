
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, Table, BarChart2, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sheets = () => {
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
            <h1 className="text-3xl font-bold text-gray-900">Google Sheets</h1>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" /> New Spreadsheet
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr>
                        {Array.from({ length: 8 }).map((_, i) => (
                          <th key={i} className="border p-2 bg-gray-50">{String.fromCharCode(65 + i)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 10 }).map((_, row) => (
                        <tr key={row}>
                          {Array.from({ length: 8 }).map((_, col) => (
                            <td key={col} className="border p-2 min-w-[100px]">
                              <input type="text" className="w-full outline-none" />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold mb-4">Sheet Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Table className="mr-2 h-4 w-4" /> Format
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart2 className="mr-2 h-4 w-4" /> Insert Chart
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold mb-4">Recent Sheets</h3>
                <div className="space-y-3">
                  {[
                    "Budget 2024",
                    "Sales Report",
                    "Team Schedule",
                  ].map((sheet, i) => (
                    <div
                      key={i}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <Table className="h-4 w-4 mr-3 text-green-500" />
                      <span>{sheet}</span>
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

export default Sheets;
