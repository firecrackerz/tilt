import { IActivity } from "../../../types/activity";
import { IRecursivePartial } from "../../../types/api";
import { UserRole } from "../../../types/roles";
import { ISettings } from "../../../types/settings";
import { apiBaseUrl } from "../config";
import { BackendApi } from "./backend-api";
import { StaticApi } from "./static-api";

/**
 * Describes API methods provided by tilt.
 */
export interface IApi {
  /**
   * Gets the application settings.
   */
  getSettings(): Promise<ISettings>;

  /**
   * Creates an account.
   * @param email The user's email
   * @param password The user's password
   */
  signup(email: string, password: string): Promise<string>;

  /**
   * Verifies a user's email.
   * @param token The verify token from the email
   */
  verifyEmail(token: string): Promise<void>;

  /**
   * Logs a user in.
   * @param email The user's email
   * @param password The user's password
   * @return The user's role
   */
  login(email: string, password: string): Promise<UserRole>;

  /**
   * Gets the user's role.
   */
  getRole(): Promise<UserRole>;

  /**
   * Refreshes the login token.
   */
  refreshLoginToken(): Promise<void>;

  /**
   * Updates the settings with the given changes.
   * @param settings The changed settings
   */
  updateSettings(settings: IRecursivePartial<ISettings>): Promise<void>;

  /**
   * Queries the past activity.
   */
  getActivities(): Promise<IActivity[]>;
}

/**
 * An api client, configured to either run against static data, or a tilt backend.
 */
export const api: IApi =
  apiBaseUrl
    ? new BackendApi(apiBaseUrl)
    : new StaticApi();
