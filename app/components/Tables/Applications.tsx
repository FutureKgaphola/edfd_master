import useApplications from "@/app/hooks/useApplications";
import { useFetchCompanies } from "@/app/hooks/useFetchCompanies";
import { Button, Spinner } from "flowbite-react";
import Link from "next/link";
import { useState } from "react";
import { Messages } from "../Modals/Messages";
import { getManager } from "@/app/services/Find_manger_by_id";
import { ManagerModal } from "../Modals/ManagerModal";
import { useRouter } from "next/navigation";


export default function Applications({ id }: any) {
    const { data, error, isLoading } = useApplications(id ?? '');
    const [openModal, setOpenModal] = useState(false);
    const [open_manager_Modal, setOpen_manager_Modal] = useState(false);
    const [ManagerObject, setManagerObject] = useState({});
    const [titleMessage, set_titleMessage] = useState({
        tittle: "",
        message: ""
    });

    const HandleShowManagerDetails = async (id: string) => {
        const resp = await getManager(id);
        //console.log(resp);
        setManagerObject(resp);
        setOpen_manager_Modal(true);
    }

    const router = useRouter();
    return (
        <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Company Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created DateTime
                                    </th>

                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type of Loan
                                    </th>

                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>

                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Outcome
                                    </th>

                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Manager
                                    </th>

                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stage
                                    </th>

                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Recom
                                    </th>

                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Logs
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data?.applications?.map((user: any) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                        <span className="text-gray-600 font-medium">{user.companyName.charAt(0)}</span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.companyName}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{user.user_email}</div>
                                        </td>


                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.last_update}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.loanDocs}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.status}
                                        </td>

                                        {
                                            user.outcome == "Rejected" ? (<td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                                {user.outcome}
                                            </td>) : <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.outcome}
                                            </td>
                                        }


                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {/* {user.managerId} */}
                                            <Button onClick={() => { HandleShowManagerDetails(user.managerId) }} size="xs" color="yellow">view</Button>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <Button onClick={() => {
                                                set_titleMessage({
                                                    tittle: "Stage",
                                                    message: user.message
                                                });
                                                setOpenModal(true);
                                            }} size="xs" color="yellow">view</Button>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <Button onClick={() => {
                                                set_titleMessage({
                                                    tittle: "Recommendations",
                                                    message: user.recommendation
                                                });
                                                setOpenModal(true);
                                            }} size="xs" color="yellow">view</Button>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <Button onClick={() => router.push(`/audit/${user.id}`)} size="xs" color="dark">audit logs</Button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {
                            isLoading && <div className="flex justify-center">
                                <Spinner size="sm" aria-label="Info spinner example" className="me-3" light />
                                <p>Executing request...</p>
                            </div>
                        }

                        {
                            !isLoading && !data && <div className="flex justify-center">
                                <p>No data found.</p>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <ManagerModal ManagerObject={ManagerObject} open_manager_Modal={open_manager_Modal} setManagerObject={setManagerObject} setOpen_manager_Modal={setOpen_manager_Modal} />
            <Messages openModal={openModal} setOpenModal={setOpenModal} message={titleMessage.message} title={titleMessage.tittle} />
        </div>
    );
}