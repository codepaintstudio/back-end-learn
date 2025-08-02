
const dayjs = require('dayjs')
const formatDate = (date) => {
    return dayjs(date).format('HH:mm');
}
module.exports = {
    formatDate
}