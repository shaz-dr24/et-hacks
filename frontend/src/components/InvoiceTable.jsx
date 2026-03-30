import React from 'react';

const InvoiceTable = () => {
  const invoices = [
    { id: 101, client: 'Acme Corp', amount: '$1,200', status: 'Paid', date: '2024-03-10' },
    { id: 102, client: 'Globex', amount: '$3,500', status: 'Unpaid', date: '2024-03-15' },
    { id: 103, client: 'Initech', amount: '$800', status: 'Draft', date: '2024-03-18' },
  ];

  return (
    <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm transition-all hover:shadow-md h-full">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4">Invoice Summary</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="py-3 px-2 text-sm font-semibold text-neutral-600">ID</th>
              <th className="py-3 px-2 text-sm font-semibold text-neutral-600">Client</th>
              <th className="py-3 px-2 text-sm font-semibold text-neutral-600">Amount</th>
              <th className="py-3 px-2 text-sm font-semibold text-neutral-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((item) => (
              <tr key={item.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                <td className="py-3 px-2 text-sm text-neutral-500 font-mono">#{item.id}</td>
                <td className="py-3 px-2 text-sm text-neutral-700 font-medium">{item.client}</td>
                <td className="py-3 px-2 text-sm text-neutral-700">{item.amount}</td>
                <td className="py-3 px-2 text-sm font-semibold">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    item.status === 'Paid' ? 'text-green-600' :
                    item.status === 'Unpaid' ? 'text-orange-600' :
                    'text-neutral-500'
                  }`}>
                    ● {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceTable;
