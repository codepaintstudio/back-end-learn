const http = require('http');
const url = require('url');

// 模拟数据库
let todos = [
  { id: 1, text: '学习ing', completed: false },
  { id: 2, text: '种植', completed: false },
  { id: 3, text: '完成', completed: false }
];

const server = http.createServer((req, res) => {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;


  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 获取待办事项列表
  if (path === '/api/todos' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(todos));
    return;
  }

  // 添加新待办事项
  if (path === '/api/todos' && method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { text } = JSON.parse(body);
      const newTodo = {
        id: todos.length + 1,
        text,
        completed: false
      };
      todos.push(newTodo);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newTodo));
    });
    return;
  }

  // 更新待办事项
  if (path.startsWith('/api/todos/') && method === 'PUT') {
    const id = parseInt(path.split('/')[3]);
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const todoIndex = todos.findIndex(todo => todo.id === id);
      if (todoIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Todo not found' }));
        return;
      }
      const updatedData = JSON.parse(body);
      todos[todoIndex] = { ...todos[todoIndex], ...updatedData };
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(todos[todoIndex]));
    });
    return;
  }

  // 删除待办事项
  if (path.startsWith('/api/todos/') && method === 'DELETE') {
    const id = parseInt(path.split('/')[3]);
    todos = todos.filter(todo => todo.id !== id);
    res.writeHead(204);
    res.end();
    return;
  }

  
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
