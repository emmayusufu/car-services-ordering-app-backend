import request from 'supertest';
import { app } from '../../app';
import { redisClient } from '../../utils/redis_client';
import connection from '../../database/connection';

beforeAll(async () => {
    await connection.create();
});

afterAll(async () => {
    await redisClient.quit();
    await connection.close();
});

beforeEach(async () => {
    // await connection.clear();
});

describe("Clients' router", () => {
    test('Name of the test', async () => {
        const response = await request(app)
            .post('/clients/continue-with-phone-number')
            .send({ phoneNumber: '366' })
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                message: 'success',
            })
        );
    });
});
