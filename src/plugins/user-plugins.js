/** بسم الله الرحمن الرحيم */
const {gql,UserInputError} =require('apollo-server')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const bcrypt = require('bcrypt')
const typeDefs =gql`
type User {
    username: String!
    password:String!
    favouriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
  }
  
  type Query {
    me: User
  }
  
  type Mutation {
    createUser(
      username: String!
      favouriteGenre: String!
      password:String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
    Query:{
        me :(_, __, context) => {
          console.log(context)
            return context.currentUser
          }
    },
    Mutation:{
        createUser:async (_,args)=>{
            const user = new User({...args})
            const hashSalt= Number(config.hashSalt+0)
            if (user.password && user.password.length<5 ) {
              throw new UserInputError('not valid password')
            }
            user.password = await bcrypt.hash(user.password,hashSalt)
            try {
                await user.save()
            } 
            catch(error){
                throw new UserInputError(error.message)
            }
            return user
        },
        login :async (_,args)=>{
            const user = await User.findOne({ username: args.username })
            const password= user? await bcrypt.compare( args.password,user.password) ?true :null : null
            if ( !user || ! password  ) {
                throw new UserInputError("wrong credentials")
            }
            const userForToken ={
                username:user.username,
                id:user._id
            }
            const jwtSecret= config.jwtSecret
            return { value: jwt.sign(userForToken, jwtSecret) }
        }
    }
        
}
const userPlugins={
    typeDefs,resolvers
}
module.exports = userPlugins