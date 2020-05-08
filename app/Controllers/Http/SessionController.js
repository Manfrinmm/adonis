"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

class SessionController {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */

  async store({ request, response, auth }) {
    const { email, password } = request.all();

    const token = auth.attempt(email, password);

    return token;
  }
}

module.exports = SessionController;
