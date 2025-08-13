
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTypingEffect } from "@/hooks/use-typing-effect";

type AIReasoningProps = {
  reasoning: string | null;
};

export function AIReasoning({ reasoning }: AIReasoningProps) {
  const typedReasoning = useTypingEffect(reasoning);
  if (!reasoning) {
    return null;
  }

  return (
    <Card className="h-5/6">
      <CardHeader className="border-b">
        <CardTitle>AI Reasoning</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-full py-4">
          <p className="text-sm whitespace-pre-wrap">{typedReasoning}</p>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
