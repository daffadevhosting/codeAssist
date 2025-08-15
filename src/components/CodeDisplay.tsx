"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Code2, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import useLicenseCheck from '@/hooks/useLicenseCheck';
import LockScreen from '@/components/ui/LockScreen';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLineByLineEffect } from "@/hooks/use-line-by-line-effect";
import { DialogClose } from "@radix-ui/react-dialog";

type CodeDisplayProps = {
  code: string | null;
  isLoading: boolean;
  template: string;
};


export function CodeDisplay({ code, isLoading, template }: CodeDisplayProps) {
  const isLocked = useLicenseCheck();
  const [copied, setCopied] = useState(false);
  const displayedCode = useLineByLineEffect(code);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);


  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      );
    }

    if (!code) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground overflow-hidden">
          <Code2 className="w-16 h-16 mb-4 overflow-y-auto overflow-hidden" />
          <h3 className="text-lg font-medium">Your generated code will appear here</h3>
          <p className="text-sm">
            Fill out the form to start generating code.
          </p>
        </div>
      );
    }

    return (
      <ScrollArea className="h-full w-full overflow-y-auto overflow-hidden">
         <pre className="text-sm whitespace-pre-wrap break-words overflow-y-auto overflow-hidden">
            <code className="font-code overflow-y-auto overflow-hidden">{displayedCode}</code>
         </pre>
      </ScrollArea>
    );
  };
  
  return (
    <div className="relative h-full flex flex-col border border-border rounded-md">
      <div className="flex items-center justify-between py-3 px-4 border-b border-border">
        <h3 className="text-lg flex items-center gap-2 font-headline"><Code2 className="w-6 h-6" />Code Mod</h3>
        {code && !isLoading && (
          <div className="flex items-center gap-2">
            {['html', 'redesign', 'url_redesign'].includes(template) && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Preview code">
                    <Eye className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-0 m-0 w-screen h-screen max-w-full rounded-none border-0">
                  <DialogTitle className="hidden"></DialogTitle>
                    <DialogClose asChild>
                      <Button variant="ghost" size="icon" className="absolute right-4 top-3">
                        <X className="h-5 w-5 text-red-600" />
                        <span className="sr-only">Close</span>
                      </Button>
                    </DialogClose>
                  <div className="flex-1">
                    <iframe
                      srcDoc={code || ''}
                      title="HTML Preview"
                      className="w-full h-full border-0"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            )}
            <Button variant="ghost" size="icon" onClick={handleCopy} aria-label="Copy code">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </div>
      <div className="relative h-full max-h-[650px] flex-1 p-4 overflow-y-auto overflow-hidden">
        {renderContent()}
        {isLocked && <LockScreen />}
      </div>
          <small id="appId" style={{ display: isLocked ? 'none' : 'block', width: '100%' }} className='absolute bottom-0 left-0 text-sm md:text-md mb-2 ml-4 text-gray-900 dark:text-primary w-fit'>Code Mod Build by Daffa</small>
    </div>
  );
}

