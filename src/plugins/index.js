/** بسم الله الرحمن الرحيم */
const authorPlugins = require('./author-plugins')
const bookPlugins=require('./book-plugins')
const userPlugins = require('./user-plugins')
const config = require('../utils/config')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const {ApolloServer} =require('apollo-server')
const plugins= {
    typeDefs:[
        authorPlugins.typeDefs,bookPlugins.typeDefs,
        userPlugins.typeDefs
    ],
    resolvers:[
        authorPlugins.resolvers,bookPlugins.resolvers,
        userPlugins.resolvers
    ],
}
const apolloServer = new ApolloServer({
    typeDefs:plugins.typeDefs,resolvers:plugins.resolvers,
    context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.toLowerCase().startsWith('bearer ')) {
          const decodedToken = jwt.verify(
            auth.substring(7), config.jwtSecret
          )
          const currentUser = await User.findById({_id:decodedToken.id})
          
          return { currentUser }
        }
      }
    })
module.exports = apolloServer