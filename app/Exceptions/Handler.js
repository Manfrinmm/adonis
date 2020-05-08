"use strict";

const BaseExceptionHandler = use("BaseExceptionHandler");

const Env = use("Env");
const Config = use("Config");
const Youch = use("Youch");

const Sentry = require("@sentry/node");
/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle(error, { request, response }) {
    const errosNames = ["ValidationException"];

    if (errosNames.includes(error.name)) {
      return response.status(error.status).send(error.messages);
    }

    if (Env.get("NODE_ENV") === "development") {
      const youch = new Youch(error, request.request);
      const errorJSON = await youch.toJSON();

      return response.status(error.status).send(errorJSON);
    }

    console.log(error);

    return response.status(error.status).send();
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report(error, { request }) {
    Sentry.init(Config.get("services.sentry.dsn"));
    Sentry.captureException(error);
  }
}

module.exports = ExceptionHandler;
