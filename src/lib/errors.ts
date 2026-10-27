export enum ErrorCode {
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  PDF_PROCESSING_FAILED = 'PDF_PROCESSING_FAILED',
  DOCX_PROCESSING_FAILED = 'DOCX_PROCESSING_FAILED',
  DOC_EXTRACTION_FAILED = 'DOC_EXTRACTION_FAILED',
  EMPTY_CONTENT = 'EMPTY_CONTENT',
  PROCESSING_FAILED = 'PROCESSING_FAILED',
  WORKER_LOAD_FAILED = 'WORKER_LOAD_FAILED',
}

const ERROR_MESSAGES: Record<ErrorCode, string> = {
  FILE_TOO_LARGE: '파일 크기가 10MB를 초과합니다. 더 작은 파일을 선택해주세요.',
  INVALID_FILE_TYPE: '지원하지 않는 파일 형식입니다.\n\n지원 형식: TXT, MD, PDF, DOCX\n\n※ DOC 파일은 지원하지 않습니다. Word에서 DOCX 형식으로 저장 후 다시 업로드해주세요.',
  PDF_PROCESSING_FAILED: 'PDF 파일 처리 중 오류가 발생했습니다. 파일이 손상되었거나 암호화되어 있을 수 있습니다.',
  DOCX_PROCESSING_FAILED: 'DOCX 파일 처리 중 오류가 발생했습니다. 파일 형식을 확인해주세요.',
  DOC_EXTRACTION_FAILED: 'DOC 파일은 지원하지 않습니다.\n\nMicrosoft Word에서 파일을 열어 "다른 이름으로 저장" → "DOCX 형식"으로 저장한 후 다시 업로드해주세요.',
  EMPTY_CONTENT: '파일에서 텍스트를 찾을 수 없습니다. 스캔된 이미지 PDF이거나 빈 문서일 수 있습니다.',
  PROCESSING_FAILED: '파일 처리 중 알 수 없는 오류가 발생했습니다. 다시 시도해주세요.',
  WORKER_LOAD_FAILED: 'PDF 처리기를 불러오지 못했습니다. 페이지를 새로고침한 후 다시 시도해주세요.',
};

export function getKoreanErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const errorCode = error.message as ErrorCode;
    return ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.PROCESSING_FAILED;
  }
  return ERROR_MESSAGES.PROCESSING_FAILED;
}
