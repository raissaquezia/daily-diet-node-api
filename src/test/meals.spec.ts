import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../app'

describe('Users and Meals routes', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    beforeEach(() => {
        execSync('knex migrate:rollback --all')
        execSync('knex migrate:latest')
    })

    it('should be able to create a new user', async () => {
        await request(app.server)
            .post('/users')
            .send({
                name: 'New User',
            })
            .expect(201)
    })

    it('should be able to create a new meal', async () => {
        const createUserResponse = await request(app.server)
            .post('/users')
            .send({ name: 'New User' })

        const cookies = createUserResponse.get('Set-Cookie')

        if (!cookies) throw new Error("No cookies set in response")

        await request(app.server)
            .post('/meals')
            .set('Cookie', cookies)
            .send({
                name: 'Salad',
                description: 'Healthy vegetable salad',
                date: '2024-11-14',
                time: '12:30',
                status: 'on-diet',
            })
            .expect(201)
    })

    it('should be able to list all meals for a user', async () => {
        const createUserResponse = await request(app.server)
            .post('/users')
            .send({ name: 'New User' })

        const cookies = createUserResponse.get('Set-Cookie')

        if (!cookies) throw new Error("No cookies set in response")

        await request(app.server)
            .post('/meals')
            .set('Cookie', cookies)
            .send({
                name: 'Salad',
                description: 'Healthy vegetable salad',
                date: '2024-11-14',
                time: '12:30',
                status: 'on-diet',
            })

        const listMealsResponse = await request(app.server)
            .get('/meals')
            .set('Cookie', cookies)
            .expect(200)

        expect(listMealsResponse.body.meals).toEqual([
            expect.objectContaining({
                name: 'Salad',
                description: 'Healthy vegetable salad',
                date: '2024-11-14',
                time: '12:30',
                status: 'on-diet',
            }),
        ])
    })

    it('should be able to get a specific meal', async () => {
        const createUserResponse = await request(app.server)
            .post('/users')
            .send({ name: 'New User' })

        const cookies = createUserResponse.get('Set-Cookie')

        if (!cookies) throw new Error("No cookies set in response")

        await request(app.server)
            .post('/meals')
            .set('Cookie', cookies)
            .send({
                name: 'Salad',
                description: 'Healthy vegetable salad',
                date: '2024-11-14',
                time: '12:30',
                status: 'on-diet',
            })

        const listMealsResponse = await request(app.server)
            .get('/meals')
            .set('Cookie', cookies)
            .expect(200)

        const mealId = listMealsResponse.body.meals[0].id

        const getMealResponse = await request(app.server)
            .get(`/meals/${mealId}`)
            .set('Cookie', cookies)
            .expect(200)

        expect(getMealResponse.body.meal).toEqual(
            expect.objectContaining({
                name: 'Salad',
                description: 'Healthy vegetable salad',
                date: '2024-11-14',
                time: '12:30',
                status: 'on-diet',
            })
        )
    })

    it('should be able to get meals data summary', async () => {
        const createUserResponse = await request(app.server)
            .post('/users')
            .send({ name: 'New User' })

        const cookies = createUserResponse.get('Set-Cookie')

        if (!cookies) throw new Error("No cookies set in response")

        await request(app.server)
            .post('/meals')
            .set('Cookie', cookies)
            .send({
                name: 'Salad',
                description: 'Healthy vegetable salad',
                date: '2024-11-14',
                time: '12:30',
                status: 'on-diet',
            })

        await request(app.server)
            .post('/meals')
            .set('Cookie', cookies)
            .send({
                name: 'Burger',
                description: 'Fast food burger',
                date: '2024-11-14',
                time: '18:00',
                status: 'off-diet',
            })

        const summaryResponse = await request(app.server)
            .get('/meals/data')
            .set('Cookie', cookies)
            .expect(200)

        expect(summaryResponse.body).toEqual(
            expect.objectContaining({
                name: 'New User',
                biggestSequence: 1,
                on: 1,
                off: 1,
                total: 2,
            })
        )
    })
})
