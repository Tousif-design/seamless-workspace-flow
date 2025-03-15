
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, Grid, Pencil, Image, Eraser, Square, Circle, Type, Undo, Redo, Download, Save, Share2, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Board = {
  id: string;
  title: string;
  thumbnail: string;
  lastEdited: string;
};

type DrawingSettings = {
  tool: "pencil" | "eraser" | "square" | "circle" | "text" | "image";
  color: string;
  size: number;
};

const Jamboard = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [showNewBoardDialog, setShowNewBoardDialog] = useState(false);
  
  const [boards, setBoards] = useState<Board[]>([
    {
      id: "1",
      title: "Brainstorming Session",
      thumbnail: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
      lastEdited: "2023-06-06T15:30:00",
    },
    {
      id: "2",
      title: "Project Timeline",
      thumbnail: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
      lastEdited: "2023-06-04T11:15:00",
    },
    {
      id: "3",
      title: "Team Workshop",
      thumbnail: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
      lastEdited: "2023-05-30T09:45:00",
    },
  ]);
  
  const [activeBoard, setActiveBoard] = useState<Board>(boards[0]);
  
  const [drawingSettings, setDrawingSettings] = useState<DrawingSettings>({
    tool: "pencil",
    color: "#000000",
    size: 5,
  });
  
  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = drawingSettings.color;
        ctx.lineWidth = drawingSettings.size;
        setContext(ctx);
      }
    }
    
    // Handle window resize
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        
        // Save current drawing
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        if (tempCtx && context) {
          tempCtx.drawImage(canvas, 0, 0);
        }
        
        // Resize canvas
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Restore drawing
        if (context && tempCtx) {
          context.drawImage(tempCanvas, 0, 0);
          context.lineCap = "round";
          context.lineJoin = "round";
          context.strokeStyle = drawingSettings.color;
          context.lineWidth = drawingSettings.size;
        }
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawingSettings.color, drawingSettings.size]);
  
  useEffect(() => {
    if (context) {
      context.strokeStyle = drawingSettings.color;
      context.lineWidth = drawingSettings.size;
    }
  }, [context, drawingSettings]);
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (context) {
      const { offsetX, offsetY } = e.nativeEvent;
      context.beginPath();
      context.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;
    
    const { offsetX, offsetY } = e.nativeEvent;
    
    if (drawingSettings.tool === "pencil") {
      context.lineTo(offsetX, offsetY);
      context.stroke();
    } else if (drawingSettings.tool === "eraser") {
      // Save current color and set white for eraser
      const currentColor = context.strokeStyle;
      context.strokeStyle = "#FFFFFF";
      context.lineTo(offsetX, offsetY);
      context.stroke();
      // Restore color
      context.strokeStyle = currentColor;
    }
  };
  
  const endDrawing = () => {
    if (context) {
      context.closePath();
      setIsDrawing(false);
    }
  };
  
  const clearCanvas = () => {
    if (context && canvasRef.current) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      toast.success("Canvas cleared");
    }
  };
  
  const handleToolSelect = (tool: DrawingSettings["tool"]) => {
    setDrawingSettings({
      ...drawingSettings,
      tool,
    });
    toast.success(`Selected tool: ${tool}`);
  };
  
  const handleSaveBoard = () => {
    if (canvasRef.current) {
      // Save canvas as thumbnail
      const thumbnail = canvasRef.current.toDataURL();
      
      // Update the board with the new thumbnail
      const updatedBoards = boards.map(board => {
        if (board.id === activeBoard.id) {
          return {
            ...board,
            thumbnail,
            lastEdited: new Date().toISOString(),
          };
        }
        return board;
      });
      
      setBoards(updatedBoards);
      toast.success("Board saved successfully");
    }
  };
  
  const handleCreateNewBoard = () => {
    if (!newBoardTitle.trim()) {
      toast.error("Board title cannot be empty");
      return;
    }
    
    const newBoard: Board = {
      id: Date.now().toString(),
      title: newBoardTitle,
      thumbnail: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
      lastEdited: new Date().toISOString(),
    };
    
    setBoards([newBoard, ...boards]);
    setActiveBoard(newBoard);
    setNewBoardTitle("");
    setShowNewBoardDialog(false);
    
    // Clear canvas for new board
    if (context && canvasRef.current) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    
    toast.success("New board created");
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else {
      return `${diffDays} days ago`;
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
            <h1 className="text-3xl font-bold text-gray-900">Jamboard</h1>
            <Dialog open={showNewBoardDialog} onOpenChange={setShowNewBoardDialog}>
              <DialogTrigger asChild>
                <Button className="bg-yellow-500 hover:bg-yellow-600">
                  <Plus className="mr-2 h-4 w-4" /> New Board
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Board</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newBoardTitle}
                      onChange={(e) => setNewBoardTitle(e.target.value)}
                      placeholder="Board title"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowNewBoardDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateNewBoard} className="bg-yellow-500 hover:bg-yellow-600">
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Drawing Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={drawingSettings.tool === "pencil" ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleToolSelect("pencil")}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      <span>Draw</span>
                    </Button>
                    <Button
                      variant={drawingSettings.tool === "eraser" ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleToolSelect("eraser")}
                    >
                      <Eraser className="h-4 w-4 mr-2" />
                      <span>Erase</span>
                    </Button>
                    <Button
                      variant={drawingSettings.tool === "square" ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleToolSelect("square")}
                    >
                      <Square className="h-4 w-4 mr-2" />
                      <span>Square</span>
                    </Button>
                    <Button
                      variant={drawingSettings.tool === "circle" ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleToolSelect("circle")}
                    >
                      <Circle className="h-4 w-4 mr-2" />
                      <span>Circle</span>
                    </Button>
                    <Button
                      variant={drawingSettings.tool === "text" ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleToolSelect("text")}
                    >
                      <Type className="h-4 w-4 mr-2" />
                      <span>Text</span>
                    </Button>
                    <Button
                      variant={drawingSettings.tool === "image" ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleToolSelect("image")}
                    >
                      <Image className="h-4 w-4 mr-2" />
                      <span>Image</span>
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Brush Size</Label>
                    <Slider
                      value={[drawingSettings.size]}
                      min={1}
                      max={20}
                      step={1}
                      onValueChange={(value) => 
                        setDrawingSettings({
                          ...drawingSettings,
                          size: value[0],
                        })
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Color</Label>
                    <div className="grid grid-cols-6 gap-2">
                      {[
                        "#000000", "#FF0000", "#00FF00", "#0000FF", 
                        "#FFFF00", "#FF00FF", "#00FFFF", "#FF9900",
                        "#9900FF", "#009900", "#990000", "#FFFFFF",
                      ].map((color) => (
                        <button
                          key={color}
                          className={`w-6 h-6 rounded-full border-2 ${
                            drawingSettings.color === color ? 'border-gray-400' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => 
                            setDrawingSettings({
                              ...drawingSettings,
                              color,
                            })
                          }
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label className="text-sm">Actions</Label>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Undo className="h-4 w-4 mr-1" />
                        Undo
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Redo className="h-4 w-4 mr-1" />
                        Redo
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" onClick={clearCanvas} className="flex justify-center">
                      <Trash className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                    <Button size="sm" onClick={handleSaveBoard} className="flex justify-center">
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-4">
              <Card className="min-h-[600px]">
                <CardHeader className="border-b p-3">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">{activeBoard.title}</h2>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 relative min-h-[500px]">
                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={endDrawing}
                    onMouseLeave={endDrawing}
                    className="w-full h-full bg-white cursor-crosshair"
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Boards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {boards.map((board) => (
                <Card
                  key={board.id}
                  className={`hover:shadow-md transition-shadow cursor-pointer ${
                    activeBoard.id === board.id ? 'ring-2 ring-yellow-500' : ''
                  }`}
                  onClick={() => setActiveBoard(board)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gray-50 rounded-lg mb-3 overflow-hidden">
                      <div className="w-full h-full bg-white" />
                    </div>
                    <h3 className="font-medium">{board.title}</h3>
                    <p className="text-sm text-gray-500">Last edited {formatDate(board.lastEdited)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jamboard;
