export const maintenanceReceiptHtml = (
  ownerName: string,
  ownerLastname: string,
  receiptNumber: string,
  date: string,
  apartment: string,
  concept: string,
  period: string,
  amount: string,
  paymentMethod: string,
  paymentReference: string,
  paymentsMade: string[],
  accountStatusMessage: string,
) => {
  return `
    <div style="
      font-family: Arial, Helvetica, sans-serif;
      color: #111;
      background-color: #ffffff;
      padding: 20px;
      line-height: 1.5;
    ">

      <!-- ENCABEZADO -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0"
        style="max-width: 900px; margin: 0 auto;">

        <tr>
          <td valign="top" style="padding: 10px 0 35px 0;">

            <h1 style="
              margin: 0;
              font-size: 25px;
              color: #111;
              font-weight: 700;
            ">
              RECIBO DE PAGO – CUOTA DE MANTENIMIENTO
            </h1>

            <h2 style="
              margin: 4px 0 0 0;
              font-size: 21px;
              color: #111;
              font-weight: 700;
            ">
              Residencial The Garden
            </h2>

          </td>
        </tr>

      </table>


      <!-- INFORMACIÓN DEL RECIBO -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0"
        style="max-width: 900px; margin: 0 auto;">

        <tr>
          <td style="font-size: 18px; padding-bottom: 5px;">
            <strong>Recibo No.:</strong>
            <span style="text-decoration: underline;">
              ${receiptNumber}
            </span>
          </td>
        </tr>

        <tr>
          <td style="font-size: 18px; padding-bottom: 20px;">
            Fecha:
            <span style="text-decoration: underline;">
              ${date}
            </span>
          </td>
        </tr>

        <tr>
          <td style="font-size: 18px; padding-bottom: 5px;">
            <strong>Propietario:</strong>
            <span style="text-decoration: underline;">
              ${ownerName} ${ownerLastname}
            </span>
          </td>
        </tr>

        <tr>
          <td style="font-size: 18px; padding-bottom: 25px;">
            <strong>Unidad / Apartamento:</strong>
            <span style="text-decoration: underline;">
              ${apartment}
            </span>
          </td>
        </tr>

      </table>


      <!-- TABLA DE PAGO -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0"
        style="
          max-width: 900px;
          margin: 0 auto 25px auto;
          border-collapse: collapse;
          border: 1px solid #8da4c7;
        ">

        <tr style="background-color: #4677c7; color: #ffffff;">

          <th style="
            padding: 10px;
            font-size: 17px;
            border: 1px solid #8da4c7;
          ">
            Concepto
          </th>

          <th style="
            padding: 10px;
            font-size: 17px;
            border: 1px solid #8da4c7;
          ">
            Período
          </th>

          <th style="
            padding: 10px;
            font-size: 17px;
            border: 1px solid #8da4c7;
          ">
            Monto (RD$)
          </th>

        </tr>

        <tr style="background-color: #dce6f5;">

          <td align="center" style="
            padding: 12px;
            font-size: 16px;
            font-weight: bold;
            border: 1px solid #8da4c7;
          ">
            ${concept}
          </td>

          <td align="center" style="
            padding: 12px;
            font-size: 16px;
            font-weight: bold;
            border: 1px solid #8da4c7;
          ">
            ${period}
          </td>

          <td align="center" style="
            padding: 12px;
            font-size: 16px;
            font-weight: bold;
            border: 1px solid #8da4c7;
          ">
            RD$${amount}
          </td>

        </tr>

      </table>


      <!-- INFORMACIÓN DEL PAGO -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0"
        style="max-width: 900px; margin: 0 auto;">

        <tr>
          <td style="
            font-size: 17px;
            padding-bottom: 8px;
          ">
            <strong>Forma de pago:</strong>
            <span style="text-decoration: underline;">
              ${paymentMethod}
            </span>
          </td>
        </tr>

        <tr>
          <td style="
            font-size: 17px;
            padding-bottom: 25px;
          ">
            <strong>Referencia / Comprobante:</strong>
            <span style="text-decoration: underline;">
              ${paymentReference}
            </span>
          </td>
        </tr>

      </table>


      <!-- HISTORIAL DE PAGOS -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0"
        style="max-width: 900px; margin: 0 auto;">

        <tr>
          <td style="font-size: 17px; padding-bottom: 5px;">

            <strong style="text-decoration: underline;">
              NOTA:
            </strong>

            Los pagos que se han realizado en este año, son los siguientes:

          </td>
        </tr>

        <tr>
          <td>

            <ul style="
              margin-top: 5px;
              padding-left: 30px;
              font-size: 16px;
            ">

              ${paymentsMade
                .map(
                  (payment) => `
                    <li style="padding-bottom: 4px;">
                      ${payment}
                    </li>
                  `,
                )
                .join('')}

            </ul>

          </td>
        </tr>

      </table>


      <!-- ESTADO DE CUENTA -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0"
        style="max-width: 900px; margin: 0 auto;">

        <tr>
          <td style="padding: 10px 0 25px 0;">

            <span style="
              display: inline-block;
              background-color: #00ffff;
              padding: 3px 7px;
              font-size: 16px;
              font-weight: bold;
            ">
              ${accountStatusMessage}
            </span>

          </td>
        </tr>

      </table>


      <!-- PIE -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0"
        style="
          max-width: 900px;
          margin: 0 auto;
          background-color: #f5f5f5;
        ">

        <tr>
          <td style="
            padding: 18px;
            font-size: 15px;
            font-weight: bold;
            text-align: center;
          ">
            Este recibo corresponde a la cuota de mantenimiento
            en el Residencial The Garden.
          </td>
        </tr>

      </table>

    </div>
  `
}