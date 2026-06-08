/**
 * Type for the GameStats component properties
 */
export type GameStatsProps = {
    /**
     * The number of value matches
     */
    valueMatches: number;
    /**
     * The number of suit matches
     */
    suitMatches: number;
    /**
     * Callback function for restarting the game
     */
    onRestart: () => void;
}