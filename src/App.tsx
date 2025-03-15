
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { AppSidebar } from "./components/AppSidebar";
import Index from "./pages/Index";
import Calendar from "./pages/Calendar";
import Meet from "./pages/Meet";
import MeetingRoom from "./pages/MeetingRoom";
import Docs from "./pages/Docs";
import Sheets from "./pages/Sheets";
import Jamboard from "./pages/Jamboard";
import Tasks from "./pages/Tasks";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex h-screen overflow-hidden">
            <AppSidebar 
              expanded={sidebarExpanded} 
              onToggle={() => setSidebarExpanded(!sidebarExpanded)} 
            />
            <main className={`flex-1 overflow-auto transition-all duration-300`}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/meet" element={<Meet />} />
                <Route path="/meet/room" element={<MeetingRoom />} />
                <Route path="/docs" element={<Docs />} />
                <Route path="/sheets" element={<Sheets />} />
                <Route path="/jamboard" element={<Jamboard />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
