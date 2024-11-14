import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("users", (table) => {
        table.uuid("id").primary()
        table.string("name").notNullable()
        table.integer('current_sequence').notNullable().defaultTo(0)
        table.integer('biggest_sequence').notNullable().defaultTo(0)
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("users")
}

