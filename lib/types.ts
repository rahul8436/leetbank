export interface Example {
  input?: string;
  output?: string;
  explanation?: string;
}

export interface StrategyStep {
  step_number?: number | string;
  step_title?: string;
  step_description?: string;
}

export interface SampleExecution {
  content?: string;
}

export interface Explanation {
  problem_statement?: string;
  key_considerations?: string;
  conceptual_approach?: string;
  strategy?: StrategyStep[];
  sample_execution?: SampleExecution;
  time_complexity?: string;
  space_complexity?: string;
  time_taken?: string;
  performance_analysis?: string;
  key_concepts?: string[];
}

export interface ListMeta {
  role?: string;
  round?: string;
  role_display?: string;
  round_display?: string;
  asked_date?: string;
  category?: string;
  companies?: string[];
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  primary_company?: string;
  problem_number: number | string;
  description?: string;
  notes?: string;
  constraints?: string[];
  examples?: Example[];
  companies?: string[];
  explanation?: Explanation;
  solutions?: Record<string, string>;
  _list?: ListMeta;
}

export type ProblemWithKey = Problem & { key: string };

/** Lightweight record used by the searchable list on the client. */
export interface ProblemMeta {
  number: number;
  title: string;
  slug: string;
  difficulty: string;
  company: string;
  companies: string[];
  role: string;
  round: string;
  topics: string[];
}
