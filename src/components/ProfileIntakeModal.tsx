import React, { useState } from 'react';
import {
  StudentProfile,
  AcademicLevel,
  FieldOfStudy,
  CitizenshipStatus,
  FinancialNeedLevel,
} from '../types/scholarship';
import {
  ACADEMIC_LEVEL_LABELS,
  FIELD_OF_STUDY_LABELS,
  CITIZENSHIP_LABELS,
} from '../utils/matchingEngine';
import { PRESET_PERSONAS, DEFAULT_BLANK_PROFILE } from '../data/personas';
import { X, Check, Sparkles, RotateCcw, HelpCircle } from 'lucide-react';

interface ProfileIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSaveProfile: (newProfile: StudentProfile) => void;
}

export const ProfileIntakeModal: React.FC<ProfileIntakeModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('');

  if (!isOpen) return null;

  const handleSelectPersona = (personaId: string) => {
    setSelectedPersonaId(personaId);
    const persona = PRESET_PERSONAS.find((p) => p.id === personaId);
    if (persona) {
      setFormData({ ...persona.profile });
    }
  };

  const handleReset = () => {
    setSelectedPersonaId('');
    setFormData({ ...DEFAULT_BLANK_PROFILE });
  };

  const handleDemographicToggle = (key: keyof StudentProfile['demographics']) => {
    setFormData((prev) => ({
      ...prev,
      demographics: {
        ...prev.demographics,
        [key]: !prev.demographics[key],
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...formData,
      isCompleted: true,
      fullName: formData.fullName.trim() || 'Student Scholar',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-slate-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 rounded-t-xl">
          <div>
            <h2 id="profile-modal-title" className="text-lg font-bold text-slate-900 tracking-tight">
              Student Eligibility Profile
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your academic and background details once to unlock tailored scholarships and eligibility audits.
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5 space-y-6 text-sm">
          {/* Preset personas banner */}
          <div className="p-3.5 bg-slate-100/80 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-slate-600" />
                Quick Test Personas (Click to load pre-configured profile)
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_PERSONAS.map((persona) => {
                const isActive = selectedPersonaId === persona.id;
                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => handleSelectPersona(persona.id)}
                    className={`p-2 text-left rounded-md border transition-all ${
                      isActive
                        ? 'bg-white border-slate-900 shadow-xs'
                        : 'bg-white/70 border-slate-200 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="text-xs font-semibold text-slate-900 truncate">
                      {persona.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {persona.tagline.split('·')[0]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 1: Basic & Academic Standing */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              01. Academic Standing & Major
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name / Preferred Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Maya Chen"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Current Academic Level *
                </label>
                <select
                  value={formData.academicLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, academicLevel: e.target.value as AcademicLevel })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                >
                  {Object.entries(ACADEMIC_LEVEL_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Primary Field of Study / Major *
                </label>
                <select
                  value={formData.major}
                  onChange={(e) =>
                    setFormData({ ...formData, major: e.target.value as FieldOfStudy })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                >
                  {Object.entries(FIELD_OF_STUDY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Specific Concentration or Dual Major
                </label>
                <input
                  type="text"
                  value={formData.customMajorName}
                  onChange={(e) =>
                    setFormData({ ...formData, customMajorName: e.target.value })
                  }
                  placeholder="e.g. Artificial Intelligence & Cognitive Science"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section 2: GPA & Citizenship */}
          <div className="pt-2 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              02. Academic Performance & Citizenship
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-700">
                    Cumulative GPA (4.00 Scale) *
                  </label>
                  <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {formData.gpa.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="2.00"
                    max="4.00"
                    step="0.05"
                    value={formData.gpa}
                    onChange={(e) =>
                      setFormData({ ...formData, gpa: parseFloat(e.target.value) })
                    }
                    className="w-full accent-slate-900 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="1.0"
                    max="4.0"
                    step="0.01"
                    value={formData.gpa}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val) && val >= 0 && val <= 4.0) {
                        setFormData({ ...formData, gpa: val });
                      }
                    }}
                    className="w-20 px-2 py-1 text-xs font-mono text-center bg-white border border-slate-300 rounded"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Most competitive awards review unweighted GPA or high school weighted scale.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Citizenship / Residency Status *
                </label>
                <select
                  value={formData.citizenship}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      citizenship: e.target.value as CitizenshipStatus,
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                >
                  {Object.entries(CITIZENSHIP_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Matches scholarships accepting international, DACA, PR, or citizen candidates.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Financial Need */}
          <div className="pt-2 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              03. Financial Need Verification
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Many endowments prioritize students with Pell Grant eligibility or unmet financial need.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'high_need',
                  title: 'Pell Eligible / High Need',
                  desc: 'Household income < $55k/yr or eligible for federal Pell Grant.',
                },
                {
                  id: 'moderate_need',
                  title: 'Moderate Financial Need',
                  desc: 'Some family contribution, but tuition gap remains.',
                },
                {
                  id: 'merit_only',
                  title: 'Merit-Focused (No Need)',
                  desc: 'Seeking awards based strictly on accomplishments.',
                },
              ].map((tier) => {
                const isSelected = formData.financialNeed === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        financialNeed: tier.id as FinancialNeedLevel,
                      })
                    }
                    className={`p-3 text-left rounded-lg border transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900">{tier.title}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-slate-900" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">{tier.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Demographic Background & Affinity */}
          <div className="pt-2 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              04. Background, Identity & Affinity Criteria
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Specific foundations dedicate funds to underrepresented and historically underserved student groups. Check all that apply:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                {
                  key: 'firstGeneration' as const,
                  label: 'First-Generation College Student',
                  desc: 'Neither parent completed a four-year bachelor’s degree.',
                },
                {
                  key: 'womanInStem' as const,
                  label: 'Woman in STEM / Technical Discipline',
                  desc: 'Female-identifying student pursuing science, tech, math, or engineering.',
                },
                {
                  key: 'underrepresentedMinority' as const,
                  label: 'Underrepresented Minority Background',
                  desc: 'Hispanic/Latino, Black/African American, Indigenous, or Pacific Islander.',
                },
                {
                  key: 'lgbtqPlus' as const,
                  label: 'LGBTQ+ Identity',
                  desc: 'Openly identifying student engaged in or supported by LGBTQ+ community.',
                },
                {
                  key: 'militaryVeteranOrDependent' as const,
                  label: 'Military Veteran, Active Duty or Dependent',
                  desc: 'Served in armed forces or dependent child/spouse of veteran.',
                },
                {
                  key: 'disabilityOrNeurodivergent' as const,
                  label: 'Student with Disability or Neurodiversity',
                  desc: 'Visible or invisible disability (ADHD, mobility, chronic illness, etc.).',
                },
                {
                  key: 'communityServiceLeader' as const,
                  label: 'Demonstrated Community Service / Civic Leadership',
                  desc: '100+ volunteer hours, student council, or active grassroots organizing.',
                },
                {
                  key: 'researchExperience' as const,
                  label: 'Academic Research or Lab Experience',
                  desc: 'Published work, scientific experiments, or faculty research assistance.',
                },
              ].map((item) => {
                const checked = formData.demographics[item.key];
                return (
                  <label
                    key={item.key}
                    onClick={() => handleDemographicToggle(item.key)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer select-none transition-colors ${
                      checked
                        ? 'border-slate-900 bg-slate-50/80'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}} // Handled by parent label
                      className="mt-0.5 accent-slate-900 rounded"
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">{item.label}</div>
                      <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section 5: Long-term Aspiration */}
          <div className="pt-2 border-t border-slate-200">
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              05. Career Aspiration / Impact Goal (Optional)
            </label>
            <input
              type="text"
              value={formData.careerAspiration}
              onChange={(e) => setFormData({ ...formData, careerAspiration: e.target.value })}
              placeholder="e.g. Dedicated to pediatric cancer research and expanding underserved clinical care."
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs transition-colors whitespace-nowrap"
            >
              Save Profile & Update Matches
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
