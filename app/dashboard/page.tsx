"use client";

import { withAuth } from "@/lib/withAuth";
import Layout from "@/app/components/Layout";
import MetricCard from "@/app/components/MetricCard";
import { useDistricts } from "../hooks/useDistricts";
import { useDomReady } from "../hooks/useDomReady";
import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa6";
import { LuListChecks, LuListX } from "react-icons/lu";
import { LiaSitemapSolid } from "react-icons/lia";

const Dashboard = () => {

  const {data}=useDistricts();

  const isDomready=useDomReady();

  if(!isDomready){
    return (<Spinner color="success" aria-label="Success spinner example" />);
  }
 
  const [metrics, setMetrics] =useState([
    { title: "Total Users", value: "2,456", change: "+12%", icon:<FaUsers />, page: 'users' },
    { title: "Loan Rejections", value: "432", change: "+5%", icon:<LuListX />, page: '' },
    { title: "Loan Approvals", value: "32", change: "-2%", icon: <LuListChecks />, page: '' },
    { title: "Districts", value: data?.data?.Districts.length ?? "0", change: "-2%", icon: <LiaSitemapSolid />, page: 'districts' },
  ]);

  useEffect(() => {
    setMetrics(prev =>
      prev.map(metric =>
        metric.title === "Districts"
          ? { ...metric, value: data?.data?.Districts.length ?? "0" }
          : metric
      )
    );
  }, [data]);

  

  return (
    <Layout>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics?.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            <li className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-indigo-600 truncate">
                  New user registered
                </p>
                <div className="ml-2 flex-shrink-0 flex">
                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Today
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    John Doe joined the platform
                  </p>
                </div>
              </div>
            </li>
            <li className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-indigo-600 truncate">
                  Order completed
                </p>
                <div className="ml-2 flex-shrink-0 flex">
                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    2h ago
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    Order #1234 has been completed
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(Dashboard);
