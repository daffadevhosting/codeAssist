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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const CHAT_HISTORY_KEY = "coda_chat_history";

// Definisikan tipe untuk riwayat obrolan
type ChatMessage = {
  role: 'user' | 'assist';
  content: string;
};

export default function Home() {
  const [result, setResult] = useState<{ code: string | null; error: string | null }>({ code: null, error: null });
  const [template, setTemplate] = useState('react');
  const [reasoning, setReasoning] = useState<string | null>(
    "👋️ Hi! I'll explain the generated code here. Please start by filling in the prompt below. Select the template to generate from the dropdown menu in the input form. You can also change the AI model using the `BOT` icon next to it. If you'd like to chat, select **'Obrolan Umum'**, and I'll be your chat partner, And let's sparring code. You can send me your error \`\`\`code\`\`\`, **I will fix it..**"
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Inisialisasi state chatHistory dari localStorage
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
      return savedHistory ? JSON.parse(savedHistory) : [];
    }
    return [];
  });
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Efek untuk menyimpan chat history setiap kali berubah
  useEffect(() => {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    const storedApiKey = localStorage.getItem("gemini_api_key");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else {
      setIsModalOpen(true);
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleGenerateCode = async (data: PromptFormValues) => {
    if (!apiKey) {
      setIsModalOpen(true);
      return;
    }

    setIsLoading(true);
    setTemplate(data.template);

    const currentChatHistory = [...chatHistory, { role: 'user', content: data.prompt }];

    if (data.template === 'public_chat') {
      const UserMessage: ChatMessage = { role: 'user', content: data.prompt };
      const currentChatHistory = [...chatHistory, UserMessage];
      setChatHistory(currentChatHistory);
      setReasoning(null);
      setResult({ code: null, error: null });

      try {
        const response = await generateCode(currentChatHistory, "", data.template, apiKey, null, data.model);
        if (response.code) {
          const AiMessage: ChatMessage = { role: 'assist', content: response.code };
          setChatHistory(prev => [...prev, AiMessage]);
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
      const currentCode = result.code;
      const isModification = currentCode !== null && currentCode.trim() !== "";

      setChatHistory([]);
      setResult({ code: currentCode, error: null }); 
      setReasoning(isModification ? `Applying changes: \"${data.prompt}\"...` : "Generating code...");

      try {
        const response = await generateCode([], data.prompt, data.template, apiKey, currentCode, data.model);
        
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
          setResult({ code: currentCode, error: response.error });
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
        setResult({ code: currentCode, error: error.message });
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

  const ChatDisplay = () => (
    <div className="relative flex flex-col h-full md:h-full border border-border rounded-md">
      <div className="flex items-center justify-between py-3 px-4 border-b border-border">
        <h3 className="text-lg font-semibold">General Chat</h3>
      </div>
      <ScrollArea className="flex-1 p-4 block w-auto" ref={chatContainerRef}>
        <div className="space-y-4">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assist' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback><Bot size={20} /></AvatarFallback>
                </Avatar>
              )}
              <div className={`rounded-lg p-3 max-w-screen-md text-sm ${msg.role === 'user' ? 'bg-[#353434] shadow text-primary-foreground' : 'bg-muted'}`}>
                  <div className="prose prose-sm text-wrap w-auto dark:prose-invert max-w-prose prose-p:leading-relaxed prose-code:text-wrap">
                     <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                     </ReactMarkdown>
                  </div>
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
            <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <AppLayout>
      <ApiKeyModal open={isModalOpen} onSave={handleSaveApiKey} />
      
      <div className="flex-1 w-full h-3/4 md:h-full md:w-2/3 p-4">
        {template === 'public_chat' ? (
          <ChatDisplay />
        ) : (
          <CodeDisplay code={result.code} isLoading={isLoading} template={template} />
        )}
      </div>

      <div className="relative flex flex-col justify-end w-full md:w-1/3 p-4 gap-4 h-fit md:h-full overflow-hidden">
        {template !== 'public_chat' && !isMobile && (
          <div className="hidden md:flex flex-1 overflow-y-auto">
            <AIReasoning reasoning={reasoning} isLoading={isLoading} />
          </div>
        )}
        <div className={template === 'public_chat' ? 'h-1/4' : 'h-1/4'}>
          <PromptForm onGenerate={handleGenerateCode} isLoading={isLoading} isChat={false} />
        </div>
      </div>
    </AppLayout>
  );
}