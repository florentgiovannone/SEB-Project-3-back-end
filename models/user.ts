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
    password: string,
    image: string
    lastPasswordChange: Date,
    myCave: [{
        _id: number,
        winery: string,
        wineName: string,
        region: string,
        country: string,
        style: string,
        vintage: number,
        grapes: string,
        image: string
        

        }]
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
    image: { type: String, required: true },

    lastPasswordChange: { type: Date, default: Date.now },

    myCave:[{ 
        winery: { type: String, required: true },
        wineName: { type: String, required: true },
        region: { type: String, required: true },
        country: { type: String, required: true },
        style: { type: String, required: true },
        vintage: { type: Number, required: true },
        grapes: { type: String, required: true },
        image: { type: String, required: false },
    }]
})

userSchema.pre('save', function hashPassword(next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync());
        this.lastPasswordChange = new Date();
    }
    next();
});

export function validatePassword(loginPlaintextPassword: string, originalHashedPassword: string) {
    return bcrypt.compareSync(loginPlaintextPassword, originalHashedPassword);
}

export function checkPasswords(password: string, passwordConfirmation: string) {
    return password === passwordConfirmation
}

userSchema.plugin(mongooseHidden({ defaultHidden: { password: true, } }))
userSchema.plugin(uniqueValidator)

export default mongoose.model<IUser>('User', userSchema)