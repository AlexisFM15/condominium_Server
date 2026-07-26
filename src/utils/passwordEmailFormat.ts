export const registerCredentialsHtml = (
  name: string,
  lastname: string,
  temporaryPassword: string,
) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">

      <h2 style="color: #2c3e50;">Bienvenido al sistema</h2>

      <p>Estimado(a) <strong>${name} ${lastname}</strong>,</p>

      <p>
        Le informamos que su cuenta ha sido creada exitosamente y ya puede acceder al sistema.
      </p>

      <p>
        Para su primer inicio de sesión, utilice la siguiente contraseña temporal:
      </p>

      <div style="background-color: #f5f5f5; border: 1px solid #ddd; padding: 15px; border-radius: 6px;">
        <strong>Contraseña temporal:</strong> ${temporaryPassword}
      </div>

      <br/>

      <p>
        Por motivos de seguridad, deberá cambiar esta contraseña inmediatamente
        después de iniciar sesión por primera vez.
      </p>

      <p>
        Si presenta algún inconveniente para acceder al sistema o necesita asistencia,
        comuníquese con el equipo de administración.
      </p>

      <br/>

      <p>
        Atentamente,<br/>
        <strong>Equipo de Administración</strong>
      </p>

    </div>
  `
}