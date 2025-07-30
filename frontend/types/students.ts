export interface OrderItem {
  file: string;
  size: string;
  item_id: string;
  item_name: string;
  status: string;
  startDate: string;
  endDate: string;
}

export interface StudentsTableProps {
  initialStudents?: Student[];
}
export interface AttireRequest {
  id: string;
  student_id: string;
  attire_id: string;
  status: string; // Defaults to "Pending"
  use_start_date: string;
  use_end_date: string;
  pickup_date?: string;
  return_date?: string;
  notes?: string;
  buffer?: number;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  order_items?: any[];
  status: string;
  created_at: string;
  updated_at?: string;
  // Add the attire_requests property for joined data
  attire_requests?: AttireRequest[];
}
