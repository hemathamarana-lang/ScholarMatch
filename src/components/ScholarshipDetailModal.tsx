import React, { useState } from 'react';
import {
  Scholarship,
  MatchEvaluation,
  StudentProfile,
  ApplicationStage,
} from '../types/scholarship';
import { formatDeadlineRelative } from '../utils/matchingEngine';
import {
  X,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Calendar,
  DollarSign,
  FileCheck2,
  Clock,
  Bookmark,
  BookmarkCheck,
  Award,
} from 'lucide-react';

interface ScholarshipDetailModalProps {
  scholarship: Scholarship | null;
  evaluation?: MatchEvaluation;
  profile: StudentProfile;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onClose: () => void;
  applicationStage?: ApplicationStage;
  onUpdateStage?: (id: string, stage: ApplicationStage) => void;
  completedRequirements?: string[];
  onToggleRequirement?: (scholarshipId: string, reqId: string) => void;
}

export const ScholarshipDetailModal: React.FC<ScholarshipDetailModalProps> = ({
  scholarship,
  evaluation,
  profile,
  isSaved,
  onToggleSave,
  onClose,
  applicationStage = 'saved',
  onUpdateStage,
  completedRequirements = [],
  onToggleRequirement,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'eligibility' | 'checklist' | 'essay'>('overview');

  if (!scholarship) return null;

  const deadlineInfo = formatDeadlineRelative(scholarship.deadline);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-slate-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="scholarship-detail-title"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/70 rounded-t-xl">
          <div className="pr-6">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="font-medium text-slate-700">{scholarship.organization}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{scholarship.category.replace('_', ' ')}</span>
              <span aria-hidden="true">·</span>
              <span>{scholarship.locationScope}</span>
            </div>

            <h2 id="scholarship-detail-title" className="text-xl font-bold text-slate-900 tracking-tight">
              {scholarship.name}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
              <span className="font-mono-data font-bold text-base text-slate-900">
                {scholarship.awardDisplay}
              </span>
              <span className="text-slate-400">|</span>
              <span className="flex items-center gap-1 text-slate-600 font-mono-data">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Due {scholarship.deadline} ({deadlineInfo.displayText})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onToggleSave(scholarship.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                isSaved
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save to Tracker</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/50 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Functional segmented filter tabs) */}
        <div className="px-6 pt-3 border-b border-slate-200 bg-white flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'text-slate-900 border-slate-900 font-semibold'
                  : 'text-slate-500 border-transparent hover:text-slate-800'
              }`}
            >
              Benefits & Details
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('eligibility')}
              className={`px-3 py-2 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'eligibility'
                  ? 'text-slate-900 border-slate-900 font-semibold'
                  : 'text-slate-500 border-transparent hover:text-slate-800'
              }`}
            >
              <span>Eligibility Audit</span>
              {evaluation && (
                <span className="font-mono-data text-[11px] font-semibold text-slate-700">
                  ({evaluation.matchScore}%)
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('checklist')}
              className={`px-3 py-2 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'checklist'
                  ? 'text-slate-900 border-slate-900 font-semibold'
                  : 'text-slate-500 border-transparent hover:text-slate-800'
              }`}
            >
              <span>Checklist & Timeline</span>
              <span className="font-mono-data text-[11px] text-slate-500">
                ({completedRequirements.length}/{scholarship.requirements.length})
              </span>
            </button>

            {scholarship.essayPrompt && (
              <button
                type="button"
                onClick={() => setActiveTab('essay')}
                className={`px-3 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'essay'
                    ? 'text-slate-900 border-slate-900 font-semibold'
                    : 'text-slate-500 border-transparent hover:text-slate-800'
                }`}
              >
                Essay Prompt & Tips
              </button>
            )}
          </div>

          {/* Quick application stage tracker toggle */}
          {onUpdateStage && isSaved && (
            <div className="hidden sm:flex items-center gap-2 py-1">
              <span className="text-[11px] text-slate-500">Stage:</span>
              <select
                value={applicationStage}
                onChange={(e) => onUpdateStage(scholarship.id, e.target.value as ApplicationStage)}
                className="text-xs bg-slate-100 border border-slate-300 rounded px-2 py-1 font-medium text-slate-800 focus:outline-hidden"
              >
                <option value="saved">Saved</option>
                <option value="in_progress">In Progress</option>
                <option value="submitted">Submitted</option>
                <option value="awarded">Awarded</option>
                <option value="declined">Declined</option>
              </select>
            </div>
          )}
        </div>

        {/* Modal Content Body */}
        <div className="overflow-y-auto px-6 py-6 space-y-6 text-sm flex-1">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Program Summary
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {scholarship.description}
                </p>
              </div>

              {/* Benefits breakdown */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Comprehensive Award Benefits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {scholarship.benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex items-center gap-2 font-semibold text-slate-900 text-xs mb-1">
                        {benefit.isMonetary ? (
                          <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Award className="w-4 h-4 text-slate-600 shrink-0" />
                        )}
                        <span>{benefit.title}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-normal pl-6">
                        {benefit.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key dates and timelines */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Milestone Dates & Timeline
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <span className="text-slate-400 block mb-0.5">Application Opens</span>
                    <span className="font-mono-data font-semibold text-slate-900">
                      {scholarship.applicationOpenDate}
                    </span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <span className="text-slate-400 block mb-0.5">Submission Deadline</span>
                    <span className="font-mono-data font-semibold text-slate-900">
                      {scholarship.deadline} ({deadlineInfo.displayText})
                    </span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <span className="text-slate-400 block mb-0.5">Winner Decisions</span>
                    <span className="font-mono-data font-semibold text-slate-900">
                      {scholarship.notificationDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Application steps */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Application Steps
                </h3>
                <ol className="space-y-2 text-xs text-slate-700">
                  {scholarship.applicationSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="font-mono-data font-semibold text-slate-400 shrink-0">
                        0{idx + 1}.
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: ELIGIBILITY AUDIT */}
          {activeTab === 'eligibility' && (
            <div className="space-y-6">
              {evaluation && (
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Student Match Score: {evaluation.matchScore}%
                    </div>
                    <div className="text-xs font-medium text-slate-600">
                      {evaluation.meetsHardCriteria
                        ? 'All mandatory eligibility requirements verified'
                        : 'Disqualifying criteria detected'}
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 transition-all ${
                        evaluation.tier === 'direct_match'
                          ? 'bg-emerald-600'
                          : evaluation.tier === 'eligible'
                          ? 'bg-sky-600'
                          : evaluation.tier === 'partial_match'
                          ? 'bg-amber-500'
                          : 'bg-slate-400'
                      }`}
                      style={{ width: `${evaluation.matchScore}%` }}
                    />
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Itemized Eligibility Audit
                </h3>
                <div className="space-y-3">
                  {evaluation?.audit.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-2.5">
                          {item.status === 'pass' && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          )}
                          {item.status === 'bonus' && (
                            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          )}
                          {item.status === 'neutral' && (
                            <AlertCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                          )}
                          {item.status === 'fail' && (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          )}

                          <div>
                            <div className="font-semibold text-slate-900">{item.label}</div>
                            <div className="text-slate-600 mt-1 leading-relaxed">
                              {item.explanation}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`font-semibold capitalize ${
                              item.status === 'pass'
                                ? 'text-emerald-700'
                                : item.status === 'bonus'
                                ? 'text-amber-700'
                                : item.status === 'fail'
                                ? 'text-rose-700'
                                : 'text-slate-600'
                            }`}
                          >
                            {item.status === 'pass'
                              ? 'Met'
                              : item.status === 'bonus'
                              ? 'Priority Bonus'
                              : item.status === 'fail'
                              ? 'Ineligible'
                              : 'Borderline'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2.5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-500">
                        <div>
                          <span className="text-slate-400">Your profile: </span>
                          <span className="font-medium text-slate-700">{item.studentValue}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Required: </span>
                          <span className="font-medium text-slate-700">{item.requiredValue}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Application Checklist & Prep Tracker
                  </h3>
                  <span className="text-xs text-slate-500">
                    {completedRequirements.length} of {scholarship.requirements.length} completed
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Check off items as you gather documents. Progress is saved automatically to your profile.
                </p>

                <div className="space-y-3">
                  {scholarship.requirements.map((req) => {
                    const isCompleted = completedRequirements.includes(req.id);
                    return (
                      <div
                        key={req.id}
                        onClick={() =>
                          onToggleRequirement && onToggleRequirement(scholarship.id, req.id)
                        }
                        className={`p-3.5 rounded-lg border cursor-pointer select-none transition-colors ${
                          isCompleted
                            ? 'bg-slate-50/80 border-slate-300'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isCompleted}
                            onChange={() => {}}
                            className="mt-0.5 accent-slate-900 rounded"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-xs font-semibold ${
                                  isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'
                                }`}
                              >
                                {req.title}
                              </span>
                              <span className="text-[11px] font-mono-data text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> ~{req.estimatedHours} hrs
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 leading-normal">
                              {req.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ESSAY PROMPT & REVIEWER TIPS */}
          {activeTab === 'essay' && scholarship.essayPrompt && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Official Application Essay Prompt
                </h3>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-800 leading-relaxed font-serif-display text-[15px]">
                  "{scholarship.essayPrompt}"
                </div>
              </div>

              {scholarship.tipsForSuccess.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Reviewer Insights & Strategies for Success
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {scholarship.tipsForSuccess.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/70 rounded-b-xl">
          <div className="text-xs text-slate-500 hidden sm:block">
            Verified provider: {scholarship.organization}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-md transition-colors"
            >
              Close
            </button>

            <a
              href={scholarship.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs transition-colors whitespace-nowrap"
            >
              <span>Visit Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
