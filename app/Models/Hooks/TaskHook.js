"use strict";

const TaskHook = (exports = module.exports = {});

const Mail = use("Mail");
const Helpers = use("Helpers");

TaskHook.sendNewTaskEmail = async taskInstance => {
  if (!taskInstance.user_id && !taskInstance.dirty.user_id) {
    return;
  }

  const { title } = taskInstance;
  const { email, username } = await taskInstance.user().fetch();
  const file = await taskInstance.file().fetch();

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
};
