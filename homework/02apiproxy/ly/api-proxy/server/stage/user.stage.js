const path = require('path')
const fs = require('fs')


const userFilePath = path.resolve(__dirname, './data/users.json')
// console.log(userFilePath)
// 读文件
const readFileJSON = async (dataPath) => {
    try {
        const data = await fs.promises.readFile(dataPath, 'utf-8')
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
        await fs.promises.writeFile(dataPath, JSON.stringify(data, null, 2))
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = {
    readFileJSON,
    writeFileJSON,
    userFilePath
}
