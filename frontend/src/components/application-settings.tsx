import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { useDebouncedCallback } from "use-debounce";
import { IApplicationSettings, ISettings } from "../../../types/settings";
import { updateSettings } from "../actions/settings";
import { debounceDuration } from "../config";
import { FormType, IState, Nullable } from "../state";
import { FormEditor } from "./form-editor";
import { Col, Row } from "./grid";
import { Subheading } from "./headings";
import { Message } from "./message";
import { StatefulTextInput, TextInputType } from "./text-input";

interface IApplicationSettingsProps {
  error?: string | false;
  settings: Nullable<ISettings>;
  dispatchUpdateSettings: typeof updateSettings;
}

/**
 * Settings to configure the application users have to fill out.
 */
export const ApplicationSettings = ({ settings, error, dispatchUpdateSettings }: IApplicationSettingsProps) => {
  const handleUpdateApplicationSettings = (field: keyof IApplicationSettings, value: any) => {
    dispatchUpdateSettings(FormType.ApplicationSettings, {
      application: {
        [field]: value,
      },
    });
  };

  const [debouncedHandleUpdateApplicationSettings] = useDebouncedCallback(handleUpdateApplicationSettings, debounceDuration, []);

  return (
    <>
      <Subheading>Application</Subheading>
      {error && (
        <Message error><b>Error:</b> {error}</Message>
      )}

      <p>An application is divided into two parts: the application and the confirmation phase. Once you accept applications, the users will be moved to the confirmation queue, where they'll need to fill out the remaining questions. If you add questions to the first phase after users submitted the first answers, tilt will ask these new questions in the confirmation phase.</p>
      {settings && (
        <Row>
          <Col percent={33}>
            <StatefulTextInput
              initialValue={settings.application.hoursToConfirm}
              onChange={(time) => debouncedHandleUpdateApplicationSettings("hoursToConfirm", time)}
              type={TextInputType.Number}
              min={1}
              title="Hours to confirm"
              placeholder="keep it fair, e.g. 240 for 10 days"
            />
          </Col>

          <Col percent={33}>
            <StatefulTextInput
              initialValue={settings.application.allowProfileFormFrom}
              onChange={(timestring) => debouncedHandleUpdateApplicationSettings("allowProfileFormFrom", timestring)}
              title="Open registration on"
              placeholder="1970-01-01 00:00:00"
            />
          </Col>

          <Col percent={33}>
            <StatefulTextInput
              initialValue={settings.application.allowProfileFormUntil}
              onChange={(timestring) => debouncedHandleUpdateApplicationSettings("allowProfileFormUntil", timestring)}
              title="Close registration on"
              placeholder="1970-01-01 00:00:00"
            />
          </Col>
        </Row>
      )}

      <p>Use the add button to add new questions and the edit button in the top right of each question to modify them. You may use Markdown syntax in the description, but please keep it short.</p>
      <p>Questions can have reference names, which you can use to conditionally show other questions. For instance, if you have a question, whether someone is a student, you could give that question the reference name "student" and modify subsequent questions by referencing the user's answer to that question.</p>

      {settings && (
        <>
          <FormEditor
            initialForm={settings.application.profileForm}
            onFormChange={(form) => debouncedHandleUpdateApplicationSettings("profileForm", form)}
          />

          <FormEditor
            initialForm={settings.application.confirmationForm}
            onFormChange={(form) => debouncedHandleUpdateApplicationSettings("confirmationForm", form)}
          />
        </>
      )}
    </>
  );
};

const mapStateToProps = (state: IState) => ({
  error: state.form.type === FormType.ApplicationSettings && state.request.error,
  settings: state.settings,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    dispatchUpdateSettings: updateSettings,
  }, dispatch);
};

/**
 * The application settings connected to the redux store.
 */
export const ConnectedApplicationSettings = connect(mapStateToProps, mapDispatchToProps)(ApplicationSettings);
