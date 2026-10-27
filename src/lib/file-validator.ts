export enum DocumentType {
  PDF = 'pdf',
  DOCX = 'docx',
  TEXT = 'text',
  MARKDOWN = 'markdown'
}

export interface FileValidationResult {
  isValid: boolean;
  documentType?: DocumentType;
  error?: string;
}

const MIME_TYPE_MAP: Record<string, DocumentType> = {
  'application/pdf': DocumentType.PDF,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': DocumentType.DOCX,
  'text/plain': DocumentType.TEXT,
  'text/markdown': DocumentType.MARKDOWN,
};

const EXTENSION_MAP: Record<string, DocumentType> = {
  '.pdf': DocumentType.PDF,
  '.docx': DocumentType.DOCX,
  '.txt': DocumentType.TEXT,
  '.md': DocumentType.MARKDOWN,
};

export function validateFileType(file: File): FileValidationResult {
  // Primary: Check MIME type
  let documentType = MIME_TYPE_MAP[file.type];

  // Fallback: Check file extension
  if (!documentType) {
    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    documentType = EXTENSION_MAP[extension];
  }

  if (!documentType) {
    return { isValid: false, error: 'INVALID_FILE_TYPE' };
  }

  return { isValid: true, documentType };
}

export function validateFileSize(file: File, maxSizeBytes: number): boolean {
  return file.size <= maxSizeBytes;
}
