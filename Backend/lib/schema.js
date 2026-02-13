import Joi from "joi";

export const userSchema = Joi.object({
    email:Joi.string().trim().email({ tlds: { allow: false } }).required(),
    username:Joi.string().trim().required(),
    password:Joi.string().trim().min(6).required(),
})