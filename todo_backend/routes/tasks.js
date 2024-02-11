const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// 连接到数据库
const db = new sqlite3.Database('./tasks.db');

// 获取所有任务
router.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.json(rows);
    }
  });
});

// 添加新任务
router.post('/tasks', (req, res) => {
  const { text, completed } = req.body;
  db.run('INSERT INTO tasks (text, completed) VALUES (?, ?)', [text, completed], function(err) {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.status(201).json({ id: this.lastID, text, completed });
    }
  });
});

// 删除任务
router.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tasks WHERE id = ?', [id], err => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.status(204).end();
    }
  });
});

// 更新任务
router.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;
  db.run('UPDATE tasks SET text = ?, completed = ? WHERE id = ?', [text, completed, id], err => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.status(200).json({ id, text, completed });
    }
  });
});

module.exports = router;
