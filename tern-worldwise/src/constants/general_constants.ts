import { Vector3 } from "three";

export const Constants = {
  APP: {
    VERSION: "1.0.0",
    NAME: "MyCoolApp",
  },
  GLOBE: {
    FLY_ALTITUDE: 1.4,
    FLY_MS: 1200,
    ROTATION_SPEED: -0.25,
    START_POS: new Vector3(0, 0, 300),
    RADIUS: 100,
    CENTER: new Vector3(0, 0, 0),
    LON_OFFSET_DEG: -90,
    FINAL_ZOOM: 0.5,
  },
};