import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export async function processPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const task = pdfjsLib.getDocument({ data: arrayBuffer });
  try {
    const pdf = await task.promise;
    const textParts: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      textParts.push(textContent.items.map((item) => 'str' in item ? item.str : '').join(' '));
    }
    return textParts.join('\n\n');
  } finally {
    await task.destroy();
  }
}
