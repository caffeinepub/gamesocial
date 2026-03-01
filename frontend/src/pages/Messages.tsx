import { useState } from 'react';
import ConversationList from '../components/ConversationList';
import ChatView from '../components/ChatView';

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  return (
    <div className="grid md:grid-cols-[300px_1fr] gap-6 h-[calc(100vh-200px)]">
      <ConversationList
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
      />
      <ChatView conversationId={selectedConversation} />
    </div>
  );
}
