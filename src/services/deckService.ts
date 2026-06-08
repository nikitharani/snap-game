export interface Card {
  code: string;
  image: string;
  images: {
    svg: string;
    png: string;
  };
  value: string;
  suit: string;
}

export interface DeckResponse {
  success: boolean;
  deck_id: string;
  shuffled: boolean;
  remaining: number;
}

export interface DrawResponse {
  success: boolean;
  cards: Card[];
  deck_id: string;
  remaining: number;
}

export const deckService = {
  async createDeck(): Promise<DeckResponse> {
    const res = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
    if (!res.ok) {
      throw new Error('Failed to create new deck');
    }
    return res.json();
  },

  async drawCard(deckId: string, count: number = 1): Promise<DrawResponse> {
    const res = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`);
    if (!res.ok) {
      throw new Error('Failed to draw card');
    }
    return res.json();
  }
};
