import { processPDF } from './pdf-processor';
import { processDOCX } from './docx-processor';
import { DocumentType } from '../file-validator';

export interface ProcessingResult {
  text: string;
  success: boolean;
  error?: string;
}

export async function processDocument(
  file: File,
  documentType: DocumentType
): Promise<ProcessingResult> {
  try {
    let text: string;

    switch (documentType) {
      case DocumentType.PDF:
        text = await processPDF(file);
        break;
      case DocumentType.DOCX:
        text = await processDOCX(file);
        break;
      default:
        throw new Error('UNSUPPORTED_DOCUMENT_TYPE');
    }

    return { text, success: true };
  } catch (error) {
    console.error('Document processing error:', error);
    return {
      text: '',
      success: false,
      error: error instanceof Error ? error.message : 'PROCESSING_FAILED'
    };
  }
}
