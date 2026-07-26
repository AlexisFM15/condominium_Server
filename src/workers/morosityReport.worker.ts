import { CronJob } from 'cron'
import fs from 'fs'
import path from 'path'
import PDFDocument from 'pdfkit'
import database from '../config/database.js'
import { billService } from '../services/bill.service.js'

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const MONTHS_SHORT = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
]

const generateMorosityReport = async () => {
  const today = new Date()
  const year = `${today.getFullYear()}`

  const unpaidBills = await billService.findUnpaidLastBills()

  // dedupe by apartment, en caso de que exista más de una factura pendiente por apartamento
  const apartmentsMap = new Map<number, (typeof unpaidBills)[number]['apartment']>()
  for (const bill of unpaidBills) {
    if (bill.apartment && !apartmentsMap.has(bill.apartment.id)) {
      apartmentsMap.set(bill.apartment.id, bill.apartment)
    }
  }
  const apartments = [...apartmentsMap.values()]

  if (apartments.length === 0) {
    console.log('No hay apartamentos morosos, no se genera el reporte')
    return
  }

  // arma la matriz apartamento -> mes -> estado
  const matrix: Record<number, string[]> = {}

  for (const apa of apartments) {
    const bills = await billService.findByApartmentAndYear(apa.id, year)
    const row = MONTHS.map((monthName) => {
      const bill = bills.find((b) => b.month === monthName)
      return bill ? bill.status : '-'
    })
    matrix[apa.id] = row
  }

  // genera el pdf
  const reportsDir = path.join(process.cwd(), 'reports')
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true })
  }

  const fileName = `morosos-${year}-${String(today.getMonth() + 1).padStart(2, '0')}.pdf`
  const filePath = path.join(reportsDir, fileName)

  const doc = new PDFDocument({ margin: 30, layout: 'landscape', size: 'A4' })
  doc.pipe(fs.createWriteStream(filePath))

  doc.fontSize(16).text(`Reporte de morosidad - ${year}`, { align: 'center' })
  doc.moveDown(1)

  const firstColWidth = 140
  const otherColsWidth = (doc.page.width - doc.page.margins.left - doc.page.margins.right - firstColWidth) / 12
  const rowHeight = 22

  const drawHeader = (y: number) => {
    let x = doc.page.margins.left
    doc.fontSize(9).font('Helvetica-Bold')
    doc.rect(x, y, firstColWidth, rowHeight).stroke()
    doc.text('Apartamento', x + 4, y + 6, { width: firstColWidth - 8 })
    x += firstColWidth

    for (const m of MONTHS_SHORT) {
      doc.rect(x, y, otherColsWidth, rowHeight).stroke()
      doc.text(m, x + 2, y + 6, { width: otherColsWidth - 4, align: 'center' })
      x += otherColsWidth
    }
  }

  let y = doc.y
  drawHeader(y)
  y += rowHeight

  doc.font('Helvetica').fontSize(8)

  for (const apa of apartments) {
    if (y + rowHeight > doc.page.height - doc.page.margins.bottom) {
      doc.addPage()
      y = doc.page.margins.top
      drawHeader(y)
      y += rowHeight
      doc.font('Helvetica').fontSize(8)
    }

    let x = doc.page.margins.left
    const label = `${apa.building?.name ?? ''} - Apto ${apa.number}`

    doc.rect(x, y, firstColWidth, rowHeight).stroke()
    doc.text(label, x + 4, y + 6, { width: firstColWidth - 8 })
    x += firstColWidth

    const row = matrix[apa.id] ?? []
    for (const status of row) {
      doc.rect(x, y, otherColsWidth, rowHeight).stroke()
      doc.text(status, x + 2, y + 6, { width: otherColsWidth - 4, align: 'center' })
      x += otherColsWidth
    }

    y += rowHeight
  }

  doc.end()

  console.log(`Reporte de morosidad generado: ${filePath}`)
}

const morosityReportWorker = async () => {
  if (!database.appDataSource.isInitialized) {
    await database.initializeDB()
  }

  try {
    const job = CronJob.from({
      cronTime: '0 2 2 * *', // día 2 de cada mes, a las 2:00am
      onTick: async () => {
        try {
          await generateMorosityReport()
        } catch (error) {
          console.log(error)
        }
      },
      start: true,
      timeZone: 'America/Santo_Domingo',
    })
    return job
  } catch (error) {
    console.log(error)
  }
}

// morosityReportWorker() // cron real, comentado para prueba

// SOLO PARA PROBAR - borra esto después:
;(async () => {
  await database.initializeDB()
  await generateMorosityReport()
  process.exit(0)
})()