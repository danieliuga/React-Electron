import mongoose from 'mongoose';
import { colorModel } from './recipe.js';

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
      const { name, hex, fileName } = args;
     
      const newColor = new colorModel({ name, hex, fileName});
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
