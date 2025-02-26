
import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface WorkspaceCardProps {
  title: string;
  Icon: LucideIcon;
  color: string;
  description: string;
  className?: string;
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  title,
  Icon,
  color,
  description,
  className,
}) => {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl p-6 transition-all duration-300",
        "bg-white/10 backdrop-blur-lg hover:bg-white/20",
        "border border-white/10",
        "animate-fade-in",
        className
      )}
    >
      <div className="relative z-10">
        <div
          className={cn(
            "inline-flex items-center justify-center p-2 rounded-lg mb-4",
            "bg-white/10 backdrop-blur-sm"
          )}
          style={{ color }}
        >
          <Icon size={24} />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-white/70 text-sm">{description}</p>
      </div>
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${color}, transparent 70%)`,
        }}
      />
    </div>
  );
};
