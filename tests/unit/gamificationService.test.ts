// [1] Import service functions
import {
  calculateLevel,
  awardPointForChecklistItem,
  awardPointForQuizAnswer,
} from '../../src/services/gamificationService';

import { updateDoc, getDoc, doc, increment } from 'firebase/firestore';

// [2] Mock Firebase config
jest.mock('../../../src/firebase/config');

// [3] Manual point tracking
let mockPoint = 100;
let mockLevel = 1;

// [4] Mock firestore methods
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  updateDoc: jest.fn().mockImplementation((ref, data) => {
    if ('point' in data) {
      mockPoint += data.point;
    }
    if ('level' in data) {
      mockLevel = data.level;
    }
    return Promise.resolve();
  }),
  getDoc: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      exists: () => true,
      data: () => ({
        point: mockPoint,
        level: mockLevel,
      }),
    });
  }),
  increment: (n: number) => n,
  getFirestore: jest.fn(),
}));

describe('gamificationService', () => {
  const userId = 'testUser';
  const userDocRef = { path: `users/${userId}` };

  beforeEach(() => {
    jest.clearAllMocks();
    mockPoint = 100; // reset before each test
    mockLevel = 1;
  });

  beforeAll(() => {
    (doc as jest.Mock).mockReturnValue(userDocRef);
  });

  describe('calculateLevel', () => {
  it('should correctly calculate level based on 100 points per level', () => {
    expect(calculateLevel(0)).toBe(1);      // Start of Level 1
    expect(calculateLevel(99)).toBe(1);      // End of Level 1
    expect(calculateLevel(100)).toBe(2);     // Start of Level 2
    expect(calculateLevel(199)).toBe(2);     // End of Level 2
    expect(calculateLevel(200)).toBe(3);     // Start of Level 3
    expect(calculateLevel(350)).toBe(4);     // Middle of Level 4
  });
});

  describe('awardPointForChecklistItem', () => {
    it('should award +1 point for checking a checklist item', async () => {
      await awardPointForChecklistItem(userId);
      expect(updateDoc).toHaveBeenCalledWith(userDocRef, { point: 1 });
    });

    it('should award +5 points and level up when completing checklist (from 100 to 105)', async () => {
      await awardPointForChecklistItem(userId, true);
      expect(updateDoc).toHaveBeenCalledWith(userDocRef, { point: 5 });
      expect(updateDoc).toHaveBeenCalledWith(userDocRef, { level: 2 });
    });

    it('should deduct 1 point when unchecking a checklist item', async () => {
      await awardPointForChecklistItem(userId, false, true);
      expect(updateDoc).toHaveBeenCalledWith(userDocRef, { point: -1 });
    });
  });

  describe('awardPointForQuizAnswer', () => {
    it('should award +1 point for answering a quiz question', async () => {
      await awardPointForQuizAnswer(userId);
      expect(updateDoc).toHaveBeenCalledWith(userDocRef, { point: 1 });
    });

    it('should award +5 points and level up when finishing quiz', async () => {
      await awardPointForQuizAnswer(userId, true);
      expect(updateDoc).toHaveBeenCalledWith(userDocRef, { point: 5 });
      expect(updateDoc).toHaveBeenCalledWith(userDocRef, { level: 2 });
    });
  });

  describe('level-up progression', () => {
    it('should level up to 3 after gaining enough points (245 → +5 = 250)', async () => {
      mockPoint = 245;
      mockLevel = 2;
      await awardPointForChecklistItem(userId, true); // +5 → 250 → level 3
      expect(updateDoc).toHaveBeenCalledWith(userDocRef, { point: 5 });
      expect(updateDoc).toHaveBeenCalledWith(userDocRef, { level: 3 });
    });

    it('should not level up if new point total remains in same level bracket', async () => {
      mockPoint = 200;
      mockLevel = 3;
      await awardPointForChecklistItem(userId, false); // +1 → 201 → still level 3
      expect(updateDoc).toHaveBeenCalledWith(userDocRef, { point: 1 });
      expect(updateDoc).not.toHaveBeenCalledWith(userDocRef, { level: expect.any(Number) });
    });
  });
});