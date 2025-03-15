
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  Plus, 
  Pencil, 
  Image, 
  Eraser, 
  Square, 
  Circle, 
  Type, 
  Undo, 
  Redo, 
  Download, 
  Save, 
  Share2, 
  Trash,
  X,
  Check,
  MousePointer,
  Palette
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Board = {
  id: string;
  title: string;
  thumbnail: string;
  lastEdited: string;
  content?: ImageData;
};

type DrawingSettings = {
  tool: "select" | "pencil" | "eraser" | "square" | "circle" | "text" | "image";
  color: string;
  size: number;
};

type DrawingAction = {
  type: "path" | "square" | "circle" | "text" | "clear";
  points?: { x: number; y: number }[];
  color?: string;
  size?: number;
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  text?: string;
};

const Jamboard = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [showNewBoardDialog, setShowNewBoardDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [actionsHistory, setActionsHistory] = useState<DrawingAction[]>([]);
  const [redoStack, setRedoStack] = useState<DrawingAction[]>([]);
  const [currentPath, setCurrentPath] = useState<{x: number; y: number}[]>([]);

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
    size: 3,
  });
  
  const colorPalette = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", 
    "#FFFF00", "#FF00FF", "#00FFFF", "#FF9900", "#9900FF", 
    "#009900", "#990000", "#4285f4", "#34a853", "#fbbc05", "#ea4335"
  ];

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
    if (!context) return;
    
    const { offsetX, offsetY } = e.nativeEvent;
    setStartPoint({ x: offsetX, y: offsetY });
    
    if (drawingSettings.tool === "pencil" || drawingSettings.tool === "eraser") {
      context.beginPath();
      context.moveTo(offsetX, offsetY);
      setIsDrawing(true);
      setCurrentPath([{ x: offsetX, y: offsetY }]);
    } else if (drawingSettings.tool === "square" || drawingSettings.tool === "circle" || drawingSettings.tool === "text") {
      setIsDrawing(true);
    }
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !startPoint) return;
    
    const { offsetX, offsetY } = e.nativeEvent;
    
    if (drawingSettings.tool === "pencil") {
      context.lineTo(offsetX, offsetY);
      context.stroke();
      setCurrentPath([...currentPath, { x: offsetX, y: offsetY }]);
    } else if (drawingSettings.tool === "eraser") {
      const currentColor = context.strokeStyle;
      context.strokeStyle = "#FFFFFF";
      context.lineTo(offsetX, offsetY);
      context.stroke();
      context.strokeStyle = currentColor;
      setCurrentPath([...currentPath, { x: offsetX, y: offsetY }]);
    } else if (drawingSettings.tool === "square") {
      // Preview square (redraw canvas and add temporary rectangle)
      drawCanvas();
      context.strokeRect(
        startPoint.x, 
        startPoint.y, 
        offsetX - startPoint.x, 
        offsetY - startPoint.y
      );
    } else if (drawingSettings.tool === "circle") {
      // Preview circle (redraw canvas and add temporary circle)
      drawCanvas();
      const radius = Math.sqrt(
        Math.pow(offsetX - startPoint.x, 2) + Math.pow(offsetY - startPoint.y, 2)
      );
      context.beginPath();
      context.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
      context.stroke();
    }
  };
  
  const endDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !startPoint) return;
    
    const { offsetX, offsetY } = e.nativeEvent;
    
    let newAction: DrawingAction | null = null;
    
    if (drawingSettings.tool === "pencil" || drawingSettings.tool === "eraser") {
      context.closePath();
      newAction = {
        type: "path",
        points: [...currentPath, { x: offsetX, y: offsetY }],
        color: drawingSettings.tool === "eraser" ? "#FFFFFF" : drawingSettings.color,
        size: drawingSettings.size,
      };
    } else if (drawingSettings.tool === "square") {
      context.strokeRect(
        startPoint.x, 
        startPoint.y, 
        offsetX - startPoint.x, 
        offsetY - startPoint.y
      );
      newAction = {
        type: "square",
        startX: startPoint.x,
        startY: startPoint.y,
        endX: offsetX,
        endY: offsetY,
        color: drawingSettings.color,
        size: drawingSettings.size,
      };
    } else if (drawingSettings.tool === "circle") {
      const radius = Math.sqrt(
        Math.pow(offsetX - startPoint.x, 2) + Math.pow(offsetY - startPoint.y, 2)
      );
      context.beginPath();
      context.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
      context.stroke();
      newAction = {
        type: "circle",
        startX: startPoint.x,
        startY: startPoint.y,
        endX: offsetX,
        endY: offsetY,
        color: drawingSettings.color,
        size: drawingSettings.size,
      };
    }
    
    if (newAction) {
      setActionsHistory([...actionsHistory, newAction]);
      setRedoStack([]);
    }
    
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPath([]);
  };
  
  const drawCanvas = () => {
    if (!context || !canvasRef.current) return;
    
    // Clear canvas
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Redraw all actions
    actionsHistory.forEach(action => {
      if (action.type === "path" && action.points && action.points.length > 0) {
        context.beginPath();
        context.strokeStyle = action.color || drawingSettings.color;
        context.lineWidth = action.size || drawingSettings.size;
        context.moveTo(action.points[0].x, action.points[0].y);
        
        action.points.forEach((point, i) => {
          if (i > 0) {
            context.lineTo(point.x, point.y);
          }
        });
        
        context.stroke();
        context.closePath();
      } else if (action.type === "square" && action.startX !== undefined && action.startY !== undefined && action.endX !== undefined && action.endY !== undefined) {
        context.strokeStyle = action.color || drawingSettings.color;
        context.lineWidth = action.size || drawingSettings.size;
        context.strokeRect(
          action.startX,
          action.startY,
          action.endX - action.startX,
          action.endY - action.startY
        );
      } else if (action.type === "circle" && action.startX !== undefined && action.startY !== undefined && action.endX !== undefined && action.endY !== undefined) {
        const radius = Math.sqrt(
          Math.pow(action.endX - action.startX, 2) + Math.pow(action.endY - action.startY, 2)
        );
        context.beginPath();
        context.strokeStyle = action.color || drawingSettings.color;
        context.lineWidth = action.size || drawingSettings.size;
        context.arc(action.startX, action.startY, radius, 0, 2 * Math.PI);
        context.stroke();
      } else if (action.type === "clear") {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    });
    
    // Reset context settings
    context.strokeStyle = drawingSettings.color;
    context.lineWidth = drawingSettings.size;
  };
  
  const clearCanvas = () => {
    if (context && canvasRef.current) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      const clearAction: DrawingAction = {
        type: "clear",
      };
      
      setActionsHistory([...actionsHistory, clearAction]);
      setRedoStack([]);
      
      toast.success("Canvas cleared");
    }
  };
  
  const handleUndo = () => {
    if (actionsHistory.length === 0) return;
    
    const lastAction = actionsHistory[actionsHistory.length - 1];
    const newHistory = actionsHistory.slice(0, -1);
    
    setActionsHistory(newHistory);
    setRedoStack([...redoStack, lastAction]);
    
    // Redraw canvas
    setTimeout(() => drawCanvas(), 0);
    
    toast.info("Undo successful");
  };
  
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    
    const actionToRedo = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);
    
    setActionsHistory([...actionsHistory, actionToRedo]);
    setRedoStack(newRedoStack);
    
    // Redraw canvas
    setTimeout(() => drawCanvas(), 0);
    
    toast.info("Redo successful");
  };
  
  const handleToolSelect = (tool: DrawingSettings["tool"]) => {
    setDrawingSettings({
      ...drawingSettings,
      tool,
    });
    toast.success(`Selected tool: ${tool}`);
  };
  
  const handleColorSelect = (color: string) => {
    setDrawingSettings({
      ...drawingSettings,
      color,
    });
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
      setActionsHistory([]);
      setRedoStack([]);
    }
    
    toast.success("New board created");
  };
  
  const handleDownloadBoard = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `${activeBoard.title.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
      toast.success("Board downloaded successfully");
    }
  };
  
  const handleShareBoard = () => {
    setShowShareDialog(true);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-[1400px] mx-auto p-4 lg:p-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Jamboard</h1>
          <Dialog open={showNewBoardDialog} onOpenChange={setShowNewBoardDialog}>
            <DialogTrigger asChild>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 lg:order-1 order-2">
            <Card className="shadow-md bg-white overflow-hidden">
              <CardHeader className="p-4 border-b bg-gray-50">
                <CardTitle className="text-lg font-medium">Drawing Tools</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tools</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      size="sm"
                      variant={drawingSettings.tool === "select" ? "default" : "outline"}
                      className={cn(
                        "w-full h-10 p-1 flex flex-col items-center justify-center space-y-1",
                        drawingSettings.tool === "select" ? "bg-yellow-500 hover:bg-yellow-600 text-white" : ""
                      )}
                      onClick={() => handleToolSelect("select")}
                    >
                      <MousePointer className="h-4 w-4" />
                      <span className="text-xs">Select</span>
                    </Button>
                    <Button
                      size="sm"
                      variant={drawingSettings.tool === "pencil" ? "default" : "outline"}
                      className={cn(
                        "w-full h-10 p-1 flex flex-col items-center justify-center space-y-1",
                        drawingSettings.tool === "pencil" ? "bg-yellow-500 hover:bg-yellow-600 text-white" : ""
                      )}
                      onClick={() => handleToolSelect("pencil")}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="text-xs">Pencil</span>
                    </Button>
                    <Button
                      size="sm"
                      variant={drawingSettings.tool === "eraser" ? "default" : "outline"}
                      className={cn(
                        "w-full h-10 p-1 flex flex-col items-center justify-center space-y-1",
                        drawingSettings.tool === "eraser" ? "bg-yellow-500 hover:bg-yellow-600 text-white" : ""
                      )}
                      onClick={() => handleToolSelect("eraser")}
                    >
                      <Eraser className="h-4 w-4" />
                      <span className="text-xs">Eraser</span>
                    </Button>
                    <Button
                      size="sm"
                      variant={drawingSettings.tool === "square" ? "default" : "outline"}
                      className={cn(
                        "w-full h-10 p-1 flex flex-col items-center justify-center space-y-1",
                        drawingSettings.tool === "square" ? "bg-yellow-500 hover:bg-yellow-600 text-white" : ""
                      )}
                      onClick={() => handleToolSelect("square")}
                    >
                      <Square className="h-4 w-4" />
                      <span className="text-xs">Square</span>
                    </Button>
                    <Button
                      size="sm"
                      variant={drawingSettings.tool === "circle" ? "default" : "outline"}
                      className={cn(
                        "w-full h-10 p-1 flex flex-col items-center justify-center space-y-1",
                        drawingSettings.tool === "circle" ? "bg-yellow-500 hover:bg-yellow-600 text-white" : ""
                      )}
                      onClick={() => handleToolSelect("circle")}
                    >
                      <Circle className="h-4 w-4" />
                      <span className="text-xs">Circle</span>
                    </Button>
                    <Button
                      size="sm"
                      variant={drawingSettings.tool === "text" ? "default" : "outline"}
                      className={cn(
                        "w-full h-10 p-1 flex flex-col items-center justify-center space-y-1",
                        drawingSettings.tool === "text" ? "bg-yellow-500 hover:bg-yellow-600 text-white" : ""
                      )}
                      onClick={() => handleToolSelect("text")}
                    >
                      <Type className="h-4 w-4" />
                      <span className="text-xs">Text</span>
                    </Button>
                    <Button
                      size="sm"
                      variant={drawingSettings.tool === "image" ? "default" : "outline"}
                      className={cn(
                        "w-full h-10 p-1 flex flex-col items-center justify-center space-y-1",
                        drawingSettings.tool === "image" ? "bg-yellow-500 hover:bg-yellow-600 text-white" : ""
                      )}
                      onClick={() => handleToolSelect("image")}
                    >
                      <Image className="h-4 w-4" />
                      <span className="text-xs">Image</span>
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Brush Size: {drawingSettings.size}px</Label>
                  </div>
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
                    className="py-1"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Color</Label>
                    <div 
                      className="w-6 h-6 rounded-full border border-gray-300 shadow-sm" 
                      style={{ backgroundColor: drawingSettings.color }}
                    />
                  </div>
                  <div className="grid grid-cols-8 gap-1">
                    {colorPalette.map((color) => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded-full border ${
                          drawingSettings.color === color ? 'ring-2 ring-yellow-500 ring-offset-1' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorSelect(color)}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">History</Label>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={handleUndo}
                      disabled={actionsHistory.length === 0}
                    >
                      <Undo className="h-4 w-4 mr-1" />
                      Undo
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={handleRedo}
                      disabled={redoStack.length === 0}
                    >
                      <Redo className="h-4 w-4 mr-1" />
                      Redo
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Actions</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={clearCanvas}>
                      <Trash className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                    <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600" onClick={handleSaveBoard}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownloadBoard}>
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShareBoard}>
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-9 lg:order-2 order-1">
            <Card className="shadow-md bg-white overflow-hidden">
              <CardHeader className="border-b p-3 bg-gray-50 flex-row justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Palette className="h-5 w-5 text-yellow-500" />
                  <h2 className="text-lg font-semibold tracking-tight">{activeBoard.title}</h2>
                </div>
                <div className="text-xs text-gray-500">
                  Last edited: {formatDate(activeBoard.lastEdited)}
                </div>
              </CardHeader>
              <CardContent className="p-0 relative">
                <div className="relative bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden" style={{ height: "calc(100vh - 230px)", minHeight: "500px" }}>
                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={endDrawing}
                    onMouseLeave={endDrawing}
                    className="w-full h-full cursor-crosshair"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold tracking-tight mb-4">Recent Boards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {boards.map((board) => (
              <Card
                key={board.id}
                className={`hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1 ${
                  activeBoard.id === board.id ? 'ring-2 ring-yellow-500' : ''
                }`}
                onClick={() => {
                  setActiveBoard(board);
                  // Reset canvas when switching boards
                  if (context && canvasRef.current) {
                    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    setActionsHistory([]);
                    setRedoStack([]);
                  }
                }}
              >
                <CardContent className="p-0 overflow-hidden">
                  <div className="aspect-video bg-white border-b overflow-hidden">
                    <img 
                      src={board.thumbnail} 
                      alt={board.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 truncate">{board.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">Edited {formatDate(board.lastEdited)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share Board</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="shareLink">Share Link</Label>
              <div className="flex items-center">
                <Input
                  id="shareLink"
                  value={`https://workspace.example.com/jamboard/${activeBoard.id}`}
                  readOnly
                  className="flex-1 mr-2"
                />
                <Button 
                  size="sm" 
                  className="bg-yellow-500 hover:bg-yellow-600"
                  onClick={() => {
                    navigator.clipboard.writeText(`https://workspace.example.com/jamboard/${activeBoard.id}`);
                    toast.success("Link copied to clipboard!");
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Share with</Label>
              <Input placeholder="Enter email addresses" />
              <div className="flex items-center mt-2">
                <div className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-1 rounded border border-gray-300 flex items-center">
                  john.doe@example.com
                  <button className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <div className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded border border-gray-300 flex items-center">
                  jane.smith@example.com
                  <button className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Permission</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option>Can view</option>
                <option>Can edit</option>
                <option>Can comment</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-yellow-500 hover:bg-yellow-600" onClick={() => {
              toast.success("Board shared successfully!");
              setShowShareDialog(false);
            }}>
              Share
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Jamboard;
