
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Calendar, 
  Video, 
  FileText, 
  Sheet, 
  Grid, 
  ListTodo, 
  Menu,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const AppSidebar = ({ expanded = true, onToggle }: { expanded?: boolean, onToggle?: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: Video, label: "Meet", path: "/meet" },
    { icon: FileText, label: "Docs", path: "/docs" },
    { icon: Sheet, label: "Sheets", path: "/sheets" },
    { icon: Grid, label: "Jamboard", path: "/jamboard" },
    { icon: ListTodo, label: "Tasks", path: "/tasks" },
  ];

  return (
    <div 
      className={cn(
        "h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
        expanded ? "w-64" : "w-16"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {expanded && <h2 className="font-semibold text-lg">Workspace</h2>}
        <Button variant="ghost" size="icon" onClick={onToggle}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start mb-1",
                !expanded && "justify-center px-2"
              )}
              onClick={() => navigate(item.path)}
            >
              <item.icon className={cn("h-5 w-5", expanded && "mr-3")} />
              {expanded && <span>{item.label}</span>}
            </Button>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        {expanded && (
          <div className="text-xs text-gray-500">
            Workspace Flow v1.0
          </div>
        )}
      </div>
    </div>
  );
};
