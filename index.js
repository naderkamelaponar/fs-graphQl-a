/** بسم الله الرحمن الرحيم */
const mongoose = require('mongoose')
const config = require('./src/utils/config')
const mongoUri = config.MONGO_URI
const apolloServer=require('./src/plugins/index')
mongoose.connect(mongoUri).then(()=>{
    console.log('connected to the remote db')
}).catch((r)=>{
    console.log('error, ',r.message)
})
/** AplloServer plugins */
/**  */

apolloServer.listen().then(({url})=>{
    console.log('server is live at >>> ',url)
})