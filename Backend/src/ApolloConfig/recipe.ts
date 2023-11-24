import {model, Schema} from 'mongoose'

const colorSchema = new Schema({
    name: String,
    hex: String,
    file: String
})

export const colorModel = model('colors', colorSchema)
