/**
 * Type definition for a card in the deck
 */
export type Card = {
    /**
     * The code of the card
     */
    code: string;
    /**
     * The image of the card
     */
    image: string;
    /**
     * The images of the card
     */
    images: {
        /**
         * The SVG image of the card
         */
        svg: string;
        /**
         * The PNG image of the card
         */
        png: string;
    };
    /**
     * The value of the card
     */
    value: string;
    /**
     * The suit of the card
     */
    suit: string;
}

/**
 * Type definition for the response from the newDeck function
 */
export type DeckResponse = {
    /**
     * Whether the request was successful
     */
    success: boolean;
    /**
     * The ID of the deck
     */
    deck_id: string;
    /**
     * Whether the deck was shuffled
     */
    shuffled: boolean;
    /**
     * The number of cards remaining in the deck
     */
    remaining: number;
}

/**
 * Type definition for the response from the drawCard function
 */
export type DrawResponse = {
    /**
     * Whether the request was successful
     */
    success: boolean;
    /**
     * The cards drawn from the deck
     */
    cards: Card[];
    /**
     * The ID of the deck
     */
    deck_id: string;
    /**
     * The number of cards remaining in the deck
     */
    remaining: number;
}