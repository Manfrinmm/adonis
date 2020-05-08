"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Task = use("App/Models/Task");

/**
 * Resourceful controller for interacting with tasks
 */
class TaskController {
  /**
   * Show a list of all tasks.
   * GET tasks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ params }) {
    const { projects_id: project_id } = params;

    const tasks = await Task.query()
      .where("project_id", project_id)
      .with("user")
      .fetch();

    return tasks;
  }

  /**
   * Create/save a new task.
   * POST tasks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, params }) {
    const { projects_id: project_id } = params;

    const data = request.only([
      "title",
      "description",
      "due_date",
      "user_id",
      "file_id",
    ]);

    const task = await Task.create({ ...data, project_id });

    return task;
  }

  /**
   * Display a single task.
   * GET tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params }) {
    const task = await Task.query()
      .where({ id: params.id, project_id: params.projects_id })
      .fetch();

    // if (!task) {
    //   response.status(404).json({ message: "Task não encontrada" });
    // }

    return task;
  }

  /**
   * Update task details.
   * PUT or PATCH tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request }) {
    const data = request.only([
      "title",
      "due_date",
      "description",
      "user_id",
      "file_id",
    ]);

    const task = await Task.findOrFail(params.id);

    task.merge(data);

    await task.save();

    return task;
  }

  /**
   * Delete a task with id.
   * DELETE tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params }) {
    const task = await await Task.query()
      .where({ id: params.id, project_id: params.projects_id })
      .fetch();

    console.log(task);

    await task.delete();

    return { message: "Tarefa deletada com sucesso." };
  }
}

module.exports = TaskController;
