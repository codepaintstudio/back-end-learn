const { EntitySchema } = require('typeorm')

const User = new EntitySchema({
    name: 'User', // 定义实体名称
    tableName: 'userss', // 数据库中对应的表名
    columns: {
        // 定义数据表字段
        id: {
            // 主键ID
            primary: true, // 设置为主键
            type: 'int', // 字段类型为整数
            generated: true,
            nullable: false
        },
        username: {
            type: 'varchar', // 类型为可变字符串
            length: 50, // 最大长度为50
            nullable: false // 不允许为空
        },
        password: {
            type: 'varchar',
            length: 255,
            nullable: false // 不允许为空
        },
        createdAt: {
            // 创建时间
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP'
        },
        updatedAt: {
            // 最后更新时间
            type: 'timestamp', // 类型为时间戳
            default: () => 'CURRENT_TIMESTAMP', // 默认值为当前时间
            onUpdate: 'CURRENT_TIMESTAMP' // 更新记录时自动更新为当前时间
        }
    }
})

module.exports = User
