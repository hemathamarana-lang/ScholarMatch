import React from 'react';
import { Scholarship, MatchEvaluation } from '../types/scholarship';
import { ArrowUpRight, Award, DollarSign } from 'lucide-react';

interface SpotlightSectionProps {
  scholarships: Scholarship[];
  evaluations: Record<string, MatchEvaluation>;
  onOpenDetails: (scholarship: Scholarship) => void;
}

export const SpotlightSection: React.FC<SpotlightSectionProps> = ({
  scholarships,
  evaluations,
  onOpenDetails,
}) => {
  const featured = scholarships.filter((s) => s.featured).slice(0, 3);
  if (featured.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Endowment Spotlights
          </span>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Distinguished National Fellowships & Full-Rides
          </h2>
        </div>
        <span className="text-xs text-slate-500">
          Curated for transformative impact & leadership development
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {featured.map((scholarship) => {
          const evalResult = evaluations[scholarship.id];

          return (
            <div
              key={scholarship.id}
              onClick={() => onOpenDetails(scholarship)}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="truncate">{scholarship.organization}</span>
                  {evalResult && (
                    <span className="font-mono-data font-semibold text-emerald-700">
                      {evalResult.matchScore}% Match
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 tracking-tight group-hover:text-slate-700 transition-colors">
                  {scholarship.name}
                </h3>

                <div className="mt-2 text-xs font-mono-data font-bold text-slate-900">
                  {scholarship.awardDisplay.split('(')[0]}
                </div>

                <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {scholarship.description}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono-data">
                  Deadline: {scholarship.deadline}
                </span>
                <span className="flex items-center gap-1 font-semibold text-slate-900 group-hover:underline">
                  <span>Explore</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
