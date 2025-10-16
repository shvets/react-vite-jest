import React, { useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { RowData } from '../types/data';

// Define the component's props with callbacks for both outcomes
export interface DownloadExcelProps<T extends RowData> {
  data: T[];
  fileName: string;
  sheetName?: string;
  onDownloadSaved?: () => void;
  onDownloadCanceled?: () => void;
}

const DownloadExcelButton = <T extends RowData>({
  data,
  fileName,
  sheetName = 'Sheet1',
  children,
  onDownloadSaved,
  onDownloadCanceled,
}: React.PropsWithChildren<DownloadExcelProps<T>>) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadWithPicker = async (blob: Blob) => {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [{
          description: 'Excel Files',
          accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
        }],
      });
      const writableStream = await handle.createWritable();
      await writableStream.write(blob);
      await writableStream.close();
      onDownloadSaved?.(); // Success callback
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Download canceled by user.');
        onDownloadCanceled?.(); // Canceled callback
      } else {
        console.error('Error with showSaveFilePicker:', err);
        alert('An unexpected error occurred during download.');
      }
    }
  };

  const downloadWithFallback = (blob: Blob) => {
    console.warn('showSaveFilePicker is not supported. Falling back to file-saver.');
    saveAs(blob, fileName);
    onDownloadSaved?.(); // Can only fire initiated callback on fallback
  };

  const handleDownload = async () => {
    if (data.length === 0) {
      console.warn("No data to export.");
      return;
    }

    setIsDownloading(true);

    try {
      // 1. Create the workbook and convert to a blob
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(sheetName);
      const headers = Object.keys(data || {});
      worksheet.columns = headers.map((header) => ({ header, key: header, width: 20 }));
      worksheet.addRows(data);
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      // 2. Feature-detect and call the appropriate download function
      if ('showSaveFilePicker' in window) {
        await downloadWithPicker(blob);
      } else {
        downloadWithFallback(blob);
      }
    } catch (error) {
      console.error("Failed to generate the Excel file:", error);
      alert("There was an error generating your file. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button onClick={handleDownload} disabled={isDownloading}>
      {isDownloading ? 'Preparing...' : children}
    </button>
  );
};

export default DownloadExcelButton;
