import { Document, model, Model, models, Schema, Types } from "mongoose"

const NotificationPrefsSchema = new Schema(
  {
    messages: { type: Boolean, default: true },
    jobAlerts: { type: Boolean, default: false },
    newsletter: { type: Boolean, default: false },
    offersAndRecommendations: { type: Boolean, default: false },
  },
  {
    _id: false,
    versionKey: false,
  }
)

export interface IAccountDocument extends Document {
  userId: Types.ObjectId
  email: string
  notificationPreferences: {
    messages: boolean
    jobAlerts: boolean
    newsletter: boolean
    offersAndRecommendations: boolean
  }
  createdAt: Date
  updatedAt: Date
}

const AccountSchema = new Schema<IAccountDocument>(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    notificationPreferences: {
      type: NotificationPrefsSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "accounts",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

export const AccountModel: Model<IAccountDocument> =
  models.Account ?? model<IAccountDocument>("Account", AccountSchema)
