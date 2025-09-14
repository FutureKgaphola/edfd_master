import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button, Spinner } from "flowbite-react";
import { useState } from "react";

// components/UserTable.js
export default function DistrictHistoryTable({ users }:any) {

   const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleRevive=async(id:string)=>{
    setMessage("");
    if(!id) return;
    
    try {
      setLoading(true);
      const resp = await axios.put("/api/District/revive", { id: id });
      if (resp.status == 201 || resp.status == 200) {
        setMessage("District Revived successfully");
        setLoading(false);
        queryClient.invalidateQueries({ queryKey: ["Districts"] });

        setTimeout(() => {
          setMessage("");
          
        }, 2000);
      }
    } catch (error: any) {
      setLoading(false);
      console.error("Error creating district:", error);
      setMessage(
        "Error reviving district: " +
          (error?.response?.data?.message || error.message || "Unknown error")
      );
    }
  }
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DateTime deleted
                  </th>

                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DateTime created
                  </th>

                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users?.map((user:any) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">{user.districtName.charAt(0)}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.districtName}</div>
                        </div>
                      </div>
                    </td>
                    
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status == '1' ? 'bg-green-100 text-green-800' : 
                        user.status == '0' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.status===1 ? "active" : "deleted"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.DateTimeDeleted}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.DateTimeChanges}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                       <Button disabled={loading} onClick={()=>handleRevive(user.id)} size="xs" color="yellow">revive</Button>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>

            {
              users?.length==0 && <div className="flex justify-center">
            <p>No deleted Districts found</p>
            </div>
            }

            {
              loading && <div className="flex justify-center">
              <Spinner size="sm" aria-label="Info spinner example" className="me-3" light />
            <p>Executing request...</p>
            </div>
            }

            {
              message && <div className="flex justify-center">
            <p>{message}</p>
            </div>
            }

            
          </div>
        </div>
      </div>
    </div>
  );
}