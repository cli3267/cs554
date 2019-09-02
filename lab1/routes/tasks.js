const express = require('express');
const router = express.Router();
const data = require('../data');
const tasksData = data.tasks;

router.get('/', async (req, res) => {
  let skip, took;
  if (!req.query.skip) {
    skip = 0;
  } else {
    skip = parseInt(req.query.skip);
  }
  if (!req.query.took) {
    took = 20;
  } else {
    took = parseInt(req.query.took);
  }
  try {
    const task = await tasksData.getAllTasks(skip, took);
    res.json(task);
  } catch (e) {
    res.sendStatus(500);
  }
});

router.post('/', async (req, res) => {
  const taskInfo = req.body;
  try {
    const newTask = await tasksData.createTask(
      taskInfo.title,
      taskInfo.description,
      taskInfo.hoursCompleted,
    );
    res.json(newTask);
  } catch (e) {
    res.sendStatus(500);
  }
});

// router.get('/:id', async (req, res) => {
//   try {
//     const task = await tasksData.getTaskById(req.params.id);
//     res.json(task);
//   } catch (e) {
//     res.status(404).json({ error: 'user not found' });
//   }
// });

// router.put('/:id', async (req, res) => {
//   const taskInfo = req.body;
//   try {
//     await tasksData.getTaskById(req.params.id);
//   } catch (e) {
//     res.status(404).json({ error: 'user not found' });
//   }
//   try {
//     const updatedTask = await tasksData.updateAllTask(req.params.id, taskInfo);
//     res.json(updatedTask);
//   } catch (e) {
//     res.sendStatus(500);
//   }
// });

// router.patch('/:id', async (req, res) => {
//   const taskInfo = req.body;
//   try {
//     await tasksData.getTaskById(req.params.id);
//   } catch (e) {
//     res.status(404).json({ error: 'user not found' });
//   }
//   try {
//     const updatedTask = await tasksData.updateAllTask(req.params.id, taskInfo);
//     res.json(updatedTask);
//   } catch (e) {
//     res.sendStatus(500);
//   }
// });

// router.post('/:id/comments', async (req, res) => {
//   try {
//     let taskId = req.params.id;
//     let commentInfo = req.body;
//     let addComment = await tasksData.addComment(
//       taskId,
//       commentInfo.name,
//       commentInfo.comment,
//     );
//     res.json(addComment);
//   } catch (e) {
//     res.sendStatus(500);
//   }
// });

// router.delete('/:taskId/:commentId', async (req, res) => {
//   try {
//     let taskId = req.params.id;
//     let commentId = req.params.commentId;
//     await tasksData.removeComment(taskId, commentId);
//   } catch (e) {
//     res.sendStatus(500);
//   }
// });

module.exports = router;
