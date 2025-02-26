
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
