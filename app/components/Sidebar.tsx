// components/Sidebar.js

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IoStatsChartSharp } from "react-icons/io5";
import { FaUsersGear } from "react-icons/fa6";


const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: IoStatsChartSharp },
  { name: 'Users', href: '/users', icon: FaUsersGear },
]

export default function Sidebar({ sidebarOpen, setSidebarOpen }:any) {
  const router = useRouter();

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
            </div>
            <nav className="flex flex-col mt-5 px-2 space-y-1">
              {navigation.map((item,index:number) => (
               <div key={index} className='flex gap-1 w-fit items-center bg-[#92981B] rounded-md text-white p-2'>
                <item.icon color="white" />
                 <Link className='text-sm' key={item.name} href={item.href}>

                   {item.name}
                </Link>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-col md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
            </div>
            <nav className="mt-5 flex flex-col px-2 bg-white space-y-1">
              {navigation.map((item,index:number) => (
                <div key={index} className='flex gap-1 w-fit items-center bg-[#92981B] rounded-md text-white p-2'>
                <item.icon color="white" />
                 <Link className='text-sm' key={item.name} href={item.href}>

                   {item.name}
                </Link>
                </div>
               
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}