import * as convict from "convict";
import * as dotenv from "dotenv";
import { Service } from "typedi";
import { IService } from ".";

interface ITiltConfiguration {
  http: IHttpConfiguration;
  log: ILoggerConfiguration;
}

interface IHttpConfiguration {
  port: number;
}

interface ILoggerConfiguration {
  filename: string;
  level: string;
}

/**
 * Provides access to tilt's configuration.
 */
@Service()
export class ConfigurationService implements IService {
  private _config?: ITiltConfiguration;

  public get config(): ITiltConfiguration {
    if (!this._config) {
      // tslint:disable-next-line: no-console
      console.error("no configuration found, exiting");
      process.exit(1);
    }

    return this._config!;
  }

  /**
   * Loads environment variables from the .env file.
   */
  private async loadEnvFile() {
    const { error } = dotenv.config();

    if (error) {
      // tslint:disable-next-line: no-console
      console.warn(`error loading .env configuration: ${error}`);
    }
  }

  /**
   * Loads tilt's configuration from the environment variables.
   */
  public async bootstrap(): Promise<void> {
    await this.loadEnvFile();

    const schema = convict<ITiltConfiguration>({
      http: {
        port: {
          default: 3000,
          env: "PORT",
          format: "int",
        },
      },
      log: {
        filename: {
          default: "tilt.log",
          env: "LOG_FILENAME",
          format: String,
        },
        level: {
          default: "info",
          env: "LOG_LEVEL",
          format: String,
        },
      },
    });

    schema.validate({
      allowed: "strict",
    });

    this._config = schema.getProperties();
  }
}