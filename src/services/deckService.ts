import { DeckResponse, DrawResponse } from "./deckService.types";

/**
 * Service for creating and drawing cards from a deck
 */
export const deckService = {
  /**
   * Creates a new shuffled deck of cards
   * @returns A promise that resolves to a DeckResponse object
   */
  async createDeck(): Promise<DeckResponse> {
    const res = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
    if (!res.ok) {
      throw new Error('Failed to create new deck');
    }
    return res.json();
  },

  /**
   * Draws a specified number of cards from a deck
   * @param deckId - The ID of the deck to draw from
   * @param count - The number of cards to draw
   * @returns A promise that resolves to a DrawResponse object
   */
  async drawCard(deckId: string, count: number = 1): Promise<DrawResponse> {
    const res = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`);
    if (!res.ok) {
      throw new Error('Failed to draw card');
    }
    return res.json();
  }
};
