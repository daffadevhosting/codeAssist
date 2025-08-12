
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type AIReasoningProps = {
  reasoning: string | null;
};

export function AIReasoning({ reasoning }: AIReasoningProps) {
  if (!reasoning) {
    return null;
  }

  return (
    <Card className="h-5/6">
      <CardHeader>
        <CardTitle>AI Reasoning</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-full">
          <p className="text-sm">{reasoning}</p>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
