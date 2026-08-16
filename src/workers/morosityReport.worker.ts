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

const HEADER_BLUE = '#37426d'
const RED_TEXT = '#dc2626'



const drawPageBorder = (doc: PDFKit.PDFDocument) => {
  const margin = 15
  doc
    .lineWidth(2)
    .rect(margin, margin, doc.page.width - margin * 2, doc.page.height - margin * 2)
    .stroke()

  doc.lineWidth(0.75)
  doc
    .rect(margin + 4, margin + 4, doc.page.width - (margin + 4) * 2, doc.page.height - (margin + 4) * 2)
    .stroke()

  doc.lineWidth(1) // resetea el grosor para el resto del contenido
}

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
      const bill = bills.find((b) => b.month.toLowerCase() === monthName.toLowerCase())
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

 const doc = new PDFDocument({ margin: 40, layout: 'landscape', size: 'A4' })
  const stream = fs.createWriteStream(filePath)
  doc.pipe(stream)

  drawPageBorder(doc)

  doc.font('Helvetica-Bold').fontSize(24).text(`Reporte de morosidad - ${year}`, { align: 'center' })
  doc.moveDown(1.5)

  const firstColWidth = 140
  const otherColsWidth = (doc.page.width - doc.page.margins.left - doc.page.margins.right - firstColWidth) / 12
  const rowHeight = 22

const drawHeader = (y: number) => {
    let x = doc.page.margins.left
    doc.fontSize(9).font('Helvetica-Bold')

    // celda "Apartamento"
    doc.rect(x, y, firstColWidth, rowHeight).fillAndStroke(HEADER_BLUE, 'black')
    doc.fillColor('white').text('Apartamento', x + 4, y + 6, { width: firstColWidth - 8 })
    x += firstColWidth

    for (const m of MONTHS_SHORT) {
      doc.rect(x, y, otherColsWidth, rowHeight).fillAndStroke(HEADER_BLUE, 'black')
      doc.fillColor('white').text(m, x + 2, y + 6, { width: otherColsWidth - 4, align: 'center' })
      x += otherColsWidth
    }

    doc.fillColor('black')
  }

  let y = doc.y
  drawHeader(y)
  y += rowHeight

  doc.font('Helvetica').fontSize(8)

  for (const apa of apartments) {
   if (y + rowHeight > doc.page.height - doc.page.margins.bottom) {
      doc.addPage()
      drawPageBorder(doc)
      y = doc.page.margins.top
      drawHeader(y)
      y += rowHeight
      doc.font('Helvetica').fontSize(8)
    }

   let x = doc.page.margins.left
    const label = `${apa.building?.name ?? ''} - Apto ${apa.number}`

    // celda del nombre del apartamento, fondo azul y texto blanco
    doc.rect(x, y, firstColWidth, rowHeight).fill(HEADER_BLUE)
    doc.font('Helvetica-Bold').fillColor('white')
    doc.text(label, x + 4, y + 6, { width: firstColWidth - 8 })
    x += firstColWidth

    const row = matrix[apa.id] ?? []
    for (const status of row) {
      const isPendiente = status === 'Pendiente'

      doc.rect(x, y, otherColsWidth, rowHeight).stroke()

      if (isPendiente) {
        doc.font('Helvetica-Bold').fillColor(RED_TEXT)
      } else {
        doc.font('Helvetica').fillColor('black')
      }

      doc.text(status, x + 2, y + 6, { width: otherColsWidth - 4, align: 'center' })
      x += otherColsWidth
    }

    doc.font('Helvetica').fillColor('black') // resetea para la siguiente fila
    y += rowHeight
  }

 doc.end()

  await new Promise<void>((resolve, reject) => {
    stream.on('finish', () => resolve())
    stream.on('error', reject)
  })

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

 morosityReportWorker() 

