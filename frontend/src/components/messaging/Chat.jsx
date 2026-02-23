import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Phone, Mail } from 'lucide-react';
import apiService from '../../services/api';

const Chat = ({ listing, onClose, vendor }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (listing && vendor) {
      loadMessages();
    }
  }, [listing, vendor]);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, we would fetch the conversation
      // For now, we'll simulate with mock data
      const mockMessages = [
        {
          _id: '1',
          content: 'Hi, I\'m interested in your property.',
          sender: { name: 'Current User' },
          receiver: { name: vendor.name },
          createdAt: new Date().toISOString(),
          isOwn: true
        },
        {
          _id: '2',
          content: 'Sure, what would you like to know?',
          sender: { name: vendor.name },
          receiver: { name: 'Current User' },
          createdAt: new Date(Date.now() - 300000).toISOString(),
          isOwn: false
        }
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      // In a real implementation, we would send the message to the API
      // For now, we'll add it to the mock messages
      const messageToAdd = {
        _id: Date.now().toString(),
        content: newMessage,
        sender: { name: 'Current User' },
        receiver: { name: vendor.name },
        createdAt: new Date().toISOString(),
        isOwn: true
      };

      setMessages(prev => [...prev, messageToAdd]);
      setNewMessage('');

      // Simulate sending to backend
      setTimeout(() => {
        const responseMessage = {
          _id: (Date.now() + 1).toString(),
          content: 'Thanks for your message, I\'ll get back to you soon!',
          sender: { name: vendor.name },
          receiver: { name: 'Current User' },
          createdAt: new Date().toISOString(),
          isOwn: false
        };
        setMessages(prev => [...prev, responseMessage]);
      }, 2000);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg w-full max-w-2xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <img 
              src={`https://ui-avatars.com/api/?name=${vendor?.name}&background=random`} 
              alt={vendor?.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold">{vendor?.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Property Owner</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <Mail className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message._id} 
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isOwn 
                      ? 'bg-teal-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${message.isOwn ? 'text-teal-100' : 'text-gray-500'}`}>
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="bg-teal-600 text-white rounded-lg px-4 py-2 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;