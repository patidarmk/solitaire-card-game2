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
import { Header } from '@/components/Header';
import Home from "./pages/Home";
import Klondike from "./pages/Klondike";
import Spider from "./pages/Spider";
import FreeCell from "./pages/FreeCell";
import Stats from "./pages/Stats";
import Challenges from "./pages/Challenges";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Create root route with Header
const rootRoute = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Header />
        <main className="min-h-[calc(100vh-80px)]">
          <Outlet />
        </main>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  ),
})

// Home route
const homeRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

// Game routes
const klondikeRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: '/klondike',
  component: Klondike,
  validateSearch: (search: Record<string, unknown>) => ({
    daily: search.daily === 'true',
  }),
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

// Other pages
const statsRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: '/stats',
  component: Stats,
});

const challengesRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: '/challenges',
  component: Challenges,
});

const aboutRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: About,
});

const contactRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: Contact,
});

// Not found route
const notFoundRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFound,
});

// Create route tree
const routeTree = rootRoute.addChildren([
  homeRoute,
  klondikeRoute,
  spiderRoute,
  freecellRoute,
  statsRoute,
  challengesRoute,
  aboutRoute,
  contactRoute,
  notFoundRoute,
])

// Create router
const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent' as const,
  defaultPreloadStaleTime: 0,
  notFoundRoute,
})

// Register for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const App = () => <RouterProvider router={router} />

export default App;