/**
 * SOVEREIGN BRIDGE SYNC SCRIPT
 * 
 * Syncs user profile data between ZyeuteV5 (Social) and Voyageur Luxury (Life Admin)
 * via the TAKIN memory layer.
 * 
 * Maps:
 * - Zyeute: username, avatar, theme_preferences → Voyageur: displayName, avatar, imperialTheme
 * - User Intent Shift Detection: Social Mode ↔ Admin Mode
 */

import { z } from 'zod';

// ==========================================
// ZYEUTEV5 USER SCHEMA (Source)
// ==========================================
const ZyeuteUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  display_name: z.string().nullable(),
  avatar_url: z.string().nullable(),
  bio: z.string().nullable(),
  city: z.string().nullable(),
  region: z.string().nullable(),
  is_verified: z.boolean(),
  isPremium: z.boolean(),
  coins: z.number(),
  piasse_balance: z.number(),
  total_karma: z.number(),
  fire_score: z.number(),
  created_at: z.string(),
  
  // Theme preferences (for sync)
  theme_preference: z.enum(['light', 'dark', 'auto']).optional(),
  gold_accent: z.boolean().optional(),
  
  // Ti-Guy settings (Quebec authenticity)
  tiGuyCommentsEnabled: z.boolean(),
  
  // Gamification
  nectar_points: z.number(),
  tier: z.enum(['novice', 'vrai', 'pur_laine', 'legende', 'icone']).optional(),
});

// ==========================================
// VOYAGEUR LUXURY USER SCHEMA (Target)
// ==========================================
const VoyageurUserSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  avatarUrl: z.string().nullable(),
  email: z.string().email().optional(),
  
  // Imperial Theme Settings
  imperialTheme: z.object({
    accentGold: z.boolean(),
    leatherTexture: z.boolean(),
    hexGrid: z.boolean(),
    viscosity: z.enum(['low', 'medium', 'high']),
  }).optional(),
  
  // Quebec Preferences
  joualMode: z.boolean(),
  preferredLanguage: z.enum(['fr', 'en', 'both']),
  
  // Life Admin Data
  travelPoints: z.number(),
  luxuryCredits: z.number(),
  bookingHistory: z.array(z.any()).optional(),
});

// ==========================================
// SYNC MAPPING
// ==========================================
type ZyeuteUser = z.infer<typeof ZyeuteUserSchema>;
type VoyageurUser = z.infer<typeof VoyageurUserSchema>;

interface SyncResult {
  success: boolean;
  syncedFields: string[];
  conflicts: string[];
  warnings: string[];
}

/**
 * Transform ZyeuteV5 user to Voyageur Luxury format
 */
export function syncZyeuteToVoyageur(zyeuteUser: ZyeuteUser): Partial<VoyageurUser> {
  const result: Partial<VoyageurUser> = {
    id: zyeuteUser.id,
    displayName: zyeuteUser.display_name || zyeuteUser.username,
    avatarUrl: zyeuteUser.avatar_url,
    
    // Map theme preferences
    imperialTheme: {
      accentGold: zyeuteUser.gold_accent || false,
      leatherTexture: true, // Default for luxury
      hexGrid: true, // Colony OS signature
      viscosity: 'medium',
    },
    
    // Map Quebec settings
    joualMode: zyeuteUser.tiGuyCommentsEnabled,
    preferredLanguage: 'both',
    
    // Carry over gamification as luxury credits
    luxuryCredits: zyeuteUser.nectar_points,
  };
  
  return result;
}

/**
 * Detect User Intent Shift (Social Mode ↔ Admin Mode)
 */
export type UserMode = 'social' | 'admin' | 'transitioning';

interface IntentShiftEvent {
  userId: string;
  previousMode: UserMode;
  currentMode: UserMode;
  timestamp: string;
  trigger: 'explicit' | 'time_based' | 'navigation_pattern';
  confidence: number;
}

/**
 * Analyze navigation patterns to detect mode shifts
 */
export function detectIntentShift(
  recentPages: string[],
  sessionDurationMs: number,
  explicitAction?: boolean
): IntentShiftEvent | null {
  
  const socialPages = ['/feed', '/explore', '/profile', '/video', '/chat'];
  const adminPages = ['/bookings', '/travel', '/luxury', '/concierge', '/admin'];
  
  const socialCount = recentPages.filter(p => socialPages.some(sp => p.includes(sp))).length;
  const adminCount = recentPages.filter(p => adminPages.some(ap => p.includes(ap))).length;
  
  // Strong shift signal
  if (Math.abs(socialCount - adminCount) >= 3) {
    const newMode = adminCount > socialCount ? 'admin' : 'social';
    return {
      userId: 'unknown', // Would come from session
      previousMode: 'transitioning',
      currentMode: newMode,
      timestamp: new Date().toISOString(),
      trigger: explicitAction ? 'explicit' : 'navigation_pattern',
      confidence: Math.min(0.95, (Math.abs(socialCount - adminCount) / recentPages.length)),
    };
  }
  
  return null;
}

// ==========================================
// EXAMPLE USAGE
// ==========================================
const exampleZyeuteUser: ZyeuteUser = {
  id: 'user_123',
  username: 'TiGuy_Montreal',
  display_name: 'Marc Tremblay',
  avatar_url: 'https://zyeutecdn.com/avatars/marc.jpg',
  bio: 'Vrai Quebecois �🇦',
  city: 'Montreal',
  region: 'Quebec',
  is_verified: true,
  isPremium: true,
  coins: 1500,
  piasse_balance: 250.00,
  total_karma: 4200,
  fire_score: 85,
  created_at: '2025-01-15T00:00:00Z',
  theme_preference: 'dark',
  gold_accent: true,
  tiGuyCommentsEnabled: true,
  nectar_points: 5000,
  tier: 'pur_laine',
};

const voyageurUser = syncZyeuteToVoyageur(exampleZyeuteUser);
console.log('Synced user:', JSON.stringify(voyageurUser, null, 2));
