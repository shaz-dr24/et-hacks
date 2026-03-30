import React from 'react';

const UploadInvoice = () => {
  return (
    <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm transition-all hover:shadow-md">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4">Upload Invoice</h3>
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-300 rounded-xl cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mb-2 text-sm text-neutral-500 font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-neutral-400">PDF, JPG, PNG (MAX. 5MB)</p>
          </div>
          <input type="file" className="hidden" />
        </label>
      </div>
    </div>
  );
};

export default UploadInvoice;
