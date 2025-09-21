// src/constants/quests/questConfig.ts

// --- Shared Types ---

export type QuestFormat = 'checklist' | 'quiz';
export type QuestCategory = 'common' | 'hazard';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: string;
  expiryDays?: number;   
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  title: string;
  questions: QuizQuestion[];
}

// --- Checklist Quest Structure ---

export interface ChecklistCategory {
  title: string;
  items: ChecklistItem[];
}

// --- Final Unified Quest Interface ---

export interface Quest {
  id: string;
  title: string;
  format: QuestFormat;     // 'checklist' or 'quiz'
  category: QuestCategory; // 'common' or 'hazard'
  categories?: ChecklistCategory[]; // required if format is 'checklist'
  quiz?: Quiz;                     // required if format is 'quiz'
}