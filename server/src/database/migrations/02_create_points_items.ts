import Knexx from 'knex';

export async function up(knex: Knexx) {
    return knex.schema.createTable('points_items', table =>{
        table.increments('id').primary();
        
        table.integer('point_id')
        .notNullable()
        .references('id')
        .inTable('points');
        
        table.integer('item_id')
        .notNullable()
        .references('id')
        .inTable('items');
   });
}

export async function down(knex: Knexx) {
    return knex.schema.dropTable('points_items')
}