#!/bin/bash
cat << 'INNER_EOF' > client/src/pages/manager-chat.tsx
import { AppLayout } from "@/components/layout/app-layout";
import { StudentSelector } from "@/components/shared/student-selector";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Send, Mic, Paperclip, MoreVertical, Phone, Video } from "lucide-react";

export default function ManagerChat() {
  return (
    <AppLayout role="manager" userName="Alexandre Mentor" userTitle="Tech Manager / Squad A">
      <div className="max-w-5xl mx-auto mb-4">
        <StudentSelector />
      </div>
      <div className="flex flex-col h-[calc(100vh-14rem)] max-w-5xl mx-auto gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Comunicações</h1>
            <p className="text-muted-foreground mt-1">Mensagens diretas com sua equipe.</p>
          </div>
        </div>

        <Card className="flex-1 flex overflow-hidden">
          {/* Chat Sidebar */}
          <div className="w-80 border-r flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar conversas..." className="pl-9" />
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {/* Active Chat */}
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg cursor-pointer">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Joao" />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="text-sm font-medium truncate">João Silva</p>
                      <span className="text-xs text-muted-foreground">10:42</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">Terminei a task da sprint.</p>
                  </div>
                </div>

                {/* Other Chats */}
                {[
                  { name: "Maria Costa", msg: "Podemos alinhar o PDI?", time: "Ontem", unread: 2 },
                  { name: "Carlos Santos", msg: "Ok, entendido.", time: "Terça", unread: 0 },
                  { name: "Ana Souza", msg: "Obrigada pelo feedback!", time: "Segunda", unread: 0 },
                ].map((chat, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.name}`} />
                      <AvatarFallback>{chat.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <p className="text-sm font-medium truncate">{chat.name}</p>
                        <span className="text-xs text-muted-foreground">{chat.time}</span>
                      </div>
                      <p className={`text-xs truncate ${chat.unread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {chat.msg}
                      </p>
                    </div>
                    {chat.unread > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="h-16 border-b flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Joao" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-medium">João Silva</h3>
                  <p className="text-xs text-green-500">Online agora</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><Video className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                <div className="text-center">
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">Hoje</span>
                </div>
                
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-2.5 max-w-[80%]">
                    <p className="text-sm">Bom dia! Conseguiu revisar o PR da nova feature?</p>
                    <span className="text-[10px] text-muted-foreground mt-1 block">09:30</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none px-4 py-2.5 max-w-[80%]">
                    <p className="text-sm">Bom dia, João! Sim, revisei agora pouco. Deixei dois comentários sobre a performance, mas a lógica está ótima.</p>
                    <span className="text-[10px] text-primary-foreground/70 mt-1 block text-right">09:45</span>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-2.5 max-w-[80%]">
                    <p className="text-sm">Vi aqui. Já ajustei o componente para evitar re-renders desnecessários. Terminei a task da sprint.</p>
                    <span className="text-[10px] text-muted-foreground mt-1 block">10:42</span>
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 bg-background border-t">
              <div className="flex items-end gap-2">
                <div className="flex gap-1 pb-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                <Input 
                  placeholder="Escreva sua mensagem..." 
                  className="flex-1 min-h-[44px] rounded-xl"
                />
                <Button size="icon" className="shrink-0 rounded-full h-11 w-11">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
INNER_EOF
