/**
 * voiceCommand.ts — parser for Inventa voice/typed stock commands.
 *
 * Understands Hindi (Roman + Devanagari) and English add/remove commands, e.g.
 *   "Aashirvaad atta 5 kilo badha do"   -> add 5 kg to Aashirvaad Atta
 *   "chini 1 kilo kam kar do"           -> remove 1 kg from Sugar
 *   "add 2 kg sugar"                    -> add 2 kg to Sugar
 *
 * Pure functions only — no browser APIs — so the same parser serves the
 * microphone transcript and the typed-command fallback.
 */

export interface VoiceItem {
  id: number;
  name: string;
  nameHindi: string;
  quantity: number;
  unit: string;
  threshold: number;
}

export interface ParsedVoiceCommand {
  item: VoiceItem;
  action: "add" | "remove";
  /** Quantity already converted into the item's own unit. */
  quantity: number;
  /** Unit word heard in the command (kg, g, L, packets...), if any. */
  spokenUnit: string | null;
}

/** Extra spoken aliases keyed by the item's English name. */
const EXTRA_ALIASES: Record<string, string[]> = {
  "Aashirvaad Atta": ["atta", "aata", "आटा", "aashirvaad", "आशीर्वाद", "flour"],
  "Tata Salt": ["namak", "नमक", "salt", "tata", "टाटा"],
  "Fortune Sunflower Oil": ["tel", "तेल", "oil", "fortune", "sunflower"],
  "Amul Taaza Milk": ["doodh", "दूध", "milk", "amul", "taaza", "ताज़ा"],
  "Parle-G Biscuits": ["parle", "parle g", "biscuit", "biscuits", "बिस्कुट"],
  "Toor Dal": ["dal", "दाल", "toor", "arhar", "तूर"],
  "Maggi 2-Min Noodles": ["maggi", "मैगी", "noodles", "noodle"],
  "Kurkure Masala Munch": ["kurkure", "कुरकुरे"],
  "Britannia Marie Gold": ["marie", "britannia", "marie gold", "मेरी गोल्ड"],
  "MDH Chana Masala": ["mdh", "एमडीएच", "masala", "मसाला", "chana", "chole", "छोले"],
  Sugar: ["chini", "चीनी", "sugar", "shakkar", "शक्कर"],
};

const NUMBER_WORDS: Record<string, number> = {
  ek: 1, "एक": 1,
  do: 2, "दो": 2,
  teen: 3, "तीन": 3,
  char: 4, "चार": 4,
  paanch: 5, panch: 5, "पाँच": 5, "पांच": 5,
  chhe: 6, chhah: 6, che: 6, "छह": 6,
  saat: 7, "सात": 7,
  aath: 8, "आठ": 8,
  nau: 9, "नौ": 9,
  das: 10, "दस": 10,
  gyarah: 11, "ग्यारह": 11,
  barah: 12, "बारह": 12,
  pandrah: 15, "पंद्रह": 15,
  bees: 20, "बीस": 20,
  pachaas: 50, "पचास": 50,
  sau: 100, "सौ": 100,
  aadha: 0.5, "आधा": 0.5,
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
};

const ADD_KEYWORDS = [
  "बढ़ा", "बढ़ाना", "बढ़ाओ", "जोड़", "जमा",
  "badha", "badhao", "add", "jod", "jodo", "plus", "increase",
];

const REMOVE_KEYWORDS = [
  "कम", "घटा", "घटाओ", "निकाल",
  "kam", "ghata", "ghat", "minus", "remove", "subtract", "nikal", "nikaal",
];

/** Canonical unit -> spoken aliases. */
const UNIT_ALIASES: Record<string, string[]> = {
  kg: ["kilo", "kilogram", "kilograms", "किलो", "किलोग्राम", "किग्रा", "kg"],
  g: ["gram", "grams", "ग्राम", "g"],
  L: ["litre", "liter", "litres", "liters", "लीटर", "l"],
  ml: ["ml", "मिली", "millilitre", "milliliter", "milliliters"],
  packets: ["packet", "packets", "पैकेट", "pack", "packs"],
  pieces: ["piece", "pieces", "पीस", "pc", "pcs"],
  dozen: ["dozen", "दर्जन"],
};

const DEVANAGARI_DIGITS = "०१२३४५६७८९";

function normalize(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[०-९]/g, (d) => String(DEVANAGARI_DIGITS.indexOf(d)))
    .replace(/[।.,!?;:"'()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Short keywords must match a whole token; longer ones may be substrings. */
function hasKeyword(text: string, tokens: string[], keyword: string): boolean {
  if (keyword.length <= 3) return tokens.includes(keyword);
  return text.includes(keyword);
}

function detectAction(text: string, tokens: string[]): "add" | "remove" | null {
  if (REMOVE_KEYWORDS.some((k) => hasKeyword(text, tokens, k))) return "remove";
  if (ADD_KEYWORDS.some((k) => hasKeyword(text, tokens, k))) return "add";
  return null;
}

function extractQuantity(tokens: string[]): number | null {
  for (const token of tokens) {
    if (/^\d+(\.\d+)?$/.test(token)) return parseFloat(token);
    const attached = token.match(/^(\d+(?:\.\d+)?)(kg|g|l|ml)$/);
    if (attached) return parseFloat(attached[1]);
    if (token in NUMBER_WORDS) return NUMBER_WORDS[token];
  }
  return null;
}

function detectUnit(text: string, tokens: string[]): string | null {
  for (const [unit, aliases] of Object.entries(UNIT_ALIASES)) {
    for (const alias of aliases) {
      if (tokens.includes(alias)) return unit;
      if (alias.length >= 4 && text.includes(alias)) return unit;
    }
  }
  return null;
}

function phrasesFor(item: VoiceItem): string[] {
  const phrases = new Set<string>();
  const name = item.name.toLowerCase();
  phrases.add(name);
  name.split(/[\s-]+/).forEach((w) => {
    if (w.length >= 3) phrases.add(w);
  });
  if (item.nameHindi) {
    phrases.add(item.nameHindi);
    item.nameHindi.split(/\s+/).forEach((w) => phrases.add(w));
  }
  (EXTRA_ALIASES[item.name] ?? []).forEach((a) => phrases.add(a));
  return [...phrases];
}

function matchItem(text: string, tokens: string[], items: VoiceItem[]): VoiceItem | null {
  let best: VoiceItem | null = null;
  let bestScore = 0;
  for (const item of items) {
    for (const phrase of phrasesFor(item)) {
      const matched =
        phrase.includes(" ") || phrase.length > 3
          ? text.includes(phrase)
          : tokens.includes(phrase);
      if (matched && phrase.length > bestScore) {
        best = item;
        bestScore = phrase.length;
      }
    }
  }
  return best;
}

function convertToItemUnit(quantity: number, spokenUnit: string | null, itemUnit: string): number {
  if (!spokenUnit || spokenUnit === itemUnit) return quantity;
  if (spokenUnit === "g" && itemUnit === "kg") return quantity / 1000;
  if (spokenUnit === "kg" && itemUnit === "g") return quantity * 1000;
  if (spokenUnit === "ml" && itemUnit === "L") return quantity / 1000;
  if (spokenUnit === "L" && itemUnit === "ml") return quantity * 1000;
  // Incompatible unit spoken (e.g. "packets" for a kg item): apply the
  // number as-is in the item's own unit rather than failing the command.
  return quantity;
}

/**
 * Parse a spoken/typed command against the current inventory.
 * Returns null when anything essential is missing (action, quantity, item),
 * so the caller can show "Samajh nahi aaya, phir se bolo".
 */
export function parseVoiceCommand(raw: string, items: VoiceItem[]): ParsedVoiceCommand | null {
  if (!raw || items.length === 0) return null;
  const text = normalize(raw);
  if (!text) return null;
  const tokens = text.split(" ").filter(Boolean);

  const action = detectAction(text, tokens);
  if (!action) return null;

  const quantity = extractQuantity(tokens);
  if (quantity === null) return null;

  const item = matchItem(text, tokens, items);
  if (!item) return null;

  const spokenUnit = detectUnit(text, tokens);
  return {
    item,
    action,
    quantity: convertToItemUnit(quantity, spokenUnit, item.unit),
    spokenUnit,
  };
}
