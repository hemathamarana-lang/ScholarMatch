import React, { useState, useEffect, useMemo } from 'react';
import {
  StudentProfile,
  Scholarship,
  MatchEvaluation,
  TrackedApplication,
  ApplicationStage,
} from './types/scholarship';
import { SCHOLARSHIPS_DATABASE } from './data/scholarships';
import { evaluateScholarshipMatch } from './utils/matchingEngine';
import { PRESET_PERSONAS, DEFAULT_BLANK_PROFILE } from './data/personas';
import { TopNavigation } from './components/TopNavigation';
import { HeroBanner } from './components/HeroBanner';
import { FilterToolbar, SortOption } from './components/FilterToolbar';
import { ScholarshipCard } from './components/ScholarshipCard';
import { ScholarshipDetailModal } from './components/ScholarshipDetailModal';
import { ProfileIntakeModal } from './components/ProfileIntakeModal';
import { ApplicationTrackerView } from './components/ApplicationTrackerView';
import { DeadlinesCalendarView } from './components/DeadlinesCalendarView';
import { ScholarshipComparisonModal } from './components/ScholarshipComparisonModal';
import { SpotlightSection } from './components/SpotlightSection';
import { Sparkles, SlidersHorizontal, ArrowRight, ShieldCheck, GraduationCap, Compass } from 'lucide-react';

const STORAGE_KEY_PROFILE = 'scholarship_student_profile_v1';
const STORAGE_KEY_TRACKED = 'scholarship_tracked_apps_v1';

export default function App() {
  // 1. Student Profile State (Initializes with Maya Chen as default populated persona so user gets instant insight)
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return PRESET_PERSONAS[0].profile;
  });

  // 2. Tracked Applications State
  const [trackedApps, setTrackedApps] = useState<Record<string, TrackedApplication>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRACKED);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    // Seed initial saved for demonstration
    return {
      'gates-scholarship': {
        scholarshipId: 'gates-scholarship',
        stage: 'saved',
        savedAt: new Date().toISOString(),
        completedRequirements: ['req_gates_transcripts'],
        customNotes: '',
      },
      'google-generation': {
        scholarshipId: 'google-generation',
        stage: 'in_progress',
        savedAt: new Date().toISOString(),
        completedRequirements: ['req_google_resume', 'req_google_transcripts'],
        customNotes: 'Coding assessment prep planned for next week.',
      },
    };
  });

  // Persist Profile to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  // Persist Tracked Apps to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRACKED, JSON.stringify(trackedApps));
    } catch {
      // ignore
    }
  }, [trackedApps]);

  // UI Navigation & Modals State
  const [currentTab, setCurrentTab] = useState<'matches' | 'directory' | 'tracker' | 'deadlines'>('matches');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [activeDetailScholarship, setActiveDetailScholarship] = useState<Scholarship | null>(null);
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState<boolean>(false);

  // Filters & Sorting State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedAwardType, setSelectedAwardType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('match_desc');

  // Compute evaluations for all scholarships against current student profile
  const evaluations = useMemo(() => {
    const map: Record<string, MatchEvaluation> = {};
    SCHOLARSHIPS_DATABASE.forEach((scholarship) => {
      map[scholarship.id] = evaluateScholarshipMatch(scholarship, profile);
    });
    return map;
  }, [profile]);

  // Total matching scholarships (Tier direct_match or eligible)
  const matchingScholarships = useMemo(() => {
    return SCHOLARSHIPS_DATABASE.filter((s) => {
      const evalResult = evaluations[s.id];
      return evalResult && (evalResult.tier === 'direct_match' || evalResult.tier === 'eligible');
    });
  }, [evaluations]);

  // Total potential funding for eligible matches
  const totalPotentialFunding = useMemo(() => {
    return matchingScholarships.reduce((sum, s) => sum + s.awardAmount, 0);
  }, [matchingScholarships]);

  // Filter & Sort scholarship list based on current active view
  const displayedScholarships = useMemo(() => {
    let list = [...SCHOLARSHIPS_DATABASE];

    // If on Matches tab, default to showing only Eligible and Partial matches (exclude hard ineligible)
    if (currentTab === 'matches') {
      list = list.filter((s) => {
        const evalResult = evaluations[s.id];
        return evalResult && evalResult.tier !== 'ineligible';
      });
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.organization.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((s) => s.category === selectedCategory);
    }

    // Tier filter
    if (selectedTier !== 'all') {
      list = list.filter((s) => {
        const evalResult = evaluations[s.id];
        if (!evalResult) return false;
        if (selectedTier === 'direct_match') return evalResult.tier === 'direct_match';
        if (selectedTier === 'eligible')
          return evalResult.tier === 'direct_match' || evalResult.tier === 'eligible';
        if (selectedTier === 'partial') return evalResult.tier === 'partial_match';
        return true;
      });
    }

    // Award Type filter
    if (selectedAwardType !== 'all') {
      list = list.filter((s) => s.awardType === selectedAwardType);
    }

    // Sort order
    list.sort((a, b) => {
      const evalA = evaluations[a.id];
      const evalB = evaluations[b.id];

      if (sortBy === 'match_desc') {
        return (evalB?.matchScore || 0) - (evalA?.matchScore || 0);
      }
      if (sortBy === 'award_desc') {
        return b.awardAmount - a.awardAmount;
      }
      if (sortBy === 'deadline_asc') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (sortBy === 'hours_asc') {
        const hoursA = a.requirements.reduce((acc, r) => acc + r.estimatedHours, 0);
        const hoursB = b.requirements.reduce((acc, r) => acc + r.estimatedHours, 0);
        return hoursA - hoursB;
      }
      return 0;
    });

    return list;
  }, [
    currentTab,
    searchQuery,
    selectedCategory,
    selectedTier,
    selectedAwardType,
    sortBy,
    evaluations,
  ]);

  // Saved / Bookmark Toggle
  const handleToggleSave = (scholarshipId: string) => {
    setTrackedApps((prev) => {
      const next = { ...prev };
      if (next[scholarshipId]) {
        delete next[scholarshipId];
      } else {
        next[scholarshipId] = {
          scholarshipId,
          stage: 'saved',
          savedAt: new Date().toISOString(),
          completedRequirements: [],
          customNotes: '',
        };
      }
      return next;
    });
  };

  // Update Application Stage
  const handleUpdateStage = (scholarshipId: string, stage: ApplicationStage) => {
    setTrackedApps((prev) => {
      const existing = prev[scholarshipId] || {
        scholarshipId,
        stage: 'saved',
        savedAt: new Date().toISOString(),
        completedRequirements: [],
        customNotes: '',
      };
      return {
        ...prev,
        [scholarshipId]: {
          ...existing,
          stage,
        },
      };
    });
  };

  // Toggle Requirement item in checklist
  const handleToggleRequirement = (scholarshipId: string, reqId: string) => {
    setTrackedApps((prev) => {
      const existing = prev[scholarshipId] || {
        scholarshipId,
        stage: 'saved',
        savedAt: new Date().toISOString(),
        completedRequirements: [],
        customNotes: '',
      };
      const isAlreadyCompleted = existing.completedRequirements.includes(reqId);
      const updatedReqs = isAlreadyCompleted
        ? existing.completedRequirements.filter((id) => id !== reqId)
        : [...existing.completedRequirements, reqId];

      return {
        ...prev,
        [scholarshipId]: {
          ...existing,
          completedRequirements: updatedReqs,
        },
      };
    });
  };

  // Remove from Tracked
  const handleRemoveTracked = (scholarshipId: string) => {
    setTrackedApps((prev) => {
      const next = { ...prev };
      delete next[scholarshipId];
      return next;
    });
  };

  // Compare Toggle
  const handleToggleCompare = (scholarshipId: string) => {
    setComparisonIds((prev) => {
      if (prev.includes(scholarshipId)) {
        return prev.filter((id) => id !== scholarshipId);
      }
      if (prev.length >= 3) {
        return [prev[1], prev[2], scholarshipId];
      }
      return [...prev, scholarshipId];
    });
  };

  const handleSelectPersona = (personaId: string) => {
    const persona = PRESET_PERSONAS.find((p) => p.id === personaId);
    if (persona) {
      setProfile({ ...persona.profile });
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTier('all');
    setSelectedAwardType('all');
    setSortBy('match_desc');
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedCategory !== 'all' ||
    selectedTier !== 'all' ||
    selectedAwardType !== 'all' ||
    sortBy !== 'match_desc';

  const comparedScholarships = useMemo(() => {
    return comparisonIds
      .map((id) => SCHOLARSHIPS_DATABASE.find((s) => s.id === id))
      .filter((s): s is Scholarship => Boolean(s));
  }, [comparisonIds]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* 3-zone Header Contract */}
      <TopNavigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        profile={profile}
        matchCount={matchingScholarships.length}
        savedCount={Object.keys(trackedApps).length}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Main Viewport Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroBanner
          profile={profile}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          onSelectPersona={handleSelectPersona}
          matchingCount={matchingScholarships.length}
          totalPotentialFunding={totalPotentialFunding}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* TAB 1: MATCHES or DIRECTORY */}
          {(currentTab === 'matches' || currentTab === 'directory') && (
            <div className="space-y-6">
              {/* Endowment Spotlights */}
              <SpotlightSection
                scholarships={SCHOLARSHIPS_DATABASE}
                evaluations={evaluations}
                onOpenDetails={(s) => setActiveDetailScholarship(s)}
              />

              {/* Filter and Search Bar */}
              <FilterToolbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedTier={selectedTier}
                onTierChange={setSelectedTier}
                selectedAwardType={selectedAwardType}
                onAwardTypeChange={setSelectedAwardType}
                sortBy={sortBy}
                onSortChange={setSortBy}
                totalFilteredCount={displayedScholarships.length}
                comparisonCount={comparisonIds.length}
                onOpenComparison={() => setIsComparisonModalOpen(true)}
                onResetFilters={handleResetFilters}
                hasActiveFilters={hasActiveFilters}
              />

              {/* Header metrics */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span className="font-mono-data">
                  Showing <strong>{displayedScholarships.length}</strong> scholarship opportunities
                  {currentTab === 'matches' && ' matching your profile'}
                </span>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline">
                    Click any card to inspect full requirements and benefits
                  </span>
                </div>
              </div>

              {/* Scholarship Cards Grid */}
              {displayedScholarships.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {displayedScholarships.map((scholarship) => {
                    const isSaved = Boolean(trackedApps[scholarship.id]);
                    const isCompared = comparisonIds.includes(scholarship.id);

                    return (
                      <ScholarshipCard
                        key={scholarship.id}
                        scholarship={scholarship}
                        evaluation={evaluations[scholarship.id]}
                        isSaved={isSaved}
                        onToggleSave={handleToggleSave}
                        onOpenDetails={(s) => setActiveDetailScholarship(s)}
                        isCompared={isCompared}
                        onToggleCompare={handleToggleCompare}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
                  <p className="text-sm font-semibold text-slate-900">
                    No scholarships matched your active filter selections.
                  </p>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Try broadening your category or GPA criteria, or reset your filters.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: APPLICATION TRACKER */}
          {currentTab === 'tracker' && (
            <ApplicationTrackerView
              scholarships={SCHOLARSHIPS_DATABASE}
              trackedApps={trackedApps}
              evaluations={evaluations}
              onOpenDetails={(s) => setActiveDetailScholarship(s)}
              onUpdateStage={handleUpdateStage}
              onRemoveTracked={handleRemoveTracked}
              onOpenProfile={() => setCurrentTab('matches')}
            />
          )}

          {/* TAB 3: DEADLINE CALENDAR */}
          {currentTab === 'deadlines' && (
            <DeadlinesCalendarView
              scholarships={SCHOLARSHIPS_DATABASE}
              evaluations={evaluations}
              onOpenDetails={(s) => setActiveDetailScholarship(s)}
              savedIds={Object.keys(trackedApps)}
            />
          )}
        </div>
      </main>

      {/* Floating comparison drawer button if scholarships are selected */}
      {comparisonIds.length > 0 && !isComparisonModalOpen && (
        <div className="fixed bottom-5 right-5 z-40">
          <button
            type="button"
            onClick={() => setIsComparisonModalOpen(true)}
            className="flex items-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-0.5"
          >
            <span>Compare {comparisonIds.length} Selected</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modals */}
      <ProfileIntakeModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={(newProfile) => setProfile(newProfile)}
      />

      <ScholarshipDetailModal
        scholarship={activeDetailScholarship}
        evaluation={activeDetailScholarship ? evaluations[activeDetailScholarship.id] : undefined}
        profile={profile}
        isSaved={activeDetailScholarship ? Boolean(trackedApps[activeDetailScholarship.id]) : false}
        onToggleSave={handleToggleSave}
        onClose={() => setActiveDetailScholarship(null)}
        applicationStage={
          activeDetailScholarship ? trackedApps[activeDetailScholarship.id]?.stage : 'saved'
        }
        onUpdateStage={handleUpdateStage}
        completedRequirements={
          activeDetailScholarship
            ? trackedApps[activeDetailScholarship.id]?.completedRequirements
            : []
        }
        onToggleRequirement={handleToggleRequirement}
      />

      <ScholarshipComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        scholarships={comparedScholarships}
        evaluations={evaluations}
        onRemove={(id) => handleToggleCompare(id)}
        onOpenDetails={(s) => {
          setIsComparisonModalOpen(false);
          setActiveDetailScholarship(s);
        }}
      />

      {/* Quiet, Human-Designed Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">ScholarMatch</span>
            <span aria-hidden="true">·</span>
            <span>Personalized Student Scholarship Navigator</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              Update Profile
            </button>
            <button
              onClick={() => setCurrentTab('directory')}
              className="hover:text-slate-900 transition-colors"
            >
              Scholarship Index
            </button>
            <button
              onClick={() => setCurrentTab('tracker')}
              className="hover:text-slate-900 transition-colors"
            >
              Application Tracker
            </button>
          </div>

          <div className="font-mono-data text-[11px] text-slate-400">
            Academic Year 2026–2027
          </div>
        </div>
      </footer>
    </div>
  );
}
