import { gql } from '@apollo/client';

export const addNewColor = gql`
mutation Mutation($name: String!, $hex: String!, $fileName: String!) {
  addColor(name: $name, hex: $hex, fileName: $fileName) {
    name
    hex
    fileName
  }
}`
export const getAllColors = gql`
query Query {
  allColors {
    name
    hex
    fileName
  }
}`

export const deleteColor = gql`
mutation Mutation($name: String!) {
   deleteColor(name: $name) {
     name
   }
 }
`;