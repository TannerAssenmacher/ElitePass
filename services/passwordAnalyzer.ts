import { SecurityReport, PasswordSettings } from "../types";

/**
 * Local password security analyzer - no API required
 * Analyzes password strength based on length, character variety, patterns, and entropy
 */

// Common password patterns to check against
const COMMON_PATTERNS = [
  /^123/, /321$/, /password/i, /qwerty/i, /abc/i, /111/, /000/,
  /(.)\1{2,}/, // repeated characters
  /^[a-z]+$/i, // only letters
  /^[0-9]+$/, // only numbers
];

const COMMON_WORDS = [
  'password', 'admin', 'login', 'welcome', 'monkey', 'dragon', 'master',
  'hello', 'shadow', 'sunshine', 'princess', 'football', 'baseball',
  'iloveyou', 'trustno1', 'superman', 'batman', 'letmein', 'abc123'
];

// Improvement tips based on what's missing
const IMPROVEMENT_TIPS = {
  short: [
    "Make it longer! Aim for 16+ characters for elite security.",
    "Length is power! Add more characters to level up.",
    "Stretch it out! Longer passwords are exponentially stronger.",
  ],
  noSymbols: [
    "Spice it up with symbols like @#$% for extra strength!",
    "Add some !@#$ magic to boost your security.",
    "Symbols are your secret weapon—add a few!",
  ],
  noNumbers: [
    "Throw in some numbers to strengthen the mix!",
    "Numbers add complexity—sprinkle a few in!",
    "Add digits to make crackers cry!",
  ],
  noUppercase: [
    "Mix in some UPPERCASE letters for variety!",
    "Capital letters add punch—use them!",
    "Go big with some uppercase characters!",
  ],
  noLowercase: [
    "Add lowercase letters for better entropy!",
    "Mix in some lowercase for balance!",
  ],
  hasPattern: [
    "Avoid common patterns like 123 or abc!",
    "Mix it up more—predictable patterns are weak!",
    "Randomize! Patterns make passwords guessable.",
  ],
  excellent: [
    "Looking elite! Maximum security achieved! 🔐",
    "Perfect entropy! Hackers don't stand a chance!",
    "Bulletproof! This password is fortress-level!",
    "Maximum strength unlocked! You're a security pro!",
  ],
};

/**
 * Calculate Shannon entropy of a password
 */
function calculateEntropy(password: string): number {
  const freq: Record<string, number> = {};
  for (const char of password) {
    freq[char] = (freq[char] || 0) + 1;
  }
  
  let entropy = 0;
  const len = password.length;
  for (const count of Object.values(freq)) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }
  
  return entropy * len; // Total bits of entropy
}

/**
 * Estimate time to crack based on entropy and attack speed
 */
function estimateCrackTime(entropy: number): string {
  // Assume 10 billion guesses per second (modern GPU cluster)
  const guessesPerSecond = 10_000_000_000;
  const totalCombinations = Math.pow(2, entropy);
  const seconds = totalCombinations / guessesPerSecond / 2; // Average case
  
  if (seconds < 0.001) return "Instant";
  if (seconds < 1) return "Less than a second";
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 86400 * 30) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 86400 * 365) return `${Math.round(seconds / 86400 / 30)} months`;
  if (seconds < 86400 * 365 * 100) return `${Math.round(seconds / 86400 / 365)} years`;
  if (seconds < 86400 * 365 * 1000) return `${Math.round(seconds / 86400 / 365)} years`;
  if (seconds < 86400 * 365 * 1000000) return `${Math.round(seconds / 86400 / 365 / 1000)}K years`;
  if (seconds < 86400 * 365 * 1000000000) return `${Math.round(seconds / 86400 / 365 / 1000000)}M years`;
  return "Billions of years";
}

/**
 * Check for common patterns and weaknesses
 */
function findWeaknesses(password: string): string[] {
  const weaknesses: string[] = [];
  
  // Check length
  if (password.length < 8) weaknesses.push('too_short');
  else if (password.length < 12) weaknesses.push('short');
  
  // Check character classes
  if (!/[A-Z]/.test(password)) weaknesses.push('no_uppercase');
  if (!/[a-z]/.test(password)) weaknesses.push('no_lowercase');
  if (!/[0-9]/.test(password)) weaknesses.push('no_numbers');
  if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) weaknesses.push('no_symbols');
  
  // Check for common patterns
  for (const pattern of COMMON_PATTERNS) {
    if (pattern.test(password)) {
      weaknesses.push('has_pattern');
      break;
    }
  }
  
  // Check for common words
  const lowerPass = password.toLowerCase();
  for (const word of COMMON_WORDS) {
    if (lowerPass.includes(word)) {
      weaknesses.push('common_word');
      break;
    }
  }
  
  return weaknesses;
}

/**
 * Get a random item from an array
 */
function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Analyze a password and return a security report
 */
export const analyzePassword = async (password: string): Promise<SecurityReport> => {
  // Simulate a tiny delay to feel more natural
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const weaknesses = findWeaknesses(password);
  const entropy = calculateEntropy(password);
  const timeToCrack = estimateCrackTime(entropy);
  
  // Calculate base score
  let score = 0;
  
  // Length scoring (up to 35 points)
  if (password.length >= 20) score += 35;
  else if (password.length >= 16) score += 30;
  else if (password.length >= 12) score += 25;
  else if (password.length >= 8) score += 15;
  else score += 5;
  
  // Character variety scoring (up to 40 points)
  if (/[A-Z]/.test(password)) score += 10;
  if (/[a-z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 10;
  if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) score += 10;
  
  // Entropy bonus (up to 25 points)
  const entropyScore = Math.min(25, Math.floor(entropy / 3));
  score += entropyScore;
  
  // Penalties
  if (weaknesses.includes('has_pattern')) score -= 15;
  if (weaknesses.includes('common_word')) score -= 20;
  if (weaknesses.includes('too_short')) score -= 10;
  
  // Clamp score
  score = Math.max(0, Math.min(100, score));
  
  // Determine strength
  let strength: 'Weak' | 'Moderate' | 'Strong' | 'Elite';
  if (score < 30) strength = 'Weak';
  else if (score < 60) strength = 'Moderate';
  else if (score < 85) strength = 'Strong';
  else strength = 'Elite';
  
  // Generate analysis
  let analysis: string;
  if (strength === 'Elite') {
    analysis = "Excellent password! High entropy with great character variety.";
  } else if (strength === 'Strong') {
    analysis = "Good password strength. Minor improvements could make it elite.";
  } else if (strength === 'Moderate') {
    analysis = "Decent password, but could use more length or variety.";
  } else {
    analysis = "This password needs work. Add length and character variety.";
  }
  
  // Generate improvement tip
  let improvementTip: string;
  if (strength === 'Elite') {
    improvementTip = randomChoice(IMPROVEMENT_TIPS.excellent);
  } else if (weaknesses.includes('has_pattern') || weaknesses.includes('common_word')) {
    improvementTip = randomChoice(IMPROVEMENT_TIPS.hasPattern);
  } else if (weaknesses.includes('short') || weaknesses.includes('too_short')) {
    improvementTip = randomChoice(IMPROVEMENT_TIPS.short);
  } else if (weaknesses.includes('no_symbols')) {
    improvementTip = randomChoice(IMPROVEMENT_TIPS.noSymbols);
  } else if (weaknesses.includes('no_numbers')) {
    improvementTip = randomChoice(IMPROVEMENT_TIPS.noNumbers);
  } else if (weaknesses.includes('no_uppercase')) {
    improvementTip = randomChoice(IMPROVEMENT_TIPS.noUppercase);
  } else if (weaknesses.includes('no_lowercase')) {
    improvementTip = randomChoice(IMPROVEMENT_TIPS.noLowercase);
  } else {
    improvementTip = randomChoice(IMPROVEMENT_TIPS.excellent);
  }
  
  return {
    score,
    strength,
    analysis,
    timeToCrack,
    improvementTip,
  };
};
