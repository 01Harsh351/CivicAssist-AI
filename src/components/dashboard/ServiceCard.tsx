import React from 'react';
import { PublicService } from '../../types';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  ShieldCheck,
  Clock,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Building2,
  FileText,
  BadgeIndianRupee,
} from 'lucide-react';

interface ServiceCardProps {
  service: PublicService;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { setSelectedService, toggleSaveService, isServiceSaved, startApplicationJourney } = useApp();
  const { t } = useLanguage();
  const saved = isServiceSaved(service.id);

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-blue-400 p-5 shadow-2xs hover:shadow-md transition flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-900">
            {service.category}
          </span>
          <button
            onClick={() => toggleSaveService(service.id)}
            className="p-1 text-slate-400 hover:text-amber-600 transition cursor-pointer"
            title={saved ? 'Remove from Saved' : 'Save to profile'}
          >
            {saved ? (
              <BookmarkCheck className="w-4 h-4 text-amber-600" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>

        <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-900 transition leading-snug">
          {service.serviceName}
        </h3>

        <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
          {service.description}
        </p>

        {/* State & Department Meta */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{service.department}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>~{service.processingTimeDays} Days</span>
            </span>
            <span className="flex items-center gap-1 text-slate-700 font-semibold">
              <BadgeIndianRupee className="w-3 h-3 text-emerald-600" />
              <span>{service.statutoryFeeText.split(' ')[0]}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={() => setSelectedService(service)}
          className="flex-1 py-2 px-3 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <span>View Service Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => startApplicationJourney(service)}
          className="py-2 px-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
          title="Start tracking application"
        >
          <FileText className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
