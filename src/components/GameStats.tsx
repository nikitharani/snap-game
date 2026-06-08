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
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 4,
        textAlign: 'center',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      <Typography variant="h4" gutterBottom fontWeight="900" sx={{ mb: 2, color: 'text.primary' }}>
        Game Over!
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
        <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          Value Matches: <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>{valueMatches}</Box>
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          Suit Matches: <Box component="span" sx={{ color: 'secondary.main', fontWeight: 700 }}>{suitMatches}</Box>
        </Typography>
      </Box>
      <Button
        variant="contained"
        size="large"
        onClick={onRestart}
        sx={{
          borderRadius: 4,
          px: 4,
          py: 1.2,
          fontWeight: 'bold',
          textTransform: 'none',
          boxShadow: '0 4px 14px 0 rgba(0, 122, 255, 0.2)',
          '&:hover': {
            boxShadow: '0 6px 20px 0 rgba(0, 122, 255, 0.3)',
          }
        }}
      >
        Play Again
      </Button>
    </Paper>
  );
}
