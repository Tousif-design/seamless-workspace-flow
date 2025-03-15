
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, Table, BarChart2, Share2, Save, Download, Lock, Grid, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SpreadsheetData = {
  id: string;
  title: string;
  data: string[][];
  lastEdited: string;
};

const Sheets = () => {
  const navigate = useNavigate();
  const [selectedSpreadsheet, setSelectedSpreadsheet] = useState<SpreadsheetData>({
    id: "1",
    title: "Budget 2024",
    data: Array(20).fill(Array(12).fill("")),
    lastEdited: new Date().toISOString(),
  });
  
  const [spreadsheets, setSpreadsheets] = useState<SpreadsheetData[]>([
    {
      id: "1",
      title: "Budget 2024",
      data: Array(20).fill(Array(12).fill("")),
      lastEdited: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Sales Report",
      data: Array(15).fill(Array(10).fill("")),
      lastEdited: "2023-06-01T10:30:00",
    },
    {
      id: "3",
      title: "Team Schedule",
      data: Array(18).fill(Array(8).fill("")),
      lastEdited: "2023-05-25T14:15:00",
    },
  ]);
  
  const [tableData, setTableData] = useState<string[][]>(selectedSpreadsheet.data);
  const [activeCell, setActiveCell] = useState<{row: number, col: number} | null>(null);
  const [cellValue, setCellValue] = useState<string>("");
  const [newSpreadsheetTitle, setNewSpreadsheetTitle] = useState<string>("");
  const [showNewSheetDialog, setShowNewSheetDialog] = useState(false);
  
  // Column headers (A, B, C, etc.)
  const columns = Array.from({ length: 12 }, (_, i) => String.fromCharCode(65 + i));
  
  // Row headers (1, 2, 3, etc.)
  const rows = Array.from({ length: 20 }, (_, i) => i + 1);
  
  useEffect(() => {
    // Deep copy the array to ensure immutability
    setTableData(JSON.parse(JSON.stringify(selectedSpreadsheet.data)));
  }, [selectedSpreadsheet]);
  
  const handleCellChange = (row: number, col: number, value: string) => {
    const newData = [...tableData];
    
    // Ensure the row exists (deep copy)
    if (!newData[row]) {
      newData[row] = Array(columns.length).fill("");
    } else {
      newData[row] = [...newData[row]];
    }
    
    newData[row][col] = value;
    setTableData(newData);
    
    // Update the active cell value
    if (activeCell && activeCell.row === row && activeCell.col === col) {
      setCellValue(value);
    }
  };
  
  const handleCellClick = (row: number, col: number) => {
    setActiveCell({ row, col });
    setCellValue(tableData[row][col] || "");
  };
  
  const handleSaveSpreadsheet = () => {
    const updatedSpreadsheets = spreadsheets.map(sheet => {
      if (sheet.id === selectedSpreadsheet.id) {
        return {
          ...sheet,
          data: tableData,
          lastEdited: new Date().toISOString(),
        };
      }
      return sheet;
    });
    
    setSpreadsheets(updatedSpreadsheets);
    toast.success("Spreadsheet saved successfully");
  };
  
  const handleCreateNewSpreadsheet = () => {
    if (!newSpreadsheetTitle.trim()) {
      toast.error("Spreadsheet title cannot be empty");
      return;
    }
    
    const newSpreadsheet: SpreadsheetData = {
      id: Date.now().toString(),
      title: newSpreadsheetTitle,
      data: Array(20).fill(Array(12).fill("")),
      lastEdited: new Date().toISOString(),
    };
    
    setSpreadsheets([newSpreadsheet, ...spreadsheets]);
    setSelectedSpreadsheet(newSpreadsheet);
    setNewSpreadsheetTitle("");
    setShowNewSheetDialog(false);
    toast.success("New spreadsheet created");
  };
  
  const handleFormatCells = () => {
    toast.success("Cell formatting options displayed");
  };
  
  const handleInsertChart = () => {
    toast.success("Chart creation dialog opened");
  };
  
  const handleExportSpreadsheet = () => {
    toast.success("Spreadsheet export options displayed");
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
            <h1 className="text-3xl font-bold text-gray-900">Google Sheets</h1>
            <Dialog open={showNewSheetDialog} onOpenChange={setShowNewSheetDialog}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2 h-4 w-4" /> New Spreadsheet
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Spreadsheet</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newSpreadsheetTitle}
                      onChange={(e) => setNewSpreadsheetTitle(e.target.value)}
                      placeholder="Spreadsheet title"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowNewSheetDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateNewSpreadsheet} className="bg-green-600 hover:bg-green-700">
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader className="border-b p-3">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold">{selectedSpreadsheet.title}</h2>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={handleSaveSpreadsheet}>
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleExportSpreadsheet}>
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Button variant="ghost" size="sm" onClick={handleFormatCells}>
                        <Table className="h-4 w-4 mr-1" />
                        Format
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleInsertChart}>
                        <BarChart2 className="h-4 w-4 mr-1" />
                        Insert Chart
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Grid className="h-4 w-4 mr-1" />
                        Grid Options
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Lock className="h-4 w-4 mr-1" />
                        Protect
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse table-fixed">
                      <thead>
                        <tr>
                          <th className="border bg-gray-50 p-2 w-12"></th>
                          {columns.map((col, i) => (
                            <th key={i} className="border p-2 bg-gray-50 w-24 text-sm font-medium">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            <td className="border bg-gray-50 p-2 text-sm font-medium text-center">
                              {row}
                            </td>
                            {columns.map((_, colIndex) => (
                              <td 
                                key={colIndex} 
                                className={`border p-0 min-w-[100px] relative ${
                                  activeCell?.row === rowIndex && activeCell?.col === colIndex
                                    ? 'bg-blue-50'
                                    : ''
                                }`}
                                onClick={() => handleCellClick(rowIndex, colIndex)}
                              >
                                <input
                                  type="text"
                                  className="w-full h-full p-2 outline-none bg-transparent"
                                  value={tableData[rowIndex]?.[colIndex] || ""}
                                  onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sheet Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={handleFormatCells}>
                    <Table className="mr-2 h-4 w-4" /> Format
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={handleInsertChart}>
                    <BarChart2 className="mr-2 h-4 w-4" /> Insert Chart
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Sheets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {spreadsheets.map((sheet) => (
                      <div
                        key={sheet.id}
                        className={`flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                          selectedSpreadsheet.id === sheet.id ? 'bg-green-50' : ''
                        }`}
                        onClick={() => setSelectedSpreadsheet(sheet)}
                      >
                        <Table className="h-4 w-4 mr-3 text-green-500" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{sheet.title}</div>
                          <div className="text-xs text-gray-500">
                            Last edited {formatDate(sheet.lastEdited)}
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

export default Sheets;
