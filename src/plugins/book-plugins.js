/** بسم الله الرحمن الرحيم */
const {gql,UserInputError} =require('apollo-server')
const Book = require('../models/book')
const Author = require('../models/author')
const typeDefs =gql`
type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
}

type Query {
    allBooks:[Book!]!
}
type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
}
`
const resolvers = {
    Query:{
        allBooks:  async ()=>  { return await Book.find()}
    },
    Mutation:{
        addBook:async (_,args,context)=>{
            const currentUser = context.currentUser
            if (!currentUser) throw new AuthenticationError("not authenticated")
            const author = await Author.findOne({name:args.author})
            const newBook=new Book({...args,author})
    
            try {
                await newBook.save()
            } 
            catch(error){
                throw new UserInputError(error.message)
            }
            return newBook
        }
    },
    
        Book:{
            author:async (r)=>{
                const author = r.author? await Author.findOne({_id:r.author._id}):null
                return author
        }
        }
}
const bookPlugins={
    typeDefs,resolvers
}
module.exports = bookPlugins