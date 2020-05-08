"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use("App/models/User");

const { isAfter, subHours } = require("date-fns");

class ResetPasswordController {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const { token, password, password_confirmation } = request.only([
      "token",
      "password",
      "password_confirmation",
    ]);

    const user = await User.findByOrFail("token", token);

    const tokenExpirationDate = subHours(new Date(), 3);
    const tokenExpired = isAfter(tokenExpirationDate, user.token_created_at);

    if (tokenExpired) {
      return response.status(401).send({
        message: "Token expirado. Solicite uma nova recuperação de senha.",
      });
    }

    const samePassword = password === password_confirmation;

    if (!samePassword) {
      return response
        .status(400)
        .send({ message: "As senhas precisam ser iguais" });
    }

    user.password = password;

    user.token = null;
    user.token_created_at = null;

    await user.save();

    return user;
  }
}

module.exports = ResetPasswordController;
