import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY

const resend = new Resend(resendApiKey)

export const sendBillEmail = async (
  subject: string,
  user: string,
  html: string,
) => {
  await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: [user],
    subject: subject,
    html: html,
  })
}
