<template>
  <div id="app">
    <h1>ToDo List</h1>
    <input v-model="newTask" @keyup.enter="addTask" placeholder="Add a new task" />
    <ul>
      <li v-for="task in tasks" :key="task.id">
        {{ task.text }}
        <button @click="deleteTask(task.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      tasks: [],
      newTask: '',
    };
  },
  methods: {
    fetchTasks() {
      axios.get('http://localhost:3003/api/tasks')
        .then(response => {
          this.tasks = response.data;
        });
    },
    addTask() {
      if (!this.newTask) return;
      axios.post('http://localhost:3003/api/tasks', { text: this.newTask })
        .then(response => {
          this.tasks.push(response.data);
          this.newTask = ''; // 清空输入框
        });
    },
    deleteTask(id) {
      axios.delete(`http://localhost:3003/api/tasks/${id}`)
        .then(() => {
          this.tasks = this.tasks.filter(task => task.id !== id);
        });
    }
  },
  mounted() {
    this.fetchTasks();
  }
};
</script>

<style>
/* 添加一些基本样式 */
</style>
