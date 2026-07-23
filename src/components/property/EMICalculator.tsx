import React, { useState } from 'react';
import { Calculator, DollarSign, Percent, Calendar } from 'lucide-react';

interface EMICalculatorProps {
  propertyPrice: number;
}

export const EMICalculator: React.FC<EMICalculatorProps> = ({ propertyPrice }) => {
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTenureYears, setLoanTenureYears] = useState(30);

  const downPaymentAmount = (propertyPrice * downPaymentPercent) / 100;
  const loanPrincipal = propertyPrice - downPaymentAmount;

  // Monthly interest rate calculation
  const r = interestRate / 12 / 100;
  const n = loanTenureYears * 12;

  const monthlyPayment = loanPrincipal > 0 && r > 0
    ? Math.round((loanPrincipal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1))
    : 0;

  const totalPayment = monthlyPayment * n;
  const totalInterest = totalPayment - loanPrincipal;

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Mortgage & EMI Estimator</h4>
            <p className="text-[11px] text-slate-400">Calculate estimated monthly mortgage breakdown</p>
          </div>
        </div>
        <div className="text-right">
          <span className="block text-[10px] text-slate-400 uppercase font-semibold">Estimated Monthly Payment</span>
          <span className="text-2xl font-extrabold text-emerald-400">${monthlyPayment.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400">/mo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Down Payment Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Down Payment ({downPaymentPercent}%)</span>
            <span className="text-emerald-400">${downPaymentAmount.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={downPaymentPercent}
            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Interest Rate Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Annual Interest Rate</span>
            <span className="text-teal-400">{interestRate}%</span>
          </div>
          <input
            type="range"
            min="3.0"
            max="12.0"
            step="0.25"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full accent-teal-500 cursor-pointer"
          />
        </div>

        {/* Loan Tenure Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Loan Duration</span>
            <span className="text-sky-400">{loanTenureYears} Years</span>
          </div>
          <input
            type="range"
            min="10"
            max="30"
            step="5"
            value={loanTenureYears}
            onChange={(e) => setLoanTenureYears(Number(e.target.value))}
            className="w-full accent-sky-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Breakdown Metrics Footer */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-center text-xs">
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <span className="block text-[10px] text-slate-500">Loan Principal</span>
          <span className="font-bold text-slate-200">${loanPrincipal.toLocaleString()}</span>
        </div>
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <span className="block text-[10px] text-slate-500">Total Interest Payable</span>
          <span className="font-bold text-amber-400">${totalInterest > 0 ? totalInterest.toLocaleString() : 0}</span>
        </div>
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <span className="block text-[10px] text-slate-500">Total Loan Outlay</span>
          <span className="font-bold text-emerald-400">${totalPayment > 0 ? totalPayment.toLocaleString() : 0}</span>
        </div>
      </div>
    </div>
  );
};
