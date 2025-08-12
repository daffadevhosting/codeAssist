
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ApiKeyModalProps = {
  open: boolean;
  onSave: (apiKey: string) => void;
};

import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export function ApiKeyModal({ open, onSave }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    if (apiKey.trim() !== "") {
      onSave(apiKey);
    } else {
      toast({
        variant: "destructive",
        title: "API Key is required",
        description: "Please enter your Gemini API key to continue.",
      });
    }
  };

  return (
    <Dialog open={open} modal={true}>
      <DialogContent onInteractOutside={(e: { preventDefault: () => any; }) => e.preventDefault()} onEscapeKeyDown={(e: { preventDefault: () => any; }) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Enter your Gemini API Key</DialogTitle>
        </DialogHeader>
        <Input
          type="password"
          placeholder="Use Your API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <DialogFooter className="flex md:justify-between items-center">
          <small className="mt-5 md:mt-0">You can get one from <Link className="text-blue-600" href="https://aistudio.google.com/apikey" target="_blank">Google AI Studio</Link></small>
          <Button className="w-full md:w-fit" size='sm' onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
