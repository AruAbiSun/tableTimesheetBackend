// Models/timesheetSchema.js
import mongoose from "mongoose";

const timesheetSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  leaveType: { type: String, default: "" },
  workingHours: { type: [Number], default: [] },
  leaveHours: { type: [Number], default: [] },
  totalHours: { type: Number, default: 0 },
  dateRange: { type: String, required: true },
});

export default mongoose.model("Timesheet", timesheetSchema);
