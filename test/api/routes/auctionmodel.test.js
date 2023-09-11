import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import AuctionModelService from "../../../src/services/auctionmodel.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/auctionmodel.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/auction-model/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/auction-model");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    AuctionModelService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/auction-model")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(AuctionModelService.list).toHaveBeenCalled();
  });

  test("POST creates a new AuctionModel", async () => {
    const data = {
      totalCount: 3.141592,
      title: "test",
      image: "test",
      imageUrl: "test",
      status: true,
      date: "2001-01-01T00:00:00Z",
      organizerId: 3.141592,
      organizer: "test",
      isDeleted: true,
      createdDate: "2001-01-01T00:00:00Z",
      updatedAt: "2001-01-01T00:00:00Z",
    };

    AuctionModelService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/auction-model")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(AuctionModelService.create).toHaveBeenCalledWith(data);
  });

  test("creating a new AuctionModel without required attributes fails", async () => {
    const data = {};

    AuctionModelService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/auction-model")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(AuctionModelService.create).not.toHaveBeenCalled();
  });
});

describe("/api/v1/auction-model/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    AuctionModelService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/auction-model/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(AuctionModelService.get).toHaveBeenCalledWith(1);
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/auction-model/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    AuctionModelService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/auction-model/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(AuctionModelService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    AuctionModelService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/auction-model/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(AuctionModelService.get).not.toHaveBeenCalled();
  });

  test("AuctionModel update", async () => {
    const data = {
      totalCount: 3.141592,
      title: "test",
      imageUrl: "test",
      status: true,
      organizerId: 3.141592,
    };
    AuctionModelService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/auction-model/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(AuctionModelService.update).toHaveBeenCalledWith(1, data);
  });

  test("AuctionModel deletion", async () => {
    AuctionModelService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/auction-model/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(AuctionModelService.delete).toHaveBeenCalledWith(1);
  });
});
