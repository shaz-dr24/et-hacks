import React, { useState } from 'react';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  ExternalLink,
  ShieldCheck,
  Building2,
  Hash,
  AlertCircle,
  Search,
  TrendingUp,
  Download,
  Share2,
  Loader2,
  CheckCircle2
} from 'lucide-react';

import UploadCard from '../components/UploadCard';
import { pageVariants } from '../animations/pageTransitions';

const Invoice = () => {
  const [invoice, setInvoice] = useState(null);
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleUploadSuccess = async (file) => {
    setUploading(true);
    setError(null);
    try {
      const result = await api.uploadInvoice(file);
      // Map backend response fields to display shape
      const data = result.data || result;
      setInvoice({
        vendor: data.vendor_name || data.vendor || 'Unknown Vendor',
        amount: data.total_amount != null
          ? `$${Number(data.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
          : data.amount || 'N/A',
        number: data.invoice_number || data.number || 'N/A',
        date: data.invoice_date || data.date || 'N/A',
        status: data.status || 'pending',
        taxId: data.tax_id || data.taxId || 'N/A',
        lineItems: Array.isArray(data.line_items) && data.line_items.length > 0
          ? data.line_items.map(item => ({
              desc: item.description || item.desc || item.item || 'Item',
              qty: item.quantity ?? item.qty ?? 1,
              price: item.amount != null
                ? `$${Number(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                : item.price || 'N/A'
            }))
          : [{ desc: 'See invoice document', qty: 1, price: data.total_amount != null ? `$${Number(data.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'N/A' }]
      });
    } catch (err) {
      setError(err.message || 'Failed to process invoice. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleApprove = () => {
    setApproving(true);
    setTimeout(() => {
      setApproving(false);
      setApproved(true);
      setInvoice(prev => ({ ...prev, status: 'approved' }));
    }, 2000);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-8 max-w-6xl mx-auto space-y-12"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
        <div className="flex items-center gap-6">
           <motion.div 
            initial={{ rotate: 10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="p-5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-[2rem] text-white shadow-xl shadow-emerald-500/30 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <DollarSign className="w-10 h-10 relative z-10" />
          </motion.div>
          <div>
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 tracking-tight leading-tight">Finance Automations</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg mt-1">Extract, validate, and approve invoices with AI precision.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-sm text-red-700 dark:text-red-400 font-medium"
            >
              ⚠️ {error}
            </motion.div>
          )}
          <motion.div 
            whileHover={{ y: -4, scale: 1.01 }}
            className="p-8 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-white/5 rounded-[2.5rem] shadow-xl hover:shadow-2xl dark:shadow-none hover:shadow-emerald-500/10 backdrop-blur-xl transition-all duration-300 relative overflow-hidden"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 relative z-10">Ingest Invoice</h3>
            
            <div className="relative z-10">
              <UploadCard 
                onSuccess={handleUploadSuccess}
                title="Drag invoice here"
                description="PDF, JPG, or PNG formats"
                accept="image/*,.pdf"
              />
            </div>
            {uploading && (
              <div className="mt-4 text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Processing with AI pipeline...
              </div>
            )}
          </motion.div>

          {/* Security Banner */}
          <motion.div 
             whileHover={{ scale: 1.02 }}
             className="p-8 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-[2.5rem] space-y-4 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white dark:bg-emerald-500/20 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-500/30">
                <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
              </div>
              <h4 className="font-extrabold text-gray-900 dark:text-white text-base">Security Verified</h4>
            </div>
            <p className="text-sm text-emerald-800/80 dark:text-emerald-200 font-medium leading-relaxed">
              Every uploaded document is automatically scanned for fraudulent markers and cross-referenced with your approved vendor ledger.
            </p>
          </motion.div>
        </div>

        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {!invoice ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full flex flex-col items-center justify-center py-32 bg-gray-50/50 dark:bg-gray-800/20 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[3rem] text-gray-400 dark:text-gray-500 shadow-inner"
              >
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                  <Search className="w-16 h-16 mb-6 opacity-30" />
                </motion.div>
                <p className="text-xl font-bold tracking-tight">Awaiting source document</p>
                <p className="text-sm font-medium mt-2">Upload an invoice to see extracted data here.</p>
              </motion.div>
            ) : (
              <motion.div 
                key="data"
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-white/10 rounded-[3rem] shadow-2xl dark:shadow-[0_20px_60px_rgb(0,0,0,0.3)] backdrop-blur-xl relative overflow-hidden"
              >
                {/* Glow effect for approved state */}
                {approved && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-green-500/5 dark:bg-green-500/10 pointer-events-none z-0 mix-blend-multiply dark:mix-blend-screen" 
                  />
                )}
                
                <div className="p-10 border-b border-gray-100 dark:border-white/5 flex justify-between items-start relative z-10">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700/50 rounded-2xl flex items-center justify-center border border-gray-200 dark:border-gray-600 shadow-sm">
                        <Building2 className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2 group cursor-pointer transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                          {invoice.vendor}
                          <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                        </h3>
                        <p className="text-sm font-bold text-gray-500 mt-1 uppercase tracking-widest">Tax ID: {invoice.taxId}</p>
                      </div>
                    </div>
                  </div>
                  <motion.div 
                     animate={invoice.status === 'pending' ? { scale: [1, 1.05, 1] } : {}}
                     transition={{ duration: 2, repeat: Infinity }}
                     className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest border shadow-xl flex items-center gap-2 ${
                    invoice.status === 'approved' 
                       ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20 shadow-green-500/10' 
                       : 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-200 dark:border-yellow-500/20 shadow-yellow-500/10'
                  }`}>
                    {invoice.status === 'approved' && <CheckCircle2 className="w-4 h-4" />}
                    {invoice.status}
                  </motion.div>
                </div>

                <div className="p-10 grid grid-cols-2 gap-10 bg-gray-50/50 dark:bg-gray-900/40 relative z-10 border-b border-gray-100 dark:border-white/5">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
                        <Hash className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-500 uppercase font-black tracking-widest mb-1">Invoice #</p>
                        <p className="text-base font-bold text-gray-900 dark:text-gray-100 font-mono">{invoice.number}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
                        <AlertCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-500 uppercase font-black tracking-widest mb-1">Due Date</p>
                        <p className="text-base font-bold text-orange-600 dark:text-orange-500">Net 30 (In 5 days)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-10 space-y-8 relative z-10">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[11px] text-gray-500 uppercase font-black tracking-widest border-b-2 border-gray-100 dark:border-white/10">
                        <th className="pb-4">Description</th>
                        <th className="pb-4 text-center">QTY</th>
                        <th className="pb-4 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="text-base font-medium">
                      {invoice.lineItems.map((item, i) => (
                        <tr key={i} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                          <td className="py-5 text-gray-800 dark:text-gray-200">{item.desc}</td>
                          <td className="py-5 text-center text-gray-500">{item.qty}</td>
                          <td className="py-5 text-right font-bold font-mono text-gray-900 dark:text-white">{item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex flex-col items-end pt-6 space-y-3">
                    <div className="flex justify-between w-64 text-base font-bold">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="text-gray-700 dark:text-gray-300 font-mono">{invoice.amount}</span>
                    </div>
                    <div className="w-64 h-[2px] bg-gray-200 dark:bg-white/10" />
                    <div className="flex justify-between w-64 text-2xl font-black">
                      <span className="text-gray-900 dark:text-white">Amount Due</span>
                      <span className="text-blue-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-emerald-400 dark:to-teal-400 tracking-tight font-mono">{invoice.amount}</span>
                    </div>
                  </div>
                </div>

                <div className="p-10 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-white/5 flex gap-5 relative z-10 rounded-b-[3rem]">
                  {!approved ? (
                    <motion.button 
                      onClick={handleApprove}
                      disabled={approving}
                      whileHover={{ scale: 1.02, filter: "brightness(1.1)" }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 disabled:opacity-70 disabled:filter-none disabled:cursor-not-allowed text-white font-black text-lg rounded-[2rem] flex items-center justify-center gap-3 transition-all shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50"
                    >
                      {approving ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          Processing Transaction...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-6 h-6" />
                          Authorize Payment
                        </>
                      )}
                    </motion.button>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex-1 flex flex-col sm:flex-row gap-5"
                    >
                      <motion.button 
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold rounded-[2rem] border border-gray-200 dark:border-white/10 flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg hover:shadow-xl dark:shadow-none transition-all"
                      >
                        <Download className="w-5 h-5" /> Export PDF
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold rounded-[2rem] border border-gray-200 dark:border-white/10 flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg hover:shadow-xl dark:shadow-none transition-all"
                      >
                        <Share2 className="w-5 h-5" /> Share internally
                      </motion.button>
                    </motion.div>
                  )}
                  
                  {!approved && (
                     <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-10 py-5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-500 font-bold rounded-[2rem] transition-colors border border-rose-100 dark:border-rose-500/20"
                     >
                        Reject
                     </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Invoice;
