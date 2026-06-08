import { Box, Typography, Paper, Slide, Zoom } from '@mui/material';
import { Card } from '../services/deckService';

interface CardDisplayProps {
  currentCard: Card | null;
  previousCard: Card | null;
}

export function CardDisplay({ currentCard, previousCard }: CardDisplayProps) {
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

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, my: 4 }}>
      {renderCard(previousCard, 'Previous Card', false)}
      {renderCard(currentCard, 'Current Card', true)}
    </Box>
  );
}
