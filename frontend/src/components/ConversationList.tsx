import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle } from 'lucide-react';

interface ConversationListProps {
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
}

export default function ConversationList({ selectedConversation, onSelectConversation }: ConversationListProps) {
  return (
    <Card className="p-4 h-full">
      <h2 className="text-xl font-semibold mb-4">Messages</h2>
      <div className="text-center py-12 text-muted-foreground">
        <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No conversations yet</p>
        <p className="text-sm mt-2">Start chatting with your friends!</p>
      </div>
    </Card>
  );
}
