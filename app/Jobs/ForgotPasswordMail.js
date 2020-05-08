"use strict";

const Mail = use("Mail");

class ForgotPasswordMail {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency() {
    return 1;
  }

  // This is required. This is a unique key used to identify this job.
  static get key() {
    return "ForgotPasswordMail-job";
  }

  // This is where the work is done.
  async handle({ email, user, linkToRedirect }) {
    console.log(`Job: ${ForgotPasswordMail.key}`);

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
  }
}

module.exports = ForgotPasswordMail;
