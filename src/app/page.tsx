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
  const [reasoning, setReasoning] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [template, setTemplate] = useState('react');
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
    setTemplate(data.template === 'redesign' || data.template === 'url_redesign' ? 'html' : data.template);

    try {
      // PERUBAHAN: Kirim apiKey sebagai argumen ke server action
      const response = await generateCode(data.prompt, data.template, apiKey);
      if (response.code) {
        setResult({ code: response.code, error: null });
        setReasoning(response.reasoning);
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
        <CodeDisplay code={result.code} isLoading={isLoading} template={template} />
      </div>
      <div className="relative flex flex-col justify-end w-full md:w-1/3 p-4 gap-4 h-fit md:h-full overflow-hidden">
        <div className="hidden md:block flex-1 overflow-y-auto">
          <AIReasoning reasoning={reasoning} />
        </div>
        <div className="h-1/4">
          <PromptForm onGenerate={handleGenerateCode} isLoading={isLoading} />
        </div>
      </div>
    </AppLayout>
  );
}