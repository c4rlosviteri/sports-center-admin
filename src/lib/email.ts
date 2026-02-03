import { Resend } from 'resend'
import { formatDateDDMMYYYY } from './date-utils'

let resendInstance: Resend | null = null
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@biciantro.com'

/**
 * Get or create Resend instance
 */
function getResend(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is required')
    }
    resendInstance = new Resend(apiKey)
  }
  return resendInstance
}

export type EmailTemplate =
  | 'booking_confirmation'
  | 'booking_cancellation'
  | 'package_expiration'
  | 'waitlist_promotion'

interface EmailData {
  to: string
  subject: string
  html: string
}

/**
 * Send an email using Resend
 */
async function sendEmail(data: EmailData): Promise<void> {
  try {
    const resend = getResend()
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: data.subject,
      html: data.html,
    })
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

/**
 * Generate booking confirmation email
 */
export function generateBookingConfirmationEmail(data: {
  firstName: string
  className: string
  scheduledAt: string
  instructor?: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reserva Confirmada</h1>
          </div>
          <div class="content">
            <p>Hola ${data.firstName},</p>
            <p>Tu reserva ha sido confirmada exitosamente.</p>
            <h3>Detalles de la clase:</h3>
            <ul>
              <li><strong>Clase:</strong> ${data.className}</li>
              <li><strong>Fecha y hora:</strong> ${new Date(data.scheduledAt).toLocaleString('es-EC', { timeZone: 'America/Guayaquil' })}</li>
              ${data.instructor ? `<li><strong>Instructor:</strong> ${data.instructor}</li>` : ''}
            </ul>
            <p>¡Te esperamos!</p>
          </div>
          <div class="footer">
            <p>Biciantro - Indoor Cycling</p>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Generate booking cancellation email
 */
export function generateBookingCancellationEmail(data: {
  firstName: string
  className: string
  scheduledAt: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #000; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reserva Cancelada</h1>
          </div>
          <div class="content">
            <p>Hola ${data.firstName},</p>
            <p>Tu reserva ha sido cancelada.</p>
            <h3>Detalles de la clase:</h3>
            <ul>
              <li><strong>Clase:</strong> ${data.className}</li>
              <li><strong>Fecha y hora:</strong> ${new Date(data.scheduledAt).toLocaleString('es-EC', { timeZone: 'America/Guayaquil' })}</li>
            </ul>
            <p>Esperamos verte pronto en otra clase.</p>
          </div>
          <div class="footer">
            <p>Biciantro - Indoor Cycling</p>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Generate package expiration warning email
 */
export function generatePackageExpirationEmail(data: {
  firstName: string
  packageName: string
  expiresAt: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Tu Paquete Está Por Expirar</h1>
          </div>
          <div class="content">
            <p>Hola ${data.firstName},</p>
            <p>Tu paquete <strong>${data.packageName}</strong> está por expirar el ${formatDateDDMMYYYY(data.expiresAt)}.</p>
            <p>Contacta con nosotros para renovar tu paquete y seguir disfrutando de nuestras clases.</p>
          </div>
          <div class="footer">
            <p>Biciantro - Indoor Cycling</p>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Generate waitlist promotion email
 */
export function generateWaitlistPromotionEmail(data: {
  firstName: string
  className: string
  scheduledAt: string
  instructor?: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Espacio Disponible!</h1>
          </div>
          <div class="content">
            <p>Hola ${data.firstName},</p>
            <p>¡Buenas noticias! Tu reserva en lista de espera ha sido confirmada.</p>
            <h3>Detalles de la clase:</h3>
            <ul>
              <li><strong>Clase:</strong> ${data.className}</li>
              <li><strong>Fecha y hora:</strong> ${new Date(data.scheduledAt).toLocaleString('es-EC', { timeZone: 'America/Guayaquil' })}</li>
              ${data.instructor ? `<li><strong>Instructor:</strong> ${data.instructor}</li>` : ''}
            </ul>
            <p>¡Te esperamos!</p>
          </div>
          <div class="footer">
            <p>Biciantro - Indoor Cycling</p>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmation(
  to: string,
  data: Parameters<typeof generateBookingConfirmationEmail>[0]
): Promise<void> {
  await sendEmail({
    to,
    subject: 'Reserva Confirmada - Biciantro',
    html: generateBookingConfirmationEmail(data),
  })
}

/**
 * Send booking cancellation email
 */
export async function sendBookingCancellation(
  to: string,
  data: Parameters<typeof generateBookingCancellationEmail>[0]
): Promise<void> {
  await sendEmail({
    to,
    subject: 'Reserva Cancelada - Biciantro',
    html: generateBookingCancellationEmail(data),
  })
}

/**
 * Send package expiration email
 */
export async function sendPackageExpiration(
  to: string,
  data: Parameters<typeof generatePackageExpirationEmail>[0]
): Promise<void> {
  await sendEmail({
    to,
    subject: 'Tu Paquete Está Por Expirar - Biciantro',
    html: generatePackageExpirationEmail(data),
  })
}

/**
 * Send waitlist promotion email
 */
export async function sendWaitlistPromotion(
  to: string,
  data: Parameters<typeof generateWaitlistPromotionEmail>[0]
): Promise<void> {
  await sendEmail({
    to,
    subject: '¡Espacio Disponible! - Biciantro',
    html: generateWaitlistPromotionEmail(data),
  })
}
