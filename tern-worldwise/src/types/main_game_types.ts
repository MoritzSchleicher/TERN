export enum GameState {
    LOADING,
    MENU,
    ROUND,
    RESULT,
    SUBMIT
}

export enum RoundState {
    NONE = "none",
    QUESTION = "question",
    RESOLUTION = "resoltion",
    FLIGHT = "flight",
    NUGGET = "nugget",
}

export enum GlobeState {
    LOADING,
    READY,
    AUTO_MOVING,
    NO_AUTO_MOVING,
    LOCKED_AUTO_MOVING,
    LOCKED,
}