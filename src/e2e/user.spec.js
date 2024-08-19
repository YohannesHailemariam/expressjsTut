import request from "supertest";
import mongoose from "mongoose";
import { createApp } from "../createApp.mjs";

describe('create user and login', () => {
    let app;
    beforeAll(() => {
        mongoose
            .connect("mongodb://localhost/expTut_test")
            .then(() => console.log("connected to Database"))
            .catch((err) => console.log(`Error: ${err}`))

        app = createApp();
    })

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    })
});


