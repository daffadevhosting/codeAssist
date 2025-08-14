// src/app/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { PromptForm, type PromptFormValues } from '@/components/PromptForm';
import { CodeDisplay } from '@/components/CodeDisplay';
import { AIReasoning } from '@/components/AIReasoning';
import { generateCode } from '@/app/actions'; 
import { AppLayout } from '@/components/AppLayout';
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';

// Definisikan tipe untuk riwayat obrolan
type ChatMessage = {
  role: 'user' | 'ai';
  content: string;
};

export default function Home() {
  const [result, setResult] = useState<{ code: string | null; error: string | null }>({ code: null, error: null });
  const [template, setTemplate] = useState('react');
  const [reasoning, setReasoning] = useState<string | null>(
    "👋️ Hi! I'll explain the generated code here. Please start by filling in the prompt below."
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // State baru untuk riwayat obrolan
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem("gemini_api_key");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else {
      setIsModalOpen(true);
    }
  }, []);

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleGenerateCode = async (data: PromptFormValues) => {
    if (!apiKey) {
      setIsModalOpen(true);
      return;
    }

    setIsLoading(true);
    // Perbarui template state saat ini
    setTemplate(data.template);

    if (data.template === 'public_chat') {
      // Logika untuk Obrolan Umum
      const newUserMessage: ChatMessage = { role: 'user', content: data.prompt };
      setChatHistory(prev => [...prev, newUserMessage]);
      setReasoning(null);
      setResult({ code: null, error: null });

      try {
        const response = await generateCode(data.prompt, data.template, apiKey, null);
        if (response.code) {
          const newAiMessage: ChatMessage = { role: 'ai', content: response.code };
          setChatHistory(prev => [...prev, newAiMessage]);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: response.error || "An unknown error occurred.",
          });
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      }

    } else {
      // Logika untuk Generasi Kode (yang sudah ada)
      setChatHistory([]); // Kosongkan riwayat obrolan jika bukan mode obrolan
      setResult({ code: null, error: null });
      setReasoning(null);

      const currentCode = result.code;
      const isModification = currentCode !== null && currentCode.trim() !== "";
      
      if (isModification) {
          setReasoning(`Applying changes: "${data.prompt}"...`);
      }

      try {
        const response = await generateCode(data.prompt, data.template, apiKey, reasoning);
        
        if (response.code) {
          setResult({ code: response.code, error: null });
          if (isMobile && response.reasoning) {
            toast({
              title: "AI Reasoning",
              description: response.reasoning,
              duration: 8000, 
            });
          } else {
            setReasoning(response.reasoning);
          }
        } else {
          setResult({ code: null, error: response.error });
          setReasoning(null);
          toast({
            variant: "destructive",
            title: "Error Generating Code",
            description: response.error || "An unknown error occurred.",
          });
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error Generating Code",
          description: error.message,
        });
        setResult({ code: null, error: error.message });
        setReasoning(null);
      }
    }

    setIsLoading(false);
  };

  const handleSaveApiKey = (newApiKey: string) => {
    localStorage.setItem("gemini_api_key", newApiKey);
    setApiKey(newApiKey);
    setIsModalOpen(false);
  };

  // Komponen untuk menampilkan pesan obrolan
  const ChatDisplay = () => (
    <div className="flex flex-col h-full border border-border rounded-md">
      <div className="flex items-center justify-between py-3 px-4 border-b border-border">
        <h3 className="text-lg font-semibold">General Chat</h3>
      </div>
      <ScrollArea className="flex-1 p-4" ref={chatContainerRef}>
        <div className="space-y-4">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'ai' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback><Bot size={20} /></AvatarFallback>
                </Avatar>
              )}
              <div className={`rounded-lg p-3 text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <p>{msg.content}</p>
              </div>
              {msg.role === 'user' && (
                 <Avatar className="w-8 h-8">
                   <AvatarFallback><User size={20} /></AvatarFallback>
                 </Avatar>
              )}
            </div>
          ))}
           {isLoading && (
            <div className="flex items-start gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback><Bot size={20} /></AvatarFallback>
              </Avatar>
              <div className="rounded-lg p-3 text-sm bg-muted">
                <p><i>Typing...</i></p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <AppLayout>
      <ApiKeyModal open={isModalOpen} onSave={handleSaveApiKey} />
      
      <div className="flex-1 w-full md:w-2/3 p-4 h-full">
        {template === 'public_chat' ? (
          <ChatDisplay />
        ) : (
          <CodeDisplay code={result.code} isLoading={isLoading} template={result.code ? 'html' : 'react'} />
        )}
      </div>

      <div className="relative flex flex-col justify-end w-full md:w-1/3 p-4 gap-4 h-fit md:h-full overflow-hidden">
        {template !== 'public_chat' && !isMobile && (
          <div className="hidden md:flex flex-1 overflow-y-auto">
            <AIReasoning reasoning={reasoning} isLoading={isLoading} />
          </div>
        )}
        <div className={template === 'public_chat' ? 'h-auto' : 'h-1/4'}>
          <PromptForm onGenerate={handleGenerateCode} isLoading={isLoading} />
        </div>
      </div>
    </AppLayout>
  );
}
''