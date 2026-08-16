export enum Rol {
  ADMIN = 'Administrador',
  CONDOMINIUM = 'Condomino',
  OPERATOR = 'Operador',
}

export enum BillStatus {
  PAID = 'Pagado',
  PENDING = 'Pendiente',
  OVERDUE = 'Vencida',
  DRAFT = 'Borrador',
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

export enum Payment_type {
  BILL = 'Factura',
  MAINTENANCE = 'Mantenimiento',
  SERVICES = 'Servicio',
  OTROS = 'Otros',
}

export enum StatusSchedule {
  CANCEL = 'Cancelada',
  PENDING = 'Pendiente',
  DONE = 'Completada', // reservation dealt
}

export enum MovemntType {
  EXPENSES = 'Gasto',
  INCOME = 'Ingreso',
}

export enum PollStatus {
  OPEN = 'Abierta',
  CLOSE = 'CERRADA',
}

export enum VoteType {
  FAVOR = 'A favor',
  AGAINST = 'En contra',
}