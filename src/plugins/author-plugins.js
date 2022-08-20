/** بسم الله الرحمن الرحيم */
const {gql,UserInputError} =require('apollo-server')
const Author = require('../models/author')
const Book = require('../models/book')
const typeDefs = gql`
type Mutation {
    editBorn(
        name:String!
        born:Int!
    ):Author,
    addAuthor(
        name:String!
        born:Int
    ):Author
}
type Author{
    id:ID!
    name:String!
    born:Int
    bookCount:Int!
}
  type Query {
    authorCount:Int!
    allAuthors:[Author!]!
  }`
  const resolvers = {
    Query: {
      authorCount:async()=>Author.collection.countDocuments(), 
      allAuthors:async()=> await Author.find({})
      },
      Author:{
          bookCount: async(root)=>{
             const books = await Book.find({author:root._id})
             return books?books.length:0
          }
      },
      Mutation:{
          addAuthor :async(_,args)=>{
              let author = new Author({...args})
              
              try {
                 author = await author.save()
              } catch (error) {
                  throw new UserInputError(error.message)
              }
              return author
          },
          editBorn: async (_,args)=>{
           const author = await Author.findOneAndUpdate({name:args.name},{born:args.born},{
            new:true
           })
           return author
          }
      }
    }
const authorPlugins ={
    typeDefs,resolvers
}
module.exports = authorPlugins