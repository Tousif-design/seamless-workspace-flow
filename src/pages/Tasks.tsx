
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, Calendar, CheckSquare, ListTodo, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
};

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
      description: "",
      dueDate: new Date().toISOString().split("T")[0],
      priority: "medium",
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
    toast.success("Task added successfully");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
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
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <Button className="bg-red-500 hover:bg-red-600">
              <Plus className="mr-2 h-4 w-4" /> New Task
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-4">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Add a new task..."
                        className="w-full px-4 py-2 border rounded-lg pr-10"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddTask();
                        }}
                      />
                      <Button
                        size="icon"
                        className="absolute right-1.5 top-1.5"
                        onClick={handleAddTask}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-start p-3 rounded-lg border transition-colors ${
                          task.completed ? "bg-gray-50 opacity-60" : "bg-white"
                        }`}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="mt-0.5 mr-3"
                          onClick={() => handleTaskToggle(task.id)}
                        >
                          <CheckSquare
                            className={`h-5 w-5 ${
                              task.completed ? "text-green-500" : "text-gray-400"
                            }`}
                          />
                        </Button>
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`font-medium ${
                              task.completed ? "line-through text-gray-500" : ""
                            }`}
                          >
                            {task.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {task.description}
                          </p>
                          <div className="flex items-center mt-2 space-x-2">
                            <Badge variant="outline" className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{task.dueDate}</span>
                            </Badge>
                            <Badge 
                              variant="secondary"
                              className={`${getPriorityColor(task.priority)}`}
                            >
                              {task.priority}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Task Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Completed</span>
                      <span className="text-sm text-gray-500">
                        {tasks.filter(t => t.completed).length}/{tasks.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">High priority</span>
                      <span className="text-sm text-gray-500">
                        {tasks.filter(t => t.priority === "high").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Medium priority</span>
                      <span className="text-sm text-gray-500">
                        {tasks.filter(t => t.priority === "medium").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Low priority</span>
                      <span className="text-sm text-gray-500">
                        {tasks.filter(t => t.priority === "low").length}
                      </span>
                    </div>
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

export default Tasks;
