'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, X, Zap, Paperclip, Smile, Send, ChevronDown, MessageSquareText, Moon, Sun } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isFromCustomer: boolean;
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
}

interface MainChatProps {
  conversationId: string;
  customerName?: string;
  onClose?: () => void;
  darkMode?: boolean;
  onDarkModeToggle?: (isDark: boolean) => void;
  // Add this prop to receive text from Copilot
  copilotText?: string;
  onCopilotTextUsed?: () => void; // Callback to clear the text after use
}

// Individual dummy chats for each conversation
const conversationChats: Record<string, Message[]> = {
  "1": [
    {
      id: '1',
      text: 'Hey! I have a question about the GitHub integration. Is it possible to sync multiple repositories at once?',
      isFromCustomer: true,
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      status: 'read'
    },
    {
      id: '2',
      text: 'Hi Luis! I\'ll get back to you with an answer shortly. Thanks for your patience!',
      isFromCustomer: false,
      timestamp: new Date(Date.now() - 40 * 60 * 1000),
      status: 'read'
    },
    {
      id: '3',
      text: 'That would be great, thank you!',
      isFromCustomer: true,
      timestamp: new Date(Date.now() - 35 * 60 * 1000),
      status: 'read'
    }
  ],
  "2": [
    {
      id: '1',
      text: 'Hi there, I have a question about our Nike partnership integration.',
      isFromCustomer: true,
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'read'
    },
    {
      id: '2',
      text: 'Hello Ivan! I\'d be happy to help with your Nike integration questions. What specific aspect would you like to discuss?',
      isFromCustomer: false,
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      status: 'read'
    },
    {
      id: '3',
      text: 'We\'re having trouble with the product catalog sync. Some items aren\'t appearing correctly.',
      isFromCustomer: true,
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      status: 'read'
    }
  ],
  "3": [
    {
      id: '1',
      text: 'Good morning, let me introduce myself. I\'m reaching out from New York regarding a potential partnership.',
      isFromCustomer: true,
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      status: 'read'
    },
    {
      id: '2',
      text: 'Good morning! Thank you for reaching out. I\'d love to learn more about this partnership opportunity.',
      isFromCustomer: false,
      timestamp: new Date(Date.now() - 40 * 60 * 1000),
      status: 'read'
    }
  ],
  "4": [
    {
      id: '1',
      text: 'Bug report - Luis • Small Crafts: The booking API is returning 500 errors intermittently.',
      isFromCustomer: true,
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      status: 'read'
    },
    {
      id: '2',
      text: 'Thanks for the bug report! I\'m looking into the 500 errors right away. Can you provide more details about when these occur?',
      isFromCustomer: false,
      timestamp: new Date(Date.now() - 40 * 60 * 1000),
      status: 'read'
    },
    {
      id: '3',
      text: 'It seems to happen most frequently during peak hours, around 2-4 PM EST.',
      isFromCustomer: true,
      timestamp: new Date(Date.now() - 35 * 60 * 1000),
      status: 'read'
    }
  ],
  "5": [
    {
      id: '1',
      text: 'Hey there, I\'m here to discuss the banking integration features for our Exemplary Bank partnership.',
      isFromCustomer: true,
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      status: 'read'
    },
    {
      id: '2',
      text: 'Hello Miracle! Great to hear from Exemplary Bank. What banking features are you most interested in implementing?',
      isFromCustomer: false,
      timestamp: new Date(Date.now() - 40 * 60 * 1000),
      status: 'read'
    }
  ]
};

export default function MainChat({ 
  conversationId, 
  customerName = "Customer", 
  onClose, 
  darkMode: propDarkMode = false,
  onDarkModeToggle,
  copilotText,
  onCopilotTextUsed
}: MainChatProps) {
  const [messages, setMessages] = useState<Message[]>(conversationChats[conversationId] || []);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [internalDarkMode, setInternalDarkMode] = useState(propDarkMode);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const darkMode = onDarkModeToggle ? propDarkMode : internalDarkMode;

  // Effect to handle copilot text
  useEffect(() => {
    if (copilotText) {
      setInputText(copilotText);
      // Focus the textarea for better UX
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
      // Call the callback to clear the copilot text
      if (onCopilotTextUsed) {
        onCopilotTextUsed();
      }
    }
  }, [copilotText, onCopilotTextUsed]);

  useEffect(() => {
    setMessages(conversationChats[conversationId] || []);
  }, [conversationId]);

  useEffect(() => {
    if (messagesContainerRef.current && messagesEndRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputText]);

  const handleDarkModeToggle = () => {
    if (onDarkModeToggle) {
      onDarkModeToggle(!darkMode);
    } else {
      setInternalDarkMode(!internalDarkMode);
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isFromCustomer: false,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

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
    <div className={`flex flex-col h-full ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b flex items-center justify-between ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium
            ${getAvatarColor(customerName)}
          `}>
            {getInitial(customerName)}
          </div>
          <h1 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{customerName}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <MoreHorizontal className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
          <button 
            onClick={handleDarkModeToggle}
            className={`p-2 rounded-lg transition-colors ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-700'
            }`}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button 
            onClick={onClose}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              darkMode 
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            <X className="w-4 h-4" />
            Close
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isFromCustomer ? 'justify-start' : 'justify-end'}`}>
            <div className={`flex gap-3 max-w-[70%] ${message.isFromCustomer ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-medium ${
                message.isFromCustomer ? getAvatarColor(customerName) : 'bg-gray-700'
              }`}>
                {message.isFromCustomer ? getInitial(customerName) : 'A'}
              </div>
              
              <div className="flex flex-col gap-1">
                <div className={`rounded-2xl px-4 py-3 ${
                  message.isFromCustomer 
                    ? (darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 border border-gray-200 text-gray-900')
                    : (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500/50 text-black')
                }`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
            
                <div className={`flex items-center gap-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} ${
                  message.isFromCustomer ? 'justify-start' : 'justify-end'
                }`}>
                  <span>{formatTime(message.timestamp)}</span>
                  {!message.isFromCustomer && message.status && (
                    <span className="capitalize">{message.status}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`border-t px-6 py-4 ${darkMode ? 'bg-gray-900 border-gray-700 rounded-xl' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <MessageSquareText className="w-4 h-4"/>
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Chat</span>
            <ChevronDown className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Use ⌘K for shortcuts</span>
        </div>

        <div className="flex items-end gap-3">
          <div className="flex gap-2">
            <button className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
              <Zap className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
            <button className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
              <Paperclip className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
            <button className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
              <Smile className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </div>

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className={`w-full resize-none border rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px] max-h-32 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
              rows={1}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className={`p-2 rounded-lg transition-colors ${
                inputText.trim() 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : (darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed')
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}