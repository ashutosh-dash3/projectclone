import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ConversationList from '../components/messaging/ConversationList';
import Chat from '../components/messaging/Chat';

const Messaging = () => {
  const { currentUser } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatListing, setChatListing] = useState(null);
  const [chatVendor, setChatVendor] = useState(null);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleStartChat = (listing, vendor) => {
    setChatListing(listing);
    setChatVendor(vendor);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setChatListing(null);
    setChatVendor(null);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to access messages</h2>
          <p className="text-gray-600">You need to be logged in to view and send messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Messages</h1>
        
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="flex h-full">
            {/* Conversation List */}
            <div className="w-1/3 border-r border-gray-200 dark:border-gray-700">
              <ConversationList 
                onSelectConversation={handleSelectConversation}
                selectedConversation={selectedConversation}
              />
            </div>
            
            {/* Chat Area */}
            <div className="flex-1">
              {selectedConversation ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <h3 className="text-xl font-semibold mb-4">Selected Conversation</h3>
                    <p className="text-gray-600 mb-4">In a full implementation, this would show the conversation details.</p>
                    <p className="text-sm text-gray-500">This is a simplified view for demonstration purposes.</p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-6 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Conversation Selected</h3>
                  <p className="text-gray-600 mb-4">Select a conversation from the list or start a new one by contacting a property owner.</p>
                  <p className="text-sm text-gray-500">You can message property owners directly from their listing pages.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal - This would be triggered from other parts of the app */}
      {showChat && (
        <Chat 
          listing={chatListing} 
          vendor={chatVendor} 
          onClose={handleCloseChat} 
        />
      )}
    </div>
  );
};

export default Messaging;