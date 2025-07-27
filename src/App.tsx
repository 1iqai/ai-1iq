
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ScheduleDemo from "./pages/ScheduleDemo";
import ContactSales from "./pages/ContactSales";
import PartnershipInquiry from "./pages/PartnershipInquiry";
import LearnMore from "./pages/LearnMore";
import OneiqPlatform from "./pages/OneiqPlatform";
import OneiqIntel from "./pages/OneiqIntel";
import GetStarted from "./pages/GetStarted";
import BuildersApplication from "./pages/BuildersApplication";
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
          <Route path="/schedule-demo" element={<ScheduleDemo />} />
          <Route path="/contact-sales" element={<ContactSales />} />
          <Route path="/partnership-inquiry" element={<PartnershipInquiry />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/1iq-platform" element={<OneiqPlatform />} />
          <Route path="/1iq-intel" element={<OneiqIntel />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/builders-application" element={<BuildersApplication />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
