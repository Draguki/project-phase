import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { useWallet } from "@/hooks/useWallet";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated } = useWallet();
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  return <Component {...rest} />;
}

function PublicRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated } = useWallet();
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }
  return <Component {...rest} />;
}

function RootRedirect() {
  const { isAuthenticated } = useWallet();
  return <Redirect to={isAuthenticated ? "/dashboard" : "/login"} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={RootRedirect} />
      <Route path="/login">
        <PublicRoute component={Login} />
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster theme="light" position="top-center" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
