# 텍스트 분석기

입력한 텍스트와 TXT·Markdown·PDF·DOCX 문서의 글자·단어·문장·빈도를 브라우저에서 분석합니다. 로그인, 서버 업로드, 저장 기록 기능은 없습니다.

## 실행

Node.js 22.13 이상과 npm이 필요합니다. 이 source edition은 Node.js 26.8.1, npm 11.19.0에서 검증합니다.

```sh
npm ci --ignore-scripts
npm run dev -- --host 127.0.0.1
```

production build와 loopback preview:

```sh
npm run build
npm run preview -- --host 127.0.0.1
```

`dist/`를 정적 호스팅하면 됩니다. 브라우저는 ES module·Web Worker·File API를 지원해야 합니다. PDF worker는 같은 build에 bundle되며 CDN worker를 사용하지 않습니다. 최초 설치에는 npm registry 접근이 필요하고, 이미 내려받은 app asset과 worker가 있으면 문서 처리를 위한 외부 service가 필요하지 않습니다. service worker를 통한 offline 설치 기능은 제공하지 않습니다.

## 지원 범위

- 텍스트 입력·붙여넣기·초기화와 파일 선택·drag-and-drop을 지원합니다. 파일은 한 번에 하나, 최대 10MiB입니다.
- TXT/MD는 원문을 읽습니다. Markdown을 렌더링하거나 HTML을 실행하지 않습니다.
- PDF는 텍스트 layer를, DOCX는 Mammoth의 raw text를 추출합니다. 문서 layout·표 서식·그림·주석의 재현을 보장하지 않습니다.
- legacy `.doc`, OCR, 스캔 PDF의 이미지 문자 인식은 지원하지 않습니다. `.doc`은 작성 프로그램에서 DOCX로 변환해야 합니다. 빈 문서·지원하지 않는 형식·손상된 문서는 한국어 오류로 안내합니다.
- 더 최근 업로드·직접 편집·초기화가 있으면 이전 비동기 업로드의 결과를 적용하지 않습니다.

## 통계 기준

총 글자 수는 JavaScript 문자열의 UTF-16 code unit 기준입니다. 따라서 일부 emoji는 2개 이상으로 계산됩니다. 공백 제외 값은 whitespace를 제거한 길이입니다. 단어는 공백으로, 문장은 `. ! ?`로, 문단은 빈 줄로 나눕니다. 빈 내용의 모든 통계는 0입니다.

단어·문자 빈도와 평균 단어 길이의 정규화 대상은 한글 음절·영문·숫자입니다(문자 빈도는 숫자 제외). 형태소 분석이나 모든 언어의 언어학적 단어 수를 제공하지 않습니다. 읽기 시간은 분당 200단어 가정의 올림값입니다.

## 개인정보

파일과 텍스트는 현재 page의 memory에서 처리하며 application backend로 전송하지 않습니다. localStorage·cookie·계정 sync로 입력을 저장하지 않습니다. 새로고침하면 입력은 사라집니다. app의 정적 파일과 PDF worker 요청은 호스팅한 같은 origin에 발생합니다.

## 검증

```sh
npm run typecheck
npm test
npm run build
npm audit --audit-level=low
```

자동 검사는 한국어·영어 통계, 빈 내용, 지원 형식·크기 경계와 비동기 업로드의 최신 요청 보호를 포함합니다. `tests/fixtures/`의 문서는 검증을 위해 작성한 합성 자료이며 운영 자료가 아닙니다. PDF/DOCX의 실제 browser File API 경로, 키보드 파일 선택, 오류 화면과 반응형 화면은 별도 browser QA 대상입니다.

## License

작성한 application은 [MIT License](LICENSE)입니다. shadcn/ui, PDF.js, Mammoth의 원고지와 license는 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)에 보존합니다.
