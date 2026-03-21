//subjects
export enum subjects {
  billSubject = 'Factura Generada',
  areaSubject = 'Reserva de area común',
  registerSubject = 'bienvenida a ----',
  resetPasswordSubject = 'Reset de contraseña',
}

// mail's bodies in html format to be send it.
export const htmlBIlls = (
  amount: number,
  due_date: Date,
  year: string,
  month: string,
  gas_pic: string,
) => {
  const formattedDate = new Date(due_date).toLocaleDateString('es-DO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  return ` 
  <div style="font-family: Arial, sans-serif; line-height: 1.5;">
    <h2>🧾 Factura generada</h2>

    <p>Estimado usuario,</p>

    <p>Se ha generado su factura con los siguientes detalles:</p>

    <ul>
      <li><strong>Monto:</strong> $${amount}</li>
      <li><strong>Fecha límite de pago:</strong> ${formattedDate}</li>
      <li><strong>Año:</strong> ${year}</li>
      <li><strong>Mes:</strong> ${month}</li>
    </ul>

    <p><strong>Lectura de gas:</strong></p>
    <img src="${gas_pic}" alt="Lectura de gas" style="max-width: 300px; border-radius: 8px;" />

    <br/><br/>

    <p>Por favor, realice el pago antes de la fecha límite.</p>

    <p>Saludos,<br/>Administración</p>
  </div>
`
}

export const htmlSchedule = (
  date: Date,
  startTime: string,
  endTime: string,
) => {
  const formattedDate = new Date(date).toLocaleDateString('es-DO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  return `
  <div style="font-family: Arial, sans-serif; line-height: 1.5;">
    <h2 style="color: #333;">📅 Reserva confirmada</h2>

    <p>Hola,</p>

    <p>
      Su reserva ha sido registrada exitosamente con los siguientes detalles:
    </p>

    <ul>
      <li><strong>Fecha:</strong> ${formattedDate}</li>
      <li><strong>Hora de inicio:</strong> ${startTime}</li>
      <li><strong>Hora de término:</strong> ${endTime}</li>
    </ul>

    <p>
      Si necesita realizar algún cambio, por favor comuníquese con la administración.
    </p>

    <br/>

    <p>Saludos,<br/>Equipo de Administración</p>
  </div>
`
}

export const registerHtml = (name: string, lastname: string) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      
      <h2 style="color: #2c3e50;">👋 Bienvenido a la plataforma</h2>

      <p>Hola <strong>${name} ${lastname}</strong>,</p>

      <p>
        Nos alegra informarte que tu cuenta ha sido creada exitosamente 🎉.
      </p>

      <p>
        Ya puedes acceder al sistema y comenzar a utilizar todas las funcionalidades disponibles.
      </p>

      <ul>
        <li>📄 Consultar tus facturas</li>
        <li>📅 Reservar áreas comunes</li>
        <li>📩 Recibir notificaciones importantes</li>
      </ul>

      <br/>

      <p>
        Si tienes alguna duda o necesitas ayuda, no dudes en contactarnos.
      </p>

      <p>
        Saludos,<br/>
        <strong>Equipo de Administración</strong>
      </p>

    </div>
  `
}
