import {
  Scholarship,
  StudentProfile,
  MatchEvaluation,
  MatchTier,
  AuditCriterion,
  AcademicLevel,
  FieldOfStudy,
  CitizenshipStatus,
} from '../types/scholarship';

export const ACADEMIC_LEVEL_LABELS: Record<AcademicLevel, string> = {
  high_school_junior: 'High School Junior (11th)',
  high_school_senior: 'High School Senior (12th)',
  undergrad_freshman: 'Undergraduate Freshman',
  undergrad_sophomore: 'Undergraduate Sophomore',
  undergrad_junior: 'Undergraduate Junior',
  undergrad_senior: 'Undergraduate Senior',
  graduate_masters: "Master's / Graduate Student",
  graduate_phd: 'Doctorate / PhD Student',
  vocational_trade: 'Vocational / Trade Student',
};

export const FIELD_OF_STUDY_LABELS: Record<FieldOfStudy, string> = {
  computer_science: 'Computer Science & Software',
  engineering: 'Engineering (Mechanical, Electrical, Bio, etc.)',
  biology_health: 'Biological, Biomedical & Pre-Med',
  mathematics_physical_sci: 'Mathematics, Physics & Chemistry',
  business_finance: 'Business, Economics & Finance',
  arts_humanities_design: 'Arts, Humanities & Design',
  social_sciences_psychology: 'Social Sciences & Psychology',
  law_public_policy: 'Law, Policy & Public Administration',
  environmental_agriculture: 'Environmental Science & Sustainability',
  education: 'Education & Teaching',
  any: 'Open to All Fields of Study',
};

export const CITIZENSHIP_LABELS: Record<CitizenshipStatus, string> = {
  us_citizen: 'U.S. Citizen',
  us_permanent_resident: 'U.S. Permanent Resident (Green Card)',
  international: 'International Student (F-1 / Global)',
  daca_undocumented: 'DACA / Undocumented Student',
  uk_europe: 'UK / European Citizen',
  canada: 'Canadian Citizen',
  other: 'Other National Residency',
};

export function evaluateScholarshipMatch(
  scholarship: Scholarship,
  profile: StudentProfile
): MatchEvaluation {
  const audit: AuditCriterion[] = [];
  const highlights: string[] = [];
  let score = 50; // baseline score
  let meetsHardCriteria = true;

  // 1. Evaluate Academic Level
  const allowedLevels = scholarship.eligibility.allowedLevels;
  const levelMatches =
    allowedLevels === 'all' || allowedLevels.includes(profile.academicLevel);

  if (levelMatches) {
    score += 15;
    audit.push({
      label: 'Academic Standing',
      status: 'pass',
      studentValue: ACADEMIC_LEVEL_LABELS[profile.academicLevel] || profile.academicLevel,
      requiredValue:
        allowedLevels === 'all'
          ? 'All academic levels welcomed'
          : allowedLevels.map((l) => ACADEMIC_LEVEL_LABELS[l]).join(', '),
      explanation: 'Your current academic standing qualifies for this scholarship cohort.',
      isCritical: true,
    });
    highlights.push('Target academic year matches');
  } else {
    meetsHardCriteria = false;
    score -= 35;
    audit.push({
      label: 'Academic Standing',
      status: 'fail',
      studentValue: ACADEMIC_LEVEL_LABELS[profile.academicLevel] || profile.academicLevel,
      requiredValue: allowedLevels.map((l) => ACADEMIC_LEVEL_LABELS[l]).join(', '),
      explanation: `Restricted to: ${allowedLevels.map((l) => ACADEMIC_LEVEL_LABELS[l]).join(', ')}.`,
      isCritical: true,
    });
  }

  // 2. Evaluate Citizenship
  const allowedCitizenships = scholarship.eligibility.allowedCitizenships;
  const citizenshipMatches =
    allowedCitizenships === 'all' ||
    allowedCitizenships.includes(profile.citizenship);

  if (citizenshipMatches) {
    score += 10;
    audit.push({
      label: 'Citizenship / Residency',
      status: 'pass',
      studentValue: CITIZENSHIP_LABELS[profile.citizenship] || profile.citizenship,
      requiredValue:
        allowedCitizenships === 'all'
          ? 'Open to all nationalities'
          : allowedCitizenships.map((c) => CITIZENSHIP_LABELS[c]).join(', '),
      explanation: 'Your citizenship status meets the residency parameters.',
      isCritical: true,
    });
  } else {
    meetsHardCriteria = false;
    score -= 30;
    audit.push({
      label: 'Citizenship / Residency',
      status: 'fail',
      studentValue: CITIZENSHIP_LABELS[profile.citizenship] || profile.citizenship,
      requiredValue: allowedCitizenships.map((c) => CITIZENSHIP_LABELS[c]).join(', '),
      explanation: 'Sponsor requires specific national citizenship or permanent residency.',
      isCritical: true,
    });
  }

  // 3. Evaluate GPA Threshold
  const minGpa = scholarship.eligibility.minGpa;
  if (minGpa === null) {
    score += 10;
    audit.push({
      label: 'GPA Threshold',
      status: 'pass',
      studentValue: profile.gpa.toFixed(2),
      requiredValue: 'No minimum GPA mandated',
      explanation: 'Selection emphasizes holistic achievements and personal narrative.',
      isCritical: false,
    });
  } else if (profile.gpa >= minGpa) {
    score += 15;
    const gpaDelta = (profile.gpa - minGpa).toFixed(2);
    audit.push({
      label: 'GPA Threshold',
      status: 'pass',
      studentValue: profile.gpa.toFixed(2),
      requiredValue: `${minGpa.toFixed(2)} or above`,
      explanation: `Your GPA of ${profile.gpa.toFixed(2)} exceeds the minimum required (+${gpaDelta}).`,
      isCritical: true,
    });
    if (profile.gpa >= 3.75) {
      score += 5;
      highlights.push('High GPA competitive edge');
    }
  } else if (profile.gpa >= minGpa - 0.15) {
    // Borderline GPA
    score += 2;
    audit.push({
      label: 'GPA Threshold',
      status: 'neutral',
      studentValue: profile.gpa.toFixed(2),
      requiredValue: `${minGpa.toFixed(2)} or above`,
      explanation: `Close to the cutoff (${profile.gpa.toFixed(2)} vs ${minGpa.toFixed(2)}). Holistic review may consider mitigating circumstances.`,
      isCritical: true,
    });
  } else {
    meetsHardCriteria = false;
    score -= 25;
    audit.push({
      label: 'GPA Threshold',
      status: 'fail',
      studentValue: profile.gpa.toFixed(2),
      requiredValue: `${minGpa.toFixed(2)} minimum required`,
      explanation: `Current GPA of ${profile.gpa.toFixed(2)} is below the hard threshold of ${minGpa.toFixed(2)}.`,
      isCritical: true,
    });
  }

  // 4. Evaluate Field of Study / Major
  const allowedFields = scholarship.eligibility.allowedFields;
  const isAllFields = allowedFields === 'all';
  const majorMatches =
    isAllFields || allowedFields.includes(profile.major);

  if (majorMatches) {
    if (isAllFields) {
      score += 5;
      audit.push({
        label: 'Field of Study',
        status: 'pass',
        studentValue: FIELD_OF_STUDY_LABELS[profile.major] || profile.major,
        requiredValue: 'Any Major / Undeclared accepted',
        explanation: 'Open to candidates across all academic majors and disciplines.',
        isCritical: false,
      });
    } else {
      score += 15;
      audit.push({
        label: 'Field of Study',
        status: 'pass',
        studentValue: FIELD_OF_STUDY_LABELS[profile.major] || profile.major,
        requiredValue: allowedFields.map((f) => FIELD_OF_STUDY_LABELS[f]).join('; '),
        explanation: 'Direct programmatic match with your declared major.',
        isCritical: true,
      });
      highlights.push('Direct major alignment');
    }
  } else {
    meetsHardCriteria = false;
    score -= 30;
    audit.push({
      label: 'Field of Study',
      status: 'fail',
      studentValue: FIELD_OF_STUDY_LABELS[profile.major] || profile.major,
      requiredValue: allowedFields.map((f) => FIELD_OF_STUDY_LABELS[f]).join('; '),
      explanation: 'Sponsor requires a declared major in specified discipline.',
      isCritical: true,
    });
  }

  // 5. Evaluate Financial Need
  const requiresNeed = scholarship.eligibility.requiresNeed;
  if (requiresNeed) {
    if (profile.financialNeed === 'high_need') {
      score += 15;
      audit.push({
        label: 'Financial Need Criterion',
        status: 'pass',
        studentValue: 'Pell Eligible / High Financial Need',
        requiredValue: 'Demonstrated Financial Need / Low-Income',
        explanation: 'Your financial need status fulfills the core mission of this award.',
        isCritical: true,
      });
      highlights.push('Need-based priority');
    } else if (profile.financialNeed === 'moderate_need') {
      score += 8;
      audit.push({
        label: 'Financial Need Criterion',
        status: 'neutral',
        studentValue: 'Moderate Financial Need',
        requiredValue: 'Demonstrated Financial Need',
        explanation: 'Students with moderate need may qualify depending on university cost of attendance.',
        isCritical: true,
      });
    } else {
      meetsHardCriteria = false;
      score -= 25;
      audit.push({
        label: 'Financial Need Criterion',
        status: 'fail',
        studentValue: 'Merit-Focused / Low Need',
        requiredValue: 'Demonstrated Financial Need required',
        explanation: 'This endowment is strictly targeted at students with verified unmet financial need.',
        isCritical: true,
      });
    }
  } else {
    score += 5;
    audit.push({
      label: 'Financial Need Criterion',
      status: 'pass',
      studentValue:
        profile.financialNeed === 'high_need'
          ? 'High Need'
          : profile.financialNeed === 'moderate_need'
          ? 'Moderate Need'
          : 'Merit-Focused',
      requiredValue: 'Merit-Based (Open regardless of household income)',
      explanation: 'Selection is determined by merit and accomplishments without income tests.',
      isCritical: false,
    });
  }

  // 6. Evaluate Required Demographics
  if (scholarship.eligibility.requiredDemographics) {
    for (const reqDemo of scholarship.eligibility.requiredDemographics) {
      const studentHasDemo = Boolean(profile.demographics[reqDemo]);
      const demoLabel = getDemographicLabel(reqDemo);
      if (studentHasDemo) {
        score += 10;
        audit.push({
          label: `Mandatory Criterion: ${demoLabel}`,
          status: 'pass',
          studentValue: 'Verified in profile',
          requiredValue: `Must identify as ${demoLabel}`,
          explanation: `You meet the mandatory requirement for ${demoLabel}.`,
          isCritical: true,
        });
        highlights.push(`Meets ${demoLabel} charter`);
      } else {
        meetsHardCriteria = false;
        score -= 40;
        audit.push({
          label: `Mandatory Criterion: ${demoLabel}`,
          status: 'fail',
          studentValue: 'Not indicated in profile',
          requiredValue: `Must identify as ${demoLabel}`,
          explanation: `This opportunity is explicitly reserved for students identifying as ${demoLabel}.`,
          isCritical: true,
        });
      }
    }
  }

  // 7. Evaluate Preferred / Bonus Demographics
  if (scholarship.eligibility.preferredDemographics) {
    for (const prefDemo of scholarship.eligibility.preferredDemographics) {
      const studentHasDemo = Boolean(profile.demographics[prefDemo]);
      const demoLabel = getDemographicLabel(prefDemo);
      if (studentHasDemo) {
        score += 8;
        audit.push({
          label: `Preferred Priority: ${demoLabel}`,
          status: 'bonus',
          studentValue: 'Verified in profile',
          requiredValue: `Priority given to ${demoLabel}`,
          explanation: `Bonus match: Selection committee prioritizes ${demoLabel}.`,
          isCritical: false,
        });
        highlights.push(`Bonus: ${demoLabel}`);
      }
    }
  }

  // Bound score between 0 and 100
  let finalScore = Math.max(10, Math.min(100, Math.round(score)));

  // If hard criteria failed, clamp score to at most 48% so it can't rank as high match
  if (!meetsHardCriteria) {
    finalScore = Math.min(finalScore, 48);
  }

  // Determine Match Tier
  let tier: MatchTier;
  if (meetsHardCriteria && finalScore >= 85) {
    tier = 'direct_match';
  } else if (meetsHardCriteria && finalScore >= 65) {
    tier = 'eligible';
  } else if (finalScore >= 45) {
    tier = 'partial_match';
  } else {
    tier = 'ineligible';
  }

  return {
    scholarshipId: scholarship.id,
    matchScore: finalScore,
    tier,
    meetsHardCriteria,
    audit,
    highlights,
  };
}

function getDemographicLabel(key: string): string {
  const map: Record<string, string> = {
    firstGeneration: 'First-Generation College Student',
    womanInStem: 'Woman in STEM / Technical Discipline',
    underrepresentedMinority: 'Underrepresented Minority Background',
    lgbtqPlus: 'LGBTQ+ Identity',
    militaryVeteranOrDependent: 'Military Veteran, Active Duty or Dependent',
    disabilityOrNeurodivergent: 'Student with Disability or Neurodivergence',
    communityServiceLeader: 'Demonstrated Community Service & Leadership',
    researchExperience: 'Formal Academic Research Experience',
  };
  return map[key] || key;
}

export function formatDeadlineRelative(deadlineIso: string): {
  displayText: string;
  daysRemaining: number;
  isUrgent: boolean;
  isPast: boolean;
} {
  const now = new Date('2026-09-28'); // Current runtime anchor
  const target = new Date(deadlineIso);
  const diffTime = target.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return {
      displayText: 'Deadline passed',
      daysRemaining,
      isUrgent: false,
      isPast: true,
    };
  }

  if (daysRemaining === 0) {
    return {
      displayText: 'Due today',
      daysRemaining: 0,
      isUrgent: true,
      isPast: false,
    };
  }

  if (daysRemaining === 1) {
    return {
      displayText: '1 day left',
      daysRemaining: 1,
      isUrgent: true,
      isPast: false,
    };
  }

  if (daysRemaining <= 14) {
    return {
      displayText: `${daysRemaining} days left`,
      daysRemaining,
      isUrgent: true,
      isPast: false,
    };
  }

  if (daysRemaining <= 45) {
    return {
      displayText: `${daysRemaining} days remaining`,
      daysRemaining,
      isUrgent: false,
      isPast: false,
    };
  }

  return {
    displayText: `Due in ${Math.round(daysRemaining / 30)} months`,
    daysRemaining,
    isUrgent: false,
    isPast: false,
  };
}
