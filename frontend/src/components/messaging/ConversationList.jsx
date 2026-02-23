import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MessageCircle, Clock, User } from 'lucide-react';
import apiService from '../../services/api';

const ConversationList = ({ onSelectConversation, selectedConversation }) => {
  const { data: conversations, isLoading, error, refetch } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      try {
        const response = await apiService.get('/api/messages/conversations');
        return response.conversations;
      } catch (err) {
        console.error('Error fetching conversations:', err);
        return [];
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  useEffect(() => {
    // Poll for updates periodically
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading conversations: {error.message}
      </div>
    );
  }

  return (
    <div className="border-r border-gray-200 dark:border-gray-700 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Messages
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {conversations && conversations.length > 0 ? (
          conversations.map((conv) => {
            // Find the other participant (not current user)
            const otherParticipant = conv.otherParticipant;
            
            return (
              <div
                key={conv._id}
                className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  selectedConversation?._id === conv._id ? 'bg-gray-100 dark:bg-gray-800' : ''
                }`}
                onClick={() => onSelectConversation(conv)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={`https://ui-avatars.com/api/?name=${otherParticipant?.name}&background=random`}
                      alt={otherParticipant?.name}
                      className="w-12 h-12 rounded-full"
                    />
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">
                        {otherParticipant?.name}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {conv.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No conversations yet</p>
            <p className="text-sm mt-1">Start a conversation by messaging a property owner</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;