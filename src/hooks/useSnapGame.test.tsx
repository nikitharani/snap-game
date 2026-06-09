import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSnapGame } from './useSnapGame';
import { deckService } from '../services/deckService';

// Mock the deckService
vi.mock('../services/deckService', () => {
  return {
    deckService: {
      createDeck: vi.fn(),
      drawCard: vi.fn()
    }
  };
});

//  Test cases for the useSnapGame hook.
describe('useSnapGame Hook', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Default success mock for creating a deck
    (deckService.createDeck as any).mockResolvedValue({
      success: true,
      deck_id: 'test-deck-123',
      shuffled: true,
      remaining: 52
    });
  });

  it('should initialize with correct default values', async () => {
    const { result } = renderHook(() => useSnapGame());

    // Allow initial initDeck to resolve
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.drawnCards).toEqual([]);
    expect(result.current.currentCard).toBeNull();
    expect(result.current.previousCard).toBeNull();
    expect(result.current.cardsRemaining).toBe(52);
    expect(result.current.isGameOver).toBe(false);
    expect(result.current.valueMatches).toBe(0);
    expect(result.current.suitMatches).toBe(0);
    expect(result.current.snapMessage.text).toBeNull();
  });

  it('should update state after drawing a card', async () => {
    const mockCard = {
      code: 'KH',
      value: 'KING',
      suit: 'HEARTS',
      image: 'img_path',
      images: { png: '', svg: '' }
    };

    (deckService.drawCard as any).mockResolvedValue({
      success: true,
      cards: [mockCard],
      deck_id: 'test-deck-123',
      remaining: 51
    });

    const { result } = renderHook(() => useSnapGame());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.drawCard();
    });

    expect(result.current.drawnCards).toHaveLength(1);
    expect(result.current.currentCard).toEqual(mockCard);
    expect(result.current.previousCard).toBeNull();
    expect(result.current.cardsRemaining).toBe(51);
  });

  it('should detect a value snap', async () => {
    const mockCard1 = { code: 'KH', value: 'KING', suit: 'HEARTS', image: '', images: { png: '', svg: '' } };
    const mockCard2 = { code: 'KS', value: 'KING', suit: 'SPADES', image: '', images: { png: '', svg: '' } };

    const { result } = renderHook(() => useSnapGame());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Draw first card
    (deckService.drawCard as any).mockResolvedValueOnce({
      success: true,
      cards: [mockCard1],
      deck_id: 'test-deck-123',
      remaining: 51
    });
    await act(async () => {
      await result.current.drawCard();
    });

    // Draw second card (Value Match)
    (deckService.drawCard as any).mockResolvedValueOnce({
      success: true,
      cards: [mockCard2],
      deck_id: 'test-deck-123',
      remaining: 50
    });
    await act(async () => {
      await result.current.drawCard();
    });

    expect(result.current.valueMatches).toBe(1);
    expect(result.current.suitMatches).toBe(0);
    expect(result.current.snapMessage.text).toBe('SNAP VALUE!');
  });

  it('should detect a suit snap', async () => {
    const mockCard1 = { code: 'KH', value: 'KING', suit: 'HEARTS', image: '', images: { png: '', svg: '' } };
    const mockCard2 = { code: '5H', value: '5', suit: 'HEARTS', image: '', images: { png: '', svg: '' } };

    const { result } = renderHook(() => useSnapGame());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Draw first card
    (deckService.drawCard as any).mockResolvedValueOnce({
      success: true,
      cards: [mockCard1],
      deck_id: 'test-deck-123',
      remaining: 51
    });
    await act(async () => {
      await result.current.drawCard();
    });

    // Draw second card (Suit Match)
    (deckService.drawCard as any).mockResolvedValueOnce({
      success: true,
      cards: [mockCard2],
      deck_id: 'test-deck-123',
      remaining: 50
    });
    await act(async () => {
      await result.current.drawCard();
    });

    expect(result.current.valueMatches).toBe(0);
    expect(result.current.suitMatches).toBe(1);
    expect(result.current.snapMessage.text).toBe('SNAP SUIT!');
  });

  it('should calculate probabilities correctly', async () => {
    const mockCard = { code: 'KH', value: 'KING', suit: 'HEARTS', image: '', images: { png: '', svg: '' } };

    const { result } = renderHook(() => useSnapGame());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    (deckService.drawCard as any).mockResolvedValueOnce({
      success: true,
      cards: [mockCard],
      deck_id: 'test-deck-123',
      remaining: 51
    });
    await act(async () => {
      await result.current.drawCard();
    });

    // After 1 card is drawn, remaining cards in deck = 51.
    // We drew 'KING', there are 3 'KING's left. Probability = 3 / 51 = 0.0588 (approx 5.9%)
    // We drew 'HEARTS', there are 12 'HEARTS' left. Probability = 12 / 51 = 0.2353 (approx 23.5%)
    expect(result.current.nextValueProbability).toBeCloseTo(3 / 51);
    expect(result.current.nextSuitProbability).toBeCloseTo(12 / 51);
  });
});
