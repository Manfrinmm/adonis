"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const User = use("App/models/User");

class UserController {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async store({ request }) {
    const data = request.only(["username", "email", "password"]);

    const user = await User.create(data);

    return user;
  }
}

module.exports = UserController;
