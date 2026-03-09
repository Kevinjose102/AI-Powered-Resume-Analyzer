import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 120000,
});

export interface Preset {
  id: string;
  title: string;
  description: string;
}

export interface SkillGap {
  skill: string;
  priority: string;
  why_important: string;
  current_level: string;
  required_level: string;
  current_level_pct: number;
  required_level_pct: number;
  resource_title: string;
  resource_platform: string;
  resource_hours: number;
  category?: string;
}

export interface LearningPathItem {
  week_range: string;
  focus: string;
  resource: string;
  goal: string;
}

export interface AnalysisResult {
  candidate_skills: string[];
  job_requirements: string[];
  analysis: {
    overall_match_score: number;
    category_scores: {
      technical_skills: number;
      experience: number;
      education: number;
      certifications: number;
    };
    matched_skills: Array<{ skill: string; category?: string; candidate_level?: string; required_level?: string; match_quality?: string }>;
    skill_gaps: SkillGap[];
    bonus_skills: Array<{ skill: string; category?: string; value_add?: string }>;
    learning_path: LearningPathItem[];
    executive_summary: string;
    strengths_narrative: string;
    gaps_narrative: string;
    market_positioning: string;
    action_plan: string;
  };
}

// Convert level strings to percentage values
const levelToPct: Record<string, number> = {
  'none': 0,
  'beginner': 25,
  'intermediate': 50,
  'advanced': 75,
  'expert': 100,
};

function levelToPercent(level: string | undefined): number {
  if (!level) return 0;
  return levelToPct[level.toLowerCase()] ?? 0;
}

// Guess a category for skills that don't have one (for filter pills)
function guessCategory(skill: string): string {
  const s = skill.toLowerCase();
  if (['python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'go', 'rust', 'ruby', 'php', 'kotlin', 'swift', 'r', 'scala'].some(l => s.includes(l))) return 'Programming';
  if (['react', 'angular', 'vue', 'django', 'flask', 'fastapi', 'express', 'spring', 'next', 'node'].some(l => s.includes(l))) return 'Frameworks';
  if (['sql', 'postgres', 'mysql', 'mongo', 'redis', 'database', 'dynamodb', 'cassandra'].some(l => s.includes(l))) return 'Databases';
  if (['docker', 'kubernetes', 'k8s', 'ci/cd', 'jenkins', 'terraform', 'ansible', 'devops'].some(l => s.includes(l))) return 'DevOps';
  if (['aws', 'gcp', 'azure', 'cloud', 'lambda', 's3', 'ec2'].some(l => s.includes(l))) return 'Cloud';
  if (['git', 'jira', 'figma', 'linux', 'rest', 'api', 'agile', 'scrum'].some(l => s.includes(l))) return 'Tools';
  return 'Other';
}

/**
 * Normalize the backend response to match the UI's expected shape.
 * - Flatten nested recommended_resource into top-level fields
 * - Compute percentage values from level strings
 * - Ensure category exists on all skill objects
 */
function normalizeAnalysisResult(raw: any): AnalysisResult {
  const analysis = raw.analysis || {};

  // Normalize skill_gaps
  const skill_gaps: SkillGap[] = (analysis.skill_gaps || []).map((gap: any) => {
    const resource = gap.recommended_resource || {};
    return {
      skill: gap.skill || '',
      priority: gap.priority || 'Medium',
      why_important: gap.why_important || '',
      current_level: gap.current_level || 'None',
      required_level: gap.required_level || '',
      current_level_pct: gap.current_level_pct ?? levelToPercent(gap.current_level),
      required_level_pct: gap.required_level_pct ?? levelToPercent(gap.required_level),
      resource_title: gap.resource_title || resource.title || '',
      resource_platform: gap.resource_platform || resource.platform || '',
      resource_hours: gap.resource_hours ?? resource.estimated_hours ?? 0,
      category: gap.category || guessCategory(gap.skill || ''),
    };
  });

  // Ensure category on matched_skills
  const matched_skills = (analysis.matched_skills || []).map((s: any) => ({
    ...s,
    category: s.category || guessCategory(s.skill || ''),
  }));

  // Ensure category on bonus_skills
  const bonus_skills = (analysis.bonus_skills || []).map((s: any) => ({
    ...s,
    category: s.category || guessCategory(s.skill || ''),
  }));

  return {
    candidate_skills: raw.candidate_skills || [],
    job_requirements: raw.job_requirements || [],
    analysis: {
      ...analysis,
      skill_gaps,
      matched_skills,
      bonus_skills,
    },
  };
}

export const fetchPresets = async (): Promise<Preset[]> => {
  const { data } = await api.get('/presets');
  return data.presets;
};

export const analyzeResume = async (
  resume: File,
  jobDescription: string,
  jobPreset: string
): Promise<AnalysisResult> => {
  const formData = new FormData();
  formData.append('resume', resume);
  if (jobDescription) formData.append('job_description', jobDescription);
  if (jobPreset) formData.append('job_preset', jobPreset);
  const { data } = await api.post('/analyze', formData);
  return normalizeAnalysisResult(data);
};

