/**
 * The message type that describes the current snap state.
 */
export type SnapMessage = {
    /**
     * The text message that is displayed to the user
     */
    text: 'SNAP VALUE!' | 'SNAP SUIT!' | 'SNAP BOTH!' | null;
    /**
     * The classification type of the snap match
     */
    type: 'value' | 'suit' | 'both' | null;
};