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
        <Box sx={{ width: 158, height: 221, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Zoom in={true} key={card?.code || 'empty'}>
            <Paper
              elevation={isCurrent && card ? 4 : 1}
              sx={{
                width: 150,
                height: 210,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: card ? 'transparent' : '#f8fafc',
                border: card ? 'none' : '2px dashed #cbd5e1',
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.3s ease-in-out',
                transform: isCurrent && card ? 'scale(1.05)' : 'scale(1)',
                boxShadow: isCurrent && card 
                  ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                  : undefined
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
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 4, md: 2 }, my: { xs: 3, md: 2 } }}>
      {renderCard(previousCard, 'Previous Card', false)}
      {renderCard(currentCard, 'Current Card', true)}
    </Box>
  );
}
