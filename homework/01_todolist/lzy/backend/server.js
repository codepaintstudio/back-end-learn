const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const DATA_FILE = path.join(__dirname, 'todos.json');
const PORT = 3001;


//post get delete put 方法
  async function isGetRequest(method, url) {
    if (method === 'GET' && url === '/api/todos') {
        res.writeHead(200);
        res.end(JSON.stringify(todos));
      }
  }
  async function isPostRequest(method, url) {
    if (method === 'POST' && url === '/api/todos') {
      if (!body) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Text is required' }));
        return;
      }
      const { text } = JSON.parse(body);
      if (!text || typeof text !== 'string') {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid text' }));
        return;
      }
      const todo = { id: nextId++, text, completed: false };
      todos.push(todo);
      todosData.nextId = nextId;
      await writeTodos(todosData);
      res.writeHead(201);
      res.end(JSON.stringify(todo));
    }
  }
  async function isPutRequest(method, url) {
    if (method === 'PUT' && match) {
      console.log(`PUT todo ID: ${id}, Body: ${body}`); // 日志：ID和请求体
      const todo = todos.find(t => t.id === id);
      if (!todo) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Todo not found' }));
        return;
      }
      if (!body) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid request body' }));
        return;
      }
      try {
        const updates = JSON.parse(body);
        console.log('Updates:', updates); // 日志：更新内容
        if (updates.text !== undefined && typeof updates.text === 'string') {
          todo.text = updates.text;
        }
        if (updates.completed !== undefined && typeof updates.completed === 'boolean') {
          todo.completed = updates.completed;
        }
        await writeTodos(todosData);
        res.writeHead(200);
        res.end(JSON.stringify(todo));
      } catch (err) {
        console.error('PUT error:', err);
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid JSON or data' }));
      }
    }
  }
  async function isDeleteRequest(method, url){
    if (method === 'DELETE' && match) {
      console.log(`DELETE todo ID: ${id}`); // 日志：ID
      const index = todos.findIndex(t => t.id === id);
      if (index === -1) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Todo not found' }));
        return;
      }
      todos.splice(index, 1);
      await writeTodos(todosData);
      res.writeHead(200);
      res.end(JSON.stringify({ success: true }));
    }
  }
  async function isRouteNotFound(method, url){
    console.log(`Route not found: ${method} ${url}`); // 日志：未匹配路由
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Route not found' }));
  }






// 读取 JSON 文件
async function readTodos() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') return { todos: [], nextId: 1 };
    console.error('Error reading todos:', err);
    throw err;
  }
}

// 写入 JSON 文件
async function writeTodos(data) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing todos:', err);
    throw err;
  }
}

// 创建服务器
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const { method, url } = req;
  let body = '';


  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    console.log(`[${new Date().toISOString()}] ${method} ${url}`); // 日志：请求方法和URL
    try {
      const todosData = await readTodos();
      const todos = todosData.todos;
      let nextId = todosData.nextId;

      // 解析 URL，匹配 /api/todos/:id
      const match = url.match(/^\/api\/todos\/(\d+)$/);
      const id = match ? parseInt(match[1]) : null;

      if (method === 'GET' && url === '/api/todos') {
        await isGetRequest()
      } else if (method === 'POST' && url === '/api/todos') {
        await isPostRequest();
      } else if (method === 'PUT' && match) {
        await isPutRequest();
      } else if (method === 'DELETE' && match) {
        await isDeleteRequest();
      } else {
        await isRouteNotFound();
      }
    } catch (err) {
      console.error('Server error:', err);
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});