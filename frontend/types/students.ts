export interface OrderItem {
  file: string
  size: string
  item_id: string
  item_name: string
  status: string
}

export interface Student {
  id: string
  first_name: string
  last_name: string
  student_id: string
  email: string
  order_items: OrderItem[]
  status: string
  created_at: string
  updated_at: string
}

export interface StudentsTableProps {
  initialStudents?: Student[]
}
