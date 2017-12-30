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
      .then((res) => {
        assert.equal(res.body.length, 10);
        assert.equal(Object.keys(res.body[1]).length, 4);
        done();
      }).catch((err) => {
        done.fail(err);
      });
  });
});

describe("GET /api/users/{i}", () => {
  it("respond with proper user when valid id", (done) => {
    request(app)
      .get("/api/users/1")
      .set("Accept", "application/json")
      .expect("Content-Type", new RegExp("application\/json;.*"))
      .expect(200)
      .then((res) => {
        assert.equal(res.body.id, 1);
        assert.equal(res.body.firstName, "Tiphanie");
        assert.equal(res.body.lastName, "Upcott");
        assert.equal(res.body.age, 54);
        done();
      }).catch((err) => {
        done.fail(err);
      });
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

describe("POST /api/users", () => {
  it("create a new user and respond with it", (done) => {
    request(app)
      .post("/api/users")
      .send({
        firstName: "Test",
        lastName: "Test",
        age: 10,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", new RegExp("application\/json;.*"))
      .expect(201)
      .then((res) => {
        assert.equal(Object.keys(res.body).length, 4);
        assert.equal(res.body.id, "11");
        assert.equal(res.body.firstName, "Test");
        assert.equal(res.body.lastName, "Test");
        assert.equal(res.body.age, 10);
        done();
      }).catch((err) => {
        done.fail(err);
      });
  });
});

describe("PUT /api/users/{i}", () => {
  it("update user and respond with it", (done) => {
    request(app)
      .put("/api/users/11")
      .send({
        firstName: "Tester",
        lastName: "Tester",
        age: 20,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", new RegExp("application\/json;.*"))
      .expect(200)
      .then((res) => {
        assert.equal(Object.keys(res.body).length, 4);
        assert.equal(res.body.id, "11");
        assert.equal(res.body.firstName, "Tester");
        assert.equal(res.body.lastName, "Tester");
        assert.equal(res.body.age, 20);
        done();
      }).catch((err) => {
        done.fail(err);
      });
  });
  it("respond with not found and not update", (done) => {
    request(app)
      .put("/api/users/100")
      .send({
        firstName: "Tester",
        lastName: "Tester",
        age: 20,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", new RegExp("application\/json;.*"))
      .expect(404)
      .end(done);
  });
});

describe("DELETE /api/users/{i}", () => {
  it("delete user and respond accepted", (done) => {
    request(app)
      .delete("/api/users/11")
      .set("Accept", "application/json")
      .expect("Content-Type", new RegExp("application\/json;.*"))
      .expect(202)
      .end(done);
  });
  it("respond not found when invalid id", (done) => {
    request(app)
      .delete("/api/users/100")
      .set("Accept", "application/json")
      .expect("Content-Type", new RegExp("application\/json;.*"))
      .expect(404)
      .end(done);
  });
});
