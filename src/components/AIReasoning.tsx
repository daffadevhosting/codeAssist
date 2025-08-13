
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTypingEffect } from "@/hooks/use-typing-effect";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Skeleton } from "@/components/ui/skeleton";

type AIReasoningProps = {
  reasoning: string | null;
  isLoading: boolean;
};

export function AIReasoning({ reasoning, isLoading }: AIReasoningProps) {
  const typedReasoning = useTypingEffect(reasoning);
  if (isLoading) {
    return (
      <div className="h-5/6 w-full">
        <Card className="h-full w-full">
          <CardHeader>
            <CardTitle>AI Reasoning</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-4/5" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="relative w-full h-full">
      <CardHeader className="border-b">
        <CardTitle>AI Reasoning</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-full w-full py-4">
          <span className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {typedReasoning}
          </ReactMarkdown>
          </span>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
