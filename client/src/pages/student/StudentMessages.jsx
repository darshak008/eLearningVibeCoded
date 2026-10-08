import { useState, useEffect } from 'react';
import { FiMessageCircle, FiSend, FiArrowLeft } from 'react-icons/fi';
import { messageAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function StudentMessages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    messageAPI.getConversations().then((res) => setConversations(res.data.conversations)).catch(() => {});
  }, []);

  const openChat = async (userId) => {
    setSelectedUser(userId);
    try {
      const res = await messageAPI.getMessages(userId);
      setMessages(res.data.messages);
    } catch {}
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;
    try {
      const res = await messageAPI.send({ receiver: selectedUser, content: newMessage });
      setMessages((prev) => [...prev, res.data.message]);
      setNewMessage('');
    } catch {
      toast.error('Failed to send');
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass-card rounded-3xl overflow-hidden h-[calc(100vh-160px)]">
          <div className="flex h-full">
            <div className="w-72 border-r border-dark-200 dark:border-dark-700 overflow-y-auto">
              <div className="p-4 border-b border-dark-200 dark:border-dark-700">
                <h2 className="font-bold text-dark-900 dark:text-white">Messages</h2>
              </div>
              {conversations.map((conv) => (
                <button
                  key={conv.user?._id}
                  onClick={() => openChat(conv.user?._id)}
                  className={`w-full p-4 text-left hover:bg-dark-50 dark:hover:bg-dark-800 transition-colors ${selectedUser === conv.user?._id ? 'bg-primary-500/10' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                      {conv.user?.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark-900 dark:text-white truncate">{conv.user?.name}</p>
                      <p className="text-xs text-dark-400 truncate">{conv.lastMessage?.content}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex-1 flex flex-col">
              {selectedUser ? (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((msg) => (
                      <div key={msg._id} className={`flex ${msg.sender?._id === user?._id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md px-4 py-3 rounded-2xl ${
                          msg.sender?._id === user?._id
                            ? 'bg-primary-500 text-white rounded-br-md'
                            : 'bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-200 rounded-bl-md'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs opacity-70 mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-dark-200 dark:border-dark-700">
                    <div className="flex gap-2">
                      <input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2.5 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                      />
                      <button onClick={sendMessage} className="px-4 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors">
                        <FiSend />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-dark-400">
                  <div className="text-center">
                    <FiMessageCircle className="text-5xl mx-auto mb-3 opacity-50" />
                    <p>Select a conversation</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
