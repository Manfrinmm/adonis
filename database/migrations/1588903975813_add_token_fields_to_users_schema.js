"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddTokenFieldsToUsersSchema extends Schema {
  up() {
    this.table("users", table => {
      // alter table
      table.string("token");
      table.timestamp("token_created_at");
    });
  }

  down() {
    this.table("users", table => {
      // reverse alternations
      table.dropColumn("token_created_at");
      table.dropColumn("token");
    });
  }
}

module.exports = AddTokenFieldsToUsersSchema;
