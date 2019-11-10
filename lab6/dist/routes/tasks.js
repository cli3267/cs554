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
const tasks_1 = require("../data/tasks");
class Tasks {
    routes(app) {
        app.route('/api/tasks').get((req, res) => __awaiter(this, void 0, void 0, function* () {
            let skip;
            let take;
            if (!req.query.skip) {
                skip = 0;
            }
            else {
                skip = parseInt(req.query.skip);
            }
            if (!req.query.take) {
                take = 20;
            }
            else {
                take = parseInt(req.query.take);
            }
            try {
                const task = yield tasks_1.getAllTasks(skip, take);
                res.json(task);
            }
            catch (error) {
                res.status(500).json({ error });
            }
        }));
        app.route('/api/tasks').post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const taskInfo = req.body;
            try {
                const newTask = yield tasks_1.createTask(taskInfo.title, taskInfo.description, taskInfo.hoursEstimated);
                res.json(newTask);
            }
            catch (error) {
                res.status(500).json({ error });
            }
        }));
        app.route('/api/tasks/:id').get((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const task = yield tasks_1.getTaskById(req.params.id);
                res.json(task);
            }
            catch (error) {
                res.status(404).json({ error: 'user not found' });
            }
        }));
        app.route('/api/tasks/:id').put((req, res) => __awaiter(this, void 0, void 0, function* () {
            const taskInfo = req.body;
            try {
                yield tasks_1.getTaskById(req.params.id);
            }
            catch (error) {
                res.status(404).json({ error: 'user not found' });
            }
            try {
                const updatedTask = yield tasks_1.updateAllTask(req.params.id, taskInfo);
                res.json(updatedTask);
            }
            catch (error) {
                res.status(500).json({ error });
            }
        }));
        app.route('/api/tasks/:id').patch((req, res) => __awaiter(this, void 0, void 0, function* () {
            const taskInfo = req.body;
            try {
                yield tasks_1.getTaskById(req.params.id);
            }
            catch (e) {
                res.status(404).json({ error: 'user not found' });
            }
            try {
                const updatedTask = yield tasks_1.updateSomeTask(req.params.id, taskInfo);
                res.json(updatedTask);
            }
            catch (e) {
                res.sendStatus(500);
            }
        }));
        app.route('/api/tasks/:id/comments').post((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let taskId = req.params.id;
                let commentInfo = req.body;
                let addCommentInfo = yield tasks_1.addComment(taskId, commentInfo.name, commentInfo.comment);
                res.json(addCommentInfo);
            }
            catch (e) {
                res.sendStatus(500);
            }
        }));
        app.route('/api/tasks/:taskId/:commentId').delete((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let taskId = req.params.taskId;
                let commentId = req.params.commentId;
                let deleteComment = yield tasks_1.removeComment(taskId, commentId);
                res.json(deleteComment);
            }
            catch (e) {
                res.sendStatus(500);
            }
        }));
    }
}
exports.Tasks = Tasks;
