
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  Plus, 
  Calendar, 
  CheckSquare, 
  ListTodo, 
  Search, 
  Filter, 
  Clock, 
  Flag, 
  X, 
  AlertCircle,
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { toast } from "sonner";

type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  starred?: boolean;
};

type FilterType = "all" | "completed" | "active" | "high" | "medium" | "low";

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Complete project proposal",
      description: "Finish the initial draft of the Q2 project proposal",
      dueDate: "2023-06-10",
      priority: "high",
      completed: false,
      starred: true,
    },
    {
      id: "2",
      title: "Review presentation slides",
      description: "Review and edit the client presentation slides",
      dueDate: "2023-06-08",
      priority: "medium",
      completed: false,
    },
    {
      id: "3",
      title: "Team weekly meeting",
      description: "Prepare agenda for the team weekly meeting",
      dueDate: "2023-06-07",
      priority: "medium",
      completed: true,
    },
    {
      id: "4",
      title: "Update documentation",
      description: "Update project documentation with recent changes",
      dueDate: "2023-06-15",
      priority: "low",
      completed: false,
    },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState(new Date().toISOString().split("T")[0]);
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const handleTaskToggle = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    const task = tasks.find((t) => t.id === id);
    if (task) {
      toast(task.completed ? "Task marked as incomplete" : "Task completed!", {
        description: task.title,
      });
    }
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      toast.error("Task title cannot be empty");
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDescription,
      dueDate: newTaskDueDate,
      priority: newTaskPriority,
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskDueDate(new Date().toISOString().split("T")[0]);
    setNewTaskPriority("medium");
    setIsCreatingTask(false);
    toast.success("Task added successfully");
  };

  const handleStarTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, starred: !task.starred } : task
      )
    );
    toast.success("Task updated");
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast.success("Task deleted");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredTasks = tasks.filter(task => {
    // First filter by search term
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Then filter by type
    if (!matchesSearch) return false;
    
    switch (activeFilter) {
      case "completed":
        return task.completed;
      case "active":
        return !task.completed;
      case "high":
        return task.priority === "high";
      case "medium":
        return task.priority === "medium";
      case "low":
        return task.priority === "low";
      default:
        return true;
    }
  });

  const getDueDateStatus = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "overdue";
    if (diffDays === 0) return "today";
    if (diffDays <= 2) return "soon";
    return "upcoming";
  };

  const dueDateStatusClasses = (status: string) => {
    switch (status) {
      case "overdue":
        return "text-red-600 font-medium";
      case "today":
        return "text-orange-600 font-medium";
      case "soon":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mr-4"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          </div>
          
          <Dialog open={isCreatingTask} onOpenChange={setIsCreatingTask}>
            <DialogTrigger asChild>
              <Button className="bg-workspace-tasks hover:bg-workspace-tasks/90 text-white">
                <Plus className="mr-2 h-4 w-4" /> New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">Title</label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Task title"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-workspace-tasks"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">Description</label>
                  <textarea
                    id="description"
                    placeholder="Task description"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-workspace-tasks"
                    rows={3}
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="dueDate" className="text-sm font-medium">Due Date</label>
                    <input
                      id="dueDate"
                      type="date"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-workspace-tasks"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                    <select
                      id="priority"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-workspace-tasks"
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as "low" | "medium" | "high")}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreatingTask(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTask} className="bg-workspace-tasks hover:bg-workspace-tasks/90">
                  Create Task
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2 flex flex-col md:flex-row md:items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-workspace-tasks"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Menubar className="border-none shadow-none p-0">
                    <MenubarMenu>
                      <MenubarTrigger className="px-3 py-1.5 bg-white rounded-lg border shadow-sm flex items-center gap-2 text-sm">
                        <Filter className="h-4 w-4" />
                        Filter
                      </MenubarTrigger>
                      <MenubarContent>
                        <MenubarItem onClick={() => setActiveFilter("all")} className={activeFilter === "all" ? "bg-slate-100" : ""}>
                          All Tasks
                        </MenubarItem>
                        <MenubarItem onClick={() => setActiveFilter("active")} className={activeFilter === "active" ? "bg-slate-100" : ""}>
                          Active
                        </MenubarItem>
                        <MenubarItem onClick={() => setActiveFilter("completed")} className={activeFilter === "completed" ? "bg-slate-100" : ""}>
                          Completed
                        </MenubarItem>
                        <MenubarItem onClick={() => setActiveFilter("high")} className={activeFilter === "high" ? "bg-slate-100" : ""}>
                          High Priority
                        </MenubarItem>
                        <MenubarItem onClick={() => setActiveFilter("medium")} className={activeFilter === "medium" ? "bg-slate-100" : ""}>
                          Medium Priority
                        </MenubarItem>
                        <MenubarItem onClick={() => setActiveFilter("low")} className={activeFilter === "low" ? "bg-slate-100" : ""}>
                          Low Priority
                        </MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>
                  </Menubar>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {filteredTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="bg-gray-100 p-4 rounded-full mb-4">
                        <ListTodo className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
                      <p className="text-gray-500 mb-6 max-w-sm">
                        {searchTerm ? "Try a different search term or clear your filters" : "Get started by creating your first task"}
                      </p>
                      {!searchTerm && (
                        <Button 
                          onClick={() => setIsCreatingTask(true)} 
                          className="bg-workspace-tasks hover:bg-workspace-tasks/90"
                        >
                          <Plus className="mr-2 h-4 w-4" /> Create Task
                        </Button>
                      )}
                    </div>
                  ) : (
                    filteredTasks.map((task) => {
                      const dueDateStatus = getDueDateStatus(task.dueDate);
                      return (
                        <div
                          key={task.id}
                          className={`flex items-start p-4 rounded-lg border shadow-sm transition-all ${
                            task.completed ? "bg-gray-50 opacity-75" : "bg-white hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="mt-0.5 rounded-full"
                              onClick={() => handleTaskToggle(task.id)}
                            >
                              <CheckSquare
                                className={`h-5 w-5 ${
                                  task.completed ? "text-green-500" : "text-gray-400"
                                }`}
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="mt-0.5 rounded-full"
                              onClick={() => handleStarTask(task.id)}
                            >
                              <Star
                                className={`h-5 w-5 ${
                                  task.starred ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                                }`}
                              />
                            </Button>
                          </div>
                          
                          <div className="flex-1 min-w-0 ml-2">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <h4
                                className={`font-medium ${
                                  task.completed ? "line-through text-gray-500" : "text-gray-900"
                                }`}
                              >
                                {task.title}
                              </h4>
                              <Badge 
                                variant="outline"
                                className={`${getPriorityColor(task.priority)} font-medium`}
                              >
                                {task.priority}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {task.description}
                            </p>
                            
                            <div className="flex items-center mt-3 gap-4">
                              <div className={`flex items-center text-xs ${dueDateStatusClasses(dueDateStatus)}`}>
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                {
                                  dueDateStatus === "overdue" ? (
                                    <span>Overdue: {task.dueDate}</span>
                                  ) : dueDateStatus === "today" ? (
                                    <span>Due today</span>
                                  ) : (
                                    <span>Due: {task.dueDate}</span>
                                  )
                                }
                              </div>
                            </div>
                          </div>
                          
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon" className="rounded-full">
                                <Filter className="h-4 w-4 text-gray-500" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48 p-0" align="end">
                              <div className="p-2">
                                <Button 
                                  variant="ghost" 
                                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 px-2"
                                  onClick={() => handleDeleteTask(task.id)}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Delete
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      )
                    })
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="border-t pt-4 text-sm text-gray-500">
                Showing {filteredTasks.length} of {tasks.length} tasks
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-workspace-tasks/90 to-workspace-tasks text-white">
                <CardTitle className="text-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Task Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Completed</span>
                    <span className="text-sm text-gray-500 font-medium">
                      {tasks.filter(t => t.completed).length}/{tasks.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full" 
                      style={{ width: `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">By Priority</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          High priority
                        </span>
                        <span className="text-sm text-gray-500">
                          {tasks.filter(t => t.priority === "high").length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-red-500 h-1.5 rounded-full" 
                          style={{ width: `${(tasks.filter(t => t.priority === "high").length / tasks.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm flex items-center">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                          Medium priority
                        </span>
                        <span className="text-sm text-gray-500">
                          {tasks.filter(t => t.priority === "medium").length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-yellow-500 h-1.5 rounded-full" 
                          style={{ width: `${(tasks.filter(t => t.priority === "medium").length / tasks.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Low priority
                        </span>
                        <span className="text-sm text-gray-500">
                          {tasks.filter(t => t.priority === "low").length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-green-500 h-1.5 rounded-full" 
                          style={{ width: `${(tasks.filter(t => t.priority === "low").length / tasks.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Quick Stats</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-gray-900">
                        {tasks.filter(t => !t.completed).length}
                      </div>
                      <div className="text-xs text-gray-500">Tasks remaining</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-gray-900">
                        {tasks.filter(t => t.completed).length}
                      </div>
                      <div className="text-xs text-gray-500">Tasks completed</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-gray-900">
                        {tasks.filter(t => getDueDateStatus(t.dueDate) === "overdue" && !t.completed).length}
                      </div>
                      <div className="text-xs text-gray-500">Overdue tasks</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-gray-900">
                        {tasks.filter(t => t.starred).length}
                      </div>
                      <div className="text-xs text-gray-500">Starred tasks</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
