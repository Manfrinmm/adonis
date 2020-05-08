"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use("App/models/User");

const Mail = use("Mail");

const { randomBytes } = require("crypto");

class ForgotPasswordController {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async store({ request }) {
    const email = request.input("email");
    const redirectUrl = request.input("redirect_url");

    const user = await User.findByOrFail("email", email);

    user.token = randomBytes(10).toString("hex");
    user.token_created_at = new Date();

    await user.save();

    const linkToRedirect = `${redirectUrl}?token=${user.token}`;

    await Mail.send(
      ["emails.forgot_password", "emails.forgot_password-text"],
      { email, token: user.token, link: linkToRedirect },
      message => {
        message
          .to(user.email)
          .from("oi@projetoadonis.com <Equipe AdonisJs>")
          .subject("Recuperação de senha");
      },
    );

    return user;
  }
}

module.exports = ForgotPasswordController;
