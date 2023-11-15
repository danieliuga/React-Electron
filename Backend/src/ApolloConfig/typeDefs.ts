const typeDefs = ` #graphql

    type Color {
        name: String!
        hex: String!
    }
    type Query { 
        allColors: [Color!]!
    }
    type Mutation {
        addColor(
            name: String!
        hex: String!
        ): Color
    }
`
export default typeDefs