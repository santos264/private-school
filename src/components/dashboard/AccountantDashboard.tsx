import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  CreditCard,
  Receipt,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer
} from 'lucide-react';
import { PaymentTransaction } from '../../types';

export const AccountantDashboard: React.FC = () => {
  const { 
    fees, 
    students, 
    classes, 
    settings, 
    recordFeePayment, 
    openReceipt 
  } = useSchool();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'partial' | 'unpaid'>('all');
  const [selectedStudentForPayment, setSelectedStudentForPayment] = useState<string>('');
  const [payAmount, setPayAmount] = useState<string>('');
  const [payMethod, setPayMethod] = useState<PaymentTransaction['paymentMethod']>('Bank Transfer');
  const [payRef, setPayRef] = useState<string>('');
  const [payNotes, setPayNotes] = useState<string>('');
  const [successBanner, setSuccessBanner] = useState(false);

  // Financial aggregates
  const totalBilled = fees.reduce((sum, f) => sum + f.totalBill, 0);
  const totalPaid = fees.reduce((sum, f) => sum + f.amountPaid, 0);
  const totalOutstanding = fees.reduce((sum, f) => sum + f.balanceDue, 0);
  const collectionRate = totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 0;

  const paidCount = fees.filter(f => f.status === 'paid').length;
  const partialCount = fees.filter(f => f.status === 'partial').length;
  const unpaidCount = fees.filter(f => f.status === 'unpaid').length;

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForPayment || !payAmount) return;

    const amount = Number(payAmount);
    const tx = recordFeePayment(
      selectedStudentForPayment,
      amount,
      payMethod,
      payRef || `TRX-${Date.now().toString().slice(-6)}`,
      payNotes || 'Official Bursary Payment'
    );

    if (tx) {
      setSuccessBanner(true);
      const student = students.find(s => s.id === selectedStudentForPayment);
      const fee = fees.find(f => f.studentId === selectedStudentForPayment);
      if (student && fee) {
        openReceipt(fee, tx, student);
      }
      setSelectedStudentForPayment('');
      setPayAmount('');
      setPayRef('');
      setPayNotes('');
      setTimeout(() => setSuccessBanner(false), 4000);
    }
  };

  const filteredFees = fees.filter(fee => {
    const student = students.find(s => s.id === fee.studentId);
    if (!student) return false;
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || fee.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Financial Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Total Billed */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Expected Revenue
          </span>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 tabular-nums">
            ₦{totalBilled.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {fees.length} enrolled student billings
          </p>
        </div>

        {/* Total Collected */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Realized Collections
          </span>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-700 tabular-nums">
            ₦{totalPaid.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-emerald-600 font-medium">
            {collectionRate}% clearance rate
          </p>
        </div>

        {/* Outstanding Arrears */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Outstanding Arrears
          </span>
          <div className="mt-2 text-2xl font-bold font-mono text-rose-700 tabular-nums">
            ₦{totalOutstanding.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {unpaidCount + partialCount} accounts pending
          </p>
        </div>

        {/* Settlement Counts */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Account Clearance
          </span>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {paidCount} <span className="text-sm font-normal text-slate-400">/ {fees.length}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <span>{paidCount} Paid</span>
            <span aria-hidden="true">·</span>
            <span>{partialCount} Partial</span>
            <span aria-hidden="true">·</span>
            <span>{unpaidCount} Unpaid</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Student Fee Ledgers & Record Payment Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Fee Ledgers */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Student Fee Accounts & Ledgers
              </h3>
              <p className="text-xs text-slate-500">
                {settings.currentSession} · {settings.currentTerm} billing status
              </p>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  statusFilter === 'all' ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('paid')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  statusFilter === 'paid' ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Paid
              </button>
              <button
                onClick={() => setStatusFilter('partial')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  statusFilter === 'partial' ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Partial
              </button>
              <button
                onClick={() => setStatusFilter('unpaid')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  statusFilter === 'unpaid' ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Unpaid
              </button>
            </div>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name or admission number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-2 text-right">Billed</th>
                  <th className="py-2.5 px-2 text-right">Paid</th>
                  <th className="py-2.5 px-2 text-right">Balance</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Receipts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFees.map((fee) => {
                  const student = students.find(s => s.id === fee.studentId);
                  const sClass = classes.find(c => c.id === fee.classId);
                  if (!student) return null;

                  return (
                    <tr key={fee.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <p className="font-semibold text-slate-900">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {student.admissionNo}
                        </p>
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-medium">
                        {sClass?.name}
                      </td>
                      <td className="py-3 px-2 text-right font-mono tabular-nums text-slate-600">
                        ₦{fee.totalBill.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-right font-mono tabular-nums text-emerald-700 font-semibold">
                        ₦{fee.amountPaid.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-right font-mono tabular-nums text-rose-700 font-semibold">
                        ₦{fee.balanceDue.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          fee.status === 'paid' ? 'bg-emerald-50 text-emerald-700' :
                          fee.status === 'partial' ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {fee.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {fee.transactions.length > 0 ? (
                          <button
                            onClick={() => openReceipt(fee, fee.transactions[0], student)}
                            className="px-2 py-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            Last Receipt
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">None</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Record New Payment Form */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-indigo-600" />
              <span>Record New Payment</span>
            </h3>
            <p className="text-xs text-slate-500">
              Post bank deposit, card or cash transaction and issue instant receipt
            </p>
          </div>

          {successBanner && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Payment registered and bursary receipt printed!</span>
            </div>
          )}

          <form onSubmit={handleRecordPayment} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Select Student
              </label>
              <select
                value={selectedStudentForPayment}
                onChange={(e) => setSelectedStudentForPayment(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">-- Choose Student --</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.lastName}, {s.firstName} ({s.admissionNo})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Amount Received (₦)
              </label>
              <input
                type="number"
                placeholder="e.g. 85000"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Payment Channel
              </label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Bank Transfer">Bank Transfer (NIP/Direct)</option>
                <option value="POS">Bursary POS Terminal</option>
                <option value="Card Online">Online Debit Card</option>
                <option value="Cash">Cash Deposit</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Bank / Transaction Reference
              </label>
              <input
                type="text"
                placeholder="e.g. GTB-TRX-109283"
                value={payRef}
                onChange={(e) => setPayRef(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Description / Memo
              </label>
              <input
                type="text"
                placeholder="e.g. Second Term Tuition Settlement"
                value={payNotes}
                onChange={(e) => setPayNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Receipt className="w-4 h-4" />
              <span>Record & Generate Receipt</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
