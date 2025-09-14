import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";

// components/MetricCard.js
export default function MetricCard({ title, value, change, icon,page }:any) {

   const router=useRouter();
  const isPositive = change && change.startsWith('+');
  const isNegative = change && change.startsWith('-');

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="text-2xl">{icon}</span>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {change && (
        <div className={`px-5 py-3 ${
          isPositive ? 'bg-green-50' : isNegative ? 'bg-red-50' : 'bg-gray-50'
        }`}>
          <div className="text-sm">
            {
              (title=="Districts" || title =="Total Users") ?
               (<Button onClick={()=> {page ? router?.push(page) : {}}} size="sm" color="green" outline>manage</Button>) :null
            }
            
          </div>
        </div>
      )}
    </div>
  );
}