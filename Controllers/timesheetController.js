import Timesheet from "../Models/timesheetSchema.js";

export const getTimesheet = async (req, res) => {
  try {
    if (!req.employee || !req.employee._id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Employee not authenticated" });
    }
    const employeeId = req.employee._id;
    const { dateRange } = req.query;
    console.log("Received dateRange:", dateRange);
    const timesheets = await Timesheet.findOne({ employeeId, dateRange });
    res
      .status(200)
      .json({ message: "Timesheets fetched successfully", data: timesheets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching timesheets" });
  }
};

export const addOrUpdateTimesheet = async (req, res) => {
  try {
    const { leaveType, workingHours, leaveHours, selectedMonthRange } =
      req.body;

    if (!req.employee || !req.employee._id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Employee not authenticated" });
    }

    const employeeId = req.employee._id;

    const calculatedTotalHours = workingHours.reduce((total, hour, index) => {
      return total + (Number(hour) || 0) + (Number(leaveHours[index]) || 0);
    }, 0);

    const existingTimesheet = await Timesheet.findOne({
      employeeId,
      dateRange: selectedMonthRange,
    });
    if (existingTimesheet) {
      existingTimesheet.leaveType = leaveType;
      existingTimesheet.workingHours = workingHours;
      existingTimesheet.leaveHours = leaveHours;
      existingTimesheet.totalHours = calculatedTotalHours;
      await existingTimesheet.save();
      return res.status(200).json({
        message: "Timesheet updated successfully",
        data: existingTimesheet,
      });
    }

    const newTimesheet = new Timesheet({
      employeeId,
      leaveType,
      workingHours,
      leaveHours,
      totalHours: calculatedTotalHours,
      dateRange: selectedMonthRange,
    });
    await newTimesheet.save();
    res
      .status(201)
      .json({ message: "Timesheet added successfully", data: newTimesheet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding or updating timesheet" });
  }
};
