"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoCollections = require('../config/mongoCollections');
const tasks = mongoCollections.tasks;
const uuid = require('node-uuid');
function getAllTasks(skip, took) {
    return __awaiter(this, void 0, void 0, function* () {
        // get call to return all the tasks
        const task = yield tasks();
        if (skip < 0)
            skip = 0;
        if (took < 0)
            took = 20;
        if (took > 100)
            took = 100;
        return task
            .find({}, { _id: 0 })
            .skip(skip)
            .limit(took)
            .toArray();
    });
}
exports.getAllTasks = getAllTasks;
function getTaskById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!id)
            throw 'No Id provided';
        const task = yield tasks();
        const findTask = yield task.findOne({ id });
        if (!findTask)
            throw 'Task cannot be found';
        return findTask;
    });
}
exports.getTaskById = getTaskById;
function createTask(title, description, hours) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!title || !description || !hours)
            throw 'not all information was provided';
        if (typeof title !== 'string' || typeof description !== 'string')
            throw 'not a string';
        if (typeof hours !== 'number')
            throw 'not a number';
        const task = yield tasks();
        const id = uuid();
        let newTask = {
            id,
            title,
            description,
            hoursEstimated: hours,
            completed: false,
            comments: [],
        };
        const insertTask = yield task.insertOne(newTask);
        if (insertTask.insertedCount === 0)
            throw 'Could not add Task';
        return yield this.getTaskById(id);
    });
}
exports.createTask = createTask;
function updateSomeTask(id, newInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        // patch call to update the certain details provided
        if (!id || !newInfo)
            throw 'no id was provided';
        const task = yield tasks();
        const getTask = yield this.getTaskById(id);
        let updatedTask = {
            id,
            title: newInfo.title || getTask.title,
            description: newInfo.description || getTask.description,
            hoursEstimated: newInfo.hoursEstimated || getTask.hoursEstimated,
            completed: newInfo.completed || getTask.completed,
            comments: getTask.comments || [],
        };
        const updateInfo = task.findOneAndUpdate({ id }, { $set: updatedTask });
        if (updateInfo.modifiedCount === 0)
            throw 'did not update';
        return yield this.getTaskById(id);
    });
}
exports.updateSomeTask = updateSomeTask;
function updateAllTask(id, newInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        //put call to update all the information of the task
        if (!id || !newInfo)
            throw 'did not provide all the data';
        if (!newInfo.title || !newInfo.description || !newInfo.hoursEstimated) {
            throw 'missing some data';
        }
        const task = yield tasks();
        const getTask = yield this.getTaskById(id);
        let updatedTask = {
            id,
            title: newInfo.title,
            description: newInfo.description,
            hoursEstimated: newInfo.hoursEstimated,
            completed: newInfo.completed || getTask.completed,
            comments: getTask.comments || [],
        };
        const updateInfo = yield task.findOneAndUpdate({ id }, { $set: updatedTask });
        if (updateInfo.modifiedCount === 0)
            throw 'Unable to update';
        return yield this.getTaskById(id);
    });
}
exports.updateAllTask = updateAllTask;
function addComment(taskId, name, comment) {
    return __awaiter(this, void 0, void 0, function* () {
        //post call to add a new comment to the task
        if (!taskId || !name || !comment)
            throw 'not all data provided';
        if (typeof taskId !== 'string' ||
            typeof name !== 'string' ||
            typeof comment !== 'string') {
            throw 'yikes, wrong types';
        }
        const task = yield tasks();
        const id = uuid();
        let newComment = {
            id,
            name,
            comment,
        };
        const insertComment = yield task.updateOne({ id: taskId }, { $addToSet: { comments: newComment } });
        if (insertComment.modifiedCount === 0)
            throw 'unable to add comment';
        return newComment;
    });
}
exports.addComment = addComment;
function removeComment(taskId, commentId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!taskId || !commentId)
            throw 'ids not provided';
        if (typeof taskId !== 'string' || typeof commentId !== 'string') {
            throw 'types not a string';
        }
        const task = yield tasks();
        const deleteComment = yield task.findOneAndUpdate({ id: taskId }, { $pull: { comments: { id: commentId } } });
        if (deleteComment.deletedCount === 0)
            throw 'unable to delete comment';
        return deleteComment;
    });
}
exports.removeComment = removeComment;
exports.default = {
    getAllTasks,
    getTaskById,
    createTask,
    updateSomeTask,
    updateAllTask,
    addComment,
    removeComment,
};
