<template>
  <div class="container">
    <h1>Todo List</h1>
    <div class="input-group">
      <input
        v-model="newTodo"
        @keyup.enter="addTodo"
        type="text"
        class="todo-input"
        placeholder="Add a new todo"
      />
      <button @click="addTodo" class="add-button">Add Todo</button>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <ul class="todo-list">
      <li
        v-for="todo in todos"
        :key="todo.id"
        class="todo-item"
      >
        <div class="todo-content">
          <input
            type="checkbox"
            v-model="todo.completed"
            @change="toggleTodo(todo)"
            class="todo-checkbox"
          />
          <span :class="{ 'completed': todo.completed }">{{ todo.text }}</span>
        </div>
        <button @click="deleteTodo(todo.id)" class="delete-button">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      todos: [],
      newTodo: '',
      error: ''
    };
  },
  mounted() {
    this.fetchTodos();
  },
  methods: {
    //与后端服务器进行连接
    async fetchTodos() {
      try {
        const response = await axios.get('http://localhost:3001/api/todos');
        this.todos = response.data;
        this.error = '';
      } catch (err) {
        this.error = 'Failed to fetch todos: ' + (err.response?.data?.error || err.message);
      }
    },

    //添加待办事项
    async addTodo() {
      if (!this.newTodo.trim()) {
        this.error = 'Please enter a task';
        return;
      }
      try {
        const response = await axios.post('http://localhost:3001/api/todos', { text: this.newTodo });
        this.todos.push(response.data);
        this.newTodo = '';
        this.error = '';
      } catch (err) {
        this.error = 'Failed to add todo: ' + (err.response?.data?.error || err.message);
      }
    },
    //更新待办事项，后端同步
    async toggleTodo(todo) {
      try {
        console.log(`Sending PUT to: http://localhost:3001/api/todos/${todo.id}, Data:`, { completed: todo.completed }); // 日志
        const response = await axios.put(`http://localhost:3001/api/todos/${todo.id}`, {
          completed: todo.completed
        });
        console.log('PUT response:', response.data); // 日志
        const index = this.todos.findIndex(t => t.id === todo.id);
        this.todos[index] = response.data;
        this.error = '';
      } catch (err) {
        this.error = 'Failed to update todo: ' + (err.response?.data?.error || err.message);
        console.error('Update error:', err.response || err); // 日志
        todo.completed = !todo.completed; // 恢复状态
      }
    },
    //删除代办事项
    async deleteTodo(id) {
      try {
        console.log(`Sending DELETE to: http://localhost:3001/api/todos/${id}`); // 日志
        await axios.delete(`http://localhost:3001/api/todos/${id}`);
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.error = '';
      } catch (err) {
        this.error = 'Failed to delete todo: ' + (err.response?.data?.error || err.message);
        console.error('Delete error:', err.response || err); // 日志
      }
    }
  }
};
</script>