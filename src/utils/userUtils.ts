const ADJECTIVES = ['Brave', 'Swift', 'Calm', 'Bold', 'Wise', 'Kind', 'Sharp', 'Steady',
                    'Quick', 'Keen', 'Warm', 'Clear', 'Alert', 'Noble', 'Bright', 'Solid'];
const NOUNS      = ['Eagle', 'Wolf',  'Bear', 'Fox',  'Hawk', 'Deer', 'Lynx',  'Bison',
                    'Crane', 'Heron', 'Moose','Otter','Raven','Finch','Trout', 'Robin'];

/**
 * Derives a consistent, human-readable display name from a Firebase UID.
 * The same UID always produces the same name (deterministic via char codes).
 * Example: "Swift Hawk", "Brave Otter"
 */
export function formatUserId(uid: string): string {
  if (!uid) return 'Explorer';
  const adj  = ADJECTIVES[uid.charCodeAt(0) % ADJECTIVES.length];
  const noun = NOUNS[uid.charCodeAt(1) % NOUNS.length];
  return `${adj} ${noun}`;
}
