import { Document, model, Model, models, Schema, Types } from "mongoose"

const AddressSchema = new Schema(
  {
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    postalCode: { type: String, default: "" },
    country: { type: String, default: "" },
  },
  {
    _id: false,
    versionKey: false,
    timestamps: true,
  }
)

export interface IProfileDocument extends Document {
  userId: Types.ObjectId
  firstName: string
  lastName: string
  email: string
  phone: string
  avatarUrl: string | null
  address: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  createdAt: Date
  updatedAt: Date
}

const ProfileSchema = new Schema<IProfileDocument>(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    avatarUrl: { type: String, default: null },
    address: { type: AddressSchema, default: {} },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "profiles",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

export const ProfileModel: Model<IProfileDocument> =
  models.Profile ?? model<IProfileDocument>("Profile", ProfileSchema)
