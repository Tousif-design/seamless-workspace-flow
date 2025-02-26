
import { Calendar, Video, FileText, Sheet, Grid, ListTodo } from "lucide-react";
import { WorkspaceCard } from "./WorkspaceCard";

export const WorkspaceFlow = () => {
  const workspaceTools = [
    {
      title: "Calendar",
      Icon: Calendar,
      color: "#4285f4",
      description: "Schedule and manage team meetings effortlessly with smart scheduling and team availability.",
    },
    {
      title: "Meet",
      Icon: Video,
      color: "#00ac47",
      description: "Connect with your team through HD video calls with screen sharing and real-time collaboration.",
    },
    {
      title: "Docs",
      Icon: FileText,
      color: "#2684fc",
      description: "Create and edit documents in real-time with powerful formatting and sharing capabilities.",
    },
    {
      title: "Sheets",
      Icon: Sheet,
      color: "#0f9d58",
      description: "Analyze data, create visualizations, and collaborate on spreadsheets with advanced features.",
    },
    {
      title: "Jamboard",
      Icon: Grid,
      color: "#f4b400",
      description: "Brainstorm ideas on a digital whiteboard with real-time collaboration and smart drawing tools.",
    },
    {
      title: "Tasks",
      Icon: ListTodo,
      color: "#db4437",
      description: "Track projects and assignments with smart task management and team coordination.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workspaceTools.map((tool, index) => (
        <WorkspaceCard
          key={tool.title}
          {...tool}
          delay={index * 100}
          className="hover:-translate-y-1 transition-transform duration-300"
        />
      ))}
    </div>
  );
};
