import { OccupiedSpace } from "constants/CanvasEditorConstants";
import { cloneDeep } from "lodash";
import { getMovementMap } from "./reflowHelpers";
import { CollidingSpaceMap, GridProps, ReflowDirection } from "./reflowTypes";
import {
  filterSpaceById,
  getCollidingSpaces,
  getDelta,
  getIsHorizontalMove,
  getOppositeDirection,
  getShouldReflow,
} from "./reflowUtils";

export function reflow(
  newPositions: OccupiedSpace,
  OGPositions: OccupiedSpace,
  occupiedSpaces: OccupiedSpace[],
  direction: ReflowDirection,
  gridProps: GridProps,
  forceDirection = false,
  shouldResize = false,
  immediateExitContainer?: string,
  prevPositions?: OccupiedSpace,
  prevCollidingSpaces?: CollidingSpaceMap,
) {
  const isHorizontalMove = getIsHorizontalMove(newPositions, prevPositions);
  const filteredOccupiedSpace = filterSpaceById(
    newPositions.id,
    occupiedSpaces,
  );
  const consolelog = cloneDeep({
    newPositions,
    OGPositions,
    occupiedSpaces,
    direction,
    gridProps,
    forceDirection,
    shouldResize,
    immediateExitContainer,
    prevPositions,
    prevCollidingSpaces,
  });

  const { collidingSpaceMap, isColliding } = getCollidingSpaces(
    newPositions,
    direction,
    filteredOccupiedSpace,
    isHorizontalMove,
    prevPositions,
    prevCollidingSpaces,
    forceDirection,
  );

  if (!isColliding || !OGPositions || direction === ReflowDirection.UNSET) {
    return {
      movementLimit: {
        canHorizontalMove: true,
        canVerticalMove: true,
      },
    };
  }
  //eslint-disable-next-line
  console.log("reflow input", consolelog);

  if (immediateExitContainer && collidingSpaceMap[immediateExitContainer]) {
    collidingSpaceMap[immediateExitContainer].direction = getOppositeDirection(
      direction,
    );
  }

  const delta = getDelta(OGPositions, newPositions, direction);

  const { movementMap, newPositionsMovement } = getMovementMap(
    filteredOccupiedSpace,
    newPositions,
    collidingSpaceMap,
    gridProps,
    delta,
    shouldResize,
  );

  const movementLimit = getShouldReflow(newPositionsMovement, delta);

  return {
    movementLimit,
    movementMap,
    newPositionsMovement,
    collidingSpaceMap,
  };
}
