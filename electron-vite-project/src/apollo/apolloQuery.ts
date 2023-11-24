import { gql } from '@apollo/client';

export const addNewColor = gql`
mutation Mutation($name: String!, $hex: String!, $file: String) {
    addColor(name: $name, hex: $hex, file: $file) {
      name
      hex
      file
    }
}`
export const getAllColors = gql`
query AllColors {
   allColors {
      name
      hex
      file
   }
}`

export const deleteColor = gql`
mutation Mutation($name: String!) {
   deleteColor(name: $name) {
     name
   }
 }
`;