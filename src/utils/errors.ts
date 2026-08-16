export class CustomError extends Error {
  statusCode: number

  constructor(statusCode: number, message?: string) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class UserNotFound extends CustomError {
  constructor() {
    super(404, 'No se encontró el usuario')
  }
}

export class IncorrectPassword extends CustomError {
  constructor() {
    super(401, 'Contraseña incorrecta')
  }
}
