    // A central place for our quest-related type definitions.

    export interface ChecklistItem {
      id: string;
      text: string;
      completed: boolean;
    }
    
    export interface QuizQuestion {
      question: string;
      options: string[];
      correctAnswer: string;
    }

    export interface Quiz {
      title: string;
      questions: QuizQuestion[];
    }

    export interface Quest {
      id: string;
      title: string;
      categories: {
        title: string;
        items: ChecklistItem[];
      }[];
      quiz?: Quiz; 
    }
    
