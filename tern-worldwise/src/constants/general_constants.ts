import { Vector3 } from "three";

export const Constants = {
  APP: {
    VERSION: "1.0.0",
    NAME: "MyCoolApp",
  },
  GLOBE: {
    FLY_ALTITUDE: 1.4,
    FLY_MS: 1200,
    ROTATION_SPEED: -0.35,
    START_POS: new Vector3(0, 0, 300),
    RESP_START_POS: new Vector3(0, 0, 450),
    RADIUS: 100,
    CENTER: new Vector3(0, 0, 0),
    LON_OFFSET_DEG: -90,
    FINAL_ZOOM: 0.5,
    TRANSITION_MOVE_SPEED: 900,
    MIN_DIST: 180,
    MAX_DIST: 400
  },
  GAME: {
    MAX_ROUNDS: 10,
    TIME_PER_ROUND_IN_MS: 30000
  },
  TEXT: {
    QUESTION_MAX_SIGNS: 20,
    NUGGET_MAX_SIGNS: 20
  }
};