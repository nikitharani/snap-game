import { useState, useEffect, useCallback } from 'react';
import { deckService } from '../services/deckService';
import { Card } from '../services/deckService.types';
import { SnapMessage } from './useSnapGame.types';

/**
 * Custom React hook that manages the card snap game state and logic.
 * Handles deck initialization, card drawing, snap detection, and next-draw probabilities.
 */
export function useSnapGame() {

  // Unique ID of the deck retrieved from the Deck of Cards API
  const [deckId, setDeckId] = useState<string | null>(null);

  // List of all cards drawn from the deck in chronological order
  const [drawnCards, setDrawnCards] = useState<Card[]>([]);

  // Total number of value match snaps (same rank, e.g. two Kings) in this game
  const [valueMatches, setValueMatches] = useState(0);

  // Total number of suit match snaps (same suit, e.g. two Spades) in this game
  const [suitMatches, setSuitMatches] = useState(0);

  // Active snap status and message details for the most recent draw
  const [snapMessage, setSnapMessage] = useState<SnapMessage>({ text: null, type: null });

  // Loading indicator active during API requests (deck creation or card draw)
  const [isLoading, setIsLoading] = useState(false);

  // Error object if any API requests fail
  const [error, setError] = useState<Error | null>(null);


  // Initializes or restarts the game by creating a new shuffled deck.
  // Resets all game statistics and drawn cards list.
  const initDeck = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await deckService.createDeck();
      setDeckId(data.deck_id);
      setDrawnCards([]);
      setValueMatches(0);
      setSuitMatches(0);
      setSnapMessage({ text: null, type: null });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize deck'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize a new deck on mount
  useEffect(() => {
    initDeck();
  }, [initDeck]);

  // Draws a single card from the active deck and appends it to the drawnCards list.
  // Prevents execution if game is loading, deck is missing, or all cards are drawn.
  const drawCard = useCallback(async () => {
    if (!deckId || drawnCards.length >= 52 || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await deckService.drawCard(deckId, 1);
      if (data.cards && data.cards.length > 0) {
        setDrawnCards(prev => [...prev, data.cards[0]]);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to draw card'));
    } finally {
      setIsLoading(false);
    }
  }, [deckId, drawnCards.length, isLoading]);

  // Triggers snap checking whenever a new card is drawn
  useEffect(() => {
    // A match requires at least two drawn cards
    if (drawnCards.length < 2) {
      setSnapMessage({ text: null, type: null });
      return;
    }

    const curr = drawnCards[drawnCards.length - 1];
    const prev = drawnCards[drawnCards.length - 2];

    const valueSnap = curr.value === prev.value;
    const suitSnap = curr.suit === prev.suit;

    // Determine type of snap match and update match counts
    if (valueSnap && suitSnap) {
      setValueMatches(v => v + 1);
      setSuitMatches(s => s + 1);
      setSnapMessage({ text: 'SNAP BOTH!', type: 'both' });
    } else if (valueSnap) {
      setValueMatches(v => v + 1);
      setSnapMessage({ text: 'SNAP VALUE!', type: 'value' });
    } else if (suitSnap) {
      setSuitMatches(s => s + 1);
      setSnapMessage({ text: 'SNAP SUIT!', type: 'suit' });
    } else {
      setSnapMessage({ text: null, type: null });
    }
  }, [drawnCards]);

  // Game is finished once all 52 cards are drawn
  const isGameOver = drawnCards.length === 52;

  // The most recently drawn card (active card)
  const currentCard = drawnCards[drawnCards.length - 1] || null;

  // The card drawn immediately before the current card
  const previousCard = drawnCards[drawnCards.length - 2] || null;

  // Remaining count of cards in the deck
  const cardsRemaining = 52 - drawnCards.length;

  // Probability that the next drawn card will match the current card's value
  let nextValueProbability = 0;

  // Probability that the next drawn card will match the current card's suit
  let nextSuitProbability = 0;

  // Compute probabilities based on the cards remaining in the deck
  if (currentCard && cardsRemaining > 0) {
    // 1. Value probability: 4 cards of each value exist in a standard deck.
    // Calculate how many of the current value have already been drawn,
    // subtract from 4 to find remaining, then divide by cards remaining in the deck.
    const drawnValueCount = drawnCards.filter(c => c.value === currentCard.value).length;
    const remainingValueCount = 4 - drawnValueCount;
    nextValueProbability = remainingValueCount / cardsRemaining;

    // 2. Suit probability: 13 cards of each suit exist in a standard deck.
    // Calculate how many of the current suit have already been drawn,
    // subtract from 13 to find remaining, then divide by cards remaining in the deck.
    const drawnSuitCount = drawnCards.filter(c => c.suit === currentCard.suit).length;
    const remainingSuitCount = 13 - drawnSuitCount;
    nextSuitProbability = remainingSuitCount / cardsRemaining;
  }

  return {
    drawnCards,
    currentCard,
    previousCard,
    cardsRemaining,
    isGameOver,
    isLoading,
    error,
    valueMatches,
    suitMatches,
    snapMessage,
    nextValueProbability,
    nextSuitProbability,
    drawCard,
    restartGame: initDeck
  };
}
