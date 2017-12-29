import * as request from "supertest";
import * as app from "../src/app";

beforeAll((done) => {
  setTimeout(() => {
    done();
  }, 1000);
});

describe("GET /users", () => {
  it("respond with json", (done) => {
    request(app)
      .get("/api/users")
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });
});
