import mammoth from 'mammoth';

export async function processDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });

  if (result.messages.length > 0) {
    console.warn('DOCX processing warnings:', result.messages);
  }

  return result.value;
}
