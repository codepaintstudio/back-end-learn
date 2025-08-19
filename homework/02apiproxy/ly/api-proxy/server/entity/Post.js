const { EntitySchema } = require("typeorm");

const Post = new EntitySchema({
    name: "Post",
    tableName: "posts",
    columns: {
        // 主键（自增整数示例，根据需求选 UUID）
        id: {
            primary: true,
            type: "int",
            generated: "increment"
        },
        username: {
            type: "varchar",
            length: 255,
            nullable: false
        },
        password: {
            type: "varchar",
            length: 255,
            nullable: false
        },

        createdAt: {
            type: "varchar",
            length: 255,
            nullable: false
        },

    }
});

module.exports = { Post };