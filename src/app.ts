import fastify from "fastify";
import cookie from "@fastify/cookie";
import {knex} from "./database"
import {clientsRoutes} from "./routes/client";
import {mealsRoutes} from "./routes/meal";

export const app = fastify()

app.register(cookie)

app.get('/hello', async () => {
    return await knex('sqlite_schema').select('*')
})

app.register(clientsRoutes, {
    prefix:'/users'
})

app.register(mealsRoutes, {
    prefix:'/meals'
})