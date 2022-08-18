/** بسم الله الرحمن الرحيم */
const { ApolloServer, gql } = require('apollo-server')
const {v1:uuid} = require('uuid')
let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

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
    bookCount:()=>books.length, /** bookCount should return7 */
    authorCount:()=>authors.length, /**authorCount should return5 */
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


const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})