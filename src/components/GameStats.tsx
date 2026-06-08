import { Box, Typography, Button, Paper } from '@mui/material';

interface GameStatsProps {
  valueMatches: number;
  suitMatches: number;
  onRestart: () => void;
}

export function GameStats({ valueMatches, suitMatches, onRestart }: GameStatsProps) {
  return (
    <Paper elevation={0} sx={{ p: 5, mt: 2, borderRadius: 4, textAlign: 'center', backgroundColor: '#333333', color: '#ffffff' }}>
      <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
        Game Over!
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 8, mb: 5 }}>
        <Box>
          <Typography variant="h2" color="primary.main" fontWeight="bold">{valueMatches}</Typography>
          <Typography variant="subtitle1" sx={{ color: '#cccccc' }}>Value Matches</Typography>
        </Box>
        <Box>
          <Typography variant="h2" color="secondary.main" fontWeight="bold">{suitMatches}</Typography>
          <Typography variant="subtitle1" sx={{ color: '#cccccc' }}>Suit Matches</Typography>
        </Box>
      </Box>
      <Button variant="outlined" size="large" onClick={onRestart} sx={{ borderRadius: 8, px: 4, color: '#90caf9', borderColor: '#757575', '&:hover': { borderColor: '#90caf9' } }}>
        PLAY AGAIN
      </Button>
    </Paper>
  );
}
