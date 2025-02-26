
import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WorkspaceCardProps {
  title: string;
  Icon: LucideIcon;
  color: string;
  description: string;
  className?: string;
  delay?: number;
  route: string;
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  title,
  Icon,
  color,
  description,
  className,
  delay = 0,
  route,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(route);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group relative w-full overflow-hidden rounded-xl p-6 transition-all duration-300",
        "bg-white shadow-sm hover:shadow-lg",
        "border border-gray-100 hover:border-gray-200",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative z-10">
        <div
          className={cn(
            "inline-flex items-center justify-center p-2 rounded-lg mb-4",
            "bg-opacity-10 transition-colors duration-300"
          )}
          style={{ backgroundColor: `${color}20`, color }}
        >
          <Icon size={24} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${color}, transparent 70%)`,
        }}
      />
    </button>
  );
};
