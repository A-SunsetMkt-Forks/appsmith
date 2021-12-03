import React from "react";

import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";
import { DerivedPropertiesMap } from "utils/WidgetFactory";

import ProgressBarComponent from "../component";

import { ValidationTypes } from "constants/WidgetValidation";
import { Colors } from "constants/Colors";

class ProgressBarWidget extends BaseWidget<
  ProgressBarWidgetProps,
  WidgetState
> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "General",
        children: [
          {
            helpText: "Provide progress value",
            propertyName: "progress",
            label: "Progress",
            controlType: "INPUT_TEXT",
            placeholderText: "Enter progress value",
            isBindProperty: true,
            isTriggerProperty: false,
            isJSConvertible: true,
            validation: {
              type: ValidationTypes.NUMBER,
              params: { min: 0, max: 100, default: 0 },
            },
          },
          {
            helpText: "Controls the visibility of progress value",
            propertyName: "showResult",
            label: "Show result",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            helpText: "Controls the visibility of the widget",
            propertyName: "isVisible",
            label: "Visible",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
      {
        sectionName: "Styles",
        children: [
          {
            helpText: "Controls the progress color of progress bar",
            propertyName: "fillColor",
            label: "Fill Color",
            controlType: "COLOR_PICKER",
            defaultColor: Colors.GREEN,
            isBindProperty: false,
            isJSConvertible: true,
            isTriggerProperty: false,
          },
        ],
      },
    ];
  }

  static getDerivedPropertiesMap(): DerivedPropertiesMap {
    return {};
  }

  static getDefaultPropertiesMap(): Record<string, string> {
    return {};
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {};
  }

  getPageView() {
    return (
      <ProgressBarComponent
        fillColor={this.props.fillColor}
        progress={this.props.progress}
        showResult={this.props.showResult}
      />
    );
  }

  static getWidgetType(): string {
    return "PROGRESSBAR_WIDGET";
  }
}

export interface ProgressBarWidgetProps extends WidgetProps {
  progress?: number;
  showResult: boolean;
  fillColor: string;
}

export default ProgressBarWidget;
