import { Repository } from "typeorm";
import { ActivityEvent } from "../../../types/activity";
import { Activity } from "../../src/entities/activity";
import { User } from "../../src/entities/user";
import { ActivityService, IActivityService } from "../../src/services/activity";
import { IDatabaseService } from "../../src/services/database";
import { UserService } from "../../src/services/user";
import { MockActivityService } from "./mock/activity";
import { TestDatabaseService } from "./mock/database";
import { MockLoggerService } from "./mock/logger";
import { MockTokenService } from "./mock/tokens";

describe("ActivityService", () => {
  let database: IDatabaseService;
  let activities: Repository<Activity>;
  let activity: IActivityService;
  let user: User;

  beforeAll(async () => {
    database = new TestDatabaseService();
    await database.bootstrap();

    const users = new UserService(
      database,
      new MockLoggerService().instance,
      new MockActivityService().instance,
      new MockTokenService().instance,
    );
    await users.bootstrap();
    user = await users.signup("test@foo.bar", "password");

    activities = database.getRepository(Activity);
  });

  beforeEach(async () => {
    await activities.clear();
    activity = new ActivityService(database);
    await activity.bootstrap();
  });

  it("adds new activities", async () => {
    expect.assertions(2);

    const event = ActivityEvent.Signup;
    await activity.addActivity(user, event);

    const data = await activities.find();

    expect(data.length).toBe(1);
    expect(data[0].event).toBe(event);
  });

  it("retrieves all activities", async () => {
    expect.assertions(1);

    await activity.addActivity(user, ActivityEvent.EmailVerified);
    await activity.addActivity(user, ActivityEvent.Signup);

    const data = await activity.getActivities();
    expect(data.length).toBe(2);
  });
});
