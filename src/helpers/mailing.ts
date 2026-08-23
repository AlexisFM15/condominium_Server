import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY!
const email =  process.env.DEFAULT_EMAIL!

const resend = new Resend(resendApiKey)

export const sendBillEmail = async (
  subject: string,
  user: string,
  html: string,
) => {
  await resend.emails.send({
    from: 'Mateo Genao <noreply@mateogenao.com>',
    to: [user],
    subject: subject,
    html: html,
  })
}
