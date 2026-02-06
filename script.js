// ============================================================
// RAGEBAIT WORDLE
// A wordle that's rigged to make you ALMOST win every row
// but you only get it on the 6th try (maybe).
// ============================================================

// --- Word lists ---

// Words that have LOTS of similar-looking cousins (max frustration)
const TARGET_WORDS = [
  "CRANE", "PLATE", "STARE", "SHINE", "TRACE",
  "BLAME", "GRAPE", "BRIDE", "STONE", "PRIDE",
  "FLAME", "GRACE", "SPINE", "SLOPE", "GLOBE",
  "SWORE", "SNORE", "STORE", "SHORE", "SCORE",
  "BRAKE", "FLAKE", "SHAKE", "STAKE", "SNAKE",
  "LIGHT", "MIGHT", "NIGHT", "RIGHT", "SIGHT",
  "BLANK", "CLANK", "CRANK", "DRANK", "PLANK",
  "TRAIN", "BRAIN", "DRAIN", "GRAIN", "STAIN",
  "CLOUD", "PROUD", "GROUT", "SCOUT", "SHOUT",
  "BLINK", "CLINK", "DRINK", "THINK", "BRINK",
  "CHARM", "SWARM", "ALARM",
  "MOUSE", "HOUSE", "LOUSE", "DOUSE",
  "MOUND", "BOUND", "FOUND", "HOUND", "ROUND", "SOUND", "WOUND",
  "PASTE", "TASTE", "WASTE", "HASTE", "BASTE",
  "LINER", "DINER", "MINER", "FINER", "TIMER",
  "TOWER", "POWER", "LOWER", "MOWER", "BOWER",
  "MANGO", "TANGO",
  "PEACH", "BEACH", "REACH", "TEACH", "LEACH",
];

// Big valid word list for checking guesses (common 5-letter words)
const VALID_WORDS = new Set([
  // A
  "ABOUT","ABOVE","ABUSE","ACTED","ACUTE","ADMIT","ADOPT","ADULT","AFTER","AGAIN",
  "AGENT","AGREE","AHEAD","ALARM","ALBUM","ALERT","ALIEN","ALIGN","ALIKE","ALIVE",
  "ALLEY","ALLOW","ALONE","ALONG","ALTER","AMONG","ANGEL","ANGER","ANGLE","ANGRY",
  "ANIME","ANKLE","ANNEX","ANTIC","APART","APPLE","APPLY","ARENA","ARGUE","ARISE",
  "ARMED","ARMOR","AROMA","AROSE","ARRAY","ARROW","ARSON","ASIDE","ASKED","ASSET",
  "ATLAS","ATTIC","AUDIO","AUDIT","AVOID","AWAKE","AWARD","AWARE","AWFUL","AXIAL",
  // B
  "BADGE","BADLY","BAKER","BASED","BASIC","BASIN","BASIS","BATCH","BEACH","BEGUN",
  "BEING","BELOW","BENCH","BERRY","BIBLE","BIKES","BIRTH","BLACK","BLADE","BLAME",
  "BLAND","BLANK","BLAST","BLAZE","BLEAK","BLEED","BLEND","BLESS","BLIND","BLINK",
  "BLISS","BLOCK","BLOND","BLOOD","BLOOM","BLOWN","BLUES","BLUFF","BLUNT","BOARD",
  "BOAST","BONUS","BOOST","BOOTH","BOUND","BOXER","BRACE","BRAIN","BRAKE","BRAND",
  "BRAVE","BREAD","BREAK","BREED","BRICK","BRIDE","BRIEF","BRING","BRINK","BROAD",
  "BROKE","BROOK","BROWN","BRUSH","BUILD","BUILT","BUNCH","BURST","BUYER",
  // C
  "CABIN","CABLE","CAMEL","CANDY","CARGO","CARRY","CATCH","CAUSE","CEASE","CHAIN",
  "CHAIR","CHAOS","CHARM","CHART","CHASE","CHEAP","CHECK","CHEEK","CHEER","CHESS",
  "CHEST","CHIEF","CHILD","CHINA","CHOIR","CHOSE","CHUNK","CIVIL","CLAIM","CLAMP",
  "CLANK","CLASS","CLEAN","CLEAR","CLERK","CLICK","CLIFF","CLIMB","CLING","CLINK",
  "CLOCK","CLONE","CLOSE","CLOTH","CLOUD","CLOWN","COACH","COAST","COLOR","COMET",
  "COMIC","CORAL","COULD","COUNT","COURT","COVER","CRACK","CRAFT","CRANE","CRANK",
  "CRASH","CRAZY","CREAM","CRIME","CRISP","CROSS","CROWD","CROWN","CRUEL","CRUSH",
  "CURVE","CYCLE",
  // D
  "DAILY","DANCE","DATED","DEALT","DEATH","DEBUT","DECAY","DECOR","DECOY","DELTA",
  "DEMON","DENSE","DEPTH","DERBY","DINER","DIRTY","DISCO","DITCH","DIVER","DODGE",
  "DOING","DONOR","DOUBT","DOUGH","DRAFT","DRAIN","DRAKE","DRAMA","DRANK","DRAPE",
  "DRAWN","DREAD","DREAM","DRESS","DRIED","DRIFT","DRILL","DRINK","DRIVE","DRONE",
  "DROPS","DROWN","DRUNK","DRYER","DOUSE","DWARF","DYING",
  // E
  "EAGER","EAGLE","EARLY","EARTH","EATEN","EIGHT","ELBOW","ELDER","ELECT","ELITE",
  "EMPTY","ENEMY","ENJOY","ENTER","ENTRY","EQUAL","EQUIP","ERROR","EVENT","EVERY",
  "EXACT","EXERT","EXILE","EXIST","EXTRA",
  // F
  "FABLE","FACET","FAITH","FALSE","FANCY","FATAL","FAULT","FEAST","FIBER","FIELD",
  "FIFTH","FIFTY","FIGHT","FINAL","FINER","FIRST","FIXED","FLAGS","FLAME","FLAKE",
  "FLASH","FLASK","FLESH","FLIES","FLING","FLOAT","FLOCK","FLOOD","FLOOR","FLORA",
  "FLOUR","FLOWN","FLUID","FLUSH","FLUTE","FOCAL","FOCUS","FORCE","FORGE","FORTY",
  "FORUM","FOUND","FRAME","FRANK","FRAUD","FREED","FRESH","FRONT","FROST","FROZE",
  "FRUIT","FULLY","FUNGI","FUNNY","FUZZY",
  // G
  "GAUGE","GHOST","GIANT","GIVEN","GLAND","GLASS","GLEAM","GLIDE","GLOBE","GLOOM",
  "GLORY","GLOSS","GLOVE","GOING","GRACE","GRADE","GRAIN","GRAND","GRANT","GRAPE",
  "GRAPH","GRASP","GRASS","GRAVE","GRAZE","GREAT","GREED","GREEN","GREET","GRIEF",
  "GRILL","GRIND","GROAN","GROOM","GROSS","GROUP","GROVE","GROWL","GROWN","GROUT",
  "GUARD","GUESS","GUEST","GUIDE","GUILD","GUILT","GUISE",
  // H
  "HABIT","HAPPY","HARDY","HARSH","HASTE","HATCH","HAVEN","HEART","HEAVY","HEDGE",
  "HEIST","HENCE","HOBBY","HONOR","HORSE","HOUND","HOUSE","HUMAN","HUMID","HUMOR",
  "HURRY",
  // I
  "IDEAL","IMAGE","IMPLY","INDEX","INDIE","INFRA","INNER","INPUT","INTRO","IRONY",
  "IVORY","ISSUE",
  // J
  "JEWEL","JOINT","JOKER","JUDGE","JUICE","JUICY","JUMBO","JUMPS",
  // K
  "KAYAK","KEBAB","KNACK","KNEEL","KNIFE","KNOCK","KNOWN",
  // L
  "LABEL","LABOR","LANCE","LARGE","LASER","LATCH","LATER","LAUGH","LAYER","LEACH",
  "LEARN","LEASE","LEAVE","LEVEL","LIGHT","LINEN","LINER","LIVER","LOCAL","LODGE",
  "LOGIC","LOOSE","LORRY","LOVER","LOWER","LOYAL","LOUSE","LUCKY","LUNAR",
  "LUNCH","LYING",
  // M
  "MAGIC","MAJOR","MAKER","MANOR","MARCH","MARRY","MARSH","MATCH","MAYOR","MEDIA",
  "MERCY","MERGE","MERIT","METAL","METER","MIGHT","MINER","MINOR","MINUS","MIXED",
  "MODEL","MONEY","MONTH","MORAL","MOTOR","MOUND","MOUNT","MOUSE","MOUTH","MOVED",
  "MOVIE","MOWER","MUSIC","MANGO",
  // N
  "NAIVE","NAVAL","NERVE","NEVER","NEWLY","NIGHT","NOBLE","NOISE","NORTH","NOTED",
  "NOVEL","NURSE",
  // O
  "OASIS","OCCUR","OCEAN","OFFER","OFTEN","OLIVE","ONSET","OPERA","ORBIT","ORDER",
  "OTHER","OUGHT","OUTER","OWNED","OWNER","OXIDE",
  // P
  "PAINT","PANEL","PANIC","PAPER","PARTY","PASTE","PATCH","PAUSE","PEACE","PEACH",
  "PEARL","PENNY","PHASE","PHONE","PHOTO","PIANO","PIECE","PILOT","PINCH","PITCH",
  "PIXEL","PIZZA","PLACE","PLAIN","PLAIT","PLANE","PLANK","PLANT","PLATE","PLAZA",
  "PLEAD","PLUMB","PLUME","PLUMP","POINT","POISE","POLAR","POUCH","POUND","POWER",
  "PRESS","PRICE","PRIDE","PRIME","PRINT","PRIOR","PRIZE","PROBE","PRONE","PROOF",
  "PROSE","PROUD","PROVE","PROXY","PULSE","PUNCH","PUPIL","PURSE","PUSSY",
  // Q
  "QUALM","QUEEN","QUERY","QUEST","QUEUE","QUICK","QUIET","QUIRK","QUOTA","QUOTE",
  // R
  "RADAR","RADIO","RAISE","RALLY","RANCH","RANGE","RAPID","RATIO","REACH","REACT",
  "READY","REALM","REBEL","REFER","REIGN","RELAX","RENAL","RENEW","REPLY","RIDER",
  "RIDGE","RIFLE","RIGHT","RIGID","RINSE","RISEN","RISKY","RIVAL","RIVER","ROAST",
  "ROBOT","ROCKY","ROMAN","ROOMY","ROOTS","ROUGE","ROUGH","ROUND","ROUTE","ROVER",
  "ROYAL","RUGBY","RULER","RURAL",
  // S
  "SAINT","SALAD","SALTY","SAUCE","SCALE","SCARE","SCENE","SCENT","SCOPE","SCORE",
  "SCOUT","SEDAN","SENSE","SERUM","SERVE","SETUP","SEVEN","SHALL","SHAME","SHAPE",
  "SHARE","SHARK","SHARP","SHAVE","SHEET","SHELF","SHELL","SHIFT","SHINE","SHIRT",
  "SHOCK","SHORE","SHORT","SHOUT","SIGHT","SILLY","SINCE","SIXTH","SIXTY","SIZED",
  "SKILL","SKULL","SLASH","SLATE","SLAVE","SLEEP","SLICE","SLIDE","SLOPE","SMALL",
  "SMART","SMELL","SMILE","SMITH","SMOKE","SNAKE","SNORE","SOLAR","SOLID","SOLVE",
  "SORRY","SOUND","SOUTH","SPACE","SPARE","SPARK","SPAWN","SPEAK","SPEED","SPELL",
  "SPEND","SPENT","SPICE","SPIKE","SPINE","SPOKE","SPOON","SPORT","SPRAY","SQUAD",
  "STAFF","STAGE","STAIN","STAKE","STALE","STALL","STAMP","STAND","STARE","START",
  "STATE","STEAK","STEAL","STEAM","STEEL","STEEP","STEER","STERN","STICK","STILL",
  "STOCK","STOLE","STONE","STOOD","STORE","STORM","STORY","STOVE","STRAP","STRAW",
  "STRAY","STRIP","STUCK","STUDY","STUFF","STYLE","SUGAR","SUITE","SUPER","SURGE",
  "SWAMP","SWARM","SWEAR","SWEAT","SWEEP","SWEET","SWEPT","SWIFT","SWING","SWORE",
  "SWUNG","SYRUP",
  // T
  "TABLE","TAKEN","TANGO","TASTE","TEACH","TEETH","TEMPO","THANK","THEME","THICK",
  "THIEF","THING","THINK","THIRD","THOSE","THREE","THREW","THROW","THUMB","TIDAL",
  "TIGER","TIGHT","TIMER","TITLE","TODAY","TOKEN","TOTAL","TOUCH","TOUGH","TOWER",
  "TOXIC","TRACE","TRACK","TRADE","TRAIL","TRAIN","TRAIT","TRASH","TREAT","TREND",
  "TRIAL","TRIBE","TRICK","TRIED","TROOP","TRUCK","TRULY","TRUMP","TRUNK","TRUST",
  "TRUTH","TUMOR","TWIST",
  // U
  "ULTRA","UNCLE","UNDER","UNDUE","UNION","UNITE","UNITY","UNTIL","UPPER","UPSET",
  "URBAN","USAGE","USUAL","UTTER",
  // V
  "VAGUE","VALID","VALUE","VALVE","VAULT","VENUE","VERSE","VIDEO","VIGOR","VINYL",
  "VIOLA","VIRUS","VISIT","VISTA","VITAL","VIVID","VOCAL","VODKA","VOICE","VOTER",
  // W
  "WAIST","WASTE","WATCH","WATER","WEARY","WEAVE","WEDGE","WEIGH","WEIRD","WHEAT",
  "WHEEL","WHERE","WHICH","WHILE","WHITE","WHOLE","WHOSE","WIDER","WITCH","WOMAN",
  "WOMEN","WORLD","WORRY","WORSE","WORST","WORTH","WOULD","WOUND","WRATH","WRIST",
  "WRITE","WRONG","WROTE",
  // XYZ
  "YACHT","YIELD","YOUNG","YOUTH","ZEBRA",
  // Add the target words too
  ...TARGET_WORDS,
  // More near-miss words
  "SHADE","SHAPE","SHARE","SHALE","SHAME","STALE","STAVE","SLAVE","SNARE",
  "BASTE","CASTE","BLARE","GLARE","FLARE","SCARE","SPARE","SWEAR","SMEAR",
  "BOWER","DOWER","SOWER","TOWER","COWER","ROWER","VOWED","TOWED","SOWED",
  "GRIPE","TRIPE","SWIPE","SNIPE","STRIP","DRAPE","CREPE",
  "BRINE","SWINE","WHINE","TWINE","SPINE","THINE","OVINE",
    "STAKE","AWAKE",
]);

// Families of words that are near-misses to each other
const WORD_FAMILIES = {
  "CRANE": ["CRATE", "CRAZE", "TRACE", "GRACE", "BRAVE", "CRANE"],
  "PLATE": ["PLACE", "PLANE", "SLATE", "SKATE", "PLATE"],
  "STARE": ["STALE", "STAKE", "SHARE", "SNARE", "SPARE", "STARE"],
  "SHINE": ["SPINE", "SWINE", "WHINE", "SHONE", "SHINE"],
  "TRACE": ["GRACE", "BRACE", "TRADE", "TRACK", "TRACE"],
  "BLAME": ["BLAZE", "BLADE", "FLAME", "BLAME"],
  "GRAPE": ["GRACE", "GRADE", "GRAVE", "DRAPE", "GRAPE"],
  "BRIDE": ["BRINE", "BRIBE", "PRIDE", "BRIDE"],
  "STONE": ["STORE", "STOVE", "STOKE", "STOLE", "ATONE", "STONE"],
  "PRIDE": ["PRICE", "PRIZE", "PRIME", "BRIDE", "PRIDE"],
  "FLAME": ["BLAME", "FLAKE", "FRAME", "FLARE", "FLAME"],
  "GRACE": ["TRACE", "BRACE", "GRADE", "GRAPE", "GRAVE", "GRACE"],
  "SPINE": ["SHINE", "SWINE", "SPICE", "SPITE", "SPINE"],
  "SLOPE": ["GLOBE", "SCOPE", "SPOKE", "STOLE", "SLOPE"],
  "GLOBE": ["GLOVE", "SLOPE", "CLOSE", "GLOBE"],
  "SWORE": ["SNORE", "STORE", "SHORE", "SCORE", "SWORE"],
  "SNORE": ["SHORE", "STORE", "SCORE", "SWORE", "SNORE"],
  "STORE": ["SHORE", "SNORE", "STARE", "STONE", "STORE"],
  "SHORE": ["SNORE", "STORE", "SCORE", "SHARE", "SHORE"],
  "SCORE": ["STORE", "SHORE", "SNORE", "SCARE", "SCORE"],
  "BRAKE": ["BRAVE", "BLAKE", "FLAKE", "SHAKE", "BRAKE"],
  "FLAKE": ["FLAME", "SHAKE", "BRAKE", "STAKE", "FLAKE"],
  "SHAKE": ["SHAPE", "SHAME", "SHARE", "SHADE", "SHALE", "SNAKE", "SHAKE"],
  "STAKE": ["STALE", "STARE", "STATE", "SNAKE", "SHAKE", "STAKE"],
  "SNAKE": ["SHAKE", "SNARE", "STAKE", "SNAKE"],
  "LIGHT": ["MIGHT", "NIGHT", "RIGHT", "SIGHT", "TIGHT", "FIGHT", "LIGHT"],
  "MIGHT": ["LIGHT", "NIGHT", "RIGHT", "SIGHT", "TIGHT", "FIGHT", "MIGHT"],
  "NIGHT": ["LIGHT", "MIGHT", "RIGHT", "SIGHT", "TIGHT", "FIGHT", "NIGHT"],
  "RIGHT": ["LIGHT", "MIGHT", "NIGHT", "SIGHT", "TIGHT", "FIGHT", "RIGHT"],
  "SIGHT": ["LIGHT", "MIGHT", "NIGHT", "RIGHT", "TIGHT", "FIGHT", "SIGHT"],
  "BLANK": ["CLANK", "PLANK", "BLACK", "BLAND", "BLANK"],
  "CLANK": ["BLANK", "PLANK", "CRANK", "CLANK"],
  "CRANK": ["CLANK", "CRACK", "CRANE", "DRANK", "CRANK"],
  "DRANK": ["CRANK", "DRAIN", "DRAWN", "DRINK", "DRANK"],
  "PLANK": ["BLANK", "CLANK", "PLANT", "PLANE", "PLANK"],
  "TRAIN": ["BRAIN", "DRAIN", "GRAIN", "STAIN", "TRAIL", "TRAIT", "TRAIN"],
  "BRAIN": ["TRAIN", "DRAIN", "GRAIN", "BRAIN"],
  "DRAIN": ["TRAIN", "BRAIN", "GRAIN", "DRANK", "DRAWN", "DRAIN"],
  "GRAIN": ["TRAIN", "BRAIN", "DRAIN", "GRAIL", "GRAIN"],
  "STAIN": ["TRAIN", "STAIR", "SAINT", "SLAIN", "STAIN"],
  "CLOUD": ["COULD", "CLOUT", "ALOUD", "PROUD", "CLOUD"],
  "PROUD": ["CLOUD", "PROOF", "PRUDE", "PROWL", "PROUD"],
  "GROUT": ["TROUT", "SHOUT", "SCOUT", "GROUT"],
  "SCOUT": ["SHOUT", "GROUT", "SNOUT", "SCOUT"],
  "SHOUT": ["SCOUT", "GROUT", "SNOUT", "SHOOT", "SHORT", "SHOUT"],
  "BLINK": ["CLINK", "DRINK", "THINK", "BRINK", "BLIND", "BLINK"],
  "CLINK": ["BLINK", "DRINK", "THINK", "CLIMB", "CLINK"],
  "DRINK": ["BLINK", "CLINK", "THINK", "BRINK", "DRANK", "DRINK"],
  "THINK": ["BLINK", "CLINK", "DRINK", "THICK", "THING", "THINK"],
  "BRINK": ["BLINK", "DRINK", "BRING", "BRICK", "BRINK"],
  "CHARM": ["CHAIR", "CHAIN", "SWARM", "ALARM", "CHARM"],
  "SWARM": ["CHARM", "SWEAR", "SWAMP", "SWARM"],
  "ALARM": ["CHARM", "ALBUM", "ALARM"],
  "MOUSE": ["HOUSE", "LOUSE", "MOOSE", "MOUTH", "MOUSE"],
  "HOUSE": ["MOUSE", "LOUSE", "HORSE", "HOUSE"],
  "LOUSE": ["MOUSE", "HOUSE", "LOOSE", "LOUSE"],
  "DOUSE": ["MOUSE", "HOUSE", "LOUSE", "DOUSE"],
  "MOUND": ["BOUND", "FOUND", "HOUND", "ROUND", "SOUND", "WOUND", "MOUNT", "MOUND"],
  "BOUND": ["MOUND", "FOUND", "HOUND", "ROUND", "SOUND", "WOUND", "BOUND"],
  "FOUND": ["BOUND", "MOUND", "HOUND", "ROUND", "SOUND", "WOUND", "FOUND"],
  "HOUND": ["BOUND", "FOUND", "MOUND", "ROUND", "SOUND", "WOUND", "HOUND"],
  "ROUND": ["BOUND", "FOUND", "HOUND", "MOUND", "SOUND", "WOUND", "ROUND"],
  "SOUND": ["BOUND", "FOUND", "HOUND", "MOUND", "ROUND", "WOUND", "SOUND"],
  "WOUND": ["BOUND", "FOUND", "HOUND", "MOUND", "ROUND", "SOUND", "WOULD", "WOUND"],
  "PASTE": ["TASTE", "WASTE", "HASTE", "PHASE", "PASTE"],
  "TASTE": ["PASTE", "WASTE", "HASTE", "TEASE", "TASTE"],
  "WASTE": ["PASTE", "TASTE", "HASTE", "WASTE"],
  "HASTE": ["PASTE", "TASTE", "WASTE", "HASTE"],
  "LINER": ["DINER", "MINER", "FINER", "TIMER", "LINEN", "LIVER", "LINER"],
  "DINER": ["LINER", "MINER", "FINER", "DIVER", "DINER"],
  "MINER": ["LINER", "DINER", "FINER", "MINOR", "MINER"],
  "FINER": ["LINER", "DINER", "MINER", "FIBER", "FINER"],
  "TIMER": ["LINER", "DINER", "TIGER", "TOWER", "TIMER"],
  "TOWER": ["POWER", "LOWER", "MOWER", "TOWEL", "TOWER"],
  "POWER": ["TOWER", "LOWER", "MOWER", "POKER", "POWER"],
  "LOWER": ["TOWER", "POWER", "MOWER", "LOVER", "LONER", "LOWER"],
  "MOWER": ["TOWER", "POWER", "LOWER", "MOVER", "MOWER"],
  "BOWER": ["TOWER", "POWER", "LOWER", "MOWER", "BOXER", "BOWER"],
  "MANGO": ["TANGO", "MANOR", "MANGO"],
  "TANGO": ["MANGO", "TANGO"],
  "PEACH": ["BEACH", "REACH", "TEACH", "LEACH", "PEACE", "PEACH"],
  "BEACH": ["PEACH", "REACH", "TEACH", "LEACH", "BENCH", "BEACH"],
  "REACH": ["PEACH", "BEACH", "TEACH", "LEACH", "REACT", "REACH"],
  "TEACH": ["PEACH", "BEACH", "REACH", "LEACH", "TEETH", "TEACH"],
  "LEACH": ["PEACH", "BEACH", "REACH", "TEACH", "LEASH", "LEACH"],
};

// Add all target words and family members to valid words
for (const key in WORD_FAMILIES) {
  VALID_WORDS.add(key);
  WORD_FAMILIES[key].forEach(w => VALID_WORDS.add(w));
}

// Rage-inducing messages shown as toasts
const RAGE_TOASTS = [
  "SO close! 😩",
  "Almost had it! 🤏",
  "One letter off... 💀",
  "You're RIGHT there!",
  "This is YOUR round... right?",
  "The answer is on the tip of your tongue!",
  "Surely next guess...",
  "Can you FEEL how close you are?",
  "Don't give up now!",
  "It's basically solved already!",
  "You practically have it!",
  "Just one tiny change...",
  "AGHHH so close!",
  "The word is BEGGING you to guess it",
  "Your brain knows it...",
];

const LOSS_MESSAGES = [
  "You were SO close the entire time...",
  "Every single guess was almost right 😭",
  "The answer was right there all along...",
  "One letter away, six times in a row 💀",
  "This game owes you an apology",
];

// ============================================================
// GAME STATE
// ============================================================

let targetWord = "";
let currentRow = 0;
let currentTile = 0;
let currentGuess = "";
let gameOver = false;
let guessedWords = [];

// ============================================================
// CORE RIGGING LOGIC
// ============================================================

/**
 * Pick a target word. We prefer words with large families for maximum pain.
 */
function pickTargetWord() {
  // Pick words that have at least 4 family members
  const goodTargets = TARGET_WORDS.filter(w => {
    const fam = WORD_FAMILIES[w];
    return fam && fam.length >= 4;
  });
  const pool = goodTargets.length > 0 ? goodTargets : TARGET_WORDS;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Evaluate a guess against the target.
 * Returns array of "correct" | "present" | "absent" for each letter.
 */
function evaluateGuess(guess, target) {
  const result = Array(5).fill("absent");
  const targetArr = target.split("");
  const guessArr = guess.split("");
  const used = Array(5).fill(false);

  // First pass: correct
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === targetArr[i]) {
      result[i] = "correct";
      used[i] = true;
    }
  }

  // Second pass: present
  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;
    for (let j = 0; j < 5; j++) {
      if (!used[j] && guessArr[i] === targetArr[j]) {
        result[i] = "present";
        used[j] = true;
        break;
      }
    }
  }

  return result;
}

/**
 * Count greens + yellows in an evaluation
 */
function countHits(evaluation) {
  return evaluation.filter(e => e === "correct" || e === "present").length;
}

/**
 * Count only greens
 */
function countGreens(evaluation) {
  return evaluation.filter(e => e === "correct").length;
}

/**
 * THE SECRET SAUCE: If the player's guess would win or get very close,
 * dynamically swap the target to a near-miss that keeps most of their
 * greens/yellows but prevents a win. On row 6, occasionally let them win.
 */
function maybeRigTheGame(guess) {
  const eval_ = evaluateGuess(guess, targetWord);
  const greens = countGreens(eval_);

  // If it's an exact match...
  if (guess === targetWord) {
    if (currentRow < 5) {
      // NOT the last row - swap the target!
      const family = WORD_FAMILIES[targetWord] || [];
      // Find a word that ISN'T what they guessed, still gives lots of hits
      const alternatives = family.filter(w => w !== guess && VALID_WORDS.has(w));

      if (alternatives.length > 0) {
        // Pick the alternative that gives the MOST yellow/green (max frustration)
        let bestAlt = alternatives[0];
        let bestScore = 0;
        for (const alt of alternatives) {
          const altEval = evaluateGuess(guess, alt);
          const score = countHits(altEval) * 10 + countGreens(altEval) * 5;
          if (score > bestScore) {
            bestScore = score;
            bestAlt = alt;
          }
        }
        targetWord = bestAlt;
        return evaluateGuess(guess, targetWord);
      }

      // No family alternatives - pick ANY valid word that gives 3-4 greens
      const desperate = TARGET_WORDS.filter(w => {
        if (w === guess || guessedWords.includes(w)) return false;
        const e = evaluateGuess(guess, w);
        return countGreens(e) >= 3 && countGreens(e) < 5;
      });
      if (desperate.length > 0) {
        targetWord = desperate[Math.floor(Math.random() * desperate.length)];
        return evaluateGuess(guess, targetWord);
      }
    }
    // Last row or no alternatives: let them win
    return eval_;
  }

  // If they got 4+ greens but not an exact match, and it's not the last row,
  // consider swapping to keep them at 3 greens instead (pure evil)
  if (greens >= 4 && currentRow < 4) {
    const family = WORD_FAMILIES[targetWord] || [];
    const alternatives = family.filter(w => {
      if (w === guess || w === targetWord || guessedWords.includes(w)) return false;
      const e = evaluateGuess(guess, w);
      return countGreens(e) >= 2 && countGreens(e) <= 3;
    });
    if (alternatives.length > 0) {
      const pick = alternatives[Math.floor(Math.random() * alternatives.length)];
      targetWord = pick;
      return evaluateGuess(guess, targetWord);
    }
  }

  // If they have very few hits (0-1), swap to a word that gives them MORE hits
  // This makes them think they're on the right track (more frustrating)
  if (countHits(eval_) <= 1 && currentRow < 3) {
    const betterTargets = TARGET_WORDS.filter(w => {
      if (guessedWords.includes(w)) return false;
      const e = evaluateGuess(guess, w);
      return countHits(e) >= 3 && countGreens(e) >= 1 && countGreens(e) < 5;
    });
    if (betterTargets.length > 0) {
      targetWord = betterTargets[Math.floor(Math.random() * betterTargets.length)];
      return evaluateGuess(guess, targetWord);
    }
  }

  return eval_;
}


// ============================================================
// UI
// ============================================================

const board = document.getElementById("board");
const keyboard = document.getElementById("keyboard");
const toastContainer = document.getElementById("toast-container");
const modalOverlay = document.getElementById("modal-overlay");
const modalTitle = document.getElementById("modal-title");
const modalMessage = document.getElementById("modal-message");
const modalWord = document.getElementById("modal-word");
const modalEmoji = document.getElementById("modal-emoji");
const playAgainBtn = document.getElementById("play-again-btn");

function createBoard() {
  board.innerHTML = "";
  for (let r = 0; r < 6; r++) {
    const row = document.createElement("div");
    row.classList.add("row");
    row.id = `row-${r}`;
    for (let c = 0; c < 5; c++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      tile.id = `tile-${r}-${c}`;
      row.appendChild(tile);
    }
    board.appendChild(row);
  }
}

function showToast(message, isRage = false) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  if (isRage) toast.classList.add("rage");
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 1500);
}

function showModal(won) {
  if (won) {
    modalEmoji.textContent = "😤";
    modalTitle.textContent = "You got it...";
    modalMessage.textContent = "On the LAST try. After being one letter away FIVE times. Sure, call that a win.";
    modalWord.textContent = targetWord;
  } else {
    modalEmoji.textContent = "💀";
    modalTitle.textContent = "So close yet so far";
    modalMessage.textContent = LOSS_MESSAGES[Math.floor(Math.random() * LOSS_MESSAGES.length)];
    modalWord.textContent = targetWord;
  }
  modalOverlay.classList.remove("hidden");
}

function updateKeyboard(guess, evaluation) {
  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i];
    const btn = keyboard.querySelector(`button[data-key="${letter}"]`);
    if (!btn) continue;

    const state = evaluation[i];
    // Only upgrade: absent -> present -> correct
    if (state === "correct") {
      btn.className = "correct";
    } else if (state === "present" && !btn.classList.contains("correct")) {
      btn.className = "present";
    } else if (state === "absent" && !btn.classList.contains("correct") && !btn.classList.contains("present")) {
      btn.className = "absent";
    }
  }
}

function revealRow(rowIndex, evaluation, callback) {
  const row = document.getElementById(`row-${rowIndex}`);
  const tiles = row.querySelectorAll(".tile");

  tiles.forEach((tile, i) => {
    setTimeout(() => {
      tile.classList.add("revealed");

      // After the flip midpoint, apply the color
      setTimeout(() => {
        tile.classList.add(evaluation[i]);
      }, 250);

      // After full flip, check if done
      if (i === 4 && callback) {
        setTimeout(callback, 300);
      }
    }, i * 300);
  });
}

function playAlmostAnimation(rowIndex) {
  const row = document.getElementById(`row-${rowIndex}`);
  const tiles = row.querySelectorAll(".tile");
  tiles.forEach((tile, i) => {
    setTimeout(() => {
      tile.classList.add("almost");
    }, i * 80);
  });
}

function playWinAnimation(rowIndex) {
  const row = document.getElementById(`row-${rowIndex}`);
  const tiles = row.querySelectorAll(".tile");
  tiles.forEach((tile, i) => {
    setTimeout(() => {
      tile.classList.add("dance");
    }, i * 100);
  });
}

function submitGuess() {
  if (gameOver) return;
  if (currentGuess.length !== 5) {
    const row = document.getElementById(`row-${currentRow}`);
    row.classList.add("shake");
    setTimeout(() => row.classList.remove("shake"), 500);
    showToast("Not enough letters");
    return;
  }

  if (!VALID_WORDS.has(currentGuess)) {
    const row = document.getElementById(`row-${currentRow}`);
    row.classList.add("shake");
    setTimeout(() => row.classList.remove("shake"), 500);
    showToast("Not in word list");
    return;
  }

  // THE RIG: get (possibly manipulated) evaluation
  const evaluation = maybeRigTheGame(currentGuess);
  const isCorrect = currentGuess === targetWord;

  guessedWords.push(currentGuess);

  revealRow(currentRow, evaluation, () => {
    updateKeyboard(currentGuess, evaluation);

    if (isCorrect) {
      gameOver = true;
      playWinAnimation(currentRow);
      setTimeout(() => showModal(true), 800);
      return;
    }

    const hits = countHits(evaluation);
    const greens = countGreens(evaluation);

    // Show frustrating toast based on how close they were
    if (greens >= 3 || hits >= 4) {
      showToast(RAGE_TOASTS[Math.floor(Math.random() * RAGE_TOASTS.length)], true);
      playAlmostAnimation(currentRow);
    } else if (hits >= 2) {
      showToast(RAGE_TOASTS[Math.floor(Math.random() * RAGE_TOASTS.length)], false);
    }

    currentRow++;
    currentTile = 0;
    currentGuess = "";

    if (currentRow >= 6) {
      gameOver = true;
      setTimeout(() => showModal(false), 600);
    }
  });
}

function handleKey(key) {
  if (gameOver) return;

  if (key === "ENTER") {
    submitGuess();
    return;
  }

  if (key === "BACKSPACE") {
    if (currentTile > 0) {
      currentTile--;
      currentGuess = currentGuess.slice(0, -1);
      const tile = document.getElementById(`tile-${currentRow}-${currentTile}`);
      tile.textContent = "";
      tile.classList.remove("filled");
    }
    return;
  }

  if (currentTile < 5 && /^[A-Z]$/.test(key)) {
    const tile = document.getElementById(`tile-${currentRow}-${currentTile}`);
    tile.textContent = key;
    tile.classList.add("filled");
    currentGuess += key;
    currentTile++;
  }
}

// ============================================================
// EVENT LISTENERS
// ============================================================

// Keyboard clicks
keyboard.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const key = btn.dataset.key;
  if (key) handleKey(key);
});

// Physical keyboard
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  if (e.key === "Enter") {
    handleKey("ENTER");
  } else if (e.key === "Backspace") {
    handleKey("BACKSPACE");
  } else if (/^[a-zA-Z]$/.test(e.key)) {
    handleKey(e.key.toUpperCase());
  }
});

// Play again
playAgainBtn.addEventListener("click", () => {
  modalOverlay.classList.add("hidden");
  resetGame();
});

// ============================================================
// INIT
// ============================================================

function resetGame() {
  currentRow = 0;
  currentTile = 0;
  currentGuess = "";
  gameOver = false;
  guessedWords = [];
  targetWord = pickTargetWord();

  createBoard();

  // Reset keyboard colors
  keyboard.querySelectorAll("button").forEach(btn => {
    btn.className = "";
    if (btn.dataset.key === "ENTER" || btn.dataset.key === "BACKSPACE") {
      btn.classList.add("wide-btn");
    }
  });
}

resetGame();
