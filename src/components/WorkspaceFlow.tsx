
import { Calendar, Video, FileText, Sheet, Grid, ListTodo } from "lucide-react";
import { WorkspaceCard } from "./WorkspaceCard";

export const WorkspaceFlow = () => {
  const workspaceTools = [
    {
      title: "Calendar",
      Icon: Calendar,
      color: "#4285f4",
      description: "Schedule and manage team meetings effortlessly",
    },
    {
      title: "Meet",
      Icon: Video,
      color: "#00ac47",
      description: "Connect with your team through seamless video calls",
    },
    {
      title: "Docs",
      Icon: FileText,
      color: "#2684fc",
      description: "Collaborate on documents in real-time",
    },
    {
      title: "Sheets",
      Icon: Sheet,
      color: "#0f9d58",
      description: "Analyze data and create reports together",
    },
    {
      title: "Jamboard",
      Icon: Grid,
      color: "#f4b400",
      description: "Brainstorm ideas on a digital whiteboard",
    },
    {
      title: "Tasks",
      Icon: ListTodo,
      color: "#db4437",
      description: "Track action items and assignments",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {workspaceTools.map((tool, index) => (
        <WorkspaceCard
          key={tool.title}
          {...tool}
          className="animate-fade-in"
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        />
      ))}
    </div>
  );
};
