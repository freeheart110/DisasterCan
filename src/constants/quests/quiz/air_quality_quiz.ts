// src/constants/quests/quiz/air_quality_quiz.ts

import type { Quest } from '../questConfig';

/**
 * @file air_quality_quiz.ts
 * @description Quiz about air quality and wildfire smoke preparedness.
 * Source: Environment Canada & Public Safety Canada
 */

export const airQualityQuiz: Quest = {
  id: 'quiz-airquality-1',
  title: 'Air Quality & Wildfire Smoke Quiz',
  format: 'quiz',
  category: 'hazard',
  quiz: {
    title: 'How prepared are you for wildfire smoke?',
    questions: [
      {
        id: 'q1',
        question: 'What AQHI value indicates a high health risk from air pollution?',
        options: ['1-3', '4-6', '7-10', '11+'],
        correctAnswer: '7-10',
      },
      {
        id: 'q2',
        question: 'What is the best way to protect yourself from wildfire smoke indoors?',
        options: [
          'Open all windows',
          'Use a fan blowing air in from outside',
          'Close windows and use an air purifier with HEPA filter',
          'Stay in a garage with the car engine on',
        ],
        correctAnswer: 'Close windows and use an air purifier with HEPA filter',
      },
      {
        id: 'q3',
        question: 'Who is most at risk during wildfire smoke events?',
        options: [
          'Healthy adults',
          'Teenagers',
          'Children, elderly, and people with heart or lung conditions',
          'People who work night shifts',
        ],
        correctAnswer: 'Children, elderly, and people with heart or lung conditions',
      },
    ],
  },
};