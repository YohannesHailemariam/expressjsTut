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

    it('should create the user', async () => {
        const response = await request(app).post('/api/users').send({
            username: 'adam123',
            password: 'password',
            displayName: 'Adam The Developer',
        }); 

        expect(response.statusCode).toBe(201);
    });

    it('should log the user in and visit /api/auth/status and return auth user', async () => {
        const response = await request(app)
            .post("/api/auth")
            .send({ username: "adam123", password: "password" })
            .then((res) => {
                req(app)
                    .get('/api/auth/status')
                    .set('cookie', res.headers['set-cookie']);
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.username).toBe("adam123");
        expect(response.body.disaplayName).toBe("Adam The Developer");
    });
    
    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    })
});


