import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { SnapMessage } from '../hooks/useSnapGame';

interface GameControlsProps {
  onDraw: () => void;
  isLoading: boolean;
  cardsRemaining: number;
  snapMessage: SnapMessage;
  nextValueProbability: number;
  nextSuitProbability: number;
}

export function GameControls({
  onDraw,
  isLoading,
  cardsRemaining,
  snapMessage,
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
        sx={{ minWidth: 200, py: 1.5, fontSize: '1.2rem', borderRadius: 4 }}
      >
        {isLoading ? <CircularProgress size={28} color="inherit" /> : 'Draw Card'}
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Cards Remaining: {cardsRemaining}
        </Typography>
        {cardsRemaining < 52 && cardsRemaining > 0 && (
          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1 }}>
            Match Probability - Value: {(nextValueProbability * 100).toFixed(1)}% | Suit: {(nextSuitProbability * 100).toFixed(1)}%
          </Typography>
        )}
      </Box>
    </Box>
  );
}
