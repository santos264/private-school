import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { X, Printer, CheckCircle, Receipt, Building2 } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { selectedReceiptData, closeReceipt, settings, classes } = useSchool();

  if (!selectedReceiptData) return null;

  const { fee, transaction, student } = selectedReceiptData;
  const studentClass = classes.find(c => c.id === student.classId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full my-6 overflow-hidden border border-slate-200">
        {/* Modal Action Bar */}
        <div className="no-print px-6 py-3 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Official School Fees Receipt
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={closeReceipt}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT SHEET */}
        <div className="p-6 sm:p-8 bg-white text-slate-900 print:p-0">
          <div className="border border-slate-300 rounded-lg p-5">
            {/* Header */}
            <div className="text-center pb-4 border-b border-slate-200">
              <div className="w-12 h-12 mx-auto rounded-md overflow-hidden mb-2">
                <img
                  src={settings.crestUrl}
                  alt="School Crest"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h2 className="text-lg font-black uppercase text-slate-900">
                {settings.schoolName}
              </h2>
              <p className="text-[10px] text-slate-500">
                Bursary & Accounts Directorate · {settings.address}
              </p>
              <div className="mt-2 inline-block px-3 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs font-bold uppercase tracking-wider">
                Official Bursary E-Receipt
              </div>
            </div>

            {/* Receipt Metadata */}
            <div className="grid grid-cols-2 gap-3 py-4 text-xs border-b border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Receipt Number</span>
                <span className="font-mono font-bold text-slate-900">{transaction.receiptNo}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block">Transaction Date</span>
                <span className="font-mono text-slate-800">{transaction.date}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Payment Reference</span>
                <span className="font-mono text-slate-700">{transaction.referenceNo}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block">Payment Channel</span>
                <span className="font-medium text-slate-800">{transaction.paymentMethod}</span>
              </div>
            </div>

            {/* Student Info */}
            <div className="py-3 border-b border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-900">{student.firstName} {student.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Admission Number:</span>
                <span className="font-mono font-bold text-slate-900">{student.admissionNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Class:</span>
                <span className="font-medium text-slate-800">{studentClass?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Session & Term:</span>
                <span className="text-slate-800">{fee.academicSession} · {fee.term}</span>
              </div>
            </div>

            {/* Amount Details */}
            <div className="py-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Description:</span>
                <span className="font-medium text-slate-800">{transaction.notes || 'School Tuition & Practical Levies'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Term Assessment Bill:</span>
                <span className="font-mono tabular-nums">₦{fee.totalBill.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-100">
                <span>Amount Paid Now:</span>
                <span className="font-mono tabular-nums">₦{transaction.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600 pt-1">
                <span>Total Cumulative Paid:</span>
                <span className="font-mono tabular-nums">₦{fee.amountPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-800 font-semibold">
                <span>Outstanding Balance Due:</span>
                <span className="font-mono tabular-nums text-rose-700">₦{fee.balanceDue.toLocaleString()}</span>
              </div>
            </div>

            {/* Footer Signature */}
            <div className="border-t border-slate-200 pt-4 mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <div>
                <p className="font-semibold text-slate-800">Mrs. Grace Bello</p>
                <p className="text-[10px] text-slate-400">Authorized Bursary Officer</p>
              </div>
              <div className="text-right flex items-center gap-1.5 text-emerald-700">
                <CheckCircle className="w-4 h-4" />
                <span className="font-bold uppercase tracking-wider text-[10px]">Payment Confirmed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
