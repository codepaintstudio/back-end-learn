Todo API
# 基础信息
服务地址：http://localhost:3000
基础路径：/api/todos
数据格式：JSON
# 接口列表
## 获取所有任务（GET）
接口路径：/api/todos
请求方法：GET
请求参数：无
响应信息
成功响应（200 OK）
响应参数：
```js
{
    "success": true,
    "data": [
        {
            "id": "70850a49-6c58-4e0d-b588-37a23c198704",
            "title": "任务1",
            "description": "这是任务1的描述",
            "completed": false,
           "createTime": "11:32",
            "updateTime": "11:32",
        }
        },
        {
               "id": "d9b4cc7c-d0e4-4b34-9921-741d9e640a3f",
                "title": "写作业",
               "description": "下午",
               "completed": "true",
               "createTime": "11:32",
               "updateTime": "11:32",
        }
    ],
    "message": "get success"
}
```
错误响应（500）
```js
json
{
  "success": false,
  "error": "错误信息描述"
}
```
## 新增任务（POST）
接口路径：/api/todos
请求方法：POST
请求头：Content-Type: application/json
请求参数：
```js
{
  "title"(必须): "新任务",
  "description"(可选): "这是一个新任务的描述"
}
```
响应信息
成功响应（200）
响应参数：
```js
{
  "success": true,
  "data": {
       "id": "d9b4cc7c-d0e4-4b34-9921-741d9e640a3f",
    "title": "写作业",
    "description": "下午",
    "completed": "true",
    "createTime": "11:32",
    "updateTime": "11:32",
    "category": "",
    "priority": ""
  },
  "message": "create success"
}
```
错误响应（400）
```js
json
{
  "success": false,
  "error": "title is required"
}
```
## 删除任务（DELETE）
接口路径：/api/todos/id
请求方法：DELETE
请求头：Content-Type: application/json
请求参数：
```js
{
    "id"(必须):"70850a49-6c58-4e0d-b588-37a23c198704"
}
```
- :id (必须): 要删除的任务ID
响应信息
成功响应（200）
响应参数：
```js
{
  "success": true,
  "message": "delete success"
}
```
错误响应（400）
```js
json
{
  "success": false,
  "error": 'id is required'
}
```
错误响应（400）
```js
json
{
  "success": false,
  "error": 'id not found'
}
```
## 更新任务（PUT）
接口路径：/api/todos/id
请求方法：PUT
请求头：Content-Type: application/json
请求参数：
```js
{
  "id"(必须):"70850a49-6c58-4e0d-b588-37a23c198704",
  "title"(可选):"更新任务",
  "description"(可选):"这是一个更新后的任务描述",
  "completed"(可选):true
}
```
响应信息
成功响应（200）
响应参数：
```js
{
  "success": true,
  "data": {
    "id": "d9b4cc7c-d0e4-4b34-9921-741d9e640a3f",
    "title": "写作业",
    "description": "下午",
    "completed": "true",
    "createTime": "11:32",
    "updateTime": "11:32",
    "category": "",
    "priority": ""
  },
  "message": "update success"
}
```
错误响应（400）
```js
json
{
  "success": false,
  "error": 'id is required'
}
```
错误响应（400）
```js
json
{
  "success": false,
  "error": 'id not found'
}