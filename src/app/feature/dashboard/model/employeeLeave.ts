import { Employee } from "./employee";
import { LeaveType } from "./leaveType";


export class EmployeeLeave {
  leaveId: number;
  employeeId: String;
  leaveTypeDTO: LeaveType;
  leaveReason: string;
  fromDate: Date;
  toDate: Date;
  deniedReason: string;
  status: string;
  createdAt: Date;
  reviewedBy: String;
}
