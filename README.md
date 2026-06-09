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