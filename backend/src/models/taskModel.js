import mongoose from "mongoose";

const taskModel = new mongoose.Schema({
    title:{
        type:String,
        required:[true, "Task Title is required"],
        trim:true,
        minLength:[3, "Title should be more than 3 characters"],
        maxlength:[100, "Title cannot exceed 100 characters"]
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    pendingDeletionExpiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

taskModel.index({ title: 'text' });

export default mongoose.model('Task', taskModel);
