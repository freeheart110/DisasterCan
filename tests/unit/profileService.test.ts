import { getUserProfile } from '../../src/services/profileService';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../src/firebase/config';

// Mock Firestore functions
jest.mock('firebase/firestore', () => {
  const original = jest.requireActual('firebase/firestore');
  return {
    ...original,
    doc: jest.fn(),
    getDoc: jest.fn(),
    setDoc: jest.fn(),
  };
});

const mockDoc = doc as jest.Mock;
const mockGetDoc = getDoc as jest.Mock;
const mockSetDoc = setDoc as jest.Mock;

jest.mock('../../../src/firebase/config', () => ({
  db: {},
}));

describe('getUserProfile', () => {
  const mockUserId = 'test_user_123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns existing user profile if document exists', async () => {
    const mockProfile = {
      userId: mockUserId,
      point: 10,
      level: 2,
      badges: ['starter'],
      completedQuests: { exampleQuest: { title: 'Sample Quest' } },
    };

    // Simulate Firestore document that exists
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => mockProfile,
    });

    mockDoc.mockReturnValue(`doc_ref_for_${mockUserId}`);

    const result = await getUserProfile(mockUserId);

    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', mockUserId);
    expect(getDoc).toHaveBeenCalledWith(`doc_ref_for_${mockUserId}`);
    expect(result).toEqual(mockProfile);
    expect(setDoc).not.toHaveBeenCalled();
  });

  it('creates and returns default user profile if document does not exist', async () => {
    mockGetDoc.mockResolvedValue({
      exists: () => false,
    });

    const expectedDefault = {
      userId: mockUserId,
      point: 0,
      level: 1,
      badges: [],
      completedQuests: {},
    };

    mockDoc.mockReturnValue(`doc_ref_for_${mockUserId}`);

    const result = await getUserProfile(mockUserId);

    expect(setDoc).toHaveBeenCalledWith(`doc_ref_for_${mockUserId}`, expectedDefault);
    expect(result).toEqual(expectedDefault);
  });
});