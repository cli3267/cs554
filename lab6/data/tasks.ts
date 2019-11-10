const mongoCollections = require('../config/mongoCollections');
const tasks = mongoCollections.tasks;
const uuid = require('node-uuid');

interface Task {
  id: any;
  title: string;
  description: string;
  hoursEstimated: number;
  completed: boolean;
  comments: Comment[];
}

interface Comment {
  id: any;
  name: string;
  comment: string;
}

export async function getAllTasks(skip: number, took: number) {
  // get call to return all the tasks
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

export async function getTaskById(id: any) {
  if (!id) throw 'No Id provided';
  const task = await tasks();
  const findTask = await task.findOne({ id });
  if (!findTask) throw 'Task cannot be found';
  return findTask;
}

export async function createTask(title: string, description: string, hours: number) {
  if (!title || !description || !hours)
    throw 'not all information was provided';
  if (typeof title !== 'string' || typeof description !== 'string')
    throw 'not a string';
  if (typeof hours !== 'number') throw 'not a number';
  const task = await tasks();
  const id: any = uuid();
  let newTask: Task = {
    id,
    title,
    description,
    hoursEstimated: hours,
    completed: false,
    comments: [],
  };
  const insertTask = await task.insertOne(newTask);
  if (insertTask.insertedCount === 0) throw 'Could not add Task';
  return await this.getTaskById(id);
}

export async function updateSomeTask(id: any, newInfo: Task) {
  // patch call to update the certain details provided
  if (!id || !newInfo) throw 'no id was provided';
  const task = await tasks();
  const getTask = await this.getTaskById(id);
  let updatedTask: Task = {
    id,
    title: newInfo.title || getTask.title,
    description: newInfo.description || getTask.description,
    hoursEstimated: newInfo.hoursEstimated || getTask.hoursEstimated,
    completed: newInfo.completed || getTask.completed,
    comments: getTask.comments || [],
  };
  const updateInfo = task.findOneAndUpdate({ id }, {$set: updatedTask });
  if (updateInfo.modifiedCount === 0) throw 'did not update';
  return await this.getTaskById(id);
}

export async function updateAllTask(id: any, newInfo: Task) {
  //put call to update all the information of the task
  if (!id || !newInfo) throw 'did not provide all the data';
  if (!newInfo.title || !newInfo.description || !newInfo.hoursEstimated) {
    throw 'missing some data';
  }
  const task = await tasks();
  const getTask = await this.getTaskById(id);
  let updatedTask: Task = {
    id,
    title: newInfo.title,
    description: newInfo.description,
    hoursEstimated: newInfo.hoursEstimated,
    completed: newInfo.completed || getTask.completed,
    comments: getTask.comments || [],
  };
  const updateInfo = await task.findOneAndUpdate({ id }, {$set: updatedTask });
  if (updateInfo.modifiedCount === 0) throw 'Unable to update';
  return await this.getTaskById(id);
}

export async function addComment(taskId: any, name: string, comment: string) {
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
  const id: any = uuid();
  let newComment: Comment = {
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

export async function removeComment(taskId: any, commentId: any) {
  if (!taskId || !commentId) throw 'ids not provided';
  if (typeof taskId !== 'string' || typeof commentId !== 'string') {
    throw 'types not a string';
  }
  const task = await tasks();
  const deleteComment = await task.findOneAndUpdate(
    { id: taskId },
    { $pull: { comments: { id: commentId } } },
  );

  if (deleteComment.deletedCount === 0) throw 'unable to delete comment';
  return deleteComment;
}

export default {
  getAllTasks,
  getTaskById,
  createTask,
  updateSomeTask,
  updateAllTask,
  addComment,
  removeComment,
};
