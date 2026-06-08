import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { GameControlsProps } from './GameControls.types';

/**
 * GameControls component for displaying game controls and information
 * @param onDraw - Callback function for drawing a card
 * @param isLoading - Whether the game is loading
 * @param cardsRemaining - The number of cards remaining in the deck
 * @param nextValueProbability - The probability of the next card being a value match
 * @param nextSuitProbability - The probability of the next card being a suit match
 */
export function GameControls({
  onDraw,
  isLoading,
  cardsRemaining,
  nextValueProbability,
  nextSuitProbability
}: GameControlsProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <Button
        variant="contained"
        size="large"
        onClick={onDraw}
        disabled={isLoading}
        sx={{ minWidth: 200, height: 56, fontSize: '1.2rem', borderRadius: 4 }}
      >
        {isLoading ? <CircularProgress size={28} color="inherit" /> : 'Draw Card'}
      </Button>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Cards Remaining: {cardsRemaining}
        </Typography>
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{
            display: 'block',
            mt: 1,
            visibility: cardsRemaining < 52 && cardsRemaining > 0 ? 'visible' : 'hidden',
            height: 20
          }}
        >
          Match Probability - Value: {(nextValueProbability * 100).toFixed(1)}% | Suit: {(nextSuitProbability * 100).toFixed(1)}%
        </Typography>
      </Box>
    </Box>
  );
}
