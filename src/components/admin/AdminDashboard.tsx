import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  BarChart3,
  TrendingUp,
  Users,
  FileCheck2,
  AlertCircle,
  Globe2,
  PieChart,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();

  const metrics = [
    { label: 'Total Citizen Queries', value: '14,820', change: '+18.4% this week', icon: TrendingUp },
    { label: 'Services Discovered', value: '11,240', change: '75.8% conversion', icon: Layers },
    { label: 'Applications Started', value: '8,650', change: '58.3% journey rate', icon: FileCheck2 },
    { label: 'Most Requested Service', value: 'Income Certificate', sub: 'Revenue Dept (34%)', icon: BarChart3 },
    { label: 'Most Common Missing Doc', value: 'Income Affidavit', sub: '41% of incomplete apps', icon: AlertCircle },
    { label: 'Top Query Language', value: 'Hindi (हिन्दी)', sub: '42% citizen volume', icon: Globe2 },
  ];

  const languageData = [
    { lang: 'Hindi (हिन्दी)', percent: 42, color: 'bg-amber-600' },
    { lang: 'English', percent: 24, color: 'bg-blue-800' },
    { lang: 'Bengali (বাংলা)', percent: 11, color: 'bg-emerald-600' },
    { lang: 'Telugu (తెలుగు)', percent: 8, color: 'bg-indigo-600' },
    { lang: 'Tamil (தமிழ்)', percent: 7, color: 'bg-purple-600' },
    { lang: 'Other 18 Indian Languages', percent: 8, color: 'bg-slate-500' },
  ];

  const categoryDemand = [
    { cat: 'Certificates (Income, Domicile, Caste)', percent: 36, color: 'bg-blue-900' },
    { cat: 'Scholarships & Higher Education', percent: 24, color: 'bg-amber-600' },
    { cat: 'Healthcare (Ayushman PM-JAY)', percent: 16, color: 'bg-emerald-700' },
    { cat: 'Social Security & Pensions', percent: 12, color: 'bg-indigo-700' },
    { cat: 'Transport & Driving Licences', percent: 7, color: 'bg-cyan-700' },
    { cat: 'MSME Business & Utility', percent: 5, color: 'bg-slate-600' },
  ];

  const funnelStages = [
    { stage: '1. Citizen Enters Natural Language Problem', count: 14820, percent: 100 },
    { stage: '2. AI Identifies Statutory Service', count: 13190, percent: 89 },
    { stage: '3. Eligibility Assessment Completed', count: 11240, percent: 76 },
    { stage: '4. Documents Prepared in Locker', count: 9480, percent: 64 },
    { stage: '5. Saved to Application Journey', count: 8650, percent: 58 },
    { stage: '6. Official Portal Submission Click', count: 6810, percent: 46 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-white uppercase tracking-wider">
              Administration / Public Insights
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              100% Anonymous Aggregated Data
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-900" />
            <span>CivicAssist AI Analytics & Demand Intelligence</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Real-time public service discovery metrics, linguistic distribution, and citizen bottleneck analytics.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          Last Synced: <strong>Just Now</strong> • Period: <strong>Last 30 Days</strong>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 hover:border-blue-400 transition"
            >
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {m.label}
                </span>
                <div className="p-2 rounded-lg bg-blue-50 text-blue-900">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {m.value}
              </div>
              <div className="text-xs font-medium text-emerald-700">
                {m.change || m.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Section: Language Usage & Service Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Usage Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-blue-900" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Linguistic Diversity & Usage Breakdown
              </h3>
            </div>
            <span className="text-xs text-slate-500">23 Languages Supported</span>
          </div>

          <p className="text-xs text-slate-500">
            Citizen volume categorized by preferred constitutional language selection.
          </p>

          <div className="space-y-3 pt-1">
            {languageData.map((item) => (
              <div key={item.lang}>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-800">{item.lang}</span>
                  <span className="text-slate-900">{item.percent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Demand */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Public Service Category Distribution
              </h3>
            </div>
            <span className="text-xs text-slate-500">Demand Heatmap</span>
          </div>

          <p className="text-xs text-slate-500">
            Citizen volume grouped by administrative service category.
          </p>

          <div className="space-y-3 pt-1">
            {categoryDemand.map((item) => (
              <div key={item.cat}>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-800">{item.cat}</span>
                  <span className="text-slate-900">{item.percent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Citizen Journey Conversion Funnel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              End-to-End Citizen Application Funnel
            </h3>
          </div>
          <span className="text-xs text-emerald-700 font-bold">
            Zero-Dropoff Goal
          </span>
        </div>

        <p className="text-xs text-slate-500">
          Conversion rate moving citizens from initial natural-language problem to verified portal submission.
        </p>

        <div className="space-y-3 pt-2">
          {funnelStages.map((stage, i) => (
            <div key={stage.stage} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-800">{stage.stage}</span>
                <span className="text-slate-900">
                  {stage.count.toLocaleString()} citizens ({stage.percent}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-blue-900 h-full rounded-full transition-all duration-500"
                  style={{ width: `${stage.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* No PII Guarantee */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>
          Compliance Notice: All metrics are computed from anonymized event telemetry. No Aadhaar numbers, mobile numbers, or citizen identity records are accessible.
        </span>
      </div>
    </div>
  );
};
