import * as React from 'react'
import { 
  createRouter, 
  RouterProvider, 
  createRootRoute, 
  createRoute as createTanStackRoute, 
  Outlet 
} from '@tanstack/react-router'
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "@/components/Header";
import Index from "./pages/Index";
import Klondike from "./pages/Klondike";
import Spider from "./pages/Spider";
import FreeCell from "./pages/FreeCell";
import Daily from "./pages/Daily";
import Stats from "./pages/Statistics";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Root route with shared providers and Header
const rootRoute = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  ),
});

// Define all routes
const indexRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
});

const klondikeRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: '/klondike',
  component: Klondike,
});

const spiderRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: '/spider',
  component: Spider,
});

const freecellRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: '/freecell',
  component: FreeCell,
});

const dailyRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: '/daily',
  component: Daily,
});

const statsRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: '/stats',
  component: Stats,
});

const aboutRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: About,
});

const notFoundRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFound,
});

// Build route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  klondikeRoute,
  spiderRoute,
  freecellRoute,
  dailyRoute,
  statsRoute,
  aboutRoute,
  notFoundRoute,
]);

// Create router
const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent' as const,
  defaultPreloadStaleTime: 0,
});

// Type registration
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const App = () => <RouterProvider router={router} />

export default App;