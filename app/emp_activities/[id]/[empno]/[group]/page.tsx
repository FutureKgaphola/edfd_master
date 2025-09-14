"use client";

import { withAuth } from "@/lib/withAuth";
import Layout from "../../../../components/Layout";
import { useParams } from "next/navigation";
import { Badge } from "flowbite-react";
import { HiUserCircle } from "react-icons/hi";

const Employee_activities = () => {
    const params = useParams<{ empno: string; id: string,group:string }>();
  const { id, empno,group } = params;
    return ( 
        <Layout>
              <div className="flex flex-wrap gap-3">
                      <Badge
                        icon={HiUserCircle}
                        className="w-fit text-white hover:bg-black bg-[#92981B]"
                      >
                        {"Employee Number: "+decodeURIComponent(empno)}
                      </Badge>

                      <Badge
                        icon={HiUserCircle}
                        className="w-fit text-white hover:bg-black bg-[#92981B]"
                      >
                        {"Management Group:  "+decodeURIComponent(group)}
                      </Badge>
               
                    </div>

                    <div className="mt-4 mb-4">
                        <p>Activity logs</p>
                    </div>
    
        </Layout>
     );
}
 
export default withAuth(Employee_activities);