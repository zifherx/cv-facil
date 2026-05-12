import { Document, model, Model, models, Schema } from "mongoose"

export interface IUserDocument extends Document {
  email: string
  passwordHash: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "users",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

UserSchema.index({ createdAt: -1 })

export const UserModel: Model<IUserDocument> =
  models.User ?? model<IUserDocument>("User", UserSchema)
