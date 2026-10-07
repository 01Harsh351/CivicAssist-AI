import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { ServiceCard } from './ServiceCard';
import { Bookmark, ArrowRight, Compass } from 'lucide-react';

export const SavedServicesView: React.FC = () => {
  const { services, savedServiceIds, setActiveTab } = useApp();
  const { t } = useLanguage();

  const savedServices = services.filter((s) => savedServiceIds.includes(s.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-amber-600" />
            <span>{t('saved_services')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Bookmarked public services stored for quick access and reference.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('find_service')}
          className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 self-start cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>Explore Public Catalog</span>
        </button>
      </div>

      {savedServices.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center mx-auto">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No saved services yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            When you discover services in CivicAssist, click the bookmark icon to save them here for quick access later.
          </p>
          <button
            onClick={() => setActiveTab('find_service')}
            className="px-5 py-2.5 bg-blue-900 text-white font-bold text-xs rounded-xl hover:bg-blue-950 transition cursor-pointer"
          >
            Browse All Services
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
};
