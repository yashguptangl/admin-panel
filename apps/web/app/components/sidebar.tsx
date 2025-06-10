"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUsers, FaUserTie, FaHome } from "react-icons/fa";

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const navigateTo = (path : string) => {
    router.push(path);
  };

  return (
    <div className="w-56 h-screen bg-gray-900 text-white p-4 flex flex-col text-center">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

      {/* Users */}
      <div>
        <button
          className="flex items-center w-full p-2 hover:bg-gray-700 rounded"
          onClick={() => navigateTo("/user")}
        >
          <FaUsers className="mr-2" /> Users
        </button>
      </div>

      <div className="mt-4">
        <button
          className="flex items-center w-full p-2 hover:bg-gray-700 rounded"
          onClick={() => navigateTo("owner")}

        >
          <FaUsers className="mr-2" /> Owners
        </button>
      </div>

      {/* Agents */}
      <div className="mt-4">
        <button
          className="flex items-center w-full p-2 hover:bg-gray-700 rounded"
          onClick={() => toggleMenu("agents")}
        >
          <FaUserTie className="mr-2" /> Agents
        </button>
        {openMenus["agents"] && (
          <div className="ml-6">
            <button
              className="block w-full p-2 text-sm hover:bg-gray-700 rounded"
              onClick={() => navigateTo("/agents-verified")}
            >
              Verified
            </button>
            <button
              className="block w-full p-2 text-sm hover:bg-gray-700 rounded"
              onClick={() => navigateTo("/agents-notverified")}
            >
              Not Verified
            </button>
          </div>
        )}
      </div>

      {/* Owners */}
      <div className="mt-4">
        <button
          className="flex items-center w-full p-2 hover:bg-gray-700 rounded"
          onClick={() => toggleMenu("property")}
        >
          <FaHome className="mr-2" /> Verification
        </button>
        {openMenus["property"] && (
          <div className="ml-6">
            <button
              className="block w-full p-2 text-sm hover:bg-gray-700 rounded"
              onClick={() => navigateTo("/self-verification")}
            >
               Self Verification
            </button>
            <button
              className="block w-full p-2 text-sm hover:bg-gray-700 rounded"
              onClick={() => navigateTo("/agent-verification")}
            >
                Agent Verification
            </button>
          </div>
        )}
      </div>
      <div className="mt-4">
        <button
          className="flex items-center w-full p-2 hover:bg-gray-700 rounded"
          onClick={() => toggleMenu("not-verified-property")}
        >
          <FaHome className="mr-2" /> Not Verified Property
        </button>
        {openMenus["not-verified-property"] && (
          <div className="ml-6">
            <button
              className="block w-full p-2 text-sm hover:bg-gray-700 rounded"
              onClick={() => navigateTo("/not-verified-flat")}
            >
              Not Verified Flat  
            </button>
            <button
              className="block w-full p-2 text-sm hover:bg-gray-700 rounded"
              onClick={() => navigateTo("/not-verified-pg")}
            >
              Not Verified PG
            </button>
            <button
              className="block w-full p-2 text-sm hover:bg-gray-700 rounded"
              onClick={() => navigateTo("/not-verified-room")}
            >
              Not Verified Room
            </button>
            <button
              className="block w-full p-2 text-sm hover:bg-gray-700 rounded"
              onClick={() => navigateTo("/not-verified-hourlyroom")}
            >
              Not Verified Hourly Room
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
