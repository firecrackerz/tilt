import * as React from "react";
import { useState } from "react";
import { IChoicesQuestion } from "../../../types/questions";
import { Checkboxes } from "./checkbox";
import { Col, Row } from "./grid";
import { Select } from "./select";
import { TextInput, TextInputType } from "./text-input";

interface IChoicesQuestionProps {
  editable?: boolean;
  question: IChoicesQuestion;
  onQuestionChange?: (changes: Partial<IChoicesQuestion>) => any;

  selected: string[];
  onSelectedChanged: (selected: string[]) => any;
}

/**
 * A question to select from multiple options, either via dropdown, checkboxes or radio boxes.
 */
export const ChoicesQuestion = ({ editable, onQuestionChange, question, selected, onSelectedChanged }: IChoicesQuestionProps) => {
  if (editable && onQuestionChange) {
    const checkboxOptionValue = "Use checkboxes";
    const radioOptionValue = "Use radio buttons";
    const displayAsDropdownOptionValue = "Use a dropdown";
    const appearanceOptions = [
      checkboxOptionValue,
      radioOptionValue,
      displayAsDropdownOptionValue,
    ];

    const selectedAppearanceOptions = (
      question.allowMultiple
        ? [checkboxOptionValue]
        : (
          question.displayAsDropdown
            ? [displayAsDropdownOptionValue]
            : [radioOptionValue]
        )
    );

    const handleAppearanceChange = (selectedAppearance: string[]) => {
      onQuestionChange({
        allowMultiple: selectedAppearance.includes(checkboxOptionValue),
        displayAsDropdown: selectedAppearance.includes(displayAsDropdownOptionValue),
      });
    };

    const [choicesText, setChoicesText] = useState(question.choices.join("\n"));
    const handleChoicesUpdate = (text: string) => {
      setChoicesText(text);
      onQuestionChange({
        choices:
          text
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0),
      });
    };

    return (
      <>
        <Row>
          <Col percent={50}>
            <TextInput
              type={TextInputType.Area}
              title="Options"
              placeholder="no options"
              value={choicesText}
              onChange={handleChoicesUpdate}
            />
          </Col>
          <Col percent={50}>
            <Checkboxes
              values={appearanceOptions}
              selected={selectedAppearanceOptions}
              onChange={handleAppearanceChange}
              title="Appearance"
              radio
            />
          </Col>
        </Row>
      </>
    );
  }

  if (question.displayAsDropdown) {
    return (
      <Select
        mandatory={question.mandatory}
        onChange={(value) => onSelectedChanged([value])}
        title={question.title}
        value={selected[0]}
        values={question.choices}
      />
    );
  }

  return (
    <Checkboxes
      values={question.choices}
      selected={selected}
      onChange={onSelectedChanged}
      title={question.title}
      mandatory={question.mandatory}
      radio={!question.allowMultiple}
    />
  );
};
