import { Box, Typography, Paper, Slide, Zoom } from '@mui/material';
import { Card } from '../services/deckService.types';
import { CardDisplayProps } from './CardDisplay.types';

/**
 * Component for displaying cards in the game
 * @param currentCard - The currently displayed card
 * @param previousCard - The previously displayed card
 */
export function CardDisplay({ currentCard, previousCard }: CardDisplayProps) {

  /**
   * Renders a card in the game
   * @param card - The card to render
   * @param label - The label to display for the card
   * @param isCurrent - Whether the card is the current card
   * @returns The rendered card component
   */
  const renderCard = (card: Card | null, label: string, isCurrent: boolean) => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6" color="text.secondary">{label}</Typography>
        <Zoom in={true} key={card?.code || 'empty'}>
          <Paper
            elevation={isCurrent && card ? 12 : 4}
            sx={{
              width: 150,
              height: 210,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: card ? 'transparent' : '#e0e0e0',
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease-in-out',
              transform: isCurrent && card ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            {card ? (
              <img src={card.image} alt={`${card.value} of ${card.suit}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <Typography variant="body2" color="text.disabled">No Card</Typography>
            )}
          </Paper>
        </Zoom>
      </Box>
    );
  };

  // Returns the current and previous cards in the game
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, my: 4 }}>
      {renderCard(previousCard, 'Previous Card', false)}
      {renderCard(currentCard, 'Current Card', true)}
    </Box>
  );
}
