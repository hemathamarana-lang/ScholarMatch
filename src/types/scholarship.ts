export type AcademicLevel =
  | 'high_school_junior'
  | 'high_school_senior'
  | 'undergrad_freshman'
  | 'undergrad_sophomore'
  | 'undergrad_junior'
  | 'undergrad_senior'
  | 'graduate_masters'
  | 'graduate_phd'
  | 'vocational_trade';

export type FieldOfStudy =
  | 'computer_science'
  | 'engineering'
  | 'biology_health'
  | 'mathematics_physical_sci'
  | 'business_finance'
  | 'arts_humanities_design'
  | 'social_sciences_psychology'
  | 'law_public_policy'
  | 'environmental_agriculture'
  | 'education'
  | 'any';

export type CitizenshipStatus =
  | 'us_citizen'
  | 'us_permanent_resident'
  | 'international'
  | 'daca_undocumented'
  | 'uk_europe'
  | 'canada'
  | 'other';

export type FinancialNeedLevel = 'high_need' | 'moderate_need' | 'merit_only';

export interface DemographicProfile {
  firstGeneration: boolean;
  womanInStem: boolean;
  underrepresentedMinority: boolean;
  lgbtqPlus: boolean;
  militaryVeteranOrDependent: boolean;
  disabilityOrNeurodivergent: boolean;
  communityServiceLeader: boolean;
  researchExperience: boolean;
}

export interface StudentProfile {
  fullName: string;
  email: string;
  academicLevel: AcademicLevel;
  major: FieldOfStudy;
  customMajorName: string;
  gpa: number; // 0.00 - 4.00 scale
  citizenship: CitizenshipStatus;
  residenceState: string;
  financialNeed: FinancialNeedLevel;
  demographics: DemographicProfile;
  expectedGraduationYear: number;
  extracurriculars: string[];
  careerAspiration: string;
  isCompleted: boolean;
}

export type AwardType =
  | 'full_ride'
  | 'renewable_tuition'
  | 'one_time_grant'
  | 'fellowship_stipend';

export interface ScholarshipBenefit {
  title: string;
  description: string;
  isMonetary: boolean;
}

export interface ScholarshipEligibility {
  minGpa: number | null;
  allowedLevels: AcademicLevel[] | 'all';
  allowedCitizenships: CitizenshipStatus[] | 'all';
  allowedFields: FieldOfStudy[] | 'all';
  requiresNeed: boolean;
  requiredDemographics?: (keyof DemographicProfile)[];
  preferredDemographics?: (keyof DemographicProfile)[];
  summaryText: string;
  ageOrYearLimit?: string;
}

export interface ApplicationRequirementItem {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
}

export interface Scholarship {
  id: string;
  name: string;
  organization: string;
  category:
    | 'stem'
    | 'diversity'
    | 'leadership'
    | 'graduate'
    | 'need_based'
    | 'arts_humanities'
    | 'general_merit';
  awardAmount: number; // Numeric for sorting & total calculations
  awardDisplay: string;
  awardType: AwardType;
  renewableYears: number; // 0 = one time, 1-4 = renewable
  deadline: string; // ISO date 'YYYY-MM-DD'
  applicationOpenDate: string;
  notificationDate: string;
  locationScope: string;
  description: string;
  benefits: ScholarshipBenefit[];
  eligibility: ScholarshipEligibility;
  requirements: ApplicationRequirementItem[];
  essayPrompt?: string;
  applicationSteps: string[];
  tipsForSuccess: string[];
  officialUrl: string;
  featured?: boolean;
}

export type MatchTier = 'direct_match' | 'eligible' | 'partial_match' | 'ineligible';

export interface AuditCriterion {
  label: string;
  status: 'pass' | 'fail' | 'bonus' | 'neutral';
  studentValue: string;
  requiredValue: string;
  explanation: string;
  isCritical: boolean;
}

export interface MatchEvaluation {
  scholarshipId: string;
  matchScore: number; // 0 to 100
  tier: MatchTier;
  meetsHardCriteria: boolean;
  audit: AuditCriterion[];
  highlights: string[];
}

export type ApplicationStage =
  | 'saved'
  | 'in_progress'
  | 'submitted'
  | 'awarded'
  | 'declined';

export interface TrackedApplication {
  scholarshipId: string;
  stage: ApplicationStage;
  savedAt: string;
  completedRequirements: string[];
  customNotes: string;
}
