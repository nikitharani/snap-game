import { useEffect, useRef } from 'react';
import { Container, Typography, Box, CssBaseline, ThemeProvider, createTheme, Paper } from '@mui/material';
import { useSnapGame } from './hooks/useSnapGame';
import { CardDisplay } from './components/CardDisplay';
import { GameControls } from './components/GameControls';
import { GameStats } from './components/GameStats';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#007aff'
    },
    secondary: {
      main: '#ff2d55'
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
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
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
        {/* Global Page Header Bar */}
        <Box
          component="header"
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 4,
            py: 2,
            borderBottom: '1px solid #e2e8f0',
            background: '#ffffff',
            position: 'sticky',
            top: 0,
            zIndex: 1100,
          }}
        >
          {/* Title SNAP! */}
          <Typography
            variant="h5"
            fontWeight="900"
            sx={{
              letterSpacing: '0.15em',
              fontFamily: '"Outfit", "Inter", sans-serif',
              background: 'linear-gradient(45deg, #007aff 30%, #ff2d55 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            SNAP!
          </Typography>

          {/* Mock OS Window dots (Outlined Circles) */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                border: '1.5px solid #cbd5e1',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                  borderColor: '#94a3b8',
                },
              }}
            />
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                border: '1.5px solid #cbd5e1',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                  borderColor: '#94a3b8',
                },
              }}
            />
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                border: '1.5px solid #cbd5e1',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                  borderColor: '#94a3b8',
                },
              }}
            />
          </Box>
        </Box>
        {/* Main Content Area */}
        <Container
          maxWidth="sm"
          sx={{
            flex: 1,
            py: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error.message || 'An error occurred'}
            </Typography>
          )}
          {/* Global Snap Message / Game Status Placed Above Cards */}
          <Box sx={{ height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            {snapMessage.text ? (
              <Typography
                variant="h4"
                fontWeight="bold"
                color={snapMessage.type === 'value' ? 'primary.main' : snapMessage.type === 'suit' ? 'secondary.main' : 'error.main'}
                sx={{ animation: 'pop 0.3s ease-out', '@keyframes pop': { '0%': { transform: 'scale(0.8)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } } }}
              >
                {snapMessage.text}
              </Typography>
            ) : (
              <Typography variant="body1" color="text.secondary">
                Draw cards and watch for matches!
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
      </Box>
    </ThemeProvider>
  );
}

export default App;
