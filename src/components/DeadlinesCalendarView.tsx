import React from 'react';
import { Scholarship, MatchEvaluation } from '../types/scholarship';
import { formatDeadlineRelative } from '../utils/matchingEngine';
import { Calendar, Clock, AlertTriangle, ArrowUpRight } from 'lucide-react';

interface DeadlinesCalendarViewProps {
  scholarships: Scholarship[];
  evaluations: Record<string, MatchEvaluation>;
  onOpenDetails: (scholarship: Scholarship) => void;
  savedIds: string[];
}

export const DeadlinesCalendarView: React.FC<DeadlinesCalendarViewProps> = ({
  scholarships,
  evaluations,
  onOpenDetails,
  savedIds,
}) => {
  // Sort all scholarships by deadline ascending
  const sorted = [...scholarships].sort((a, b) => {
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  // Group into time windows
  const urgent: Scholarship[] = []; // <= 30 days
  const soon: Scholarship[] = []; // 31 - 60 days
  const upcoming: Scholarship[] = []; // 61 - 120 days
  const distant: Scholarship[] = []; // > 120 days

  sorted.forEach((s) => {
    const diff = formatDeadlineRelative(s.deadline);
    if (diff.daysRemaining <= 30) urgent.push(s);
    else if (diff.daysRemaining <= 60) soon.push(s);
    else if (diff.daysRemaining <= 120) upcoming.push(s);
    else distant.push(s);
  });

  const renderSection = (title: string, subtitle: string, items: Scholarship[], isUrgent = false) => {
    if (items.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              {isUrgent && <AlertTriangle className="w-4 h-4 text-amber-600" />}
              <span>{title}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          </div>
          <span className="text-xs font-mono-data text-slate-500">
            {items.length} {items.length === 1 ? 'scholarship' : 'scholarships'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((scholarship) => {
            const deadline = formatDeadlineRelative(scholarship.deadline);
            const evaluation = evaluations[scholarship.id];
            const isSaved = savedIds.includes(scholarship.id);

            return (
              <div
                key={scholarship.id}
                onClick={() => onOpenDetails(scholarship)}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-xs flex items-start justify-between gap-3 ${
                  isSaved
                    ? 'bg-slate-50/80 border-slate-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span className="font-mono-data font-semibold text-slate-900">
                      {scholarship.deadline}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={`font-mono-data ${
                        deadline.isUrgent ? 'text-amber-700 font-bold' : 'text-slate-500'
                      }`}
                    >
                      {deadline.displayText}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {scholarship.name}
                  </h4>

                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-600 truncate">
                    <span>{scholarship.organization}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="font-mono-data font-medium text-slate-900">
                      {scholarship.awardDisplay.split('(')[0]}
                    </span>
                  </div>

                  {evaluation && (
                    <div className="mt-2 text-xs font-medium text-slate-700">
                      Match: <span className="font-semibold text-emerald-700">{evaluation.matchScore}%</span>
                      {isSaved && <span className="ml-2 text-slate-400">· Saved in Tracker</span>}
                    </div>
                  )}
                </div>

                <div className="shrink-0 pt-1">
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
          Calendar & Submission Roadmap
        </span>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
          Upcoming Scholarship Deadlines
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Track deadlines in chronological order to plan your letters of recommendation, official transcript requests, and personal statement drafts ahead of time.
        </p>
      </div>

      {renderSection(
        'Critical Deadlines: Closing Within 30 Days',
        'Immediate priority. Finalize recommendation letters and essay drafts.',
        urgent,
        true
      )}

      {renderSection(
        'Approaching Deadlines: 31 to 60 Days',
        'Ideal time to request official transcripts and contact professors for references.',
        soon
      )}

      {renderSection(
        'Winter / Spring Cycles: 61 to 120 Days',
        'Early-stage preparation for mid-cycle endowments and foundation grants.',
        upcoming
      )}

      {renderSection(
        'Future Deadlines: 120+ Days',
        'Late spring and summer opportunities.',
        distant
      )}
    </div>
  );
};
