import * as XLSX from 'xlsx';

export function exportToExcel(
  sheetsData: { sheetName: string; data: Record<string, unknown>[] }[],
  fileName: string = 'Database_Kebudayaan'
) {
  const wb = XLSX.utils.book_new();

  sheetsData.forEach(({ sheetName, data }) => {
    if (data && data.length > 0) {
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 30));
    } else {
      const ws = XLSX.utils.aoa_to_sheet([['Data Kosong']]);
      XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 30));
    }
  });

  const timestamp = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `${fileName}_${timestamp}.xlsx`);
}

export function triggerPrintReport(reportTitle: string, htmlContent: string) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Pop-up terblokir. Silakan izinkan pop-up untuk mencetak laporan.');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${reportTitle}</title>
        <style>
          @media print {
            @page { size: A4 portrait; margin: 15mm; }
            body { font-family: 'Times New Roman', Times, serif; color: #000; background: #fff; margin: 0; padding: 0; }
            .no-print { display: none; }
          }
          body { font-family: 'Times New Roman', Times, serif; margin: 20px; line-height: 1.4; color: #111; }
          .header-kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 12px; margin-bottom: 20px; position: relative; }
          .header-kop h3 { margin: 0; font-size: 16pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
          .header-kop h2 { margin: 2px 0; font-size: 18pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; }
          .header-kop p { margin: 0; font-size: 10pt; font-style: italic; }
          .report-title { text-align: center; margin: 20px 0 15px 0; font-size: 14pt; font-weight: bold; text-decoration: underline; text-transform: uppercase; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 10pt; }
          th, td { border: 1px solid #000; padding: 6px 8px; text-align: left; vertical-align: top; }
          th { background-color: #f2f2f2; font-weight: bold; text-align: center; }
          .signature-section { margin-top: 40px; float: right; width: 250px; text-align: center; font-size: 11pt; page-break-inside: avoid; }
          .signature-space { height: 70px; }
          .meta-info { font-size: 9pt; color: #555; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="header-kop">
          <h3>Pemerintah Provinsi Nusa Tenggara Barat</h3>
          <h2>Dinas Pendidikan dan Kebudayaan</h2>
          <p>Jl. Pejanggik No. 6, Mataram, Nusa Tenggara Barat | Telp: (0370) 633000 | Email: disdikbud@ntbprov.go.id</p>
        </div>
        
        <div class="report-title">${reportTitle}</div>
        <div class="meta-info">Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        
        ${htmlContent}

        <div class="signature-section">
          <div>Mengetahui,<br/><strong>Kepala Dinas Dikbud NTB</strong></div>
          <div class="signature-space"></div>
          <div><strong><u>Drs. H. Aidy Furqan, M.Pd.</u></strong><br/>NIP. 19681102 199403 1 001</div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
