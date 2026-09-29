import React from 'react';
import { Scholarship, MatchEvaluation } from '../types/scholarship';
import { formatDeadlineRelative } from '../utils/matchingEngine';
import { Bookmark, BookmarkCheck, ArrowUpRight, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  evaluation?: MatchEvaluation;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpenDetails: (scholarship: Scholarship) => void;
  isCompared?: boolean;
  onToggleCompare?: (id: string) => void;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scholarship,
  evaluation,
  isSaved,
  onToggleSave,
  onOpenDetails,
  isCompared = false,
  onToggleCompare,
}) => {
  const deadlineInfo = formatDeadlineRelative(scholarship.deadline);

  // Match tier presentation (text-based, zero pills)
  const getMatchDisplay = () => {
    if (!evaluation) return null;

    if (evaluation.tier === 'direct_match') {
      return (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{evaluation.matchScore}% Match · Direct Match</span>
        </div>
      );
    }
    if (evaluation.tier === 'eligible') {
      return (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          <span>{evaluation.matchScore}% Match · Eligible</span>
        </div>
      );
    }
    if (evaluation.tier === 'partial_match') {
      return (
        <div className="flex items-center gap-1.5 text-xs font-medium text-amber-800">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>{evaluation.matchScore}% Match · Partial Match</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>Ineligible ({evaluation.matchScore}%)</span>
      </div>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between group">
      <div>
        {/* Top metadata row: quiet unboxed text with typographic separators */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-medium text-slate-700 truncate">{scholarship.organization}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="capitalize">{scholarship.category.replace('_', ' ')}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onToggleCompare && (
              <button
                type="button"
                onClick={() => onToggleCompare(scholarship.id)}
                className={`text-[11px] font-medium transition-colors ${
                  isCompared ? 'text-slate-900 font-semibold underline' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Compare side-by-side"
              >
                {isCompared ? 'In Compare' : '+ Compare'}
              </button>
            )}

            <button
              type="button"
              onClick={() => onToggleSave(scholarship.id)}
              aria-label={isSaved ? 'Remove from saved' : 'Save scholarship'}
              className="p-1 text-slate-400 hover:text-slate-900 rounded transition-colors"
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Primary Title (Leading anchor) */}
        <h3
          onClick={() => onOpenDetails(scholarship)}
          className="text-base font-bold text-slate-900 tracking-tight cursor-pointer hover:text-slate-700 transition-colors line-clamp-1"
        >
          {scholarship.name}
        </h3>

        {/* Award Amount & Benefits highlight */}
        <div className="mt-2 text-sm">
          <span className="font-mono-data font-bold text-slate-900 text-lg">
            {scholarship.awardDisplay.split('(')[0].trim()}
          </span>
          {scholarship.renewableYears > 0 && (
            <span className="text-xs text-slate-500 ml-1.5 font-normal">
              · {scholarship.renewableYears === 4 ? 'Renewable 4 Years' : `${scholarship.renewableYears} Years`}
            </span>
          )}
        </div>

        {/* Short description */}
        <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {scholarship.description}
        </p>

        {/* Match evaluation status bar */}
        {evaluation && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            {getMatchDisplay()}
            {evaluation.highlights.length > 0 && (
              <span className="text-[11px] text-slate-500 truncate max-w-[180px]">
                {evaluation.highlights[0]}
              </span>
            )}
          </div>
        )}

        {/* Requirements audit summary */}
        <div className="mt-2.5 text-[11px] text-slate-500 flex items-center gap-1.5 truncate">
          <span>{scholarship.eligibility.minGpa ? `Min GPA ${scholarship.eligibility.minGpa.toFixed(1)}` : 'No Min GPA'}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{scholarship.requirements.length} Application items</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{scholarship.locationScope.includes('Global') ? 'Worldwide' : 'United States'}</span>
        </div>
      </div>

      {/* Card Footer: Deadline and View Details CTA */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-400">Deadline</span>
          <span
            className={`font-mono-data text-xs font-medium ${
              deadlineInfo.isUrgent
                ? 'text-amber-700 font-semibold'
                : deadlineInfo.isPast
                ? 'text-slate-400'
                : 'text-slate-700'
            }`}
          >
            {scholarship.deadline} ({deadlineInfo.displayText})
          </span>
        </div>

        <button
          type="button"
          onClick={() => onOpenDetails(scholarship)}
          className="flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-slate-700 transition-colors py-1 px-2.5 rounded-md hover:bg-slate-50 border border-slate-200"
        >
          <span>Requirements</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
