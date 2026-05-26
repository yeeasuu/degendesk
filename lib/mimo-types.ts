export type MimoMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type MimoCompletionRequest = {
  model: string;
  messages: MimoMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
};

export type MimoCompletionResponse = {
  id: string;
  choices: {
    index: number;
    message: { role: string; content: string };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type AuditSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type AuditFinding = {
  severity: AuditSeverity;
  title: string;
  description: string;
  location: string;
  recommendation: string;
};

export type AuditReport = {
  contractName: string;
  overallRisk: AuditSeverity;
  score: number; // 0-100, higher = safer
  findings: AuditFinding[];
  gasOptimizations: string[];
  summary: string;
};
