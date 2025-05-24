import { ChevronDown, Plus, Users } from "lucide-react";
import React from "react";

const CopilotDetails = () => {
  return (
    <>
      <div className="h-full full bg-[#e6e6e6]">
        <div className=" border-b-2 border-gray-300  p-5">
          <div className="w-full flex gap-12 items-center">
            <h1 className="w-1/4">Assignee</h1>
            <h1 className="font-semibold">Brian Bryne</h1>
          </div>
          <div className="w-full flex gap-12 items-center mt-3">
            <h1 className="w-1/4">Team</h1>
            <div className="flex gap-2 items-center">
              <Users size={16} strokeWidth={2.75} />
              <h1 className="font-semibold">Unassigned</h1>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-b-2 border-gray-300">
          <div className="w-full flex justify-between items-center mb-7">
            <h1 className=" font-semibold">LINKS</h1>
            <ChevronDown />
          </div>

          <div className="w-full flex justify-between items-center my-4">
            <h1 className="text-md">Tracker Ticket</h1>
            <div className="h-7 w-7 bg-gray-300 rounded-lg flex justify-center items-center">
              <Plus size={20} strokeWidth={2.75} />
            </div>
          </div>

          <div className="w-full flex justify-between items-center my-4">
            <h1 className="text-md">Back Office Tickets</h1>
            <div className="h-7 w-7 bg-gray-300 rounded-lg flex justify-center items-center">
              <Plus size={20} strokeWidth={2.75} />
            </div>
          </div>

          <div className="w-full flex justify-between items-center my-4">
            <h1 className="text-md">Side Conversations</h1>
            <div className="h-7 w-7 bg-gray-300 rounded-lg flex justify-center items-center">
              <Plus size={20} strokeWidth={2.75} />
            </div>
          </div>
        </div>

        <div className="p-5 border-b-2 border-gray-300">
          <div className="w-full flex justify-between items-center">
            <h1 className="text-md font-semibold">USER DATA</h1>
            <ChevronDown />
          </div>
        </div>

        <div className="p-5 border-b-2 border-gray-300">
          <div className="w-full flex justify-between items-center">
            <h1 className="text-md font-semibold">CONVERSATION ATTRIBUTES</h1>
            <ChevronDown />
          </div>
        </div>

        <div className="p-5 border-b-2 border-gray-300">
          <div className="w-full flex justify-between items-center">
            <h1 className="text-md font-semibold">COMPANY DETAILS</h1>
            <ChevronDown />
          </div>
        </div>
      </div>
    </>
  );
};

export default CopilotDetails;