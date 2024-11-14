import {FastifyInstance} from "fastify";
import {z} from "zod";
import {randomUUID} from "node:crypto";
import {knex} from "../database";

export async function clientsRoutes(app: FastifyInstance){
    app.post('/', async (request, reply) =>{
        const createClientBodySchema = z.object({
            name: z.string()
        })

        const { name} = createClientBodySchema.parse(request.body)

        let sessionId = request.cookies.sessionId

        sessionId = randomUUID()

        reply.setCookie("sessionId", sessionId, {
            path:'/',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        })

        await knex('users').insert({
            id: randomUUID(),
            name: name,
            session_id: sessionId
        })

        return reply.status(201).send()
    })

}