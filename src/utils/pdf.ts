import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
export async function exportPreviewToPDF(el: HTMLElement, filename='invoice.pdf') {
  const pdf = new jsPDF('p','mm','a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff' })
  const imgData = canvas.toDataURL('image/png')
  const imgWidth = pageWidth
  const imgHeight = canvas.height * (imgWidth / canvas.width)
  let heightLeft = imgHeight, position = 0
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST')
  heightLeft -= pageHeight
  while (heightLeft > 0) {
    pdf.addPage(); position = -heightLeft
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST')
    heightLeft -= pageHeight
  }
  pdf.save(filename)
}
