const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose(); // 引入 SQLite3 模块



const app = express();
const PORT = process.env.PORT || 3003;

// 使用 CORS 中间件允许所有源的跨域请求
app.use(cors());

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to SQLite database
const db = new sqlite3.Database('todo-list.db');

// Define Task schema and create table
db.serialize(() => {
	db.run(
		"CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, completed BOOLEAN)");

	// Routes
	app.get('/', (req, res) => {
		res.redirect('/api/tasks'); // 重定向到任务列表路由
	});


	app.get('/api/tasks', (req, res) => {
		db.all("SELECT * FROM tasks", (err, rows) => {
			if (err) {
				res.status(500).json({
					error: err.message
				});
				return;
			}
			res.json(rows);
		});
	});

	app.post('/api/tasks', (req, res) => {
		const {
			text
		} = req.body;
		if (!text) {
			res.status(400).json({
				error: 'Task text is required'
			});
			return;
		}
		db.run("INSERT INTO tasks (text, completed) VALUES (?, ?)", [text, false], function(err) {
			if (err) {
				res.status(500).json({
					error: err.message
				});
				return;
			}
			res.status(201).json({
				id: this.lastID,
				text,
				completed: false
			});
		});
	});

	app.delete('/api/tasks/:id', (req, res) => {
		const {
			id
		} = req.params;
		db.run("DELETE FROM tasks WHERE id = ?", id, function(err) {
			if (err) {
				res.status(500).json({
					error: err.message
				});
				return;
			}
			if (this.changes === 0) {
				res.status(404).json({
					error: 'Task not found'
				});
				return;
			}
			res.sendStatus(204);
		});
	});

	app.patch('/api/tasks/:id/complete', (req, res) => {
		const {
			id
		} = req.params;
		db.run("UPDATE tasks SET completed = ? WHERE id = ?", [true, id], function(err) {
			if (err) {
				res.status(500).json({
					error: err.message
				});
				return;
			}
			if (this.changes === 0) {
				res.status(404).json({
					error: 'Task not found'
				});
				return;
			}
			res.status(200).json({
				id: id,
				completed: true
			});
		});
	});
	app.patch('/api/tasks/:id/undo', (req, res) => {
		const {
			id
		} = req.params;
		db.run("UPDATE tasks SET completed = ? WHERE id = ?", [false, id], function(err) {
			if (err) {
				res.status(500).json({
					error: err.message
				});
				return;
			}
			if (this.changes === 0) {
				res.status(404).json({
					error: 'Task not found'
				});
				return;
			}
			res.status(200).json({
				id: id,
				completed: false
			});
		});
	});



	// Start server
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
});