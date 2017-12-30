import * as assert from "assert";
import * as fs from "fs";
import * as request from "supertest";
import { Container } from "typedi";
import { app } from "../src/app";
import { UserService } from "../src/service/UserService";

function createMockdata(): Promise<any> {
  const userService = Container.get(UserService);
  return Promise.all(JSON.parse(fs.readFileSync("./MOCK_DATA.json", "utf8")).map((item) => {
    return userService.createOne(item);
  }));
}

beforeAll((done) => {
  if (fs.existsSync("./test.db")) {
    fs.unlinkSync("./test.db");
  }
  app.on("connected", () => {
    createMockdata().then(() => {
      done();
    });
  });
});

afterAll(() => {
  fs.unlinkSync("./test.db");
});

describe("GET /api/users", () => {
  it("respond with json array", (done) => {
    request(app)
      .get("/api/users")
      .set("Accept", "application/json")
      .expect("Content-Type", new RegExp("application\/json;.*"))
      .expect(200)
      .expect((res) => {
        assert.equal(res.body.length, 10);
        assert.equal(Object.keys(res.body[1]).length, 4);
      })
      .end(done);
  });
});

describe("GET /api/users/{i}", () => {
  it("respond with proper user when valid id", (done) => {
    request(app)
      .get("/api/users/1")
      .set("Accept", "application/json")
      .expect("Content-Type", new RegExp("application\/json;.*"))
      .expect(200)
      .expect((res) => {
        assert.equal(res.body.id, 1);
        assert.equal(res.body.firstName, "Tiphanie");
        assert.equal(res.body.lastName, "Upcott");
        assert.equal(res.body.age, 54);
      })
      .end(done);
  });
  it("respond with not found when invalid id", (done) => {
    request(app)
      .get("/api/users/100")
      .set("Accept", "application/json")
      .expect("Content-Type", new RegExp("application\/json;.*"))
      .expect(404)
      .end(done);
  });
});
