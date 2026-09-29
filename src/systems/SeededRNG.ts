/**
 * Deterministic Pseudo-Random Number Generator using Mulberry32 algorithm.
 * Guarantees 100% reproducible maps, drops, and encounters from the same seed.
 */
export class SeededRNG {
  private state: number;
  public readonly seedString: string;

  constructor(seedInput?: string | number) {
    if (typeof seedInput === 'number') {
      this.seedString = `SEED-${Math.abs(Math.floor(seedInput))}`;
      this.state = seedInput >>> 0;
    } else if (typeof seedInput === 'string' && seedInput.trim().length > 0) {
      this.seedString = seedInput.trim().toUpperCase();
      this.state = SeededRNG.hashString(this.seedString);
    } else {
      this.seedString = SeededRNG.generateRandomSeedString();
      this.state = SeededRNG.hashString(this.seedString);
    }
  }

  /**
   * Generates a cool dark-fantasy themed seed string like 'VOID-7842' or 'BLOOD-3190'
   */
  public static generateRandomSeedString(): string {
    const prefixes = ['VOID', 'BLOOD', 'ABYSS', 'CHAOS', 'SHADOW', 'GRAVE', 'STORM', 'FROST', 'EMBER'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${number}`;
  }

  /**
   * cyrb53 / FNV-like string hash converting arbitrary string seed into uint32
   */
  public static hashString(str: string): number {
    let h1 = 0xdeadbeef;
    let h2 = 0x41c64e6d;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  }

  /**
   * Generates next float in range [0, 1)
   */
  public nextFloat(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Generates an integer in range [min, max] inclusive
   */
  public nextInt(min: number, max: number): number {
    if (min >= max) return min;
    const f = this.nextFloat();
    return min + Math.floor(f * (max - min + 1));
  }

  /**
   * Picks a random element from an array
   */
  public pick<T>(array: T[]): T {
    if (array.length === 0) {
      throw new Error('Cannot pick from empty array');
    }
    const idx = this.nextInt(0, array.length - 1);
    return array[idx];
  }

  /**
   * Weighted random selection from an array of item-weight pairs
   */
  public weightedPick<T>(items: { item: T; weight: number }[]): T {
    if (items.length === 0) {
      throw new Error('Cannot pick from empty weighted array');
    }
    const totalWeight = items.reduce((sum, i) => sum + Math.max(0, i.weight), 0);
    if (totalWeight <= 0) return items[0].item;

    let roll = this.nextFloat() * totalWeight;
    for (const entry of items) {
      if (entry.weight <= 0) continue;
      roll -= entry.weight;
      if (roll <= 0) {
        return entry.item;
      }
    }
    return items[items.length - 1].item;
  }

  /**
   * Shuffles an array deterministically (Fisher-Yates)
   */
  public shuffle<T>(array: T[]): T[] {
    const clone = [...array];
    for (let i = clone.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [clone[i], clone[j]] = [clone[j], clone[i]];
    }
    return clone;
  }
}
