import React from 'react';
import { StudentProfile } from '../types/scholarship';
import { UserCheck, Sparkles, SlidersHorizontal } from 'lucide-react';

interface TopNavigationProps {
  currentTab: 'matches' | 'directory' | 'tracker' | 'deadlines';
  onSelectTab: (tab: 'matches' | 'directory' | 'tracker' | 'deadlines') => void;
  profile: StudentProfile;
  matchCount: number;
  savedCount: number;
  onOpenProfileModal: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  currentTab,
  onSelectTab,
  profile,
  matchCount,
  savedCount,
  onOpenProfileModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element Brand Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('matches')}
            className="text-xl font-bold tracking-tight text-slate-900 hover:text-slate-700 transition-colors text-left"
          >
            ScholarMatch
          </button>
        </div>

        {/* Zone 2: Clean text navigation links with subtle hover states */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={() => onSelectTab('matches')}
            className={`transition-colors pb-1 border-b-2 whitespace-nowrap ${
              currentTab === 'matches'
                ? 'text-slate-950 border-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Personalized Matches
            {profile.isCompleted && matchCount > 0 && (
              <span className="ml-1.5 text-xs font-mono font-medium text-slate-500">
                ({matchCount})
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('directory')}
            className={`transition-colors pb-1 border-b-2 whitespace-nowrap ${
              currentTab === 'directory'
                ? 'text-slate-950 border-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            All Scholarships
          </button>

          <button
            onClick={() => onSelectTab('tracker')}
            className={`transition-colors pb-1 border-b-2 whitespace-nowrap ${
              currentTab === 'tracker'
                ? 'text-slate-950 border-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Application Tracker
            {savedCount > 0 && (
              <span className="ml-1.5 text-xs font-mono font-medium text-slate-500">
                ({savedCount})
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('deadlines')}
            className={`transition-colors pb-1 border-b-2 whitespace-nowrap ${
              currentTab === 'deadlines'
                ? 'text-slate-950 border-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Deadline Timeline
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenProfileModal}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              profile.isCompleted
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
            }`}
          >
            {profile.isCompleted ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {profile.fullName ? profile.fullName.split(' ')[0] : 'Profile'}{' '}
                  · Edit Details
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enter Student Details</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="flex md:hidden items-center justify-around border-t border-slate-200 bg-slate-50 py-2 px-2 text-xs font-medium text-slate-600">
        <button
          onClick={() => onSelectTab('matches')}
          className={`px-2 py-1 rounded ${
            currentTab === 'matches' ? 'bg-white text-slate-900 font-semibold shadow-xs' : ''
          }`}
        >
          Matches ({matchCount})
        </button>
        <button
          onClick={() => onSelectTab('directory')}
          className={`px-2 py-1 rounded ${
            currentTab === 'directory' ? 'bg-white text-slate-900 font-semibold shadow-xs' : ''
          }`}
        >
          Directory
        </button>
        <button
          onClick={() => onSelectTab('tracker')}
          className={`px-2 py-1 rounded ${
            currentTab === 'tracker' ? 'bg-white text-slate-900 font-semibold shadow-xs' : ''
          }`}
        >
          Tracker ({savedCount})
        </button>
        <button
          onClick={() => onSelectTab('deadlines')}
          className={`px-2 py-1 rounded ${
            currentTab === 'deadlines' ? 'bg-white text-slate-900 font-semibold shadow-xs' : ''
          }`}
        >
          Deadlines
        </button>
      </div>
    </header>
  );
};
