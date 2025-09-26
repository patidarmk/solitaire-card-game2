import * as React from 'react'
import { 
  createRouter, 
  RouterProvider, 
  createRootRoute, 
  createRoute, 
  Outlet 
} from '@tanstack/react-router'
import { Toaster } from "@/components/ui/toaster";
import { Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Header } from '@/components/Header';
import Home from "./pages/Home";
import Klondike from "./pages/Klondike";
import Spider from "./pages/Spider";
import FreeCell from "./pages/FreeCell";
import StatsPage from "./pages/Statistics";
import Daily from "./pages/Daily";
import Challenges from "./pages/Challenges";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
});

const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home });
const klondikeRoute = createRoute({ 
  getParentRoute: () => rootRoute, 
  path: '/klondike/$', 
  component: Klondike,
  validateSearch: (search: Record<string, unknown>) => ({ daily: search.daily === true }),
});
const spiderRoute = createRoute({ getParentRoute: () => rootRoute, path: '/spider', component: Spider });
const freecellRoute = createRoute({ getParentRoute: () => rootRoute, path: '/freecell', component: FreeCell });
const statsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/stats', component: StatsPage });
const dailyRoute = createRoute({ getParentRoute: () => rootRoute, path: '/daily', component: Daily });
const challengesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/challenges', component: Challenges });
const aboutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/about', component: About });
const contactRoute = createRoute({ getParentRoute: () => rootRoute, path: '/contact', component: Contact });
const notFoundRoute = createRoute({ getParentRoute: () => rootRoute, path: '*', component: NotFound });

const routeTree = rootRoute.addChildren([
  homeRoute, klondikeRoute, spiderRoute, freecellRoute, statsRoute, dailyRoute, challengesRoute, aboutRoute, contactRoute, notFoundRoute,
]);

const router = createRouter({ routeTree, defaultPreload: 'intent', context: { queryClient } });

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}

const App = () => <RouterProvider router={router} />;

export default App;