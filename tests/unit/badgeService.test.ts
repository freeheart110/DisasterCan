import { getEarnedBadges } from '../../src/services/badgeService';
import type { UserProfile, CompletedItem } from '../../src/services/profileService';

const completedItem: CompletedItem = {
  id: 'item1',
  completedAt: '2025-09-21',
  expiryDays: 180,
};

describe('badgeService', () => {
  it('should award "Prepared Citizen" badge when both common checklists are fully completed', () => {
    const mockProfile: UserProfile = {
      userId: 'testUser',
      point: 0,
      level: 1,
      badges: [],
      completedQuests: {
        'kit-1': {
          checklistItems: {
            essentials: [completedItem],
          },
        },
        'plan-1': {
          checklistItems: {
            safety: [completedItem],
          },
        },
      },
    };

    const badges = getEarnedBadges(mockProfile);
    expect(badges).toContain('Prepared Citizen');
  });

  it('should not award "Prepared Citizen" if only one checklist is complete', () => {
    const mockProfile: UserProfile = {
      userId: 'testUser',
      point: 0,
      level: 1,
      badges: [],
      completedQuests: {
        'kit-1': {
          checklistItems: {
            essentials: [completedItem],
          },
        },
        'plan-1': {
          checklistItems: {
            safety: [],
          },
        },
      },
    };

    const badges = getEarnedBadges(mockProfile);
    expect(badges).not.toContain('Prepared Citizen');
  });

  it('should award "Wildfire Smoke Ready" badge when checklist and quiz are completed', () => {
    const mockProfile: UserProfile = {
      userId: 'testUser',
      point: 0,
      level: 1,
      badges: [],
      completedQuests: {
        'hazard-wildfire-smoke-1': {
          checklistItems: {
            safety: [completedItem],
          },
        },
        'quiz-airquality-1': {
          quizCompleted: true,
        },
      },
    };

    const badges = getEarnedBadges(mockProfile);
    expect(badges).toContain('Wildfire Smoke Ready');
  });

  it('should not award "Wildfire Smoke Ready" badge if quiz is not completed', () => {
    const mockProfile: UserProfile = {
      userId: 'testUser',
      point: 0,
      level: 1,
      badges: [],
      completedQuests: {
        'hazard-wildfire-smoke-1': {
          checklistItems: {
            safety: [completedItem],
          },
        },
        'quiz-airquality-1': {
          quizCompleted: false,
        },
      },
    };

    const badges = getEarnedBadges(mockProfile);
    expect(badges).not.toContain('Wildfire Smoke Ready');
  });

  it('should return an empty array if no badge conditions are met', () => {
    const mockProfile: UserProfile = {
      userId: 'testUser',
      point: 0,
      level: 1,
      badges: [],
      completedQuests: {},
    };

    const badges = getEarnedBadges(mockProfile);
    expect(badges).toEqual([]);
  });
});