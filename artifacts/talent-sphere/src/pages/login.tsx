import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Network } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store user email to simulate auth state
    localStorage.setItem("userEmail", email);
    
    // Determine role based on email
    if (email === "jenner.lopes@institutojef.org.br") {
      setLocation("/manager"); // Manager dashboard is the default for dual-role users
    } else {
      setLocation("/profile"); // Default to employee dashboard for all others (like jenner70@gmail.com)
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 -z-10" />
      <Card className="w-full max-w-md shadow-2xl border-border bg-card/80 backdrop-blur-xl">
        <CardHeader className="flex flex-col p-6 space-y-1 text-center pb-8 bg-transparent">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <Network className="text-primary-foreground h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">TalentSphere</CardTitle>
            Plataforma de Desenvolvimento de Talentos
        </CardHeader>
        <CardContent className="p-6 pt-0 bg-transparent">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email de acesso</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="nome@organizacao.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                data-testid="input-email"
                className="bg-background/50 focus:bg-background"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <a href="#" className="text-sm font-medium text-primary hover:underline">
                  Esqueceu a senha?
                </a>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                data-testid="input-password"
                className="bg-background/50 focus:bg-background"
                defaultValue="password123"
              />
            </div>

            <Button type="submit" className="w-full mt-4" data-testid="button-login">
              Entrar no sistema
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
