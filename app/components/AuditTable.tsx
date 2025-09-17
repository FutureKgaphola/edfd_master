"use client";

import { useEffect, useState } from "react";

interface AuditRecord {
  AuditID: number;
  ApplicationID: number;
  ActionType: string;
  OldValues: string | null;
  NewValues: string | null;
  ActionDate: string;
  ActionUser: string | null;
}

export default function AuditTable({ applicationId }: { applicationId: number }) {
  const [data, setData] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Filters
  const [actionType, setActionType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (actionType) query.append("actionType", actionType);
      if (startDate) query.append("startDate", startDate);
      if (endDate) query.append("endDate", endDate);

      const res = await fetch(`/api/companies/audit/?applicationId=${applicationId}?${query.toString()}`);
      const json = await res.json();
      setData(json.data);
    } catch (err) {
      console.error("Error fetching audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [applicationId, page, actionType, startDate, endDate]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Audit Logs</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={actionType}
          onChange={(e) => {
            setPage(1);
            setActionType(e.target.value);
          }}
          className="border rounded px-3 py-2"
        >
          <option value="">All Actions</option>
          <option value="INSERT">INSERT</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => {
            setPage(1);
            setStartDate(e.target.value);
          }}
          className="border rounded px-3 py-2"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => {
            setPage(1);
            setEndDate(e.target.value);
          }}
          className="border rounded px-3 py-2"
        />

        <button
          onClick={() => {
            setStartDate("");
            setEndDate("");
            setActionType("");
            setPage(1);
          }}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Reset
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-500">No audit logs found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2">Action</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Old Values</th>
                <th className="px-4 py-2">New Values</th>
              </tr>
            </thead>
            <tbody>
              {data.map((log) => (
                <tr key={log.AuditID} className="border-t">
                  <td className="px-4 py-2 font-medium">{log.ActionType}</td>
                  <td className="px-4 py-2">{log.ActionUser || "System"}</td>
                  <td className="px-4 py-2">
                    {new Date(log.ActionDate).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 whitespace-pre-wrap text-xs text-red-600">
                    {log.OldValues || "-"}
                  </td>
                  <td className="px-4 py-2 whitespace-pre-wrap text-xs text-green-600">
                    {log.NewValues || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">Page {page}</span>
        <button
          className="px-3 py-1 bg-gray-200 rounded"
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
