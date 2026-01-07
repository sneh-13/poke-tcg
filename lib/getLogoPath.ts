import { PokemonSet } from '@/types/pokemon';

export function getLogoPath(set: PokemonSet): string {
  const seriesMap: Record<string, string> = {
    'mega': '16-Mega-Evolutions',
    'sv': '15-Scarlet-&-Violet',
    'swsh': '14-Sword-&-Shield',
    'sm': '13-Sun-&-Moon',
    'xy': '12-XY',
    'bw': '11-Black-&-White',
    'bwp': '11-Black-&-White',
    'col': '10-HeartGold-SoulSilver',
    'hgss': '10-HeartGold-SoulSilver',
    'pl': '09-Platinum',
    'np': '08-Nintendo',
    'dp': '07-Diamond-and-Pearl',
    'ex': '06-EX',
    'ecard': '05-eCard',
    'lc': '04-Legendary-Collection',
    'neo': '03-Neo',
    'topps': 'Other',
    'gym': '02-Gym',
    'base': '01-Base'
  };

  const seriesFolder = seriesMap[set.seriesCode] || '01-Base';

  // Special name mappings for exact matches
  const nameOverrides: Record<string, string> = {
    // Mega Evolution series
    'Mega Evolution Black Star Promos': 'mega-evolution',
    'Mega Evolution': 'mega-evolution',

    // Scarlet & Violet
    'Scarlet & Violet': 'scarlet-&-violet',
    'Scarlet & Violet Promos': 'scarlet-&-violet-promos',
    'Scarlet & Violet - 151': '151',
    'Paldea Evolved': 'paldea-evolved',
    'Obsidian Flames': 'obsidian-flames',
    'Paradox Rift': 'paradox-rift',
    'Paldean Fates': 'paldean-fates',
    'Temporal Forces': 'temporal-forces',
    'Twilight Masquerade': 'twilight-masquerade',
    'Shrouded Fable': 'shrouded-fable',
    'Stellar Crown': 'stellar-crown',
    'Surging Sparks': 'surging-sparks',
    'Prismatic Evolutions': 'prismatic-evolutions',
    'White Flare': 'white-flare',
    'Black Bolt': 'black-bolt',
    'Destined Rivals': 'destined-rivals',
    'Journey Together': 'journey-together',
    'McDonald\'s Dragon Discovery': 'mcdonald_s-dragon-discovery',
    'McDonald\'s Match Battle 2023': 'mcdonald_s-match-battle-2023',
    'Trick or Trade 2023': 'trick-or-trade-2023',
    'Trick or Trade 2024': 'trick-or-trade-2024',

    // Sword & Shield
    'Sword & Shield': 'sword-&-shield',
    'Sword & Shield Promos': 'sword-&-shield-promos',
    'Rebel Clash': 'rebel-clash',
    'Darkness Ablaze': 'darkness-ablaze',
    'Champion\'s Path': 'champion_s-path',
    'Vivid Voltage': 'vivid-voltage',
    'Shining Fates': 'shining-fates',
    'Battle Styles': 'battle-styles',
    'Chilling Reign': 'chilling-reign',
    'Evolving Skies': 'evolving-skies',
    'Celebrations': 'celebrations',
    'Fusion Strike': 'fusion-strike',
    'Brilliant Stars': 'brilliant-stars',
    'Astral Radiance': 'astral-radiance',
    'Pokemon Go': 'pokemon-go',
    'Lost Origin': 'lost-origin',
    'Silver Tempest': 'silver-tempest',
    'Crown Zenith': 'crown-zenith',
    'McDonald\'s 25th Anniversary': 's&s-mcdonald_s-collection-25th-anniversary',
    'McDonald\'s Match Battle': 'match-battle-2022',
    'Trick or Trade': 'trick-or-trade-2022',
    'Pokemon Futsal Promos': 'fustal-promos',

    // Sun & Moon
    'Sun & Moon': 'sun-&-moon',
    'Sun & Moon Promos': 'sun-&-moon-promos',
    'Guardians Rising': 'guardians-rising',
    'Burning Shadows': 'burning-shadows',
    'Crimson Invasion': 'crimson-invasion',
    'Ultra Prism': 'ultra-prism',
    'Forbidden Light': 'forbidden-light',
    'Celestial Storm': 'celestial-storm',
    'Lost Thunder': 'lost-thunder',
    'Team Up': 'team-up',
    'Unbroken Bonds': 'unbroken-bonds',
    'Unified Minds': 'unified-minds',
    'Cosmic Eclipse': 'cosmic-eclipse',
    'Detective Pikachu': 'detective-pikachu',
    'Hidden Fates': 'hidden-fates',
    'Shining Legends': 'shining-legends',
    'Dragon Majesty': 'dragon-majesty',
    'McDonald\'s Collection (2019 FR)': 's&m-mcdonald_s-collection',
    'McDonald\'s Collection (2019)': 's&m-mcdonald_s-collection',
    'McDonald\'s Collection (2018)': 's&m-mcdonald_s-collection',
    'McDonald\'s Collection (2017)': 's&m-mcdonald_s-collection',

    // XY series
    'XY': 'xy',
    'XY Promos': 'xy-promos',
    'XY Flashfire': 'flashfire',
    'Furious Fists': 'furious-fists',
    'Phantom Forces': 'phantom-forces',
    'Primal Clash': 'primal-clash',
    'Roaring Skies': 'roaring-skies',
    'Ancient Origins': 'ancient-origins',
    'XY BREAKthrough': 'breakthrough',
    'BREAKPoint': 'breakpoint',
    'Generations': 'generations',
    'Fates Collide': 'fates-collide',
    'Steam Siege': 'steam-siege',
    'Evolutions': 'evolutions',
    'Kalos Starter Set': 'kalos-starter-set',
    'Double Crisis': 'double-crisis',
    'McDonald\'s Collection (2016)': 'xy-mcdonald_s-collection',
    'McDonald\'s Collection (2015)': 'xy-mcdonald_s-collection',
    'McDonald\'s Collection (2014)': 'xy-mcdonald_s-collection',

    // Black & White
    'Black & White': 'black-&-white',
    'Black & White Promos': 'black-&-white-promos',
    'Emerging Powers': 'emerging-powers',
    'Noble Victories': 'noble-victories',
    'Next Destinies': 'next-destinies',
    'Dark Explorers': 'dark-explorers',
    'Dragons Exalted': 'dragons-exalted',
    'Dragon Vault': 'dragon-vault',
    'Boundaries Crossed': 'boundaries-crossed',
    'Plasma Storm': 'plasma-storm',
    'Plasma Freeze': 'plasma-freeze',
    'Plasma Blast': 'plasma-blast',
    'Legendary Treasures': 'legendary-treasures',
    'Radiant Collection': 'radiant-collection',
    'McDonald\'s Collection (2013)': 'b&w-mcdonald_s-collection',
    'McDonald\'s Collection (2012)': 'b&w-mcdonald_s-collection',
    'McDonald\'s Collection (2011)': 'b&w-mcdonald_s-collection',

    // HeartGold SoulSilver
    'HeartGold SoulSilver': 'heartgold-soulsilver',
    'HeartGold SoulSilver Promos': 'heartgold-soulsilver-promos',
    'HS Unleashed': 'unleashed',
    'HS Undaunted': 'undaunted',
    'HS Triumphant': 'triumphant',
    'Call of Legends': 'call-of-legends',

    // Platinum
    'Platinum': 'platinum',
    'Platinum - Rising Rivals': 'rising-rivals',
    'Platinum - Supreme Victors': 'supreme-victors',
    'Platinum - Arceus': 'arceus',
    'Pokemon Rumble': 'pokemon-rumble',

    // Nintendo Promos
    'Nintendo Promos': 'nintendo-promos',
    'POP Series 1': 'pop',
    'POP Series 2': 'pop',
    'POP Series 3': 'pop',
    'POP Series 4': 'pop',
    'POP Series 5': 'pop',
    'POP Series 6': 'pop',
    'POP Series 7': 'pop',
    'POP Series 8': 'pop',
    'POP Series 9': 'pop',

    // Diamond & Pearl
    'Diamond & Pearl': 'diamond-and-pearl',
    'DP Black Star Promos': 'diamond-and-pearl-promos',
    'Mysterious Treasures': 'mysterious-treasures',
    'Secret Wonders': 'secret-wonders',
    'Great Encounters': 'great-encounters',
    'Majestic Dawn': 'majestic-dawn',
    'Legends Awakened': 'legends-awakened',
    'Stormfront': 'stormfront',

    // EX series
    'EX Ruby & Sapphire': 'ruby-&-sapphire',
    'EX Sandstorm': 'sandstorm',
    'EX Dragon': 'dragon',
    'EX Team Magma vs Team Aqua': 'team-magma-vs.-team-aqua',
    'EX Hidden Legends': 'hidden-legends',
    'EX FireRed & LeafGreen': 'firered-leafgreen',
    'EX Team Rocket Returns': 'team-rocket-returns',
    'EX Deoxys': 'deoxys',
    'EX Emerald': 'emerald',
    'EX Unseen Forces': 'unseen-forces',
    'EX Unseen Forces Unown Collection': 'unseen-forces-unown-collection',
    'EX Delta Species': 'delta-species-logo',
    'EX Legend Maker': 'legend-maker',
    'EX Holon Phantoms': 'holon-phantoms',
    'EX Crystal Guardians': 'crystal-guardians',
    'EX Dragon Frontiers': 'dragon-frontiers',
    'EX Power Keepers': 'power-keepers',

    // e-Card
    'Expedition': 'expedition',
    'Aquapolis': 'aquapolis',
    'Skyridge': 'skyridge',
    'Best of Game': 'best-of-game',

    // Legendary Collection
    'Legendary Collection': 'legendary-collection',

    // Neo
    'Neo Genesis': 'neo-genesis',
    'Neo Discovery': 'neo-discovery',
    'Neo Revelation': 'neo-revelation',
    'Neo Destiny': 'neo-destiny',
    'Southern Islands': 'southern-islands',

    // Topps Chrome
    'Topps Series 1': 'topps-chrome',
    'Topps Series 2': 'topps-chrome',
    'Topps Series 3': 'topps-chrome',

    // Gym
    'Gym Heroes': 'gym-heroes',
    'Gym Challenge': 'gym-challenge',

    // Base/Classic
    'Base Set': 'base',
    'Base Set 2': 'base-set-2',
    'Jungle': 'jungle',
    'Fossil': 'fossil',
    'Team Rocket': 'team-rocket',
    'Wizards of the Coast Promos': 'wotc-promos'
  };

  // Check for exact name override first
  if (nameOverrides[set.name]) {
    return `/images/Logos/${seriesFolder}/${nameOverrides[set.name]}.png`;
  }

  // Special handling for Holiday Calendar expansions - use the logo from Other folder
  if (set.name.includes('Holiday Calendar')) {
    return `/images/Logos/Other/holiday-calendar.png`;
  }

  // Convert set name to filename format (lowercase, hyphens instead of spaces and special chars)
  let fileName = set.name
    .toLowerCase()
    .replace(/[&']/g, '') // Remove ampersands and apostrophes
    .replace(/[\s\-]+/g, '-') // Replace spaces and hyphens with single hyphen
    .replace(/[^\w\-]/g, '') // Remove any other special characters
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single

  return `/images/Logos/${seriesFolder}/${fileName}.png`;
}
