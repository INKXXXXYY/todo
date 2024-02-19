<template>
	<div id="app">
		<h1>ToDo List</h1>
		<input v-model="newTask" @keyup.enter="addTask" placeholder="Add a new task" />
		<ul>
			<li v-for="task in tasks" :key="task.id" :class="{ 'completed': task.completed }">

				<span class="task-text">{{ task.text }}</span>
				<div>
					<button class="task-button" @click="deleteTask(task.id)">Delete</button>
					<button class="task-button" @click="completeTask(task.id)" v-if="!task.completed">Complete</button>
					<button class="task-button" @click="undoTask(task.id)" v-if="task.completed">Undo</button>
				</div>
			</li>

		</ul>
	</div>
	<div v-if="error" class="error-message">{{ error }}</div>

</template>

<script>
	import axios from 'axios';

	export default {
		name: 'App',
		data() {
			return {
				tasks: [],
				newTask: '',
				error: null, // Add an error property to handle errors
			};
		},
		methods: {
			// Use async/await for asynchronous operations
			async fetchTasks() {
				try {
					const response = await axios.get('http://localhost:3003/api/tasks');
					this.tasks = response.data.sort((a, b) => a.completed - b.completed);
				} catch (error) {
					console.error("There was an error fetching the tasks:", error);
					this.error = "Failed to fetch tasks.";
				}
			},
			async addTask() {
				if (!this.newTask) return;
				try {
					const response = await axios.post('http://localhost:3003/api/tasks', {
						text: this.newTask
					});
					this.tasks.push(response.data);
					this.newTask = ''; // Clear input box
				} catch (error) {
					console.error("There was an error adding the task:", error);
					this.error = "Failed to add task."; // Update UI or state to reflect the error
				}
			},
			async completeTask(id) {
				try {
					await axios.patch(`http://localhost:3003/api/tasks/${id}/complete`);
					this.fetchTasks(); // Re-fetch tasks to update the UI
				} catch (error) {
					console.error("There was an error completing the task:", error);
					this.error = "Failed to complete task.";
				}
			},
			async undoTask(id) {
				try {
					await axios.patch(`http://localhost:3003/api/tasks/${id}/undo`);
					this.fetchTasks(); // Re-fetch tasks to update the UI
				} catch (error) {
					console.error("There was an error undoing the task completion:", error);
					this.error = "Failed to undo task completion.";
				}
			},
			async deleteTask(id) {
				try {
					await axios.delete(`http://localhost:3003/api/tasks/${id}`);
					this.tasks = this.tasks.filter(task => task.id !== id);
				} catch (error) {
					console.error("There was an error deleting the task:", error);
					this.error = "Failed to delete task."; // Update UI or state to reflect the error
				}
			}
		},
		mounted() {
			this.fetchTasks();
		}
	};
</script>


<style>
	/* 基本重置，确保样式在不同浏览器中的一致性 */
	*,
	*::before,
	*::after {
		box-sizing: border-box;
	}

	body,
	html {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		text-rendering: optimizeLegibility;
	}

	#app {
		max-width: 600px;
		margin: 40px auto;
		padding: 20px;
		background: #f5f5f7;
		border-radius: 10px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	h1 {
		color: #333;
		font-size: 24px;
		text-align: center;
		margin-bottom: 20px;
	}

	input {
		width: 100%;
		padding: 10px;
		margin-bottom: 20px;
		border: 2px solid #d1d1d6;
		border-radius: 8px;
		font-size: 16px;
		color: #333;
	}

	input::placeholder {
		color: #c7c7cc;
	}

	ul {
		list-style: none;
		padding: 0;
	}

	li {
		background: #ffffff;
		margin-bottom: 10px;
		padding: 10px;
		border-radius: 8px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	button {
		background: #007aff;
		color: #ffffff;
		border: none;
		border-radius: 6px;
		padding: 6px 12px;
		margin-right: 10px;
		cursor: pointer;
		font-size: 14px;
	}

	button:hover {
		background: #005ecb;
	}

	button:focus {
		outline: none;
	}

	.error-message {
		color: red;
		margin: 10px 0;
		text-align: center;
	}

	.completed .task-text {
		text-decoration: line-through;
	}

	/* Ensure buttons have a consistent class for styling */
	button.task-button {
		/* ...existing styles... */
	}
</style>