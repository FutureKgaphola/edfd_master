import Link from "next/link";
import { useClients } from "../hooks/useClients";
import { useAccountDeactivator } from "../hooks/useAccountDeactivator";

export default function ClientTable({ users }: any) {
  const { data, error, isLoading, isSuccess } = useClients();

  const { Deactivate, Activate, loading } = useAccountDeactivator();
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
                    Email
                  </th>

                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.data.clients?.map((user: any,index:number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">{user.first_name.charAt(0)}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.first_name + " " + user.last_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.user_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.active == '1' ? 'bg-green-100 text-green-800' :
                          user.active == '0' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>

                        {user.active == '1' ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.create_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link className="text-indigo-600 hover:text-indigo-900 mr-3" href={`/client_activities/${encodeURIComponent(user.first_name + " " + user.last_name)}/${encodeURIComponent(user.user_email)}`}>Account/Activities</Link>
                      {
                        user.active == '1' ? <button onClick={() => Deactivate(user.id, "LeadContact", "clients")} className="text-red-600 hover:text-red-900">Deactivate</button> :
                          <button onClick={() => Activate(user.id, "LeadContact", "clients")} className="text-green-900 hover:text-green-900">Activate</button>
                      }

                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="text-center">{loading && "processing request...."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}