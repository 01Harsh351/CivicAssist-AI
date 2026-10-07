import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { ServiceCard } from './ServiceCard';
import { ServiceCategory } from '../../types';
import { Search, Filter, ShieldCheck } from 'lucide-react';

const CATEGORIES: ServiceCategory[] = [
  'Certificates',
  'Education',
  'Scholarships',
  'Healthcare',
  'Identity',
  'Employment',
  'Business',
  'Pension',
  'Transport',
  'Housing',
  'Utility Services',
];

export const FindServiceCatalog: React.FC = () => {
  const { services, activeCategory, setActiveCategory } = useApp();
  const { t } = useLanguage();

  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedState, setSelectedState] = useState<string>('All');

  // Filter services
  const filtered = services.filter((svc) => {
    const matchesCategory = !activeCategory || svc.category === activeCategory;
    const matchesSearch =
      !catalogSearch ||
      svc.serviceName.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      svc.description.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      svc.department.toLowerCase().includes(catalogSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('find_service')} • Government Service Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Browse verified Central and State public services, statutory rules, and requirements.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 self-start">
          Showing {filtered.length} of {services.length} Public Services
        </span>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={catalogSearch}
            onChange={(e) => setCatalogSearch(e.target.value)}
            placeholder="Search by service name, certificate type, or department..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
              activeCategory === null
                ? 'bg-blue-900 text-white border-blue-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => {
            const isSel = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(isSel ? null : cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                  isSel
                    ? 'bg-blue-900 text-white border-blue-900 font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <p className="text-base font-bold text-slate-900">No public services match your query</p>
          <p className="text-xs text-slate-500">
            Try adjusting your search keywords or clearing the category filter.
          </p>
          <button
            onClick={() => {
              setCatalogSearch('');
              setActiveCategory(null);
            }}
            className="px-4 py-2 bg-blue-900 text-white text-xs font-bold rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
};
