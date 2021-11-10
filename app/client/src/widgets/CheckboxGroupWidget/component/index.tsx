import React from "react";
import styled from "styled-components";

import { ComponentProps } from "widgets/BaseComponent";
import { ThemeProp } from "components/ads/common";
import { generateReactKey } from "utils/generators";
import { Colors } from "constants/Colors";

// TODO(abstraction-issue): this needs to be a common import from somewhere in the platform
// Alternatively, they need to be replicated.
import { StyledCheckbox } from "widgets/CheckboxWidget/component";
import { OptionProps, SelectAllState, SelectAllStates } from "../constants";

export interface CheckboxGroupContainerProps {
  inline?: boolean;
  valid?: boolean;
}

const CheckboxGroupContainer = styled.div<
  ThemeProp & CheckboxGroupContainerProps
>`
  display: flex;
  ${({ inline }) => `
    flex-direction: ${inline ? "row" : "column"};
    align-items: ${inline ? "center" : "flex-start"};
    ${inline && "flex-wrap: wrap"};
  `}
  justify-content: space-between;
  width: 100%;
  height: 100%;
  overflow: auto;
  border: 1px solid transparent;
  ${({ theme, valid }) =>
    !valid &&
    `
    border: 1px solid ${theme.colors.error};
  `}
  padding: 2px 4px;

  & .select-all {
    white-space: nowrap;
    color: ${Colors.GREY_9} !important;
  }
`;

export interface SelectAllProps {
  checked: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  inline?: boolean;
  onChange: React.FormEventHandler<HTMLInputElement>;
  rowSpace: number;
}

function SelectAll(props: SelectAllProps) {
  const {
    checked,
    disabled,
    indeterminate,
    inline,
    onChange,
    rowSpace,
  } = props;
  return (
    <StyledCheckbox
      checked={checked}
      className="select-all"
      disabled={disabled}
      indeterminate={indeterminate}
      inline={inline}
      label="Select All"
      onChange={onChange}
      rowSpace={rowSpace}
    />
  );
}

export interface CheckboxGroupComponentProps extends ComponentProps {
  isDisabled?: boolean;
  isInline?: boolean;
  isSelectAll?: boolean;
  isRequired?: boolean;
  isValid?: boolean;
  onChange: (value: string) => React.FormEventHandler<HTMLInputElement>;
  onSelectAllChange: (
    state: SelectAllState,
  ) => React.FormEventHandler<HTMLInputElement>;
  options: OptionProps[];
  rowSpace: number;
  selectedValues: string[];
}
function CheckboxGroupComponent(props: CheckboxGroupComponentProps) {
  const {
    isDisabled,
    isInline,
    isSelectAll,
    isValid,
    onChange,
    onSelectAllChange,
    options,
    rowSpace,
    selectedValues,
  } = props;

  const selectAllChecked = selectedValues.length === options.length;
  const selectAllIndeterminate =
    !selectAllChecked && selectedValues.length >= 1;
  const selectAllState = selectAllChecked
    ? SelectAllStates.CHECKED
    : selectAllIndeterminate
    ? SelectAllStates.INDETERMINATE
    : SelectAllStates.UNCHECKED;

  return (
    <CheckboxGroupContainer inline={isInline} valid={isValid}>
      {isSelectAll && (
        <SelectAll
          checked={selectAllChecked}
          disabled={isDisabled}
          indeterminate={selectAllIndeterminate}
          inline={isInline}
          onChange={onSelectAllChange(selectAllState)}
          rowSpace={rowSpace}
        />
      )}
      {options &&
        options.length > 0 &&
        [...options].map((option: OptionProps) => (
          <StyledCheckbox
            checked={(selectedValues || []).includes(option.value)}
            disabled={isDisabled}
            inline={isInline}
            key={generateReactKey()}
            label={option.label}
            onChange={onChange(option.value)}
            rowSpace={rowSpace}
          />
        ))}
    </CheckboxGroupContainer>
  );
}

export default CheckboxGroupComponent;
