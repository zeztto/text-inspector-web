# 변경 기록

## 0.1.0 — 2026-10-28

- standalone source edition으로 실제 사용하는 entry·component·문서 처리기와 dependency lock을 정리했습니다.
- PDF.js worker를 CDN에서 같은 build의 asset으로 전환하고 PDF 처리 후 worker resource를 정리합니다.
- 미지원 legacy DOC의 사용하지 않는 binary 추출 코드를 제외하고 지원 범위를 문서화했습니다.
- keyboard 파일 선택, 한국어 줄바꿈, 늦게 끝난 업로드의 최신 입력 덮어쓰기를 수정했습니다.
- 통계·파일 경계·upload race 검사와 읽기 전용 CI, first-party MIT 및 third-party notice를 추가했습니다.
