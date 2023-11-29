import mongoose from 'mongoose';
import { colorModel } from './recipe.js';

// Define el esquema para el usuario

// Conecta a MongoDB Atlas
mongoose.connect('mongodb+srv://dani04iuga:6619csh2018@cluster0.btu6omz.mongodb.net/?retryWrites=true&w=majority', {
  dbName: 'ColorFull'
});

const resolvers = {
  Query: {
    allColors: async () => {
      return colorModel.find();
    },
  },
  Mutation: {
    addColor: async (parent, args) => {
      const { name, hex, file } = args;
     
      const newColor = new colorModel({ name, hex, file});
      await newColor.save();
      return newColor;
    },
    deleteColor: async (parent, args) => {
      const { name } = args;
      await colorModel.deleteOne({ name: name });
    }
  },
};

export default resolvers;
