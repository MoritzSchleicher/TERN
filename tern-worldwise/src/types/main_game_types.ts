export enum GameState {
    LOADING,
    MENU,
    ROUND,
    RESULT,
}

export enum RoundState {
    QUESTION = "question",
    RESOLUTION = "resoltion",
    FLIGHT = "flight",
    NUGGET = "nugget"
}

export enum GlobeState {
    LOADING,
    READY,
    AUTO_MOVING,
    LOCKED,
}