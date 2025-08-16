const { AppDataSource } = require("../data-source");
const { Post } = require("../entity/Post");

class PostController {
  // 获取所有文章
  async getAllPosts(req, res) {
    try {
      const postRepository = AppDataSource.getRepository(Post);
      const posts = await postRepository.find({
        order: {
          createdAt: "DESC"
        }
      });
      res.json({
        success: true,
        data: posts
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "获取文章列表失败",
        error: error.message
      });
    }
  }

  // 根据ID获取文章
  async getPostById(req, res) {
    try {
      const postId = req.params.id;
      const postRepository = AppDataSource.getRepository(Post);
      const post = await postRepository.findOne({
        where: { id: parseInt(postId) }
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "未找到指定的文章"
        });
      }

      res.json({
        success: true,
        data: post
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "获取文章失败",
        error: error.message
      });
    }
  }

  // 创建新文章
  async createPost(req, res) {
    try {
      const { title, content } = req.body;
      const postRepository = AppDataSource.getRepository(Post);
      
      const post = postRepository.create({
        title,
        content
      });
      
      const result = await postRepository.save(post);
      
      res.status(201).json({
        success: true,
        data: result,
        message: "文章创建成功"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "创建文章失败",
        error: error.message
      });
    }
  }

  // 更新文章
  async updatePost(req, res) {
    try {
      const postId = req.params.id;
      const { title, content } = req.body;
      
      const postRepository = AppDataSource.getRepository(Post);
      let post = await postRepository.findOne({
        where: { id: parseInt(postId) }
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "未找到指定的文章"
        });
      }

      post.title = title || post.title;
      post.content = content || post.content;

      const result = await postRepository.save(post);
      
      res.json({
        success: true,
        data: result,
        message: "文章更新成功"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "更新文章失败",
        error: error.message
      });
    }
  }

  // 删除文章
  async deletePost(req, res) {
    try {
      const postId = req.params.id;
      
      const postRepository = AppDataSource.getRepository(Post);
      const post = await postRepository.findOne({
        where: { id: parseInt(postId) }
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "未找到指定的文章"
        });
      }

      await postRepository.remove(post);
      
      res.json({
        success: true,
        message: "文章删除成功"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "删除文章失败",
        error: error.message
      });
    }
  }
}

module.exports = {
  PostController
};