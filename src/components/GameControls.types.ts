import { SnapMessage } from "../hooks/useSnapGame";

/**
 * Type for the GameControls component properties
 */
export type GameControlsProps = {
    /**
     * Callback function for drawing a card
     */
    onDraw: () => void;
    /**
     * Whether the game is loading
     */
    isLoading: boolean;
    /**
     * The number of cards remaining in the deck
     */
    cardsRemaining: number;
    /**
     * The probability of the next card being a value match
     */
    nextValueProbability: number;
    /**
     * The probability of the next card being a suit match
     */
    nextSuitProbability: number;
}