import { Schema, model, Document, Types } from "mongoose";

export interface IProject extends Document {
    name: string;
    description?: string;
    owner: Types.ObjectId;
    collaborators: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
    {
        name: { type: String, required: true },
        description: { type: String },
        owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
        collaborators: [{ type: Schema.Types.ObjectId, ref: "User" }]
    },
    {
        timestamps: true
    }
);

export const Project = model<IProject>("Project", projectSchema);
