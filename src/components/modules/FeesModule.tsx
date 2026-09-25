import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  CreditCard,
  PlusCircle,
  Search,
  Filter,
  Receipt,
  Download,
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';
import { PaymentTransaction } from '../../types';

export const FeesModule: React.FC = () => {
  const { fees, students, classes, settings, recordFeePayment, openReceipt, currentUser } = useSchool();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'partial' | 'unpaid'>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // Form states
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentTransaction['paymentMethod']>('Bank Transfer');
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  const canRecord = currentUser.role === 'admin' || currentUser.role === 'accountant';

  const totalBilled = fees.reduce((sum, f) => sum + f.totalBill, 0);
  const totalCollected = fees.reduce((sum, f) => sum + f.amountPaid, 0);
  const totalOutstanding = fees.reduce((sum, f) => sum + f.balanceDue, 0);
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

  const handleOpenRecordForStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    const fee = fees.find(f => f.studentId === studentId);
    setPaymentAmount(fee?.balanceDue ? fee.balanceDue.toString() : '50000');
    setIsRecordModalOpen(true);
  };

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !paymentAmount) return;

    const amount = Number(paymentAmount);
    const tx = recordFeePayment(
      selectedStudentId,
      amount,
      paymentMethod,
      paymentRef || `REF-${Date.now().toString().slice(-6)}`,
      paymentNotes || 'Terminal fees payment receipt'
    );

    setIsRecordModalOpen(false);
    if (tx) {
      const student = students.find(s => s.id === selectedStudentId);
      const fee = fees.find(f => f.studentId === selectedStudentId);
      if (student && fee) {
        openReceipt(fee, tx, student);
      }
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
    const matchesClass = selectedClass === 'all' || fee.classId === selectedClass;

    return matchesSearch && matchesStatus && matchesClass;
  });

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            School Fees & Bursary Management
          </h2>
          <p className="text-xs text-slate-500">
            Track terminal fee assessments, issue official receipts and manage account balances
          </p>
        </div>

        {canRecord && (
          <button
            onClick={() => {
              setSelectedStudentId(students[0]?.id || '');
              setPaymentAmount('');
              setIsRecordModalOpen(true);
            }}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record Bursary Payment</span>
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Billed</span>
          <p className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-2">
            ₦{totalBilled.toLocaleString()}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">{settings.currentTerm} Assessment</span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Collected</span>
          <p className="text-2xl font-bold font-mono text-emerald-700 tabular-nums mt-2">
            ₦{totalCollected.toLocaleString()}
          </p>
          <span className="text-xs text-emerald-600 font-medium mt-1 block">{collectionRate}% clearance rate</span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Outstanding Arrears</span>
          <p className="text-2xl font-bold font-mono text-rose-700 tabular-nums mt-2">
            ₦{totalOutstanding.toLocaleString()}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">Awaiting payment</span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Fee Schedule</span>
          <p className="text-sm font-semibold text-slate-800 mt-2">
            ₦185,000 / Senior Science
          </p>
          <span className="text-xs text-slate-400 mt-1 block">Tuition, Labs & PTA</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student or admission no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Classes</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-3">Class</th>
                <th className="py-3 px-2 text-right">Assessment</th>
                <th className="py-3 px-2 text-right">Paid</th>
                <th className="py-3 px-2 text-right">Balance Due</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFees.map((fee) => {
                const student = students.find(s => s.id === fee.studentId);
                const sClass = classes.find(c => c.id === fee.classId);
                if (!student) return null;

                return (
                  <tr key={fee.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {student.admissionNo} · Guardian: {student.guardianName}
                      </p>
                    </td>

                    <td className="py-3 px-3 text-slate-800 font-medium">
                      {sClass?.name}
                    </td>

                    <td className="py-3 px-2 text-right font-mono tabular-nums text-slate-600">
                      ₦{fee.totalBill.toLocaleString()}
                    </td>

                    <td className="py-3 px-2 text-right font-mono tabular-nums font-semibold text-emerald-700">
                      ₦{fee.amountPaid.toLocaleString()}
                    </td>

                    <td className="py-3 px-2 text-right font-mono tabular-nums font-semibold text-rose-700">
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

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {fee.transactions.length > 0 && (
                          <button
                            onClick={() => openReceipt(fee, fee.transactions[0], student)}
                            className="px-2.5 py-1 text-xs text-indigo-600 hover:text-indigo-800 border border-slate-200 rounded hover:bg-slate-50 font-medium"
                          >
                            Receipt
                          </button>
                        )}
                        {canRecord && fee.balanceDue > 0 && (
                          <button
                            onClick={() => handleOpenRecordForStudent(student.id)}
                            className="px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium shadow-2xs"
                          >
                            Post Payment
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Record Bursary Payment
              </h3>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordSubmit} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  required
                >
                  <option value="">-- Choose Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.lastName}, {s.firstName} ({s.admissionNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Amount (₦)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 75000"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Payment Channel</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Bank Transfer">Bank Transfer (NIP/Direct)</option>
                  <option value="POS">Bursary POS Terminal</option>
                  <option value="Card Online">Online Debit Card</option>
                  <option value="Cash">Cash Deposit</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Bank Reference ID</label>
                <input
                  type="text"
                  placeholder="e.g. GTB-TRX-88219"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Payment Memo / Purpose</label>
                <input
                  type="text"
                  placeholder="e.g. Second Term Tuition Settlement"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold"
                >
                  Generate Official Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
