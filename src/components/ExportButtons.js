import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ExportButtons = ({ schedule, days, timeSlots, semester }) => {
  const exportAsImage = () => {
    const element = document.querySelector('.schedule-grid-container');
    html2canvas(element).then(canvas => {
      const link = document.createElement('a');
      link.download = `USC-Schedule-${semester.replace(/\s/g, '-')}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const exportAsPDF = () => {
    const element = document.querySelector('.schedule-grid-container');
    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`USC-Schedule-${semester.replace(/\s/g, '-')}.pdf`);
    });
  };

  const exportAsCSV = () => {
    let csv = 'Subject Code,Subject Name,Day,Start Time,End Time,Units\n';
    schedule.forEach(item => {
      csv += `"${item.code}","${item.name}",${item.day},${item.startTime}:00,${item.endTime}:00,${item.units}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `USC-Schedule-${semester.replace(/\s/g, '-')}.csv`;
    link.click();
  };

  return (
    <div className="export-buttons">
      <button className="export-btn" onClick={exportAsImage}>
        📸 PNG
      </button>
      <button className="export-btn" onClick={exportAsPDF}>
        📄 PDF
      </button>
      <button className="export-btn" onClick={exportAsCSV}>
        📊 CSV
      </button>
    </div>
  );
};

export default ExportButtons;