const ApplicationTracking = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Darrell Steward</h1>
        <p className="text-green-600 font-medium">Employee synced</p>
      </div>

      {/* Time Tracking Table */}
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-b border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Time type</th>
              <th className="border-b border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Date</th>
              <th className="border-b border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Time in-out</th>
              <th className="border-b border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Duration</th>
              <th className="border-b border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Payroll account</th>
              <th className="border-b border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Project</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b border-gray-200 px-4 py-3 text-gray-700">Regular</td>
              <td className="border-b border-gray-200 px-4 py-3 text-gray-700">Nov 03, 2023</td>
              <td className="border-b border-gray-200 px-4 py-3 text-gray-700">8:38 AM - 5:38 PM</td>
              <td className="border-b border-gray-200 px-4 py-3 text-gray-700">10:20 hrs</td>
              <td className="border-b border-gray-200 px-4 py-3 text-gray-700">2000 - General labor</td>
              <td className="border-b border-gray-200 px-4 py-3 text-gray-700">Kelly Kapoor</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      <div className="mb-6">
        <p className="text-gray-700 mb-2">Payroll account totals for period</p>
        <p className="text-gray-700 mb-4">- Approved time totals by type for period</p>
      </div>

      {/* Payroll Account Totals */}
      <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-lg text-gray-800 mb-3">2000 - General labor: (10:20 hrs)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-700">Regular: <span className="font-semibold">10 hrs 20 mins</span></p>
          </div>
          <div>
            <p className="text-gray-700">Over time: <span className="font-semibold">-</span></p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-gray-700">Total: <span className="font-bold">10 hrs 20 mins</span></p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationTracking;