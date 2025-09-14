import { useFetchCompanies } from "@/app/hooks/useFetchCompanies";
import { Button, Spinner } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { SelectedCompanyAction } from "@/lib/features/Companies/SelectedCompanySlice";

export default function Companies({ id }: any) {
    const { data, error, isLoading, isSuccess } = useFetchCompanies(id ?? '');
    const router=useRouter();
    const dispatch = useDispatch();
    const GoToDetails=(regno:string,email:string)=>{
        if(!regno || !email) return;
        dispatch(SelectedCompanyAction.SetGlobalselectedcompReg({ regNo: regno.trim() }));
        dispatch(SelectedCompanyAction.SetGlobalselectedLeadEmail({ email: email.trim() }));

        router.push(`/details`);
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
                                        Company Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>

                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Reg No.
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created DateTime
                                    </th>

                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tax No.
                                    </th>

                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        VAT No.
                                    </th>

                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Logs
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data?.data.companies?.map((user: any) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                        <span className="text-gray-600 font-medium">{user.TradeName.charAt(0)}</span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.TradeName}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{user.user_email}</div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.regNo}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.last_update}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.TaxNo}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.VatNo}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <Button onClick={() => GoToDetails(user.regNo,user.user_email)} size="xs" color="yellow">view</Button>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <Button size="xs" color="dark">audit logs</Button>
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
        </div>
    );
}