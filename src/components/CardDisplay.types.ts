import { Card } from "../services/deckService.types";

/**
 * Props for CardDisplay component
 */
export type CardDisplayProps = {
    /**
     * The currently displayed card
     */
    currentCard: Card | null;
    /**
     *The previously displayed card
     */
    previousCard: Card | null;
}