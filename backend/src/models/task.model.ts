import { Schema, model, Document, Types } from "mongoose";

export type TaskStatus = "pending" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface ITask extends Document {
    title: string;
    description?: string;
    project: Types.ObjectId;
    assignee?: Types.ObjectId;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
    {
        title: { type: String, required: true },
        description: String,
        project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
        assignee: { type: Schema.Types.ObjectId, ref: "User" },
        status: {
            type: String,
            enum: ["pending", "in_progress", "completed"],
            default: "pending"
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium"
        },
        dueDate: Date
    },
    {
        timestamps: true
    }
);

export const Task = model<ITask>("Task", taskSchema);
