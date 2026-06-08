import { useState, useEffect, useCallback } from 'react';
import { deckService } from '../services/deckService';
import { Card } from '../services/deckService.types';

export interface SnapMessage {
  text: 'SNAP VALUE!' | 'SNAP SUIT!' | 'SNAP BOTH!' | null;
  type: 'value' | 'suit' | 'both' | null;
}

export function useSnapGame() {
  const [deckId, setDeckId] = useState<string | null>(null);
  const [drawnCards, setDrawnCards] = useState<Card[]>([]);
  const [valueMatches, setValueMatches] = useState(0);
  const [suitMatches, setSuitMatches] = useState(0);
  const [snapMessage, setSnapMessage] = useState<SnapMessage>({ text: null, type: null });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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

  useEffect(() => {
    initDeck();
  }, [initDeck]);

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

  useEffect(() => {
    if (drawnCards.length < 2) {
      setSnapMessage({ text: null, type: null });
      return;
    }

    const curr = drawnCards[drawnCards.length - 1];
    const prev = drawnCards[drawnCards.length - 2];

    const valueSnap = curr.value === prev.value;
    const suitSnap = curr.suit === prev.suit;

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

  // calculated values based on the drawnCards array 
  const isGameOver = drawnCards.length === 52;
  const currentCard = drawnCards[drawnCards.length - 1] || null;
  const previousCard = drawnCards[drawnCards.length - 2] || null;
  const cardsRemaining = 52 - drawnCards.length;

  let nextValueProbability = 0;
  let nextSuitProbability = 0;

  if (currentCard && cardsRemaining > 0) {
    const drawnValueCount = drawnCards.filter(c => c.value === currentCard.value).length;
    const remainingValueCount = 4 - drawnValueCount;
    nextValueProbability = remainingValueCount / cardsRemaining;

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
