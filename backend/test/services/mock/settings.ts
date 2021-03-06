import { MockedService } from ".";
import { ISettingsService } from "../../../src/services/settings";

export const MockSettingsService = jest.fn(() =>
  new MockedService<ISettingsService>({
    bootstrap: jest.fn(),
    getSettings: jest.fn(),
    updateSettings: jest.fn(),
  }),
);
