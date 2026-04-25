exports.up = function(knex) {
  return knex.schema
    .createTable('owners', table => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').unique();
      table.string('mobile');
      table.text('address');
      table.timestamps(true, true);
    })
    .createTable('users', table => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
      table.string('role').defaultTo('owner');
      table.string('mobile');
      table.string('avatar');
      table.boolean('active').defaultTo(true);
      table.datetime('lastLogin');
      table.integer('ownerId').unsigned().references('id').inTable('owners');
      table.timestamps(true, true);
    })
    .createTable('pets', table => {
      table.increments('id').primary();
      table.integer('ownerId').unsigned().references('id').inTable('owners').onDelete('CASCADE');
      table.string('name').notNullable();
      table.string('type');
      table.string('breed');
      table.string('gender');
      table.string('dob');
      table.string('weight');
      table.text('notes');
      table.timestamps(true, true);
    })
    .createTable('appointments', table => {
      table.increments('id').primary();
      table.integer('petId').unsigned().references('id').inTable('pets').onDelete('CASCADE');
      table.integer('doctorId').unsigned().references('id').inTable('users');
      table.datetime('date').notNullable();
      table.string('status').defaultTo('pending');
      table.text('notes');
      table.timestamps(true, true);
    })
    .createTable('visits', table => {
      table.increments('id').primary();
      table.integer('petId').unsigned().references('id').inTable('pets').onDelete('CASCADE');
      table.integer('doctorId').unsigned().references('id').inTable('users');
      table.datetime('date').notNullable();
      table.text('diagnosis');
      table.text('notes');
      table.timestamps(true, true);
    })
    .createTable('inventory', table => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('category');
      table.integer('quantity').defaultTo(0);
      table.string('unit');
      table.decimal('price');
      table.timestamps(true, true);
    })
    .createTable('prescriptions', table => {
      table.increments('id').primary();
      table.integer('petId').unsigned().references('id').inTable('pets').onDelete('CASCADE');
      table.integer('visitId').unsigned().references('id').inTable('visits').onDelete('CASCADE');
      table.text('medications');
      table.timestamps(true, true);
    })
    .createTable('invoices', table => {
      table.increments('id').primary();
      table.integer('petId').unsigned().references('id').inTable('pets');
      table.decimal('amount').notNullable();
      table.string('status').defaultTo('unpaid');
      table.timestamps(true, true);
    })
    .createTable('vaccinations', table => {
      table.increments('id').primary();
      table.integer('petId').unsigned().references('id').inTable('pets');
      table.string('type');
      table.datetime('date');
      table.datetime('nextDueDate');
      table.timestamps(true, true);
    })
    .createTable('activity_log', table => {
      table.increments('id').primary();
      table.integer('userId').unsigned().references('id').inTable('users');
      table.string('action');
      table.text('details');
      table.timestamps(true, true);
    })
    .createTable('clinic_settings', table => {
      table.string('key').primary();
      table.text('value');
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('clinic_settings')
    .dropTableIfExists('activity_log')
    .dropTableIfExists('vaccinations')
    .dropTableIfExists('invoices')
    .dropTableIfExists('prescriptions')
    .dropTableIfExists('inventory')
    .dropTableIfExists('visits')
    .dropTableIfExists('appointments')
    .dropTableIfExists('pets')
    .dropTableIfExists('users')
    .dropTableIfExists('owners');
};
