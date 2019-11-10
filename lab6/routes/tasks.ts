import { Request, Response } from 'express';
import {
    getAllTasks,
    getTaskById,
    createTask,
    updateSomeTask,
    updateAllTask,
    addComment,
    removeComment,
} from '../data/tasks';

export class Tasks {
  public routes(app): void {
    app.route('/api/tasks').get(async (req: Request, res: Response) => {
        let skip: number;
        let take: number;
        if(!req.query.skip){
            skip = 0;
        } else{
            skip = parseInt(req.query.skip);
        }
        if(!req.query.take){
            take = 20;
        } else{
            take = parseInt(req.query.take);
        }
        try {
            const task = await getAllTasks(skip, take);
            res.json(task);
        } catch (error) {
            res.status(500).json({error});
        }
    });
    app.route('/api/tasks').post(async (req: Request, res: Response) => {
      const taskInfo = req.body;
      try {
          const newTask = await createTask(taskInfo.title, taskInfo.description, taskInfo.hoursEstimated);
          res.json(newTask);
      } catch (error) {
          res.status(500).json({error})
      }
    });
    app.route('/api/tasks/:id').get(async (req: Request, res: Response) => {
        try {
            const task = await getTaskById(req.params.id);
            res.json(task);
        } catch (error) {
            res.status(404).json({error: 'user not found'});
        }
    });
    app.route('/api/tasks/:id').put(async (req: Request, res: Response) => {
      const taskInfo = req.body;
      try {
          await getTaskById(req.params.id);
      } catch (error) {
          res.status(404).json({error: 'user not found'});
      }
      try {
          const updatedTask = await updateAllTask(req.params.id, taskInfo);
          res.json(updatedTask);
      } catch (error) {
          res.status(500).json({error});
      }
    });
    app.route('/api/tasks/:id').patch(async (req: Request, res: Response) => {
        const taskInfo = req.body;
        try {
          await getTaskById(req.params.id);
        } catch (e) {
          res.status(404).json({ error: 'user not found' });
        }
        try {
          const updatedTask = await updateSomeTask(req.params.id, taskInfo);
          res.json(updatedTask);
        } catch (e) {
          res.sendStatus(500);
        }
    });
    app.route('/api/tasks/:id/comments').post(async (req: Request, res: Response) => {
        try {
            let taskId = req.params.id;
            let commentInfo = req.body;
            let addCommentInfo = await addComment(
              taskId,
              commentInfo.name,
              commentInfo.comment,
            );
            res.json(addCommentInfo);
          } catch (e) {
            res.sendStatus(500);
          }
    });
    app.route('/api/tasks/:taskId/:commentId').delete(async (req: Request, res: Response) => {
        try {
            let taskId = req.params.taskId;
            let commentId = req.params.commentId;
            let deleteComment = await removeComment(taskId, commentId);
            res.json(deleteComment);
          } catch (e) {
            res.sendStatus(500);
          }
    });
  }
}
