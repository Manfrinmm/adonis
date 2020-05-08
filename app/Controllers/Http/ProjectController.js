"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Project = use("App/models/Project");

class ProjectController {
  /**
   * Show a list of all projects.
   * GET projects
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   *
   */
  async index({ request, response, view }) {
    const projects = await Project.query().with("user").fetch();

    return projects;
  }

  /**
   * Create/save a new project.
   * POST projects
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async store({ request, response, auth }) {
    const { title, description } = request.only(["title", "description"]);

    const user = await auth.getUser();

    const project = await Project.create({
      title,
      description,
      user_id: user.id,
    });

    return project;
  }

  /**
   * Display a single project.
   * GET projects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params }) {
    const project = await Project.findOrFail(params.id);

    await project.loadMany(["user", "tasks"]);

    return project;
  }

  /**
   * Render a form to update an existing project.
   * GET projects/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  async update({ params, request, response }) {
    const data = request.only(["title", "description"]);

    const project = await Project.findOrFail(params.id);

    project.merge(data);

    await project.save();

    await project.loadMany(["user", "tasks"]);

    return project;
  }

  /**
   * Delete a project with id.
   * DELETE projects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params }) {
    const project = await Project.findOrFail(params.id);

    await project.delete();

    return { message: "Projeto deletado com sucesso" };
  }
}

module.exports = ProjectController;
