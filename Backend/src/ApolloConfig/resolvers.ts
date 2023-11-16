import mongoose from 'mongoose';
import { colorModel } from './recipe.js';

// Define el esquema para el usuario

// Conecta a MongoDB Atlas
mongoose.connect('mongodb+srv://reiselrol8:Es2W2EtwiX6UwWE@cluster0.n1j9tad.mongodb.net/test', {
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
      const { name, hex } = args;
      const newColor = new colorModel({ name, hex });
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
