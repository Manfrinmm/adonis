"use strict";

const Mail = use("Mail");
const Helpers = use("Helpers");

class NewTaskMail {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency() {
    return 1;
  }

  // This is required. This is a unique key used to identify this job.
  static get key() {
    return "NewTaskMail-job";
  }

  // This is where the work is done.
  async handle({ title, email, username, file }) {
    console.log(`Job: ${NewTaskMail.key}`);

    await Mail.send(
      ["emails.new_task", "emails.new_task-text"],
      {
        title,
        email,
        username,
        hasAttachment: !!file,
      },
      message => {
        message
          .to(email)
          .from("tasks@adonisjs.com", "New Task | Task")
          .subject("Nova tarefa para você");

        if (file) {
          message.attach(Helpers.tmpPath(`uploads/${file.file}`), {
            filename: file.name,
          });
        }
      },
    );
  }
}

module.exports = NewTaskMail;
