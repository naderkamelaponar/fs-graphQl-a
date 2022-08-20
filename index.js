/** بسم الله الرحمن الرحيم */
const {ApolloServer,gql,UserInputError} =require('apollo-server')
const mongoose = require('mongoose')
const config = require('./src/utils/config')
const mongoUri = config.MONGO_URI
const Author = require('./src/models/author')
const plugins=require('./src/plugins/index')
mongoose.connect(mongoUri).then(()=>{
    console.log('connected to the remote db')
}).catch((r)=>{
    console.log('error, ',r.message)
})
/** AplloServer plugins */
const typeDefs = gql`
type Book {
    title:String!
    author:String!
    published:Int!
    genres:[String!]!
    id:ID!
}
type Mutation {
    addBook(
        title:String!
        author:String!
        published:Int!
        genres:[String!]!
    ):Book,
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
    bookCount:Int!
    authorCount:Int!
    allBooks:[Book!]!
    allAuthors:[Author!]!
    authorBooks(author:String,genres:String):[Book!]
  }
`

const resolvers = {
  Query: {
    bookCount: ()=>books.length, /** bookCount should return7 */
    authorCount:async()=>Author.collection.countDocuments(), /**authorCount should return5 */
    allBooks:()=> books, /** allBooks should return all books*/    
    authorBooks:(_,args)=> {
        const res = args.author?books.filter(b=>{
            return b.author===args.author
          }):books
      
      return args.genres? res.filter(b=>{
        return b.genres.includes(args.genres)
      }):res
    } ,
    allAuthors:()=>authors 
    },
    Author:{
        bookCount:(root)=>{
           return books.filter(b=>{
               return b.author===root.name
            }).length
        }
    },
    Mutation:{
        addBook:(_,args)=>{
            const newBook={...args,id:uuid()}
            books= books.concat(newBook)
            return newBook
        },
        addAuthor :async(_,args)=>{
            const author = new Author({...args})
            try {
                await author.save()
            } catch (error) {
                throw new UserInputError(error.message)
            }
            return author
        },
        editBorn:(_,args)=>{
            const getAuthor = args.name ? authors.find(a=>{
                return a.name ===args.name 
            }):null
            const res= getAuthor?{...getAuthor,born:args.born}:null
            if(res ) authors = authors.map(a=>{
                return a.id === res.id? res:a
            })
            return res
        }
    }
  }
/**  */
const server = new ApolloServer({typeDefs:plugins.typeDefs,resolvers:plugins.resolvers})
server.listen().then(({url})=>{
    console.log('server is live at >>> ',url)
})