import React, { useState } from 'react';
import {
  Scholarship,
  MatchEvaluation,
  ApplicationStage,
  TrackedApplication,
} from '../types/scholarship';
import { formatDeadlineRelative } from '../utils/matchingEngine';
import {
  BookmarkCheck,
  Clock,
  ArrowUpRight,
  ExternalLink,
  Printer,
  Trash2,
  CheckCircle,
  FileText,
  DollarSign,
} from 'lucide-react';

interface ApplicationTrackerViewProps {
  scholarships: Scholarship[];
  trackedApps: Record<string, TrackedApplication>;
  evaluations: Record<string, MatchEvaluation>;
  onOpenDetails: (scholarship: Scholarship) => void;
  onUpdateStage: (scholarshipId: string, stage: ApplicationStage) => void;
  onRemoveTracked: (scholarshipId: string) => void;
  onOpenProfile: () => void;
}

export const ApplicationTrackerView: React.FC<ApplicationTrackerViewProps> = ({
  scholarships,
  trackedApps,
  evaluations,
  onOpenDetails,
  onUpdateStage,
  onRemoveTracked,
  onOpenProfile,
}) => {
  const [filterStage, setFilterStage] = useState<string>('all');

  const savedScholarships = scholarships.filter((s) => trackedApps[s.id]);

  const filtered = savedScholarships.filter((s) => {
    if (filterStage === 'all') return true;
    return trackedApps[s.id]?.stage === filterStage;
  });

  // Calculate total potential funding
  const totalFunding = savedScholarships.reduce((acc, curr) => acc + curr.awardAmount, 0);

  const stageCounts: Record<string, number> = {
    all: savedScholarships.length,
    saved: savedScholarships.filter((s) => trackedApps[s.id]?.stage === 'saved').length,
    in_progress: savedScholarships.filter((s) => trackedApps[s.id]?.stage === 'in_progress').length,
    submitted: savedScholarships.filter((s) => trackedApps[s.id]?.stage === 'submitted').length,
    awarded: savedScholarships.filter((s) => trackedApps[s.id]?.stage === 'awarded').length,
  };

  const handlePrintDossier = () => {
    window.print();
  };

  if (savedScholarships.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-4">
          <BookmarkCheck className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          No Tracked Applications Yet
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
          Bookmark scholarships from your personalized matches or the directory to track your requirements, milestones, and funding progress.
        </p>
        <button
          onClick={onOpenProfile}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
        >
          Review Your Matches
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top summary banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Application Portfolio
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Tracked Scholarships & Deadlines
          </h2>
          <div className="mt-2 flex items-center gap-3 text-xs text-slate-600">
            <span>
              <strong className="text-slate-900">{savedScholarships.length}</strong> Opportunities Saved
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>
              Potential Value:{' '}
              <strong className="font-mono-data text-slate-900 font-bold">
                ${totalFunding.toLocaleString()}
              </strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrintDossier}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {/* Stage Filter Buttons (Functional segmented controls) */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/60 rounded-lg max-w-fit">
        {[
          { id: 'all', label: 'All Saved' },
          { id: 'saved', label: 'Saved / Considering' },
          { id: 'in_progress', label: 'In Progress' },
          { id: 'submitted', label: 'Submitted' },
          { id: 'awarded', label: 'Awarded' },
        ].map((tab) => {
          const isActive = filterStage === tab.id;
          const count = stageCounts[tab.id] || 0;
          return (
            <button
              key={tab.id}
              onClick={() => setFilterStage(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {filtered.map((scholarship) => {
          const app = trackedApps[scholarship.id];
          const evaluation = evaluations[scholarship.id];
          const deadline = formatDeadlineRelative(scholarship.deadline);
          const completedCount = app?.completedRequirements?.length || 0;
          const totalReqs = scholarship.requirements.length;
          const pct = Math.round((completedCount / (totalReqs || 1)) * 100);

          return (
            <div
              key={scholarship.id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-medium text-slate-700">{scholarship.organization}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-data text-slate-900 font-semibold">
                    {scholarship.awardDisplay.split('(')[0]}
                  </span>
                  {evaluation && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-emerald-700">
                        {evaluation.matchScore}% Match
                      </span>
                    </>
                  )}
                </div>

                <h3
                  onClick={() => onOpenDetails(scholarship)}
                  className="text-base font-bold text-slate-900 tracking-tight hover:text-slate-700 cursor-pointer transition-colors"
                >
                  {scholarship.name}
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                  <span
                    className={`font-mono-data font-medium ${
                      deadline.isUrgent ? 'text-amber-700 font-semibold' : 'text-slate-600'
                    }`}
                  >
                    Deadline: {scholarship.deadline} ({deadline.displayText})
                  </span>

                  <span aria-hidden="true" className="text-slate-300">·</span>

                  <span>
                    Prep Progress: {completedCount}/{totalReqs} requirements ({pct}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-2 w-full max-w-md bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-slate-900 h-1.5 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Stage selector and action buttons */}
              <div className="flex items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <select
                  value={app?.stage || 'saved'}
                  onChange={(e) => onUpdateStage(scholarship.id, e.target.value as ApplicationStage)}
                  className="text-xs bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1.5 font-medium text-slate-800 focus:outline-hidden"
                >
                  <option value="saved">Stage: Saved</option>
                  <option value="in_progress">Stage: In Progress</option>
                  <option value="submitted">Stage: Submitted</option>
                  <option value="awarded">Stage: Awarded</option>
                  <option value="declined">Stage: Declined</option>
                </select>

                <button
                  type="button"
                  onClick={() => onOpenDetails(scholarship)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors"
                >
                  Details
                </button>

                <button
                  type="button"
                  onClick={() => onRemoveTracked(scholarship.id)}
                  aria-label="Remove from tracker"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                  title="Remove from saved tracker"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
