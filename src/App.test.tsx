import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { deckService } from './services/deckService';

// Mock the deckService
vi.mock('./services/deckService', () => ({
  deckService: {
    createDeck: vi.fn(),
    drawCard: vi.fn()
  }
}));

describe('App Component Integration', () => {
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

  it('should render the Game title and draw button', async () => {
    render(<App />);
    
    // Wait for deck to initialize
    const button = await screen.findByRole('button', { name: /Draw Card/i });
    expect(button).toBeInTheDocument();
    
    expect(screen.getByText('Snap Game')).toBeInTheDocument();
  });

  it('should display drawn card after clicking draw', async () => {
    const mockCard = {
      code: 'KH',
      value: 'KING',
      suit: 'HEARTS',
      image: 'https://deckofcardsapi.com/static/img/KH.png',
      images: { png: '', svg: '' }
    };

    (deckService.drawCard as any).mockResolvedValue({
      success: true,
      cards: [mockCard],
      deck_id: 'test-deck-123',
      remaining: 51
    });

    render(<App />);
    
    const button = await screen.findByRole('button', { name: /Draw Card/i });
    
    // Click draw
    fireEvent.click(button);
    
    // Find the image of the card
    const currentCardImg = await screen.findByAltText('KING of HEARTS');
    expect(currentCardImg).toBeInTheDocument();
    expect(currentCardImg).toHaveAttribute('src', mockCard.image);
    
    // Expect remaining cards to update
    expect(screen.getByText('Cards Remaining: 51')).toBeInTheDocument();
  });
});
