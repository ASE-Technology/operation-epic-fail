const request = require("supertest");
const app = require("../index");
const dbUtil = require('../utils/db.util');

const USER = {
    email: new Date().valueOf() + "@foo.com",
    password: "passpass",
}

let TOKEN = '';

describe("POST /authentication/register", () => {
    test("should not be able to create an account with invalid email", async () => {
        return request(app)
            .post("/authentication/register")
            .send({email: "bademail.com", password: USER.password})
            .expect(400)
    });

    test("should not be able to create an account with invalid password", async () => {
        return request(app)
            .post("/authentication/register")
            .send({email: USER.email, password: "foo"})
            .expect(400)
    });

    test("should create an account", async () => {
        return request(app)
            .post("/authentication/register")
            .send(USER)
            .expect(200)
    });

    test("should not create an account with the same email", async () => {
        return request(app)
            .post("/authentication/register")
            .send(USER)
            .expect(409)
            .then(({ body }) => {
                expect(body.message).toBe("User with this email already exists")
            });
    });
});

describe("POST /authentication/login", () => {
    test("should not login with wrong email", async () => {
        return request(app)
            .post("/authentication/login")
            .send({email: "wrongemail@bar.com", password: USER.password})
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe("User not found")
            });
    });

    test("should not login with wrong password", async () => {
        return request(app)
            .post("/authentication/login")
            .send({email: USER.email, password: "wrongpass"})
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe("Wrong password")
            });
    });

    test("should login with its account", async () => {
        return request(app)
            .post("/authentication/login")
            .send(USER)
            .expect(200)
            .then(({ body }) => {
                expect(body.accessToken).toBeDefined()
                TOKEN = body.accessToken
            })
    });
});

describe("GET /authentication/profile", () => {
    test("should get profile if authorization header was not provided", async () => {
        return request(app)
            .get("/authentication/profile")
            .send(USER)
            .expect(401);
    });

    test("should not get profile if authorization type was wrong", async () => {
        return request(app)
            .get("/authentication/profile")
            .set('Authorization', `Basic ${TOKEN}`)
            .send(USER)
            .expect(401);
    });

    test("should not get profile if authorization token was wrong", async () => {
        return request(app)
            .get("/authentication/profile")
            .set('Authorization', `Bearer 123456789`)
            .send(USER)
            .expect(401);
    });

    test("should get his profile", async () => {
        return request(app)
            .get("/authentication/profile")
            .set('Authorization', `Bearer ${TOKEN}`)
            .send(USER)
            .expect(200)
            .then(({ body }) => {
                expect(body.email).toBe(USER.email)
            })
    });
});

describe("POST /authentication/profile", () => {
    test("should not update profile if wrong current password was provided", async () => {
        return request(app)
            .put("/authentication/profile")
            .set('Authorization', `Bearer ${TOKEN}`)
            .send({email: USER.email, newPassword: USER.password, oldPassword: "wrongpass"})
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe("Wrong old password");
            });
    });

    test("should not update profile if invalid new password was provided", async () => {
        return request(app)
            .put("/authentication/profile")
            .set('Authorization', `Bearer ${TOKEN}`)
            .send({email: USER.email, newPassword: "foo", oldPassword: USER.password})
            .expect(400)
    });

    test("should not update profile if invalid new email was provided", async () => {
        return request(app)
            .put("/authentication/profile")
            .set('Authorization', `Bearer ${TOKEN}`)
            .send({email: "bademail.com", newPassword: USER.password, oldPassword: USER.password})
            .expect(400)
    });

    test("should not update profile", async () => {
        return request(app)
            .put("/authentication/profile")
            .set('Authorization', `Bearer ${TOKEN}`)
            .send({email: USER.email, newPassword: USER.password, oldPassword: USER.password})
            .expect(201)
    });
});

afterAll(async () => await dbUtil.close());