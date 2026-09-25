import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Award,
  CalendarCheck2,
  CreditCard,
  FileText,
  Printer,
  Receipt,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export const ParentDashboard: React.FC = () => {
  const { 
    currentUser, 
    students, 
    classes, 
    teachers, 
    fees, 
    attendance, 
    results, 
    settings, 
    openReportCard, 
    openReceipt,
    recordFeePayment 
  } = useSchool();

  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentChannel, setPaymentChannel] = useState<'Bank Transfer' | 'Card Online'>('Card Online');
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Link ward
  const student = students.find(s => s.id === (currentUser.associatedId || 'stu-01')) || students[0];
  const studentClass = classes.find(c => c.id === student.classId);
  const classTeacher = teachers.find(t => t.id === studentClass?.classTeacherId);
  const feeLedger = fees.find(f => f.studentId === student.id);
  const studentResults = results.filter(r => r.studentId === student.id);

  // Attendance stats
  const studentAttendance = attendance.filter(a => a.studentId === student.id);
  const presentDays = studentAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const missedDays = studentAttendance.filter(a => a.status === 'absent' || a.status === 'excused');

  const handleOnlinePay = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(paymentAmount);
    if (!amount || amount <= 0 || !feeLedger) return;

    setIsPaying(true);
    setTimeout(() => {
      const tx = recordFeePayment(
        student.id,
        amount,
        paymentChannel,
        `PARENT-PAY-${Date.now().toString().slice(-6)}`,
        'Parent online fee payment clearance'
      );
      setIsPaying(false);
      setPaymentSuccess(true);
      setPaymentAmount('');
      if (tx) {
        openReceipt(feeLedger, tx, student);
      }
      setTimeout(() => setPaymentSuccess(false), 4000);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Ward Profile Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={student.photoUrl}
              alt={student.firstName}
              className="w-16 h-16 rounded-xl object-cover border border-slate-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  {student.firstName} {student.lastName}
                </h2>
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  Ward Profile
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Adm No: {student.admissionNo} · Class: {studentClass?.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                <span>Class Form Master: <strong>{classTeacher ? `${classTeacher.firstName} ${classTeacher.lastName}` : 'Mr. David Adeleke'}</strong></span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{classTeacher?.phone || '+234 802 311 9922'}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2.5 w-full md:w-auto">
            <button
              onClick={() => openReportCard(student.id)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-xs"
            >
              <FileText className="w-4 h-4" />
              <span>View Terminal Report Card</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Academic Standing */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider">Terminal Standing</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-indigo-700 tabular-nums">
              1st Position
            </span>
            <span className="text-xs text-slate-500">Class Rank</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Average Score: <strong>87.8%</strong> (Distinction)
          </p>
        </div>

        {/* Attendance Record */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider">Punctuality & Presence</span>
            <CalendarCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {presentDays} / {studentAttendance.length || 62} Days
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {missedDays.length === 0 ? 'No unexcused absences recorded' : `${missedDays.length} excused/sick days recorded`}
          </p>
        </div>

        {/* School Fees Balance */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider">School Fees Balance</span>
            <CreditCard className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono tabular-nums ${feeLedger?.balanceDue === 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              ₦{feeLedger?.balanceDue.toLocaleString() || '0'}
            </span>
            <span className="text-xs text-slate-500">
              {feeLedger?.balanceDue === 0 ? 'Cleared' : 'Due for clearance'}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Total Term Bill: ₦{feeLedger?.totalBill.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Main Grid: Fees Ledger & Payment History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Fee Ledger & Receipts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  School Fees Assessment Ledger
                </h3>
                <p className="text-xs text-slate-500">
                  {settings.currentSession} · {settings.currentTerm} Tuition, Lab and Development Levy
                </p>
              </div>
              <span className={`px-2.5 py-1 text-xs font-semibold rounded ${
                feeLedger?.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
              }`}>
                {feeLedger?.status === 'paid' ? 'Fully Paid' : 'Partial / Balance Due'}
              </span>
            </div>

            {/* Bill Breakdown */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs mb-5">
              <div className="flex justify-between">
                <span className="text-slate-600">Tuition & Academic Instructional Fee:</span>
                <span className="font-mono tabular-nums font-medium text-slate-900">₦120,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Science Lab & Practical Consumables:</span>
                <span className="font-mono tabular-nums font-medium text-slate-900">₦35,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">ICT Lab & Digital Learning Portal:</span>
                <span className="font-mono tabular-nums font-medium text-slate-900">₦15,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">PTA Development Levy & Sports:</span>
                <span className="font-mono tabular-nums font-medium text-slate-900">₦15,000</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900">
                <span>Total Term Assessment Bill:</span>
                <span className="font-mono tabular-nums">₦{feeLedger?.totalBill.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Receipts History */}
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Official Payment Receipts ({feeLedger?.transactions.length || 0})
            </h4>

            {feeLedger && feeLedger.transactions.length > 0 ? (
              <div className="space-y-2.5">
                {feeLedger.transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-lg border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900">{tx.receiptNo}</span>
                        <span className="text-[11px] text-slate-400">· {tx.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {tx.paymentMethod} · Ref: <span className="font-mono">{tx.referenceNo}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-xs text-emerald-800">
                        ₦{tx.amount.toLocaleString()}
                      </span>
                      <button
                        onClick={() => openReceipt(feeLedger, tx, student)}
                        className="px-2.5 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 border border-slate-200 rounded hover:bg-white"
                      >
                        Print Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No payment transactions recorded yet.</p>
            )}
          </div>
        </div>

        {/* Right Col: Pay Balance Online Simulator */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              <span>Settle Outstanding Fees</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Instant electronic payment simulation with automated bursary receipt generation
            </p>

            {paymentSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Payment received successfully! Official receipt generated.</span>
              </div>
            )}

            <form onSubmit={handleOnlinePay} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Amount to Pay (₦)
                </label>
                <input
                  type="number"
                  placeholder={feeLedger?.balanceDue ? feeLedger.balanceDue.toString() : '50000'}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  required
                />
                {feeLedger && feeLedger.balanceDue > 0 && (
                  <button
                    type="button"
                    onClick={() => setPaymentAmount(feeLedger.balanceDue.toString())}
                    className="text-[11px] text-indigo-600 hover:underline mt-1 block"
                  >
                    Pay full outstanding balance (₦{feeLedger.balanceDue.toLocaleString()})
                  </button>
                )}
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentChannel}
                  onChange={(e) => setPaymentChannel(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Card Online">Debit Card (Mastercard / Visa / Verve)</option>
                  <option value="Bank Transfer">Direct Bank Transfer</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isPaying}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                {isPaying ? 'Processing Clearance...' : 'Pay Now & Generate Receipt'}
              </button>
            </form>
          </div>

          {/* School Contact Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs text-xs space-y-2.5">
            <h4 className="font-bold text-slate-900">College Administration Contact</h4>
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{settings.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono">{settings.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
