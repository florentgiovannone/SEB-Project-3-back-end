import mongoose, { Schema } from 'mongoose'
import bcrypt, { compareSync } from "bcrypt"
import uniqueValidator from "mongoose-unique-validator"
import validator from 'validator'
import mongooseHidden from 'mongoose-hidden'

interface IUser {
    userName: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

const userSchema: Schema<IUser> = new mongoose.Schema<IUser>({
    userName: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },

    email: {
        type: String, required: true, unique: true, validate: (email: string) => { return validator.isEmail(email) }
    },
    password: {
        type: String, required: true, validate: (password: string) => {
            return validator.isStrongPassword(password, {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            })
        }
    },
})

userSchema.pre('save', function hashPassword(next) {

    console.log(this.password)
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync())
    console.log(this.password)
    next()
})

export function validatePassword(loginPlaintextPassword: string, originalHashedPassword: string) {
    return bcrypt.compareSync(loginPlaintextPassword, originalHashedPassword);
}

export function checkPasswords(password: string, passwordConfirmation: string) {
    return password === passwordConfirmation
}

userSchema.plugin(mongooseHidden({ defaultHidden: { password: true, email: true, _id: true } }))
userSchema.plugin(uniqueValidator)

export default mongoose.model<IUser>('User', userSchema)