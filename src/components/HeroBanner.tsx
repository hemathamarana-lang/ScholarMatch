import React from 'react';
import { StudentProfile } from '../types/scholarship';
import { ACADEMIC_LEVEL_LABELS, FIELD_OF_STUDY_LABELS } from '../utils/matchingEngine';
import { PRESET_PERSONAS } from '../data/personas';
import { Sparkles, SlidersHorizontal, CheckCircle2, ChevronRight, User } from 'lucide-react';

interface HeroBannerProps {
  profile: StudentProfile;
  onOpenProfileModal: () => void;
  onSelectPersona: (personaId: string) => void;
  matchingCount: number;
  totalPotentialFunding: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  profile,
  onOpenProfileModal,
  onSelectPersona,
  matchingCount,
  totalPotentialFunding,
}) => {
  return (
    <div className="relative bg-white border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left copy & call to action */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Personalized Scholarship Intelligence</span>
              <span aria-hidden="true">·</span>
              <span>2026–2027 Academic Cycle</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight text-balance leading-tight">
              Enter your academic profile once.
              <br />
              <span className="text-slate-700 font-normal">
                Unlock every scholarship you qualify for.
              </span>
            </h1>

            <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
              Eliminate hours of manual searching. ScholarMatch screens your GPA, academic level, citizenship, major, and demographic background against tens of millions in national grants, full rides, and fellowships.
            </p>

            {/* Profile summary bar or Setup CTA */}
            {profile.isCompleted ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                      {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{profile.fullName || 'Student Profile'}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {ACADEMIC_LEVEL_LABELS[profile.academicLevel]} · {FIELD_OF_STUDY_LABELS[profile.major]}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onOpenProfileModal}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Edit Profile Details</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-600 font-mono-data">
                  <span>
                    GPA: <strong className="text-slate-900">{profile.gpa.toFixed(2)}</strong>
                  </span>
                  <span>
                    Eligible Opportunities:{' '}
                    <strong className="text-emerald-700 font-bold">{matchingCount}</strong>
                  </span>
                  <span>
                    Identified Funding:{' '}
                    <strong className="text-slate-900 font-bold">
                      ${totalPotentialFunding.toLocaleString()}
                    </strong>
                  </span>
                </div>
              </div>
            ) : (
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <button
                  type="button"
                  onClick={onOpenProfileModal}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs transition-colors whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start Free Profile Match</span>
                </button>

                <span className="text-xs text-slate-500">
                  Takes &lt; 90 seconds · No signup required
                </span>
              </div>
            )}

            {/* Persona Quick-Switchers */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
                Or test with sample student personas:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {PRESET_PERSONAS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelectPersona(p.id)}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    {p.name} ({p.avatarInitials})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right image presentation */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-100 aspect-16/10">
              <img
                src="/src/assets/images/hero_scholarship_students_1790602465863.jpg"
                alt="University students studying together in a modern academic library"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white text-xs">
                <span className="font-semibold block text-sm">Empowering Every Student</span>
                <span className="text-slate-200 text-[11px]">
                  Connecting candidates to merit, full-ride, and diversity endowments worldwide.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
