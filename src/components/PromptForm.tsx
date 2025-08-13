"use client";

import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, Code, Globe, PenSquare, Sparkles } from "lucide-react";
import { z } from "zod";
import React from 'react';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage, // FormMessage bisa digunakan jika Anda ingin menampilkan error di bawah input
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


const formSchema = z.object({
  template: z.string({
    required_error: "Please select a template.",
  }),
  model: z.string({ // [BARU] Tambahan field model
    required_error: "Please select a model.",
  }),
  prompt: z.string(), // Hapus validasi min(10) dari sini
}).superRefine((data, ctx) => {
  // Terapkan validasi kondisional
  if (data.template === 'url_redesign') {
    if (!data.prompt.startsWith('http')) {
      if (data.prompt.length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Silakan masukkan URL yang valid.",
          path: ['prompt'],
        });
      }
    }
  } else {
    // Jika bukan URL, terapkan validasi minimal 10 karakter
    if (data.prompt.length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Prompt harus memiliki setidaknya 10 karakter.",
        path: ['prompt'],
      });
    }
  }
});

export type PromptFormValues = z.infer<typeof formSchema>;

type PromptFormProps = {
  onGenerate: (data: PromptFormValues) => void;
  isLoading: boolean;
};

const placeholders: Record<string, string> = {
  react: "e.g., A responsive login form with email and password fields, and a submit button.",
  html: "e.g., A simple landing page with a hero section and a call-to-action button.",
  redesign: "Paste the HTML code you want to redesign here.",
  url_redesign: "e.g., https://google.com",
};

export function PromptForm({ onGenerate, isLoading }: PromptFormProps) {
  const form = useForm<PromptFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      template: "react",
      prompt: "",
      model: "gemini-2.5-pro",
    },
  });

  const { toast } = useToast();
  const template = form.watch("template");



  const onSubmit = (data: PromptFormValues) => {
    onGenerate(data);
    form.reset({
      prompt: "",
      template: data.template,
      model: data.model,
    });
  };

  // 2. Buat fungsi onInvalid
  const onInvalid = (errors: FieldErrors<PromptFormValues>) => {
    if (errors.prompt) {
      toast({
        variant: "destructive",
        title: "Input Tidak Valid",
        description: errors.prompt.message,
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Mencegah baris baru
      form.handleSubmit(onSubmit, onInvalid)(); // Memicu submit form
    }
  };

  return (
    <Form {...form}>
      {/* 3. Pembaruan handleSubmit dengan dua argumen: onValid dan onInvalid */}
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="relative justify-end space-y-2 flex flex-col max-h-screen h-full">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="relative flex">
                <FormControl>
                  <Textarea
                    placeholder={placeholders[template] || placeholders.react}
                    className="pr-14 pb-12 h-full"
                    {...field}
                    disabled={isLoading}
                    onKeyDown={handleKeyDown} 
                  />
                </FormControl>
                <div className="absolute bottom-0 left-0 flex items-center gap-1">
                   <FormField
                    control={form.control}
                    name="template"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                          <FormControl>
                            <SelectTrigger className="border-0 bg-transparent focus:ring-0 focus:ring-offset-0 w-auto">
                              <SelectValue placeholder="Select a base template" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="react">React Component</SelectItem>
                            <SelectItem value="html">HTML Page</SelectItem>
                            <SelectItem value="redesign">Redesign from HTML</SelectItem>
                            <SelectItem value="url_redesign">Redesign from URL</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isLoading}>
                            <Bot className="h-8 w-8" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel className="flex justify-start items-center gap-2"><Bot className="h-4 w-4" /> Pilih Model AI</DropdownMenuLabel>
                           <DropdownMenuSeparator />
                          <DropdownMenuRadioGroup value={field.value} onValueChange={field.onChange}>
                            <DropdownMenuRadioItem value="gemma-3n-e2b-it">Gemma 3n E2B</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="gemini-1.5-flash">Gemini 1.5 Flash</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="gemini-2.5-flash">Gemini 2.5 Flash</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="gemini-2.5-pro">Gemini 2.5 Pro</DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  />
                </div>
                <Button type="submit" size="sm" className="absolute bottom-2 right-2" disabled={isLoading}>
                  {isLoading ? "Generating..." : "Generate Code"}
                </Button>
              </div>
              {/* Anda juga bisa menambahkan <FormMessage /> di sini jika ingin error teks muncul di bawah input */}
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}