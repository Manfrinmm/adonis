"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use("App/models/User");

const Database = use("Database");

class UserController {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async store({ request }) {
    const data = request.only(["username", "email", "password"]);
    const addresses = request.input("addresses");

    const trx = await Database.beginTransaction();

    const user = await User.create(data, trx);

    await user.addresses().createMany(addresses, trx);

    await user.load("addresses");

    await trx.commit();

    return user;
  }
}

module.exports = UserController;
