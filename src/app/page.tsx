// src/app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { PromptForm, type PromptFormValues } from '@/components/PromptForm';
import { CodeDisplay } from '@/components/CodeDisplay';
import { AIReasoning } from '@/components/AIReasoning';
import { generateCode } from '@/app/actions'; 
import { AppLayout } from '@/components/AppLayout';

export default function Home() {
  const [result, setResult] = useState<{ code: string | null; error: string | null }>({ code: null, error: null });
  const [reasoning, setReasoning] = useState<string | null>(
    "👋️ Hi! I'll explain the generated code here. Please start by filling in the prompt below."
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedApiKey = localStorage.getItem("gemini_api_key");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else {
      setIsModalOpen(true);
    }
  }, []);

  const handleGenerateCode = async (data: PromptFormValues) => {
    if (!apiKey) {
      setIsModalOpen(true);
      return;
    }

    setIsLoading(true);
    setResult({ code: null, error: null });
    setReasoning(null);

    // Tentukan apakah ini permintaan modifikasi atau bukan
    const currentCode = result.code;
    const isModification = currentCode !== null && currentCode.trim() !== "";

    // Kosongkan error sebelumnya
    setResult(prev => ({ ...prev, error: null }));
    
    // Untuk modifikasi, reasoning bisa kita set secara langsung
    if (isModification) {
        setReasoning(`Menerapkan perubahan: "${data.prompt}"...`);
    } else {
        setReasoning(null);
    }

    try {
      // Gunakan fungsi server yang baru
      const response = await generateCode(data.prompt, data.template, apiKey);
      
      if (response.code) {
        setResult({ code: response.code, error: null });
        setReasoning(response.reasoning);
      } else {
        setResult(prev => ({ ...prev, error: response.error }));
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
      setResult(prev => ({ ...prev, error: error.message }));
    }

    setIsLoading(false);
  };

  const handleSaveApiKey = (newApiKey: string) => {
    localStorage.setItem("gemini_api_key", newApiKey);
    setApiKey(newApiKey);
    setIsModalOpen(false);
  };

  return (
    <AppLayout>
      <ApiKeyModal open={isModalOpen} onSave={handleSaveApiKey} />
      <div className="flex-1 w-full md:w-2/3 p-4">
        {/* Template tidak lagi relevan untuk mode modifikasi, tapi kita biarkan untuk display awal */}
        <CodeDisplay code={result.code} isLoading={isLoading} template={result.code ? 'html' : 'react'} />
      </div>
      <div className="relative flex flex-col justify-end w-full md:w-1/3 p-4 gap-4 h-fit md:h-full overflow-hidden">
        <div className="hidden md:flex flex-1 overflow-y-auto">
          <AIReasoning reasoning={reasoning} isLoading={isLoading} />
        </div>
        <div className="h-1/4">
          <PromptForm onGenerate={handleGenerateCode} isLoading={isLoading} />
        </div>
      </div>
    </AppLayout>
  );
}