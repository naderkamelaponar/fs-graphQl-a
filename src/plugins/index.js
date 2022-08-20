/** بسم الله الرحمن الرحيم */
const authorPlugins = require('./author-plugins')
const bookPlugins=require('./book-plugins')
const typeDefs =[authorPlugins.typeDefs,bookPlugins.typeDefs]
const resolvers = [authorPlugins.resolvers,bookPlugins.resolvers]
const plugins= {
    typeDefs,resolvers
}
module.exports = plugins