
import { PasswordSettings } from './types';

// Rhyming word pairs for fun memorable passwords
const RHYME_PAIRS = [
  ['cat', 'hat'], ['cat', 'bat'], ['cat', 'rat'],
  ['dog', 'fog'], ['dog', 'log'], ['dog', 'jog'],
  ['bear', 'hair'], ['bear', 'care'], ['bear', 'dare'],
  ['fox', 'box'], ['fox', 'rocks'], ['fox', 'socks'],
  ['bee', 'tree'], ['bee', 'free'], ['bee', 'key'],
  ['fish', 'wish'], ['fish', 'dish'], ['fish', 'swish'],
  ['frog', 'blog'], ['frog', 'clog'],
  ['mouse', 'house'], ['goat', 'boat'], ['goat', 'coat'],
  ['snake', 'cake'], ['snake', 'lake'], ['snake', 'wake'],
  ['whale', 'tale'], ['whale', 'sail'], ['whale', 'mail'],
  ['fly', 'sky'], ['fly', 'pie'], ['fly', 'high'],
  ['bug', 'hug'], ['bug', 'mug'], ['bug', 'rug'],
  ['owl', 'howl'], ['crow', 'snow'], ['crow', 'glow'],
];

// Alliterative pairs (same starting letter)
const ALLITERATIVE = [
  ['brave', 'bear'], ['bold', 'bird'], ['big', 'bunny'],
  ['crazy', 'cat'], ['cool', 'cobra'], ['calm', 'crab'],
  ['dancing', 'dog'], ['daring', 'duck'], ['dizzy', 'dolphin'],
  ['fancy', 'fox'], ['fast', 'frog'], ['fuzzy', 'fish'],
  ['gentle', 'goat'], ['giant', 'gorilla'], ['groovy', 'gator'],
  ['happy', 'hippo'], ['hungry', 'hawk'], ['hasty', 'hare'],
  ['jazzy', 'jaguar'], ['jumpy', 'jellyfish'],
  ['lucky', 'lion'], ['lazy', 'llama'], ['loud', 'lemur'],
  ['magic', 'moose'], ['mighty', 'monkey'], ['merry', 'mouse'],
  ['ninja', 'newt'], ['noble', 'narwhal'],
  ['purple', 'panda'], ['proud', 'penguin'], ['party', 'parrot'],
  ['quick', 'quail'], ['quiet', 'quokka'],
  ['rapid', 'rabbit'], ['royal', 'raven'],
  ['silly', 'shark'], ['super', 'snake'], ['swift', 'seal'],
  ['tiny', 'tiger'], ['turbo', 'turtle'], ['tricky', 'toucan'],
  ['wacky', 'wolf'], ['wild', 'whale'], ['wise', 'walrus'],
  ['zany', 'zebra'], ['zippy', 'zebu'],
];

// Action verbs for story patterns
const ACTIONS = ['runs', 'jumps', 'eats', 'sees', 'loves', 'hugs', 'finds', 'gets', 'wants', 'has'];
const PLACES = ['moon', 'mars', 'park', 'beach', 'cloud', 'star', 'hill', 'cave', 'lake', 'city'];

// Mini story templates: [subject, verb, object] patterns
const STORY_TEMPLATES = [
  ['cat', 'on', 'mat'], ['dog', 'in', 'fog'], ['frog', 'on', 'log'],
  ['bear', 'eats', 'pear'], ['goat', 'in', 'boat'], ['mouse', 'in', 'house'],
  ['fish', 'has', 'wish'], ['bee', 'is', 'free'], ['fly', 'in', 'sky'],
  ['owl', 'can', 'howl'], ['fox', 'in', 'box'], ['bug', 'gets', 'hug'],
];

// Fun phrases that are easy to visualize
const FUN_PHRASES = [
  'CatInHat', 'DogOnLog', 'FoxInBox', 'BugInRug', 'FrogOnLog',
  'BeeInTree', 'FlyInSky', 'BatInHat', 'RatInHat', 'GoatOnBoat',
  'SnakeAtLake', 'FishMakeWish', 'BearWithHair', 'OwlCanHowl',
  'CrowInSnow', 'MouseInHouse', 'WhaleWithTale', 'SnailOnTrail',
];

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateMemorableBase(): string {
  const pattern = Math.floor(Math.random() * 4);
  
  switch (pattern) {
    case 0: {
      // Rhyming pattern: "TheCatInTheHat" style
      const [word1, word2] = randomChoice(RHYME_PAIRS);
      const connectors = ['And', 'With', 'On', 'In', 'By'];
      return capitalize(word1) + randomChoice(connectors) + capitalize(word2);
    }
    case 1: {
      // Alliterative pattern: "BraveBear" style
      const [adj, noun] = randomChoice(ALLITERATIVE);
      return capitalize(adj) + capitalize(noun);
    }
    case 2: {
      // Story pattern: "CatOnMat" style
      const [subj, verb, obj] = randomChoice(STORY_TEMPLATES);
      return capitalize(subj) + capitalize(verb) + capitalize(obj);
    }
    case 3:
    default: {
      // Double alliterative: "BraveBearBigBox"
      const [adj1, noun1] = randomChoice(ALLITERATIVE);
      const [adj2, noun2] = randomChoice(ALLITERATIVE);
      return capitalize(adj1) + capitalize(noun1) + capitalize(adj2) + capitalize(noun2);
    }
  }
}

export const generatePassword = (settings: PasswordSettings): string => {
  if (settings.funToType) {
    const symbolChars = '!@#$%^&*';
    const numberChars = '0123456789';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    // Calculate required suffix length for guaranteed characters
    let requiredSuffix = '';
    if (settings.numbers) {
      requiredSuffix += numberChars[Math.floor(Math.random() * numberChars.length)];
      requiredSuffix += numberChars[Math.floor(Math.random() * numberChars.length)];
    }
    if (settings.symbols) {
      requiredSuffix += symbolChars[Math.floor(Math.random() * symbolChars.length)];
    }
    
    const reservedLength = requiredSuffix.length;
    const availableForPhrase = settings.length - reservedLength;
    
    // Generate memorable base - try multiple times to get a good fit
    let base = '';
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      const candidate = generateMemorableBase();
      
      // If this is the first phrase and it fits in available space, use it
      if (base === '' && candidate.length <= availableForPhrase) {
        base = candidate;
      }
      // If adding another phrase still fits within available space, add it
      else if (base !== '' && (base + candidate).length <= availableForPhrase) {
        base += candidate;
      }
      // If we have something and adding more would exceed, stop trying
      else if (base !== '') {
        break;
      }
      
      attempts++;
    }
    
    // If we still have nothing (very short password requested), use shortest possible
    if (base === '') {
      const shortPhrases = ['CatHat', 'DogFog', 'FoxBox', 'BeeKey', 'BugHug', 'Cat', 'Dog', 'Fox'];
      for (const phrase of shortPhrases) {
        if (phrase.length <= availableForPhrase) {
          base = phrase;
          break;
        }
      }
    }

    // Apply case transformations to the phrase
    if (!settings.uppercase && settings.lowercase) {
      base = base.toLowerCase();
    } else if (settings.uppercase && !settings.lowercase) {
      base = base.toUpperCase();
    }

    // Build padding pool for any remaining gap (between phrase and required suffix)
    let paddingChars = '';
    if (settings.numbers) paddingChars += numberChars;
    if (settings.symbols) paddingChars += symbolChars;
    if (settings.lowercase) paddingChars += lowercaseChars;
    if (settings.uppercase) paddingChars += uppercaseChars;
    if (paddingChars.length === 0) paddingChars = lowercaseChars;

    // Fill any gap between phrase and required suffix
    while (base.length < availableForPhrase) {
      base += paddingChars[Math.floor(Math.random() * paddingChars.length)];
    }
    
    // Append the guaranteed required characters (numbers + symbols)
    base += requiredSuffix;
    
    return base;
  }

  const chars = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  let pool = '';
  if (settings.uppercase) pool += chars.uppercase;
  if (settings.lowercase) pool += chars.lowercase;
  if (settings.numbers) pool += chars.numbers;
  if (settings.symbols) pool += chars.symbols;

  if (pool.length === 0) return '';

  let password = '';
  // Ensure at least one of each selected type is present
  if (settings.uppercase) password += chars.uppercase[Math.floor(Math.random() * chars.uppercase.length)];
  if (settings.lowercase) password += chars.lowercase[Math.floor(Math.random() * chars.lowercase.length)];
  if (settings.numbers) password += chars.numbers[Math.floor(Math.random() * chars.numbers.length)];
  if (settings.symbols) password += chars.symbols[Math.floor(Math.random() * chars.symbols.length)];

  while (password.length < settings.length) {
    password += pool[Math.floor(Math.random() * pool.length)];
  }

  // Shuffle the final string
  return password.split('').sort(() => 0.5 - Math.random()).join('');
};

export const generatePythonCode = (settings: PasswordSettings): string => {
  if (settings.funToType) {
    return `import random

def generate_memorable_password(length=${settings.length}):
    adjectives = ${JSON.stringify(ADJECTIVES)}
    nouns = ${JSON.stringify(NOUNS)}
    
    password = random.choice(adjectives)
    
    # Add words until we fill most of the length
    while len(password) < length - 4:
        word_list = random.choice([adjectives, nouns])
        password += random.choice(word_list)
        
    # Add numbers
    password += str(random.randint(10, 99))
    
    ${settings.symbols ? "password += random.choice('!@#$%^&*')" : ""}
    ${settings.uppercase ? "password = password.capitalize()" : ""}
    
    # Exact length adjustment
    if len(password) < length:
        chars = "abcdefghijklmnopqrstuvwxyz0123456789"
        password += ''.join(random.choice(chars) for _ in range(length - len(password)))
    
    return password[:length]

if __name__ == "__main__":
    print(generate_memorable_password())
`;
  }

  return `import random
import string

def generate_password(length=${settings.length}):
    chars = ""
    ${settings.uppercase ? 'chars += string.ascii_uppercase' : ''}
    ${settings.lowercase ? 'chars += string.ascii_lowercase' : ''}
    ${settings.numbers ? 'chars += string.digits' : ''}
    ${settings.symbols ? "chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'" : ''}
    
    if not chars:
        return "Please select at least one character type"
        
    # Guaranteed pool selection
    res = []
    ${settings.uppercase ? 'res.append(random.choice(string.ascii_uppercase))' : ''}
    ${settings.lowercase ? 'res.append(random.choice(string.ascii_lowercase))' : ''}
    ${settings.numbers ? 'res.append(random.choice(string.digits))' : ''}
    ${settings.symbols ? "res.append(random.choice('!@#$%^&*()_+-=[]{}|;:,.<>?'))" : ''}
    
    # Fill remaining
    while len(res) < length:
        res.append(random.choice(chars))
        
    random.shuffle(res)
    return ''.join(res)

if __name__ == "__main__":
    print(generate_password())
`;
};
