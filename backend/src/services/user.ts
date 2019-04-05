import { genSalt, hash } from "bcrypt";
import { Inject, Service, Token } from "typedi";
import { Repository } from "typeorm";
import { IService } from ".";
import { ActivityEvent } from "../../../types/activity";
import { User } from "../entities/user";
import { ActivityServiceToken, IActivityService } from "./activity";
import { DatabaseServiceToken, IDatabaseService } from "./database";
import { ILoggerService, LoggerServiceToken } from "./log";

/**
 * An interface describing user handling.
 */
export interface IUserService extends IService {
  /**
   * Adds a new user with the given credentials.
   * @param email The user's email
   * @param password The user's plaintext password
   */
  signup(email: string, password: string): Promise<User>;

  /**
   * Sets the verified flag on a user with the given token.
   * @param verifyToken The token sent to the user
   */
  verifyUserByVerifyToken(verifyToken: string): Promise<void>;
}

/**
 * A token used to inject a concrete user service.
 */
export const UserServiceToken = new Token<IUserService>();

/**
 * A service to handle users.
 */
@Service(UserServiceToken)
export class UserService implements IUserService {
  private _users?: Repository<User>;

  public constructor(
    @Inject(DatabaseServiceToken) private readonly _database: IDatabaseService,
    @Inject(LoggerServiceToken) private readonly _logger: ILoggerService,
    @Inject(ActivityServiceToken) private readonly _activity: IActivityService,
  ) { }

  /**
   * Sets up the user service.
   */
  public async bootstrap(): Promise<void> {
    this._users = this._database.getRepository(User);
  }

  /**
   * Adds a new user.
   * @param email The user's email
   * @param password The user's password
   */
  public async signup(email: string, password: string): Promise<User> {
    const user = new User();
    user.email = email;
    user.password = await hash(password, 10);
    user.verifyToken = await genSalt(10);

    const now = new Date();
    user.createdAt = now;
    user.updatedAt = now;

    await this._users!.save(user);
    this._logger.debug(`${user.email} signed up, token ${user.verifyToken}`);
    this._activity.addActivity(user, ActivityEvent.Signup);

    return user;
  }

  /**
   * Verifies an account using it's verifyToken.
   * @param verifyToken The token sent to the user
   */
  public async verifyUserByVerifyToken(verifyToken: string): Promise<void> {
    const user = await this._users!.findOneOrFail({
      where: {
        verifyToken,
      },
    });

    user.didVerifyEmail = true;
    user.verifyToken = "";

    await this._users!.save(user);
    this._logger.debug(`${user.email} verified their email`);
    this._activity.addActivity(user, ActivityEvent.EmailVerified);
  }
}