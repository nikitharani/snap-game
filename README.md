# Snap Card Game

A modern, responsive, and feature-rich single-page application (SPA) implementation of the classic card game **Snap**, built using **React**, **Vite**, **TypeScript**, and **Material UI (MUI)**. The game integrates with the public [Deck of Cards API](https://deckofcardsapi.com/) to shuffle and draw cards dynamically.

---

## 🎮 Game Rules & UX Details

1. **Setup**: The game starts by automatically creating and shuffling a standard deck of 52 cards via the API.
2. **Gameplay**: 
   - Click the **Draw Card** button to draw a card from the deck.
   - When a card is drawn, the previous card moves to the "Previous Card" slot, and the new card appears in the "Current Card" slot.
3. **Snap Matches**:
   - **Value Match**: Occurs when the drawn card has the same rank (e.g., King, 5, Ace) as the previous card. Displays a `SNAP VALUE!` alert.
   - **Suit Match**: Occurs when the drawn card has the same suit (Hearts, Spades, Diamonds, Clubs) as the previous card. Displays a `SNAP SUIT!` alert.
   - **Both Match**: Occurs when both suit and rank match (possible if multiple decks were used, or special rules apply). Displays a `SNAP BOTH!` alert.
4. **Game Over**: Once all 52 cards are drawn, the game finishes, presenting a summary of total **Value Matches** and **Suit Matches** along with a **Play Again** restart button.

---

## ✨ Features

- **Premium Light Mode UI (Wireframe-Matched)**: Styled from the ground up to match the wireframe exactly. Uses a clean light slate palette (`#f8fafc`), pure white containers, high-contrast Slate text colors, and custom card elevation/hover effects.
- **Global Window Header**: Features a sticky, full-width mock browser/application window header bar at the top of the viewport. It displays the **"SNAP!"** logo with a beautiful blue-to-pink gradient on the left, and three hollow outlined circles representing system controls on the right.
- **Zero Layout Shifts (Stable Animations)**: Implements layout-shift prevention throughout the game:
  - Card transitions use a fixed-dimension wrapper so the page content remains static and stable during zoom updates.
  - The draw button has a fixed height, preventing shifts when transitioning to the loading spinner.
  - Match probabilities use CSS `visibility` logic to pre-reserve height space before the first card is drawn.
- **Dynamic Probabilities**: Shows the real-time probability (as a percentage) of getting a value match or a suit match on the next draw. These statistics adapt dynamically based on the remaining contents of the deck.
- **Synthesized Audio Effects**: Uses the native **Web Audio API** to generate sound effects dynamically (draw sweep, match snap) directly in the browser without requiring heavy audio asset files. Uses a singleton context to bypass web browser audio-thread blocks.
- **Smooth Micro-Animations**: Card transitions are animated using MUI's `Zoom` and `Fade` helpers, and match messages pop dynamically to capture user attention.
- **No Third-Party State Overhead**: Avoids complex state libraries (like Redux or React Query) to keep code readable, lightweight, and performant for assessment.
- **100% Type-Safe**: Built fully with TypeScript, ensuring clear type interfaces for cards, API responses, hooks, and component properties.

---

## 🛠️ Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **UI Library**: Material UI (MUI) v5
- **Testing**: Vitest + React Testing Library + jsdom
- **API**: Deck of Cards API

---

## 📁 Project Architecture

The codebase follows a modular and clean architecture:

```
src/
├── services/
│   └── deckService.ts       # Service layer for communicating with the Deck of Cards API
├── hooks/
│   ├── useSnapGame.ts       # Custom hook managing state, math, matches, and API integration
│   └── useSnapGame.test.tsx # Unit tests for the hook and core game logic
├── components/
│   ├── CardDisplay.tsx      # Render component for current and previous cards
│   ├── GameControls.tsx     # Handles button drawing, remaining cards counter, and probabilities
│   └── GameStats.tsx        # Post-game statistics panel and restart trigger
├── App.tsx                  # Root layout, theme provider, and singleton Web Audio player
├── App.test.tsx             # Integration tests for the full user-interaction flow
├── main.tsx                 # Entrypoint
└── test/
    └── setup.ts             # Testing library matchers registration for Vitest
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.x or higher recommended)
- **npm** (v9.x or higher)

### Installation

1. Clone or download the repository.
2. Open a terminal in the root folder and run:
   ```bash
   npm install
   ```

### Running the Application

To start the local Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
The application will run locally (typically at `http://localhost:5173`).

### Building for Production

To compile TypeScript and compile code into production-ready assets:
```bash
npm run build
```

To preview the built production application locally:
```bash
npm run preview
```

---

## 🧪 Testing

The project uses **Vitest** for fast unit and integration testing.

To run the test suite:
```bash
npm run test
```

### Coverage Details:
- **`useSnapGame.test.tsx`**: Tests the core game hook, validating initial state setup, card-drawing states, probability calculations (matching value/suit percentages), and matching logic alerts.
- **`App.test.tsx`**: Integration tests confirming that components mount correctly, deck services are called on load, and drawing a card updates the layout correctly.