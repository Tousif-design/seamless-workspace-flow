
import { WorkspaceFlow } from "@/components/WorkspaceFlow";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-6xl mx-auto space-y-12 py-12 px-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-blue-50 backdrop-blur-sm mb-4">
            <span className="text-blue-600 text-sm font-medium">
              Seamless Integration
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Google Workspace Flow
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
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
