export enum Rol {
  ADMIN = 'Administrador',
  CONDOMINIUM = 'condomino',
}

export enum BillStatus {
  PAID = 'Pagado',
  PENDING = 'Pendiente',
  OVERDUE = 'Vencida',
}

export enum occupancyType {
  TENANT = 'Alquiler',
  OWNER = 'Propietario',
  VACANT = 'Vacante',
}

export enum Payment_Method {
  CASH = 'Efectivo',
  TRANSFER = 'Transferencia',
  CHECK = 'Cheque',
}

export enum StatusSchedule {
  PENDING = 'Pendiente',
  DONE = 'Completada', // reservation dealt
  FINISHED = 'Terminada',
}

export enum MovemntType {
  EXPENSES = 'Gasto',
  INCOME = 'Ingreso',
}
