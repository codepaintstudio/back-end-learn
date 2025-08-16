// 引入 User 实体
const { User } = require('../entity/User');
// 引入数据库连接
const { AppDataSource } = require('../config/database');

/**
 * 用户服务类
 * 
 * 提供用户相关的业务逻辑处理
 * 包括用户创建、查询、更新等操作
 */
class UserService {
  /**
   * 获取用户仓库
   * @returns {import('typeorm').Repository<User>} 用户仓库实例
   */
  getUserRepository() {
    return AppDataSource.getRepository(User);
  }

  /**
   * 创建新用户
   * @param {Object} userData - 用户数据
   * @param {string} userData.username - 用户名
   * @param {string} userData.email - 邮箱
   * @param {string} userData.password - 密码
   * @returns {Promise<User>} 创建的用户对象
   */
  async createUser(userData) {
    console.log('正在创建用户:', userData.username);
    
    // 创建用户实例
    const user = new User(userData);
    
    // 保存到数据库
    const savedUser = await this.getUserRepository().save(user);
    
    console.log('用户创建成功:', savedUser.username);
    return savedUser;
  }

  /**
   * 根据ID查找用户
   * @param {number} id - 用户ID
   * @returns {Promise<User|null>} 用户对象或null
   */
  async findUserById(id) {
    console.log('正在查找用户 ID:', id);
    
    const user = await this.getUserRepository().findOneBy({ id });
    
    if (user) {
      console.log('找到用户:', user.username);
    } else {
      console.log('未找到用户 ID:', id);
    }
    
    return user;
  }

  /**
   * 根据用户名查找用户
   * @param {string} username - 用户名
   * @returns {Promise<User|null>} 用户对象或null
   */
  async findUserByUsername(username) {
    console.log('正在查找用户名:', username);
    
    const user = await this.getUserRepository().findOneBy({ username });
    
    if (user) {
      console.log('找到用户:', user.username);
    } else {
      console.log('未找到用户名:', username);
    }
    
    return user;
  }

  /**
   * 获取所有用户
   * @returns {Promise<User[]>} 用户列表
   */
  async getAllUsers() {
    console.log('正在获取所有用户');
    
    const users = await this.getUserRepository().find();
    
    console.log(`找到 ${users.length} 个用户`);
    return users;
  }

  /**
   * 更新用户信息
   * @param {number} id - 用户ID
   * @param {Object} userData - 要更新的用户数据
   * @returns {Promise<User|null>} 更新后的用户对象或null
   */
  async updateUser(id, userData) {
    console.log('正在更新用户 ID:', id);
    
    // 查找用户
    const user = await this.findUserById(id);
    if (!user) {
      console.log('用户不存在，无法更新');
      return null;
    }
    
    // 更新用户数据
    Object.assign(user, userData);
    
    // 保存更新
    const updatedUser = await this.getUserRepository().save(user);
    
    console.log('用户更新成功:', updatedUser.username);
    return updatedUser;
  }

  /**
   * 删除用户
   * @param {number} id - 用户ID
   * @returns {Promise<boolean>} 删除是否成功
   */
  async deleteUser(id) {
    console.log('正在删除用户 ID:', id);
    
    // 查找用户
    const user = await this.findUserById(id);
    if (!user) {
      console.log('用户不存在，无法删除');
      return false;
    }
    
    // 删除用户
    await this.getUserRepository().remove(user);
    
    console.log('用户删除成功:', user.username);
    return true;
  }
}

// 导出用户服务实例
module.exports = {
  UserService
};