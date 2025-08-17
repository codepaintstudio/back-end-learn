const express = require('express')
const { PostController } = require('../controller/PostController')

const router = express.Router()
const postController = new PostController()

// 获取所有文章
router.get('/', postController.getAllPosts)

// 根据ID获取文章
router.get('/:id', postController.getPostById)

// 创建新文章
router.post('/', postController.createPost)

// 更新文章
router.put('/:id', postController.updatePost)

// 删除文章
router.delete('/:id', postController.deletePost)

module.exports = router
