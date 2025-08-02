<script setup>
import { ref, onMounted, computed } from 'vue';
import { fetchTodos, addTodo, updateTodo, deleteTodo } from './api/infoTodo';

// 待办事项列表
const todos = ref([]);
// 已完成计数（计算属性）
const completedCount = computed(() => todos.value.filter(todo => todo.completed).length);
// 未完成计数（计算属性）
const activeCount = computed(() => todos.value.filter(todo => !todo.completed).length);
// 输入框
const newTodoText = ref('');

// 添加待办事项
const handleAddTodo = async () => {
  if (!newTodoText.value.trim()) return;
  
  try {
    const newTodo = await addTodo(newTodoText.value);
    todos.value.push(newTodo);
    newTodoText.value = '';
  } catch (error) {
    console.error('添加待办事项失败:', error);
  }
};

// 更新待办事项状态
const handleUpdateTodo = async (todo) => {
  try {
    await updateTodo(todo.id, { completed: !todo.completed });
    todo.completed = !todo.completed;
  } catch (error) {
    console.error('更新待办事项失败:', error);
  }
};

// 删除待办事项
const handleDeleteTodo = async (id) => {
  try {
    await deleteTodo(id);
    todos.value = todos.value.filter(todo => todo.id !== id);
  } catch (error) {
    console.error('删除待办事项失败:', error);
  }
};

// 批量操作
const selectAll = async () => {
  try {
    await Promise.all(todos.value.map(async todo => {
      if (!todo.completed) {
        await handleUpdateTodo(todo);
      }
    }));
  } catch (error) {
    console.error('全选操作失败:', error);
  }
};

const clearCompleted = async () => {
  try {
    const completedTodos = todos.value.filter(todo => todo.completed);
    await Promise.all(completedTodos.map(todo => handleDeleteTodo(todo.id)));
  } catch (error) {
    console.error('删除已完成任务失败:', error);
  }
};

// 初始化时获取数据
onMounted(async () => {
  try {
    todos.value = await fetchTodos();
  } catch (error) {
    console.error('初始化加载待办事项失败:', error);
  }
});
</script>

<template>
  <div class="todo-app">
    <h1 class="title">待办事项</h1>
    <div class="stats">
      <span>总计: {{ todos.length }}</span>
      <span>已完成: {{ completedCount }}</span>
      <span>未完成: {{ activeCount }}</span>
    </div>
    
    <!-- 添加任务区域 -->
    <div class="add-task">
      <input 
        type="text" 
        placeholder="输入新任务"
        class="task-input"
        v-model="newTodoText"
      >
      <button class="add-btn" @click="handleAddTodo">添加</button>
    </div>

    <!-- 任务列表 -->
    <ul class="task-list">
      <li 
        v-for="todo in todos" 
        :key="todo.id"
        class="task-item"
      >
        <input 
          type="checkbox" 
          :checked="todo.completed"
          class="task-checkbox"
          @change="handleUpdateTodo(todo)"
        >
        <span :class="{ 'completed': todo.completed }">
          {{ todo.text }}
        </span>
        <button class="delete-btn" @click="handleDeleteTodo(todo.id)">删除</button>
      </li>
    </ul>

    <!-- 批量操作 -->
    <div class="batch-actions">
      <button class="action-btn" @click="selectAll">全选</button>
      <button class="action-btn" @click="clearCompleted">一键删除已完成</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.todo-app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;

  .title {
    margin-bottom: 10px;
  }

  .stats {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
    font-size: 14px;
    color: #666;

    span {
      padding: 4px 8px;
      background: #f5f5f5;
      border-radius: 4px;
    }
  }

  .add-task {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    width: 100%;

    .task-input {
      flex: 1;
      padding: 8px;
    }

    .add-btn {
      padding: 8px 16px;
    }
  }

  .task-list {
    width: 100%;
    list-style: none;
    padding: 0;

    .task-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      border-bottom: 1px solid #eee;

      .completed {
        text-decoration: line-through;
        color: #999;
      }

      .delete-btn {
        margin-left: auto;
      }
    }
  }

  .batch-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;

    .action-btn {
      padding: 8px 16px;
    }
  }
}
</style>
