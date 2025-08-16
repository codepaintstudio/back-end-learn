// 引入数据库配置
const { AppDataSource } = require('./src/config/database');
// 引入用户服务
const { UserService } = require('./src/service/UserService');

/**
 * ORM 技术演示
 * 
 * ORM（Object Relational Mapping，对象关系映射）是一种技术，
 * 用于在关系型数据库和面向对象编程语言之间进行数据转换。
 * 
 * 优势：
 * 1. 提高开发效率 - 避免编写重复的 SQL 语句
 * 2. 提高代码可维护性 - 使用面向对象的方式操作数据库
 * 3. 数据库无关性 - 可以轻松切换不同的数据库系统
 * 4. 安全性 - 自动防止 SQL 注入攻击
 */

// 创建用户服务实例
const userService = new UserService();

/**
 * 演示创建用户
 */
async function demonstrateCreateUser() {
  console.log('\n=== 创建用户演示 ===');
  
  // 用户数据
  const userData = {
    username: 'alice',
    email: 'alice@example.com',
    password: 'encrypted_password_here', // 实际项目中应使用 bcrypt 等加密
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  try {
    // 创建用户
    const user = await userService.createUser(userData);
    console.log('创建的用户:', {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    });
    return user;
  } catch (error) {
    console.error('创建用户失败:', error.message);
    return null;
  }
}

/**
 * 演示查询用户
 */
async function demonstrateFindUsers() {
  console.log('\n=== 查询用户演示 ===');
  
  try {
    // 根据 ID 查询用户
    const userById = await userService.findUserById(1);
    console.log('根据 ID 查询用户:', userById ? userById.username : '未找到');
    
    // 根据用户名查询用户
    const userByName = await userService.findUserByUsername('alice');
    console.log('根据用户名查询用户:', userByName ? userByName.username : '未找到');
    
    // 查询所有用户
    const allUsers = await userService.getAllUsers();
    console.log(`所有用户数量: ${allUsers.length}`);
    
    // 显示所有用户信息（不包括密码）
    allUsers.forEach(user => {
      console.log(`- ${user.username} (${user.email})`);
    });
  } catch (error) {
    console.error('查询用户失败:', error.message);
  }
}

/**
 * 演示更新用户
 */
async function demonstrateUpdateUser() {
  console.log('\n=== 更新用户演示 ===');
  
  try {
    // 更新用户信息
    const updatedUser = await userService.updateUser(1, {
      email: 'alice.new@example.com',
      updatedAt: new Date()
    });
    
    if (updatedUser) {
      console.log('更新后的用户:', {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        updatedAt: updatedUser.updatedAt
      });
    } else {
      console.log('用户更新失败');
    }
  } catch (error) {
    console.error('更新用户失败:', error.message);
  }
}

/**
 * 演示删除用户
 */
async function demonstrateDeleteUser() {
  console.log('\n=== 删除用户演示 ===');
  
  try {
    // 创建一个用于删除的用户
    const userToDelete = await userService.createUser({
      username: 'bob',
      email: 'bob@example.com',
      password: 'encrypted_password_here',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    if (userToDelete) {
      console.log('创建用于删除的用户:', userToDelete.username);
      
      // 删除用户
      const isDeleted = await userService.deleteUser(userToDelete.id);
      console.log('用户删除结果:', isDeleted ? '成功' : '失败');
    }
  } catch (error) {
    console.error('删除用户失败:', error.message);
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('=== ORM 技术演示 ===');
  
  try {
    // 初始化数据库连接
    console.log('正在连接数据库...');
    await AppDataSource.initialize();
    console.log('数据库连接成功');
    
    // 演示创建用户
    const user = await demonstrateCreateUser();
    
    // 演示查询用户
    await demonstrateFindUsers();
    
    // 演示更新用户
    await demonstrateUpdateUser();
    
    // 演示删除用户
    await demonstrateDeleteUser();
    
    console.log('\n=== 演示完成 ===');
    console.log('ORM 技术演示结束');
  } catch (error) {
    console.error('演示过程中出错:', error.message);
  } finally {
    // 关闭数据库连接
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('数据库连接已关闭');
    }
  }
}

// 运行主函数
main();