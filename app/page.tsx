"use client";
import { useState } from "react";
import InboxSidebar from "./components/InboxSidebar";
import MainChat from "./components/MainChat";
import CopilotSection from "./components/CopilotSection";

export default function Home() {
  const [selectedConversationId, setSelectedConversationId] = useState<string>("1");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [copilotText, setCopilotText] = useState<string>('');
  
  const customerMap = {
    "1": { name: "Luis", email: "luis@example.com" },
    "2": { name: "Ivan", email: "ivan@nike.com" },
    "3": { name: "Lead from New York", email: "lead@newyork.com" },
    "4": { name: "Booking API problems", email: "support@smallcrafts.com" },
    "5": { name: "Miracle", email: "miracle@bank.com" }
  };
  
  const selectedCustomer = customerMap[selectedConversationId as keyof typeof customerMap];
  
  const handleCopilotTextUsed = () => {
    setCopilotText('');
  };


  const handleAddToComposer = (text: string) => {
    setCopilotText(text);
  };

  return (
    <div className={` h-full flex flex-col md:flex-row overflow-hidden p-2 gap-2 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-200'
    }`}>
      <div className={` rounded-xl  p-3 w-full md:w-1/5 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <InboxSidebar 
          selectedConversationId={selectedConversationId}
          onConversationSelect={setSelectedConversationId}
          darkMode={darkMode}
        />
      </div>

      <div className={`flex-1 flex flex-col p-3 rounded-xl  w-full ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {selectedConversationId ? (
          <MainChat 
            conversationId={selectedConversationId}
            customerName={selectedCustomer?.name || "Customer"}
            onClose={() => setSelectedConversationId("")}
            darkMode={darkMode}
            onDarkModeToggle={setDarkMode}
            copilotText={copilotText}
            onCopilotTextUsed={handleCopilotTextUsed}
          />
        ) : (
          <div className={`flex-1 flex  items-center justify-center ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
              <p>Choose a conversation from the inbox to start chatting</p>
            </div>
          </div>
        )}
      </div>

      <div className={` w-full md:w-1/4 rounded-xl ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <CopilotSection onAddToComposer={handleAddToComposer} />
      </div>
    </div>
  );
}