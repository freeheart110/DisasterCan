// A central place for our quest-related type definitions.

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  categories: {
    title: string;
    items: ChecklistItem[];
  }[];
}
