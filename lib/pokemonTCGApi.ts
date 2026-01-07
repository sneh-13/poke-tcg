/**
 * Client-side API functions that call our Next.js API routes
 * These routes run on the server and handle the TCGdex API calls
 */

/**
 * Fetch all cards from a specific set (basic info only)
 * @param setId - The set ID to fetch cards from (e.g., 'base1', 'xy1', 'swsh7')
 * @returns Promise with array of cards (basic info: id, name, number, image)
 */
export async function getCardsFromSet(setId: string) {
  try {
    const response = await fetch(`/api/cards?setId=${setId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch cards');
    }
    const cards = await response.json();
    return cards;
  } catch (error) {
    console.error('Error fetching cards from set:', error);
    throw error;
  }
}

/**
 * Fetch full details for a single card including pricing and price history
 * @param cardId - The card ID (e.g., 'swsh7-110', 'base1-4')
 * @returns Promise with full card details including pricing data
 */
export async function getCardById(cardId: string) {
  try {
    const response = await fetch(`/api/cards/${cardId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch card');
    }
    const card = await response.json();
    return card;
  } catch (error) {
    console.error('Error fetching card:', error);
    throw error;
  }
}

/**
 * Fetch a single set by ID
 * @param setId - The set ID (e.g., 'base1', 'swsh7')
 * @returns Promise with set details
 */
export async function getSetById(setId: string) {
  try {
    const response = await fetch(`/api/sets/${setId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch set');
    }
    const set = await response.json();
    return set;
  } catch (error) {
    console.error('Error fetching set:', error);
    throw error;
  }
}

/**
 * Fetch historical price data for a card
 * @param cardId - The card ID (e.g., 'swsh7-110')
 * @returns Promise with price history data
 */
export async function getPriceHistory(cardId: string) {
  try {
    const response = await fetch(`/api/price-history/${cardId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch price history');
    }
    const priceHistory = await response.json();
    return priceHistory;
  } catch (error) {
    console.error('Error fetching price history:', error);
    throw error;
  }
}
