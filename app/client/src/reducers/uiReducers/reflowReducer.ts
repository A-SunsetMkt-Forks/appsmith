import { ResizeDirection } from "resizable/resizenreflow";
import { createReducer } from "utils/AppsmithUtils";
import {
  ReduxAction,
  ReflowReduxActionTypes,
} from "constants/ReduxActionConstants";
import { OccupiedSpace } from "constants/editorConstants";

const initialState: widgetReflowState = {
  isReflowing: false,
  reflow: {
    resizeDirections: ResizeDirection.UNSET,
  },
};

export const widgetReflowReducer = createReducer(initialState, {
  [ReflowReduxActionTypes.START_REFLOW]: (
    _,
    action: ReduxAction<{ reflow: Reflow }>,
  ) => {
    return { isReflowing: true, reflow: { ...action.payload } };
  },
  [ReflowReduxActionTypes.STOP_REFLOW]: () => {
    return { isReflowing: false, resizeDirections: ResizeDirection.UNSET };
  },
  [ReflowReduxActionTypes.REFLOW_MOVE]: (
    _,
    action: ReduxAction<{ reflow: Reflow }>,
  ) => {
    return { isReflowing: true, reflow: { ...action.payload } };
  },
});

export type widgetReflowState = {
  isReflowing: boolean;
  reflow: Reflow;
};

export type CollidingWidgets = {
  [key: string]: OccupiedSpace & {
    direction: ResizeDirection;
  };
};

export type Reflow = {
  staticWidgetId?: string;
  staticWidget?: StaticReflowWidget | undefined;
  resizeDirections: ResizeDirection;
  reflowingWidgets?: reflowWidgets;
  initialCollidingWidgets?: CollidingWidgets;
};

export type StaticReflowWidget = {
  id?: string;
  maxX?: number;
  mathXComparator?: string;
  directionXIndicator?: number;
  maxY?: number;
  mathYComparator?: string;
  directionYIndicator?: number;
};

export type reflowWidgets = {
  [key: string]: {
    x?: number;
    y?: number;
    maxX?: number;
    maxY?: number;
    dimensionXBeforeCollision?: number;
    dimensionYBeforeCollision?: number;
    maxOccupiedSpace?: number;
    whiteSpaces?: number;
    collisionWhiteSpaces?: number;
    X?: number;
    Y?: number;
    width?: number;
    height?: number;
    depth?: number;
  };
};
