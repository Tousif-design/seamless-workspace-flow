
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, CheckSquare, Calendar, Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Tasks = () => {
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
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <Button className="bg-red-500 hover:bg-red-600">
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="space-y-4">
                  {[
                    {
                      title: "Update project documentation",
                      due: "Today",
                      priority: "High",
                      completed: false,
                    },
                    {
                      title: "Review team submissions",
                      due: "Tomorrow",
                      priority: "Medium",
                      completed: true,
                    },
                    {
                      title: "Prepare presentation slides",
                      due: "Next week",
                      priority: "Low",
                      completed: false,
                    },
                  ].map((task, i) => (
                    <div
                      key={i}
                      className={`flex items-center p-4 rounded-lg border ${
                        task.completed ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        className="h-5 w-5 rounded border-gray-300"
                        readOnly
                      />
                      <div className="ml-4 flex-1">
                        <p className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center mt-1 space-x-4">
                          <span className="text-sm text-gray-500 flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {task.due}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Flag className="h-4 w-4 mr-1" />
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold mb-4">Task Lists</h3>
                <div className="space-y-2">
                  {[
                    { name: "My Tasks", count: 5 },
                    { name: "Team Tasks", count: 3 },
                    { name: "Completed", count: 12 },
                  ].map((list, i) => (
                    <Button
                      key={i}
                      variant="ghost"
                      className="w-full justify-between"
                    >
                      <span className="flex items-center">
                        <CheckSquare className="mr-2 h-4 w-4" />
                        {list.name}
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded-full text-sm">
                        {list.count}
                      </span>
                    </Button>
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

export default Tasks;
