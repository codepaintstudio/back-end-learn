const http = require('http')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');// 引入uuid模块,它是
const dataPath = path.join(__dirname, './data/todos.json')// 存储数据的路径
const clientPath = path.join(__dirname, '../client/index.html')// 客户端的路径
const { formatDate } = require('./utils/format.js')
// 读文件
const readFileJSON = async (dataPath) => {
  try {
    const data = await fs.readFileSync(dataPath, 'utf-8')
    return JSON.parse(data)
  }
  catch (err) {
    if (err.code === 'ENOENT') {
      console.log(err)
    }
    return []

  }
}
// 写入文件
const writeFileJSON = async (dataPath, data) => {
  try {
    await fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
  }
  catch (err) {
    console.log(err)
  }
}

// 引入html 
const readFileHtml = async (clientPtah) => {
  try {
    const data = await fs.readFileSync(clientPtah, 'utf-8')
    // console.log(data)
    return data
  }
  catch (err) {
    console.log(err)
  }
}

// get 的请求
const getTodos = async (req, res) => {
  //  成功
  try {
    const todos = await readFileJSON(dataPath)
    res.statusCode = 200
    res.end(JSON.stringify({ success: true, data: todos, message: 'get请求成功' }))
  }
  // 失败
  catch (err) {
    res.statusCode = 500
    res.end(JSON.stringify({ success: false, error: err.message }))
  }
}
// 解析请求体（处理 POST/PUT 的 JSON 数据）
const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
};
// 处理post
const postTodos = async (req, res) => {
  try {
    const body = await parseBody(req);

    // 验证title是否存在(因为是前端必须要传过来的参数)
    if (!body.title) {
      // console.log("22222222")
      res.statusCode = 400
      res.end(JSON.stringify({ success: false, error: 'title is required' }))
      return
    }
    const Todos = await readFileJSON(dataPath)
    const newTodo = {
      id: uuidv4(),
      title: body.title,
      description: body.description || '',
      completed: false,
      createTime: formatDate(new Date().toISOString()),
      updateTime: '',
      category: "",
      priority: ""
    }
    Todos.unshift(newTodo)
    await writeFileJSON(dataPath, Todos)
    res.statusCode = 200
    res.end(JSON.stringify({ success: true, data: newTodo, message: 'create success' }))

  } catch (err) {
    res.statusCode = 400;
    res.end(JSON.stringify({ success: false, error: err.message }));
  }
}
// 处理delete
const deleteTodos = async (req, res) => {
  try {
    const body = await parseBody(req);
    const id = body.id
    // console.log(id)
    // id 不能为空(前端根据id来删除数据)
    if (!id) {
      res.statusCode = 400
      res.end(JSON.stringify({ success: false, error: 'id is required' }))
      return
    }
    const Todos = await readFileJSON(dataPath)
    const remainTodos = Todos.filter(todo => String(todo.id) !== String(id));
    if (Todos.length === remainTodos.length) {
      res.statusCode = 400
      res.end(JSON.stringify({ success: false, error: 'id not found' }))
      return
    }
    await writeFileJSON(dataPath, remainTodos)
    res.statusCode = 200
    res.end(JSON.stringify({ success: true, message: 'delete success', data: remainTodos }))
  }
  catch (err) {
    res.statusCode = 400
    res.end(JSON.stringify({ success: false, error: err.message }))
  }
}
// 处理put
const putTodos = async (req, res) => {
  try {
    const body = await parseBody(req);
    const id = body.id
    // console.log(id)
    const title = body.title
    const description = body.description
    const completed = body.completed
    // id 不能为空(前端根据id来删除数据)
    if (!id) {
      res.statusCode = 400
      res.end(JSON.stringify({ success: false, error: 'id is required' }))
      return
    }
    const Todos = await readFileJSON(dataPath)
    // 找到目标任务的索引
    const index = Todos.findIndex(todo => todo.id === id)

    if (index === -1) {
      res.statusCode = 400
      res.end(JSON.stringify({ success: false, error: 'id not found' }))
      return
    }
    if (!title) {
      Todos[index].title = ""
    }
    else {
      Todos[index].title = title
    }
    if (!description) {
      Todos[index].description = ""
    }
    else {
      Todos[index].description = description
    }
    Todos[index].updateTime = formatDate(new Date().toISOString())
    Todos[index].completed = completed || Todos[index].completed
    await writeFileJSON(dataPath, Todos)
    res.statusCode = 200
    res.end(JSON.stringify({ success: true, data: Todos[index], message: 'update success' }))
  }
  catch (err) {
    res.statusCode = 400
    res.end(JSON.stringify({ success: false, error: err.message }))
  }
}
const server = http.createServer()
server.on('request', async (req, res) => {
  // 获取方法(get push delete put )和 url
  const url = req.url

  const method = req.method
  // 基础路径
  const baseUrl = url.split('?')[0]


  // 设置响应头
  res.setHeader('content-type', 'application/json')
  // 在处理请求的最开始设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*'); // 允许所有来源（生产环境建议指定具体域名）
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // 允许的方法
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // 允许的请求头
  // 处理请求
  if (baseUrl === '/api/todos') {
    // get 把数据渲染到页面上
    if (method === 'GET') {
      getTodos(req, res)

    }
    else if (method === 'POST') {
      postTodos(req, res)

    }
  }
  else if (baseUrl === '/api/todos/id') {
    if (method === 'DELETE') {
      deleteTodos(req, res)

    }
    else if (method === 'PUT') {
      putTodos(req, res)
    }
  }
  else {
    // 引入html
    // const html = await readFileHtml(clientPtah);
    // res.setHeader('content-type', 'text/html');
    // res.end(html);
    try {
      const html = await readFileHtml(clientPath);
      res.setHeader('content-type', 'text/html');
      res.end(html);
    } catch (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ success: false, error: 'Failed to load HTML' }));
    }
  }


})
server.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})