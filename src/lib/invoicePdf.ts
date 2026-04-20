'use client'

import { jsPDF } from 'jspdf'
import { COMPANY } from '@/lib/brand'

export interface InvoiceLine {
  description: string
  quantity: number
  unit_price: number
  line_total: number
}

export interface InvoicePayload {
  invoice_number: string
  issued_at: string | Date
  customer_name: string
  customer_loc?: string
  customer_num?: string
  order_no?: string
  rep?: string
  fob?: string
  payment_method?: string
  items: InvoiceLine[]
  subtotal: number
  vat_rate: number
  vat_amount: number
  total: number
}

const fmt = (n: number) =>
  Number(n || 0).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/**
 * Draws the Intelet Enterprise invoice on an A4 page (RECEIPT / INVOICE
 * header boxes, Customer + Misc blocks, itemised table, SubTotal/Total
 * column, payment box, rules footer, tagline).
 */
export function downloadInvoicePdf(inv: InvoicePayload) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = 210
  const H = 297
  const M = 14
  const contentW = W - M * 2

  // ── Top-right RECEIPT | INVOICE header ─────────────────────────
  const hdrY = 24
  const hdrH = 10
  const hdrW = 42
  doc.setLineWidth(0.5)
  // horizontal rule across top
  doc.line(M, hdrY, W - M, hdrY)
  // RECEIPT box
  doc.rect(W - M - hdrW * 2, hdrY - hdrH, hdrW, hdrH)
  doc.setFillColor(0, 0, 0)
  doc.rect(W - M - hdrW * 2, hdrY - hdrH, hdrW, hdrH, 'F')
  doc.setTextColor(255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text('RECEIPT', W - M - hdrW * 2 + 6, hdrY - 2.5)
  // INVOICE box
  doc.setFillColor(0, 0, 0)
  doc.rect(W - M - hdrW, hdrY - hdrH, hdrW, hdrH, 'F')
  doc.setTextColor(255)
  doc.text('INVOICE', W - M - hdrW + 6, hdrY - 2.5)
  doc.setTextColor(0)

  // ── Customer + Misc blocks ────────────────────────────────────
  const blockY = hdrY + 4
  const blockH = 28
  const colW = contentW / 2 - 3

  // Customer block (left)
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8)
  // label tab
  doc.rect(M, blockY, 24, 4.5)
  doc.text('Customer', M + 2, blockY + 3.2)
  // block border
  doc.rect(M, blockY + 4.5, colW, blockH - 4.5)
  // field labels
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5)
  doc.text('NAME', M + 2, blockY + 10)
  doc.text('Loc',  M + 2, blockY + 16)
  doc.text('NUM',  M + 2, blockY + 22)
  // values + underlines
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9)
  const drawVal = (label: string, val: string, y: number) => {
    doc.text(val || '', M + 16, y)
    doc.line(M + 16, y + 0.8, M + colW - 3, y + 0.8)
  }
  drawVal('NAME', (inv.customer_name || '').toUpperCase(), blockY + 10)
  drawVal('Loc',  inv.customer_loc || '',                   blockY + 16)
  drawVal('NUM',  inv.customer_num || '',                   blockY + 22)

  // Misc block (right)
  const mx = M + colW + 6
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8)
  doc.rect(mx, blockY, 18, 4.5)
  doc.text('Misc', mx + 2, blockY + 3.2)
  doc.rect(mx, blockY + 4.5, colW, blockH - 4.5)
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5)
  doc.text('Order No.', mx + 2, blockY + 16)
  doc.text('Rep',       mx + 2, blockY + 22)
  doc.text('FOB',       mx + 2, blockY + 28)
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9)
  const d = new Date(inv.issued_at)
  const dateStr = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear().toString().slice(-2)}`
  // Date top-right of misc block
  doc.text(dateStr, mx + colW - 22, blockY + 10)
  doc.line(mx + colW - 26, blockY + 10.8, mx + colW - 3, blockY + 10.8)
  const drawMisc = (val: string, y: number) => {
    doc.text(val || '', mx + 22, y)
    doc.line(mx + 22, y + 0.8, mx + colW - 3, y + 0.8)
  }
  drawMisc(inv.order_no || '', blockY + 16)
  drawMisc(inv.rep || '',      blockY + 22)
  drawMisc(inv.fob || 'ACC',   blockY + 28)

  // ── Items table ───────────────────────────────────────────────
  const tblY = blockY + blockH + 4
  const rowH = 6
  // column widths
  const cNum = 10, cItem = 110, cPrice = 30, cTotal = contentW - cNum - cItem - cPrice
  // header strip
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5)
  doc.rect(M, tblY, contentW, rowH)
  doc.text('TOTAL GH¢', M + cNum + cItem + cPrice + 4, tblY + 4)
  // body box
  const bodyH = 140
  doc.rect(M, tblY + rowH, contentW, bodyH)
  // column dividers
  doc.line(M + cNum, tblY, M + cNum, tblY + rowH + bodyH)
  doc.line(M + cNum + cItem, tblY, M + cNum + cItem, tblY + rowH + bodyH)
  doc.line(M + cNum + cItem + cPrice, tblY, M + cNum + cItem + cPrice, tblY + rowH + bodyH)

  // rows
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10)
  inv.items.slice(0, 18).forEach((it, i) => {
    const y = tblY + rowH + 5 + i * rowH
    doc.text(String(it.quantity), M + 2, y)
    doc.text((it.description || '').slice(0, 60), M + cNum + 2, y)
    doc.text(fmt(it.unit_price), M + cNum + cItem + cPrice - 2, y, { align: 'right' })
    doc.text(fmt(it.line_total), M + contentW - 2, y, { align: 'right' })
  })

  // ── Totals column ─────────────────────────────────────────────
  const totY = tblY + rowH + bodyH + 4
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9)
  doc.rect(M + cNum + cItem + cPrice, totY, cTotal, 7)
  doc.text('SubTotal', M + cNum + cItem + 2, totY + 5)
  doc.text(fmt(inv.subtotal), M + contentW - 2, totY + 5, { align: 'right' })

  // VAT row (extra, since our system applies VAT)
  doc.rect(M + cNum + cItem + cPrice, totY + 7, cTotal, 7)
  doc.setFont('helvetica', 'normal')
  doc.text(`VAT (${inv.vat_rate}%)`, M + cNum + cItem + 2, totY + 12)
  doc.text(fmt(inv.vat_amount), M + contentW - 2, totY + 12, { align: 'right' })

  doc.rect(M + cNum + cItem + cPrice, totY + 14, cTotal, 8)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text(fmt(inv.total), M + contentW - 2, totY + 20, { align: 'right' })

  // ── Payment block ─────────────────────────────────────────────
  const payY = totY
  const payH = 26
  const payW = 92
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8)
  doc.rect(M, payY, 22, 4.5)
  doc.text('Payment', M + 2, payY + 3.2)
  doc.rect(M + 22, payY, 30, 4.5)
  doc.setFont('helvetica', 'normal')
  doc.text(inv.payment_method || 'Cash', M + 24, payY + 3.2)
  doc.rect(M, payY + 4.5, payW, payH - 4.5)
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5)
  doc.text('CUSTOMER:', M + 2, payY + 10)
  doc.text('NAME:',     M + 2, payY + 15)
  doc.text('SIGN:',     M + 2, payY + 20)
  doc.text('DATE:',     M + 2, payY + 25)
  doc.setFont('helvetica', 'normal')
  doc.line(M + 22, payY + 15.5, M + payW - 3, payY + 15.5)
  doc.line(M + 22, payY + 20.5, M + payW - 3, payY + 20.5)
  doc.line(M + 22, payY + 25.5, M + payW - 3, payY + 25.5)

  // ── Rules footer ──────────────────────────────────────────────
  const rulesY = payY + payH + 6
  doc.setLineWidth(1.2)
  doc.line(M, rulesY, W - M, rulesY)
  doc.line(M, rulesY + 18, W - M, rulesY + 18)
  // black square
  doc.setFillColor(0, 0, 0); doc.rect(M, rulesY + 2, 4, 14, 'F')
  doc.setFont('helvetica', 'italic'); doc.setFontSize(7.5)
  const rules =
    "TERMS & CONDITIONS... 1) GOODS SOLD ARE NOT RETURNABLE ONCE RECEIVED IN GOOD CONDITION...2) A 12-MONTH MANUFACTURER WARRANTY " +
    "COVERS FACTORY DEFECTS; MISUSE, POWER SURGES AND PHYSICAL DAMAGE ARE EXCLUDED...3) PLEASE TEST YOUR APPLIANCE AT DELIVERY / COLLECTION " +
    "AND INSPECT FOR ANY COSMETIC ISSUES...4) INSTALLATION IS AVAILABLE ON REQUEST AT AN ADDITIONAL COST. WE THANK YOU FOR CHOOSING INTELET ENTERPRISE."
  const split = doc.splitTextToSize(rules, contentW - 10)
  doc.text(split, M + 6, rulesY + 5)

  // ── Tagline ───────────────────────────────────────────────────
  doc.setFont('helvetica', 'italic'); doc.setFontSize(8.5)
  doc.text(COMPANY.tagline, W / 2, rulesY + 24, { align: 'center' })
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5)
  doc.text(
    `${COMPANY.address.full} · ${COMPANY.phones.primaryFmt} / ${COMPANY.phones.secondaryFmt}`,
    W / 2, rulesY + 28, { align: 'center' },
  )

  // ── Invoice number (subtle, top-left — keeps paper layout intact) ─
  doc.setFont('helvetica', 'bold'); doc.setFontSize(7)
  doc.setTextColor(120)
  doc.text(`# ${inv.invoice_number}`, M, 10)
  doc.setTextColor(0)

  doc.save(`${inv.invoice_number}.pdf`)
}
