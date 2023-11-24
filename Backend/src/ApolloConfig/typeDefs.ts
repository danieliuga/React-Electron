const typeDefs = ` #graphql

    type Color {
        name: String!
        hex: String!
        file: String
    }
    type Query { 
        allColors: [Color!]!
    }
    type Mutation {
        addColor(
            name: String!
            hex: String!
            file: String
        ): Color
        deleteColor( name: String!): Color
    }
`
export default typeDefs