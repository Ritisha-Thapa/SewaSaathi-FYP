import React from 'react';
import { Download } from 'lucide-react';
import { earningsHistory, providerStats } from '../../data/providerMockData';

const Earnings = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1B3C53]">Earnings & Payments</h2>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
           <Download size={16} /> Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1B3C53] text-white p-6 rounded-xl shadow-lg">
           <p className="text-blue-200 text-sm font-medium">Total Lifetime Earnings</p>
           <h3 className="text-3xl font-bold mt-2">Rs. {providerStats.totalEarnings.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <p className="text-gray-500 text-sm font-medium">This Month</p>
           <h3 className="text-3xl font-bold mt-2 text-green-600">Rs. 45,000</h3>
        </div>
        {/* <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <p className="text-gray-500 text-sm font-medium">Insurance Deductions (1%)</p>
           <h3 className="text-3xl font-bold mt-2 text-red-500">Rs. 450</h3>
        </div> */}
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-[#1B3C53] mb-4">Transaction History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
             <thead className="bg-gray-50 uppercase text-xs font-semibold text-gray-500">
                <tr>
                   <th className="px-4 py-3">Date</th>
                   <th className="px-4 py-3">Transaction ID</th>
                   <th className="px-4 py-3">Service</th>
                   <th className="px-4 py-3">Method</th>
                   <th className="px-4 py-3 text-right">Job Amount</th>
                   {/* <th className="px-4 py-3 text-right">Deduction (1%)</th> */}
                   <th className="px-4 py-3 text-right">Net Earning</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-100 text-sm">
                {earningsHistory.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{txn.date}</td>
                    <td className="px-4 py-3 font-mono text-gray-500">{txn.id}</td>
                    <td className="px-4 py-3 text-[#1B3C53] font-medium">{txn.service}</td>
                    <td className="px-4 py-3">
                       <span className={`px-2 py-0.5 rounded text-xs ${
                          txn.method === 'Online' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                       }`}>
                          {txn.method}
                       </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-800">Rs. {txn.amount}</td>
                    {/* <td className="px-4 py-3 text-right text-red-500">- Rs. {txn.deduction}</td> */}
                    <td className="px-4 py-3 text-right font-bold text-green-600">Rs. {txn.finalAmount}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Earnings;
