const { EntitySchema } = require("typeorm");

const Post = new EntitySchema({
  name: "Post", // 定义实体名称
  tableName: "posts", // 数据库中对应的表名
  columns: { // 定义数据表字段
    id: { // 主键ID
      primary: true, // 设置为主键
      type: "int", // 字段类型为整数
      generated: true // 值由数据库自动生成
    },
    title: { // 文章标题
      type: "varchar", // 类型为可变字符串
      length: 255, // 最大长度为255
      nullable: false // 不允许为空
    },
    content: { // 文章内容
      type: "text", // 类型为文本
      nullable: false // 不允许为空
    },
    createdAt: { // 创建时间
      type: "timestamp", // 类型为时间戳
      default: () => "CURRENT_TIMESTAMP" // 默认值为当前时间
    },
    updatedAt: { // 最后更新时间
      type: "timestamp", // 类型为时间戳
      default: () => "CURRENT_TIMESTAMP", // 默认值为当前时间
      onUpdate: "CURRENT_TIMESTAMP" // 更新记录时自动更新为当前时间
    }
  }
});

module.exports = {
  Post // 导出Post实体
};