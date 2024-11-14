import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("meals", (table) => {
        table.uuid('id').primary()
        table.string('name').notNullable()
        table.text('description')
        table.date('date').notNullable()
        table.time('time').notNullable()
        table.enum('status', ["off-diet", "on-diet"]).defaultTo("on_diet")
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("meals")
}

