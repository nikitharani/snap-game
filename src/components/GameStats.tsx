import { Box, Typography, Button, Paper } from '@mui/material';
import { GameStatsProps } from './GameStats.types';

/**
 * GameStats component for displaying game statistics
 * @param valueMatches - The number of value matches
 * @param suitMatches - The number of suit matches
 * @param onRestart - Callback function for restarting the game
 */
export function GameStats({ valueMatches, suitMatches, onRestart }: GameStatsProps) {
  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 4, textAlign: 'center', backgroundColor: '#333333', color: '#ffffff' }}>
      <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
        Game Over!
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ color: '#cccccc' }}>Value Matches: {valueMatches}</Typography>
        </Box>
        <Box>
          <Typography variant="h6" sx={{ color: '#cccccc' }}>Suit Matches: {suitMatches}</Typography>
        </Box>
      </Box>
      <Button variant="outlined" size="large" onClick={onRestart} sx={{ borderRadius: 8, px: 4, color: '#90caf9', borderColor: '#757575', '&:hover': { borderColor: '#90caf9' } }}>
        PLAY AGAIN
      </Button>
    </Paper>
  );
}
