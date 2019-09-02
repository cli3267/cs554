// I pledge my honor that I have abided by the Stevens Honor System. -cli50
const mongoCollections = require('../config/mongoCollections');
const tasks = mongoCollections.tasks;
const uuid = require('node-uuid');

async function getAllTasks(skip, took) {
  const task = await tasks();
  if (skip < 0) skip = 0;
  if (took < 0) took = 20;
  if (took > 100) took = 100;
  return task
    .find({}, { _id: 0 })
    .skip(skip)
    .limit(took)
    .toArray();
}

async function getTaskById(id) {
  //get call to get the task given the id
  if (!id) throw 'No id provided';
  const task = await tasks();
  const findTask = await task.findOne({ _id: id });
  if (!findTask) throw 'task cannot be found';
  return findTasks;
}

async function createTask(title, description, hours) {
  // post call to create a task
  if (!title || !description || !hours)
    throw 'not all information was provided';
  if (typeof title !== 'string' || typeof description !== 'string')
    throw 'not a string';
  if (typeof house !== 'number') throw 'not a number';
  const task = await tasks();
  const id = uuid();
  let newTask = {
    id,
    title,
    description,
    hoursEstimated: hours,
    completed: false,
    comments: [],
  };
  const insertTask = await task.insertOne(newTask);
  if (insertTask.insertedCount === 0) throw 'could not add task';
  return await this.getTaskById(id);
}

async function updateSomeTask(id, newInfo) {
  // patch call to update the certain details provided
  let newTitle, newDescription, newHours, completed;
  if (!id) throw 'no id was provided';
  const task = await tasks();
  const getTask = this.getTaskById(id);
  if (newInfo.title) newTitle = newInfo.title;
  if (newInfo.description) newDescription = newInfo.description;
  if (newInfo.hoursEstimated) newHours = newInfo.hoursEstimated;
  if (newInfo.completed) completed = newInfo.completed;
  let updatedTask = {
    id,
    title: newTitle || getTask.title,
    description: newDescription || getTask.description,
    hoursEstimated: newHours || getTask.hoursEstimated,
    completed: completed || getTask.completed,
    comments: getTask.comments,
  };
  const updateInfo = task.updateOne({ _id: id }, updatedTask);
  if (updateInfo.modifiedCount === 0) throw 'did not update';
  return await this.getTaskById(id);
}

async function updateAllTask(id, newInfo) {
  //put call to update all the information of the task
  if (!id || !newInfo) throw 'did not provide all the data';
  const task = await tasks();
  const getTask = this.getTaskById(id);
  let updatedTask = {
    $set: {
      title: newInfo.newTitle,
      description: newInfo.newDescription,
      hoursEstimated: newInfo.newHoursEstimated,
      completed: newInfo.newCompleted,
      comments: getTask.comments,
    },
  };
  const updateInfo = await task.findOneAndUpdate({ _id: id }, updatedTask);
  if (updateInfo.modifiedCount === 0) throw 'Unable to update';
  return await this.getTaskById(id);
}

async function addComment(taskId, name, comment) {
  //post call to add a new comment to the task
  if (!taskId || !name || !comment) throw 'not all data provided';
  if (
    typeof taskId !== 'string' ||
    typeof name !== 'string' ||
    typeof comment !== 'string'
  ) {
    throw 'yikes, wrong types';
  }
  const task = await tasks();
  let id = uuid();
  let newComment = {
    id,
    name,
    comment,
  };
  const insertComment = await task.updateOne(
    { id: taskId },
    { $addToSet: { comments: newComment } },
  );
  if (insertComment.modifiedCount === 0) throw 'unable to add comment';
  return newComment;
}

async function removeComment(taskId, commentId) {
  if (!taskId || !commentId) throw 'ids not provided';
  if (typeof taskId !== 'string' || typeof commentId !== 'string') {
    throw 'types not a string';
  }
  const task = await tasks();
  const deleteComment = await task.updateOne(
    { id: taskId },
    { $pull: { comment: { id: commentId } } },
  );
  if (deletedComment.deletedCount === 0) throw 'unable to delete comment';
  return deleteComment;
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateSomeTask,
  updateAllTask,
  addComment,
  removeComment,
};
