const moment = require('moment')

const formatMessage = (username, msg, img = null) => {
    return { 
        username, 
        msg,
        img,
        time: moment().format('h:mm a') 
    }
}

module.exports = formatMessage
