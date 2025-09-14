import { CiLogout } from "react-icons/ci";
import { useSignout } from "../hooks/useSignout";

export default function Header({ setSidebarOpen }:any) {
  const logout=useSignout();
  return (
    <div className="bg-white shadow">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              {/* Menu icon */}
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
            <div className="flex-shrink-0 flex items-center ml-4">
              <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
            </div>
          </div>
          <div className="flex items-center">
            <div className="ml-3 relative">
              <div className="flex gap-2">
                <CiLogout onClick={()=>logout?.handleSigOut()} className="h-7 w-7 m-2 hover:cursor-pointer" />
                <button className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">A</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}