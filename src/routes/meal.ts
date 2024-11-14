import {FastifyInstance} from "fastify";
import {checkSessionIdExists} from "../middleware/checkSessionIdExists";
import {z} from "zod";
import {knex} from "../database";
import {randomUUID} from "node:crypto";

export async function mealsRoutes(app: FastifyInstance) {
    app.post('/',
        {
            preHandler: [checkSessionIdExists]
        },
        async (request, reply) =>{
            const sessionId = request.cookies.sessionId

            const createMealBodySchema = z.object({
                name: z.string(),
                description: z.string().max(500).optional(),
                date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format. Use YYYY-MM-DD." }),
                time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, { message: "Invalid time format. Use HH:MM or HH:MM:SS." }),
                status: z.enum(['off-diet', 'on-diet'])
            })

            const { name, description, date, time, status } = createMealBodySchema.parse(request.body);

            await knex('meals').insert({
                id: randomUUID(),
                name,
                description,
                date,
                time,
                status,
                session_id: sessionId
            })

            if(status == 'on-diet'){
                await knex('users')
                    .where('session_id', sessionId)
                    .increment('current_sequence', 1)
            } else {
                await knex('users')
                    .where('session_id', sessionId)
                    .update('current_sequence', 0)

            }

            const { current_sequence: currentSequence } = await knex('users')
                .where('session_id', sessionId)
                .select('current_sequence')
                .first();

            const { biggest_sequence: biggestSequence } = await knex('users')
                .where('session_id', sessionId)
                .select('biggest_sequence')
                .first();

            if (currentSequence > biggestSequence) {
                await knex('users')
                    .where('session_id', sessionId)
                    .update('biggest_sequence', currentSequence);
            }

            return reply.status(201).send()
        })

    app.get('/',
        {
            preHandler: [checkSessionIdExists]
        },
        async (request) => {
            const sessionId = request.cookies.sessionId

            const meals = await knex('meals')
                    .where('session_id', sessionId)
                    .select()

            const user = await knex('users')
                    .where('session_id', sessionId)
                    .select('name')
                    .first();

            return { name: user.name, meals };
        })

    app.get('/:id',
        {
            preHandler: [checkSessionIdExists]
        },
        async (request, reply) => {
            const sessionId = request.cookies.sessionId
            const { id } = request.params as {id:string}

            const meal = await knex('meals')
                    .where('id', id)
                    .andWhere('session_id', sessionId)
                    .first();

            if (!meal) {
                return reply.status(404).send({
                    error: "Meal not found or you do not have access to this meal."
                });
            }

            const user = await knex('users')
                    .where('session_id', sessionId)
                    .select('name')
                    .first();

            return { name: user.name, meal };
        })

    app.get('/data',
        {
            preHandler: [checkSessionIdExists]
        },
        async (request) => {
            const sessionId = request.cookies.sessionId;

            const user = await knex('users')
                .where('session_id', sessionId)
                .select('name')
                .first();

            const { biggest_sequence: biggestSequence = 0 } = await knex('users')
                .where('session_id', sessionId)
                .select('biggest_sequence')
                .first()

            type CountResult = { count: number };

            const { count: on } = await knex('meals')
                .where('session_id', sessionId)
                .andWhere('status', 'on-diet')
                .count({ count: 'id' })
                .first() as CountResult;

            const { count: off } = await knex('meals')
                .where('session_id', sessionId)
                .andWhere('status', 'off-diet')
                .count({ count: 'id' })
                .first() as CountResult;

            const { count: total } = await knex('meals')
                .where('session_id', sessionId)
                .count({ count: 'id' })
                .first() as CountResult;

            return { name: user.name, biggestSequence, on, off, total };
        });




}