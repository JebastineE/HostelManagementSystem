export interface Student {
  studentId: number;
  name: string;
  email: string;
  phone: string;
  course: string;
  year: number;
}

export interface Hostel {
  hostelId: number;
  hostelName: string;
  hostelType: string;
  location: string;
  monthlyFee: number;
}

export interface Room {
  roomId: number;
  hostelId: number;
  roomNumber: string;
  capacity: number;
  occupancy: number;
}

export interface Allocation {
  allocationId: number;
  studentId: number;
  roomId: number;
  allocatedDate: string; // ISO date YYYY-MM-DD
  durationMonths: number;
}

export interface StudentRoomAllocation {
  allocationId: number;
  studentId: number;
  studentName: string;
  course: string;
  hostelName: string;
  hostelType: string;
  roomNumber: string;
  allocatedDate: string;
  durationMonths: number;
}

export interface AuditLog {
  auditId: number;
  action: 'INSERT' | 'UPDATE' | 'DELETE' | string;
  tableName: string;
  recordId: number;
  oldValue: string | null;
  newValue: string | null;
  changedAt: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalHostels: number;
  totalRooms: number;
  totalAllocations: number;
  totalCapacity: number;
  occupiedBeds: number;
  availableBeds: number;
  occupancyRate: number;
  recentAllocations: StudentRoomAllocation[];
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  durationMs?: number;
}
