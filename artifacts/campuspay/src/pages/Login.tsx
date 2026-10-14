import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";

export default function Login() {
  const { login } = useWallet();
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      login(username.trim());
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-background px-4 py-10 text-foreground">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="w-full max-w-[420px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background"><Wallet className="h-6 w-6" /></div>
          <h1 className="text-2xl font-semibold tracking-tight">CampusPay</h1>
          <p className="mt-2 text-sm text-muted-foreground">Simple payments for campus life.</p>
        </div>
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="space-y-1 pb-5">
            <CardTitle className="text-xl">{isSignUp ? "Create an account" : "Welcome back"}</CardTitle>
            <CardDescription>{isSignUp ? "Enter your details to get started." : "Sign in to access your student wallet."}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label htmlFor="username">Student ID or username</Label><Input id="username" placeholder="e.g. s2023001" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required /></div>
              <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={isSignUp ? "new-password" : "current-password"} required /></div>
              <Button type="submit" className="mt-2 w-full" disabled={isLoading}>{isLoading ? "Signing in…" : isSignUp ? "Create account" : "Sign in"}</Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t border-border pt-4">
            <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}</button>
          </CardFooter>
        </Card>
        <p className="mt-6 text-center text-xs text-muted-foreground">A simple, secure way to manage campus spending.</p>
      </motion.div>
    </div>
  );
}
