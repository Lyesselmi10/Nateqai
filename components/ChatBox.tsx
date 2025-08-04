
// دمج الواجهة الحديثة في ChatBox.tsx مع استخدام GPT فعلي
import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';

interface Props {
  sendToAI: (message: string) => Promise<string>;
}

const ChatBox = ({ sendToAI }: Props) => {
  const [messages, setMessages] = useState<{ from: 'user' | 'ai'; text: string }[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { from: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    const aiReply = await sendToAI(userMessage.text);
    setMessages(prev => [...prev, { from: 'ai', text: aiReply }]);
    setIsTyping(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-xl max-w-lg ${
                msg.from === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              يكتب الآن...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-300 dark:border-gray-700">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 resize-none rounded-2xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            rows={2}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="px-4 py-3 bg-indigo-500 text-white rounded-2xl hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
