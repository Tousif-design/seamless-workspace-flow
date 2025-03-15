
import { WorkspaceFlow } from "@/components/WorkspaceFlow";
import { Button } from "@/components/ui/button";
import { Search, Bell, User } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      <div className="p-4 border-b bg-white flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border rounded-full text-sm w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto space-y-12 py-12 px-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-blue-50 backdrop-blur-sm mb-4">
            <span className="text-blue-600 text-sm font-medium">
              Seamless Integration
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Workspace Flow
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Experience the power of integrated collaboration tools that streamline
            your team's workflow, from scheduling meetings to managing tasks.
          </p>
        </div>
        
        <WorkspaceFlow />
        
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Get Started Today</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of teams who use our platform to boost productivity and streamline collaboration.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg">Try for Free</Button>
            <Button variant="outline" size="lg">Schedule a Demo</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
