import { useEffect, useRef } from 'react';
import { Container, Typography, Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useSnapGame } from './hooks/useSnapGame';
import { CardDisplay } from './components/CardDisplay';
import { GameControls } from './components/GameControls';
import { GameStats } from './components/GameStats';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Use a singleton audio context to prevent inconsistent sounds
let audioCtx: AudioContext | null = null;

function App() {
  const {
    currentCard,
    previousCard,
    cardsRemaining,
    isGameOver,
    isLoading,
    error,
    valueMatches,
    suitMatches,
    snapMessage,
    nextValueProbability,
    nextSuitProbability,
    drawCard,
    restartGame
  } = useSnapGame();

  const playSound = (type: 'draw' | 'snap') => {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'draw') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime); // Lowered volume
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      } else if (type === 'snap') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(500, audioCtx.currentTime);
        osc.frequency.setValueAtTime(800, audioCtx.currentTime + 0.1);
        osc.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime); // Lowered volume
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
    } catch (e) {
      // Ignore if Audio API is blocked or unavailable
    }
  };

  const prevRemainingRef = useRef(cardsRemaining);

  useEffect(() => {
    // Only play draw sound if cards decreased and it's not the first render
    if (cardsRemaining < prevRemainingRef.current) {
      playSound('draw');
    }
    prevRemainingRef.current = cardsRemaining;
  }, [cardsRemaining]);

  useEffect(() => {
    if (snapMessage.text) {
      playSound('snap');
    }
  }, [snapMessage.text, valueMatches, suitMatches]); // added matches to dependency to ensure it fires on consecutive same-type snaps

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ py: 2, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', textAlign: 'center', mb: 2 }}>
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom sx={{
            background: 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}>
            Snap Game
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Draw cards and watch for matches!
          </Typography>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error.message || 'An error occurred'}
          </Typography>
        )}

        {/* Global Snap Message Placed Above Cards */}
        <Box sx={{ height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {snapMessage.text && (
            <Typography
              variant="h4"
              fontWeight="bold"
              color={snapMessage.type === 'value' ? 'primary.main' : snapMessage.type === 'suit' ? 'secondary.main' : 'error.main'}
              sx={{ animation: 'pop 0.3s ease-out', '@keyframes pop': { '0%': { transform: 'scale(0.8)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } } }}
            >
              {snapMessage.text}
            </Typography>
          )}
        </Box>

        <CardDisplay
          currentCard={currentCard}
          previousCard={previousCard}
        />

        {!isGameOver ? (
          <GameControls
            onDraw={drawCard}
            isLoading={isLoading}
            cardsRemaining={cardsRemaining}
            nextValueProbability={nextValueProbability}
            nextSuitProbability={nextSuitProbability}
          />
        ) : (
          <Box sx={{ width: '100%', mt: 1 }}>
            <GameStats
              valueMatches={valueMatches}
              suitMatches={suitMatches}
              onRestart={restartGame}
            />
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
