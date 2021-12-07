import React, { CSSProperties, ReactNode, useCallback, useMemo } from "react";
import { BaseStyle } from "widgets/BaseWidget";
import { WidgetType, WIDGET_PADDING } from "constants/WidgetConstants";
import { generateClassName } from "utils/generators";
import styled from "styled-components";
import { useClickToSelectWidget } from "utils/hooks/useClickToSelectWidget";
import { usePositionedContainerZIndex } from "utils/hooks/usePositionedContainerZIndex";
import { useSelector } from "react-redux";
import { snipingModeSelector } from "selectors/editorSelectors";
import WidgetFactory from "utils/WidgetFactory";
import { memoize } from "lodash";
import { getReflow, getReflowSelector } from "selectors/widgetReflowSelectors";

const PositionedWidget = styled.div<{ zIndexOnHover: number }>`
  &:hover {
    z-index: ${(props) => props.zIndexOnHover} !important;
  }
  transition: transform 100ms ease-in-out;
`;
export type PositionedContainerProps = {
  style: BaseStyle;
  children: ReactNode;
  widgetId: string;
  widgetType: WidgetType;
  selected?: boolean;
  focused?: boolean;
  resizeDisabled?: boolean;
};

export const checkIsDropTarget = memoize(function isDropTarget(
  type: WidgetType,
) {
  return !!WidgetFactory.widgetConfigMap.get(type)?.isCanvas;
});

export function PositionedContainer(props: PositionedContainerProps) {
  const x = props.style.xPosition + (props.style.xPositionUnit || "px");
  const y = props.style.yPosition + (props.style.yPositionUnit || "px");
  const padding = WIDGET_PADDING;
  const clickToSelectWidget = useClickToSelectWidget();
  const isSnipingMode = useSelector(snipingModeSelector);
  // memoized classname
  const containerClassName = useMemo(() => {
    return (
      generateClassName(props.widgetId) +
      " positioned-widget " +
      `t--widget-${props.widgetType
        .split("_")
        .join("")
        .toLowerCase()}`
    );
  }, [props.widgetType, props.widgetId]);
  const isDropTarget = checkIsDropTarget(props.widgetType);
  const { onHoverZIndex, zIndex } = usePositionedContainerZIndex(
    props,
    isDropTarget,
  );
  const { isReflowing } = useSelector(getReflow);

  const reflowSelector = getReflowSelector(props.widgetId);

  const equal = (reflowA: any, reflowB: any) => {
    if (reflowA || reflowB) return false;

    return true;
  };

  const reflowedPosition = useSelector(reflowSelector, equal);

  const reflowX = reflowedPosition?.X || 0;
  const reflowY = reflowedPosition?.Y || 0;
  const reflowWidth = reflowedPosition?.width;
  const reflowHeight = reflowedPosition?.height;

  const containerStyle: CSSProperties = useMemo(() => {
    const transformStyles = isReflowing
      ? {
          transform: `translate(${reflowX}px,${reflowY}px)`,
        }
      : {};
    const styles: CSSProperties = {
      position: "absolute",
      left: x,
      top: y,
      height:
        reflowHeight ||
        props.style.componentHeight + (props.style.heightUnit || "px"),
      width:
        reflowWidth ||
        props.style.componentWidth + (props.style.widthUnit || "px"),
      padding: padding + "px",
      zIndex,
      backgroundColor: "inherit",
      ...transformStyles,
    };
    // if (reflowedPosition) {
    //   styles.padding = "0px";
    //   styles.border = "4px solid cadetblue";
    // }
    return styles;
  }, [
    props.style,
    onHoverZIndex,
    zIndex,
    reflowX,
    reflowY,
    reflowWidth,
    reflowHeight,
    reflowedPosition,
  ]);

  const onClickFn = useCallback(
    (e) => {
      clickToSelectWidget(e, props.widgetId);
    },
    [props.widgetId, clickToSelectWidget],
  );

  // TODO: Experimental fix for sniping mode. This should be handled with a single event
  const stopEventPropagation = (e: any) => {
    !isSnipingMode && e.stopPropagation();
  };

  return (
    <PositionedWidget
      className={containerClassName}
      data-testid="test-widget"
      id={props.widgetId}
      key={`positioned-container-${props.widgetId}`}
      // Positioned Widget is the top enclosure for all widgets and clicks on/inside the widget should not be propogated/bubbled out of this Container.
      onClick={stopEventPropagation}
      onClickCapture={onClickFn}
      //Before you remove: This is used by property pane to reference the element
      style={containerStyle}
      zIndexOnHover={onHoverZIndex}
    >
      {props.children}
    </PositionedWidget>
  );
}

PositionedContainer.padding = WIDGET_PADDING;

export default PositionedContainer;
