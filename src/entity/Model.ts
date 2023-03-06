import joi, {object} from 'joi'
import mongoose from 'mongoose'

export const CreateModelSchema = joi.object({
    name: joi.string().required(),
    title: joi.string().required(),
    url: joi.string().required(),
}).required()

export const UpdateValidModelSchema = joi.object({
    valid: joi.boolean().required()
}).required()

export const UpdateVotesModelSchema = joi.object({
    rating: joi.array().required()
}).required()

const modelSchema = new mongoose.Schema({
    id: Number,
    name: String,
    title: String,
    artistId: String,
    url: String,
    valid: Boolean,
    rating: Array,
    uploaded_at: Date,
    updated_at: Date
})

export const Model = mongoose.model('Model', modelSchema)
