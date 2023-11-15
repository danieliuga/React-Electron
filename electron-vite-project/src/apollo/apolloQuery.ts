import { gql } from '@apollo/client';

export const addNewColor = gql`
mutation Mutation($name: String!, $hex: String!) {
    addColor(name: $name, hex: $hex) {
      name
      hex
    }
}`
export const getAllColors = gql`
query AllColors {
   allColors {
      name
      hex
   }
}`