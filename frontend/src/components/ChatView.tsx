import { Card } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

interface ChatViewProps {
  conversationId: string | null;
}

export default function ChatView({ conversationId }: ChatViewProps) {
  if (!conversationId) {
    return (
      <Card className="p-8 h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Select a conversation to start chatting</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <p className="text-center text-muted-foreground py-8">No messages yet</p>
      </div>
    </Card>
  );
}
