import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<{ name: string; email: string; avatar: string } | null>({
    name: 'Гость',
    email: 'guest@example.com',
    avatar: '👤'
  });

  const handleAuth = (userData: { name: string; email: string; avatar: string }) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser({
      name: 'Гость',
      email: 'guest@example.com',
      avatar: '👤'
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={<Index user={user} onAuth={handleAuth} onLogout={handleLogout} />} 
            />
            <Route 
              path="/auth" 
              element={<Auth onAuth={handleAuth} />} 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;