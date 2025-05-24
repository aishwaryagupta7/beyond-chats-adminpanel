import { ArrowUp, User, Bot } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
  error?: {
    message: string;
  };
}

interface CopilotProps {
  // Add this prop to send text to MainChat
  onAddToComposer?: (text: string) => void;
}

const Copilot: React.FC<CopilotProps> = ({ onAddToComposer }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Read from environment variable
  const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const sendMessage = async (): Promise<void> => {
    if (!inputValue.trim()) return;

    if (!GEMINI_API_KEY) {
      alert("Please add your Gemini API key to the .env file");
      return;
    }

    console.log("API Key exists:", !!GEMINI_API_KEY);
    console.log(
      "API URL:",
      GEMINI_API_URL.replace(GEMINI_API_KEY, "HIDDEN_KEY")
    );

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: inputValue,
                },
              ],
            },
          ],
        }),
      });

      const data: GeminiResponse = await response.json();

      if (!response.ok) {
        console.error("API Error Response:", data);
        throw new Error(
          data.error?.message || `HTTP error! status: ${response.status}`
        );
      }

      if (data.candidates && data.candidates[0]) {
        const botMessage: Message = {
          id: Date.now() + 1,
          text: data.candidates[0].content.parts[0].text,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error(data.error?.message || "No response from Gemini");
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);

      let errorMessage = "Sorry, I encountered an error. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("400")) {
          errorMessage = "Invalid request. Please check your API key.";
        } else if (error.message.includes("401")) {
          errorMessage = "API key is invalid or missing permissions.";
        } else if (error.message.includes("403")) {
          errorMessage = "API key doesn't have permission to access Gemini.";
        } else if (error.message.includes("429")) {
          errorMessage = "Rate limit exceeded. Please try again later.";
        }
      }

      const errorMsg: Message = {
        id: Date.now() + 1,
        text: errorMessage,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleAddToComposer = (text: string) => {
    console.log("Add to composer:", text);
    // Call the callback function to pass the text to the parent component
    if (onAddToComposer) {
      onAddToComposer(text);
    }
  };

  return (
    <div
      className="h-full w-full flex flex-col"
      style={{
        background: "linear-gradient(to bottom right, #F6FBFA, #F0DDE4)",
      }}
    >
      {/* Chat Messages Area */}
      <div className="h-[90%] w-full p-3 overflow-y-auto">
        <div className="h-full flex flex-col space-y-4">
          {messages.length === 0 && (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <h1 className="font-semibold">Hi, I'm Fin AI Copolit </h1>
              <p className="text-sm text-gray-600">
                Ask me anything about the conversation.
              </p>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.sender === "user" ? "justify-start" : "justify-start"
              }`}
            >
              {/* Profile Picture and Name (always on left) */}
              {message.sender === "user" ? (
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <User size={16} color="white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      You
                    </span>
                  </div>
                  <div className=" ml-5 max-w-xs lg:max-w-md px-4 rounded-lg break-words">
                    <p className="text-sm whitespace-pre-wrap">
                      {message.text}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col group">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Bot size={16} color="white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Bot
                    </span>
                  </div>
                  <div
                    className="ml-7 max-w-xs lg:max-w-md px-4 py-2 rounded-lg mt-2 break-words"
                    style={{
                      background:
                        "linear-gradient(to bottom right, #C2CCF7, #EFCFD0)",
                    }}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.text}
                    </p>

                    <button
                      className="w-full bg-white text-black py-2 rounded-lg text-xs font-medium mt-3 hidden group-hover:flex transition-all duration-300 justify-center items-center"
                      onClick={() => handleAddToComposer(message.text)}
                    >
                      Add to composer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-start space-x-3 justify-start">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Bot size={16} color="white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Bot</span>
              </div>
              <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-200">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="h-[7%] w-full px-2 py-1">
        <div className="relative w-full h-full">
          <input
            type="text"
            placeholder="Ask a Question"
            value={inputValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputValue(e.target.value)
            }
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="w-full h-full pr-10 px-4 py-1 rounded-lg border text-sm border-gray-300 focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="absolute top-1/2 right-3 -translate-y-1/2 hover:bg-gray-100 rounded p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowUp
              size={20}
              color={inputValue.trim() && !isLoading ? "#3b82f6" : "#d9d9d9"}
            />
          </button>
        </div>
      </div>

      <div className="h-[3%]"></div>
    </div>
  );
};

export default Copilot;