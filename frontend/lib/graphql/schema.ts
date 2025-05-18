// This is a sample schema for reference - you would implement this on your GraphQL server
export const typeDefs = `#graphql
  type Student {
    id: ID!
    name: String!
    email: String!
    grade: String!
    enrollmentDate: String!
    status: String!
  }

  type Query {
    students: [Student!]!
    student(id: ID!): Student
  }

  type Mutation {
    addStudent(name: String!, email: String!, grade: String!, status: String!): Student!
    updateStudent(id: ID!, name: String, email: String, grade: String, status: String): Student!
    deleteStudent(id: ID!): Boolean!
  }
`
