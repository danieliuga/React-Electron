const typeDefs = ` #graphql

    type Color {
        name: String!
        hex: String!
        fileName: String!
    }
    type Query { 
        allColors: [Color!]!
    }
    type Mutation {
        addColor(
            name: String!
            hex: String!
            fileName: String!
        ): Color
        deleteColor( name: String!): Color
    }
`
export default typeDefs