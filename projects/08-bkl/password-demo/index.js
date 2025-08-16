// 引入 bcrypt 库用于密码加密
const bcrypt = require('bcrypt');

/**
 * 演示密码加密存储
 * 
 * 为什么需要加密存储密码？
 * 1. 防止数据库泄露导致用户隐私泄露
 * 2. 防止身份冒用
 * 3. 符合法律法规要求
 * 
 * 为什么使用 bcrypt？
 * 1. bcrypt 是专为密码哈希设计的算法
 * 2. 内置盐值防止彩虹表攻击
 * 3. 可调节计算复杂度适应硬件发展
 */

// 模拟用户注册时的密码处理
async function registerUser(username, plainPassword) {
  console.log(`\n=== 用户注册: ${username} ===`);
  console.log(`明文密码: ${plainPassword}`);
  
  // 设置 bcrypt 的计算轮数（salt rounds）
  // 数值越高越安全，但计算时间也越长
  const saltRounds = 10;
  
  try {
    // 使用 bcrypt 对密码进行哈希处理
    console.log('正在加密密码...');
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    
    console.log(`加密后的密码: ${hashedPassword}`);
    console.log('密码加密完成');
    
    // 返回用户信息（实际项目中会存储到数据库）
    return {
      username: username,
      password: hashedPassword // 注意：只存储加密后的密码
    };
  } catch (error) {
    console.error('密码加密失败:', error);
    throw error;
  }
}

// 模拟用户登录时的密码验证
async function authenticateUser(user, plainPassword) {
  console.log(`\n=== 用户登录验证: ${user.username} ===`);
  console.log(`输入的密码: ${plainPassword}`);
  console.log(`存储的哈希密码: ${user.password}`);
  
  try {
    // 使用 bcrypt 验证密码
    console.log('正在验证密码...');
    const isMatch = await bcrypt.compare(plainPassword, user.password);
    
    if (isMatch) {
      console.log('密码验证成功');
      return true;
    } else {
      console.log('密码验证失败');
      return false;
    }
  } catch (error) {
    console.error('密码验证出错:', error);
    throw error;
  }
}

// 演示彩虹表攻击的防护
function demonstrateRainbowTableProtection() {
  console.log('\n=== 彩虹表攻击防护演示 ===');
  console.log('即使两个用户使用相同的密码，存储的哈希值也不同（因为盐值不同）');
  
  const password = '123456';
  console.log(`用户A的密码: ${password}`);
  console.log(`用户B的密码: ${password}`);
  
  // 模拟两个用户使用相同密码的情况
  bcrypt.hash(password, 10).then(hash1 => {
    console.log(`用户A的哈希: ${hash1}`);
    
    bcrypt.hash(password, 10).then(hash2 => {
      console.log(`用户B的哈希: ${hash2}`);
      console.log(`两个哈希相同吗? ${hash1 === hash2 ? '是' : '否'}`);
      console.log('由于使用了不同的盐值，即使相同密码也会产生不同的哈希值');
    });
  });
}

// 演示不同密码强度的处理
async function demonstratePasswordStrength() {
  console.log('\n=== 密码强度演示 ===');
  
  const passwords = [
    '123456',           // 弱密码
    'password',         // 弱密码
    'qwerty123',        // 中等密码
    'MyStr0ng!P@ssw0rd' // 强密码
  ];
  
  for (const password of passwords) {
    console.log(`\n密码: ${password}`);
    const start = Date.now();
    const hash = await bcrypt.hash(password, 10);
    const end = Date.now();
    console.log(`哈希: ${hash.substring(0, 20)}...`);
    console.log(`耗时: ${end - start}ms`);
  }
}

// 主函数
async function main() {
  console.log('=== 密码加密存储演示 ===');
  
  // 模拟用户注册
  const user = await registerUser('alice', 'mySecretPassword123');
  
  // 模拟用户登录（正确密码）
  await authenticateUser(user, 'mySecretPassword123');
  
  // 模拟用户登录（错误密码）
  await authenticateUser(user, 'wrongPassword');
  
  // 演示彩虹表攻击防护
  demonstrateRainbowTableProtection();
  
  // 演示不同密码强度
  await demonstratePasswordStrength();
  
  console.log('\n=== 演示完成 ===');
  console.log('密码加密和验证已成功演示');
}

// 运行主函数
main().catch(console.error);