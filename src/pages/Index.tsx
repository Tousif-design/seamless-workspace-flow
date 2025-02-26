
import { WorkspaceFlow } from "@/components/WorkspaceFlow";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-6xl mx-auto space-y-12 py-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm mb-4">
            <span className="text-white/70 text-sm font-medium">
              Seamless Integration
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Google Workspace Flow
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Experience the power of integrated collaboration tools that streamline
            your team's workflow, from scheduling meetings to managing tasks.
          </p>
        </div>
        
        <WorkspaceFlow />
      </div>
    </div>
  );
};

export default Index;
