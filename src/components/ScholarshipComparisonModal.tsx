import React from 'react';
import { Scholarship, MatchEvaluation } from '../types/scholarship';
import { formatDeadlineRelative } from '../utils/matchingEngine';
import { X, ExternalLink, Check, DollarSign, Clock, Calendar } from 'lucide-react';

interface ScholarshipComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  scholarships: Scholarship[];
  evaluations: Record<string, MatchEvaluation>;
  onRemove: (id: string) => void;
  onOpenDetails: (scholarship: Scholarship) => void;
}

export const ScholarshipComparisonModal: React.FC<ScholarshipComparisonModalProps> = ({
  isOpen,
  onClose,
  scholarships,
  evaluations,
  onRemove,
  onOpenDetails,
}) => {
  if (!isOpen || scholarships.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col border border-slate-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="comparison-title"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 rounded-t-xl">
          <div>
            <h2 id="comparison-title" className="text-lg font-bold text-slate-900 tracking-tight">
              Side-by-Side Scholarship Comparison
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluating {scholarships.length} of 3 selected scholarship opportunities.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/50 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="overflow-x-auto overflow-y-auto px-6 py-6 flex-1 text-xs">
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${scholarships.length}, minmax(260px, 1fr))`,
            }}
          >
            {scholarships.map((s) => {
              const evalResult = evaluations[s.id];
              const deadline = formatDeadlineRelative(s.deadline);
              const totalEstHours = s.requirements.reduce((acc, r) => acc + r.estimatedHours, 0);

              return (
                <div
                  key={s.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-4"
                >
                  <div>
                    {/* Top action and remove */}
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="text-[11px] font-medium text-slate-500 truncate">
                        {s.organization}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemove(s.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 tracking-tight line-clamp-2">
                      {s.name}
                    </h3>

                    {/* Match Score Badge */}
                    {evalResult && (
                      <div className="mt-3 p-2 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="text-[11px] text-slate-500">Personal Match Score</div>
                        <div className="text-base font-bold font-mono-data text-emerald-700">
                          {evalResult.matchScore}%
                        </div>
                        <div className="text-[11px] text-slate-600 capitalize">
                          {evalResult.tier.replace('_', ' ')}
                        </div>
                      </div>
                    )}

                    {/* Metrics Table */}
                    <div className="mt-4 space-y-3 border-t border-slate-100 pt-3">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Award Amount</span>
                        <span className="font-mono-data font-bold text-slate-900 text-sm">
                          {s.awardDisplay}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px]">Renewability</span>
                        <span className="text-slate-700 font-medium">
                          {s.renewableYears > 0 ? `Renewable for ${s.renewableYears} years` : 'One-time grant'}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px]">Minimum GPA</span>
                        <span className="font-mono-data text-slate-700 font-medium">
                          {s.eligibility.minGpa ? `${s.eligibility.minGpa.toFixed(2)}` : 'None required'}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px]">Deadline</span>
                        <span className="font-mono-data text-slate-700 font-medium">
                          {s.deadline} ({deadline.displayText})
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px]">Application Burden</span>
                        <span className="text-slate-700 font-medium">
                          {s.requirements.length} items (~{totalEstHours} hours prep)
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px]">Primary Non-Monetary Perks</span>
                        <ul className="mt-1 space-y-1 text-[11px] text-slate-600">
                          {s.benefits
                            .filter((b) => !b.isMonetary)
                            .slice(0, 2)
                            .map((b, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="line-clamp-2">{b.title}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenDetails(s);
                      }}
                      className="w-full py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors text-center"
                    >
                      View Full Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end bg-slate-50/70 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
          >
            Done Comparing
          </button>
        </div>
      </div>
    </div>
  );
};
