"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wand2 } from "lucide-react";
import React from 'react';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  template: z.string({
    required_error: "Please select a template.",
  }),
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }),
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
    },
  });

  const template = form.watch("template");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onGenerate)} className="relative justify-end space-y-4 flex flex-col max-h-screen h-full">
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
                  />
                </FormControl>
                <div className="absolute bottom-2 left-2">
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
                </div>
                <Button type="submit" size="sm" className="absolute bottom-2 right-2" disabled={isLoading}>
                  {isLoading ? "Generating..." : "Generate Code"}
                </Button>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
