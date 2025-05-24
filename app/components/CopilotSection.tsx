"use client";
import React, { useState } from "react";
import Copilot from "./Copilot";
import CopilotDetails from "./CopilotDetails";

type Tab = "AI Copilot" | "Details";

interface CopilotSectionProps {
  onAddToComposer?: (text: string) => void;
}

const CopilotSection: React.FC<CopilotSectionProps> = ({ onAddToComposer }) => {
  const [selectedTab, setSelectedTab] = useState<Tab>("AI Copilot");

  return (
    <div className="h-full w-full flex flex-col">
      {/* Tab Buttons */}
      <div className="w-full px-2 py-3 text-sm flex gap-4 border-b-2 border-gray-300">
        <button
          className={`font-semibold ${
            selectedTab === "AI Copilot" ? " text-purple-700" : " text-gray-600"
          }`}
          onClick={() => setSelectedTab("AI Copilot")}
        >
          AI Copilot
        </button>
        <button
          className={`font-semibold ${
            selectedTab === "Details" ? " text-purple-700" : " text-gray-600"
          }`}
          onClick={() => setSelectedTab("Details")}
        >
          Details
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-grow overflow-hidden">
        {selectedTab === "AI Copilot" && <Copilot onAddToComposer={onAddToComposer} />}
        {selectedTab === "Details" && <CopilotDetails />}
      </div>
    </div>
  );
};

export default CopilotSection;