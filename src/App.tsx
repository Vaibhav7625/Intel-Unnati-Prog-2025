
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AiChat from "./pages/AiChat";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import { EngagementProvider } from "./hooks/EngagementContext";
import { FaceEngagement } from "./components/FaceEngagement";

const queryClient = new QueryClient();

const App = () => (
  <EngagementProvider>
    <FaceEngagement />
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ai-chat" element={<AiChat />} />
            <Route path="/analytics" element={<Analytics />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </EngagementProvider>
);

export default App;