'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Conversation {
  id: string;
  customer: {
    name: string;
    source?: string;
    avatar?: string;
  };
  lastMessage: {
    text: string;
    timestamp: string;
  };
  unreadCount?: number;
  status: 'open' | 'waiting' | 'closed';
  
}

interface InboxSidebarProps {
  selectedConversationId?: string;
  onConversationSelect: (id: string) => void;
  darkMode: boolean;
}

export default function InboxSidebar({ selectedConversationId, onConversationSelect, darkMode }: InboxSidebarProps) {
  const [openFilter, setOpenFilter] = useState('5 Open');
  const [sortFilter, setSortFilter] = useState('Waiting longest');

  const conversations: Conversation[] = [
    {
      id: '1',
      customer: {
        name: 'Luis',
        source: 'GitHub',
      },
      lastMessage: {
        text: 'Hey! I have a questio...',
        timestamp: '45m'
      },
      status: 'open',
      
    },
    {
      id: '2',
      customer: {
        name: 'Ivan',
        source: 'Nike',
      },
      lastMessage: {
        text: 'Hi there, I have a qu...',
        timestamp: '30m'
      },
      unreadCount: 2,
      status: 'waiting',
     
    },
    {
      id: '3',
      customer: {
        name: 'Lead from New York',
      },
      lastMessage: {
        text: 'Good morning, let me...',
        timestamp: '45m'
      },
      unreadCount: 1,
      status: 'open',
      
    },
    {
      id: '4',
      customer: {
        name: 'Booking API problems',
      },
      lastMessage: {
        text: 'Bug report - Luis • Small Crafts',
        timestamp: '45m'
      },
      status: 'open',
     
    },
    {
      id: '5',
      customer: {
        name: 'Miracle',
        source: 'Exemplary Bank',
      },
      lastMessage: {
        text: 'Hey there, I\'m here to...',
        timestamp: '45m'
      },
      status: 'open',
      
    }
  ];

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-red-500', 
      'bg-green-500',
      'bg-gray-500',
      'bg-purple-500'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const getInitial = (name: string) => {
    if (name === 'Booking API problems') return '🐛';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className={`w-full flex flex-col h-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h1 className={`text-xl font-semibold mb-5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Your inbox</h1>

        <div className="flex justify-between mb-2">
            <button 
              className={`flex items-center text-sm ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
              onClick={() => {/* Handle filter */}}
            >
              {openFilter}
              <ChevronDown className="w-4 h-4" />
            </button>
            <button 
              className={`flex items-center text-sm ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
              onClick={() => {/* Handle sort */}}
            >
              {sortFilter}
              <ChevronDown className="w-4 h-4" />
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`
              flex items-start gap-3 p-2 cursor-pointer transition-colors
              ${selectedConversationId === conversation.id 
                ? (darkMode ? 'bg-gray-800 border-l-4 rounded-xl border-l-blue-400' : 'bg-blue-50 border-l-4 rounded-xl border-l-blue-500')
                : (darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100')
              }
            `}
            onClick={() => onConversationSelect(conversation.id)}
          >
            <div className="relative flex-shrink-0">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium
                ${getAvatarColor(conversation.customer.name)}
              `}>
                {getInitial(conversation.customer.name)}
              </div>
              {conversation.unreadCount && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {conversation.unreadCount}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className='flex items-center gap-2'>
                    <h3 className={`font-medium text-sm truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {conversation.customer.name}
                    </h3>
                    
                    {conversation.customer.source && (
                    <>
                        <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>•</span>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {conversation.customer.source}
                        </span>
                    </>
                    )}
                </div>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {conversation.lastMessage.timestamp}
                </span>
              </div>
              {conversation.lastMessage.text && (
                <p className={`text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {conversation.lastMessage.text}
                </p>
              )} 
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}