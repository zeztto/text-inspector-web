import { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { StatCard } from "./components/StatCard";
import { analyzeText, type TextStats } from "./components/TextAnalyzer";
import {
  FileText,
  Type,
  Hash,
  AlignLeft,
  List,
  Clock,
  TrendingUp,
  Sparkles,
  Upload,
  BarChart3,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Label } from "./components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "./components/ui/alert";
import { cn } from "./components/ui/utils";
import { validateFileType, validateFileSize, DocumentType } from "../lib/file-validator";
import { processDocument } from "../lib/document-processors";
import { getKoreanErrorMessage } from "../lib/errors";
import { createLatestUpload } from "../lib/latest-upload";

export default function App() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploads = useRef(createLatestUpload());
  useEffect(() => () => uploads.current.invalidate(), []);
  const [text, setText] = useState("");
  const [stats, setStats] = useState<TextStats | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingFileName, setProcessingFileName] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const cancelUpload = () => {
    uploads.current.invalidate();
    setIsProcessing(false);
    setProcessingFileName('');
    setUploadError(null);
  };

  const handleTextChange = (value: string) => {
    cancelUpload();
    setText(value);
    const analyzed = analyzeText(value);
    setStats(analyzed);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setIsProcessing(true);
    setProcessingFileName(file.name);

    await uploads.current.run(async () => {
      if (!validateFileSize(file, 10 * 1024 * 1024)) throw new Error('FILE_TOO_LARGE');
      const validation = validateFileType(file);
      if (!validation.isValid) throw new Error(validation.error || 'INVALID_FILE_TYPE');
      let content: string;
      if (validation.documentType === DocumentType.TEXT || validation.documentType === DocumentType.MARKDOWN) {
        content = await file.text();
      } else {
        const result = await processDocument(file, validation.documentType!);
        if (!result.success) throw new Error(result.error || 'PROCESSING_FAILED');
        content = result.text;
      }
      if (!content.trim()) throw new Error('EMPTY_CONTENT');
      return content;
    }, {
      success(content) { setText(content); setStats(analyzeText(content)); },
      error(error) { setUploadError(getKoreanErrorMessage(error)); },
      settled() { setIsProcessing(false); setProcessingFileName(''); event.target.value = ''; },
    });
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const syntheticEvent = {
        target: { files, value: '' }
      } as React.ChangeEvent<HTMLInputElement>;

      handleFileUpload(syntheticEvent);
    }
  };

  const handleClear = () => {
    cancelUpload();
    setText("");
    setStats(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 py-8">
          <div className="flex items-center justify-center gap-2">
            <BarChart3 className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-semibold">텍스트 분석기</h1>
          </div>
          <p className="text-muted-foreground">
            텍스트를 입력하거나 파일을 업로드하여 상세한 분석 결과를 확인하세요
          </p>
        </div>

        {/* Input Section */}
        <Card className="p-6">
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="text" className="gap-2">
                <Type className="w-4 h-4" />
                텍스트 입력
              </TabsTrigger>
              <TabsTrigger value="file" className="gap-2">
                <Upload className="w-4 h-4" />
                파일 업로드
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="analysis-text">분석할 텍스트를 입력하세요</Label>
                <Textarea
                  id="analysis-text"
                  placeholder="여기에 텍스트를 입력하거나 붙여넣기 하세요..."
                  className="min-h-[300px] resize-y"
                  value={text}
                  onChange={(e) => handleTextChange(e.target.value)}
                />
              </div>
              {text && (
                <Button variant="outline" onClick={handleClear}>
                  초기화
                </Button>
              )}
            </TabsContent>

            <TabsContent value="file" className="space-y-4">
              <div className="space-y-2">
                <Label>분석할 파일을 업로드하세요</Label>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                    isDragActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
                      <p className="text-muted-foreground mb-2">
                        파일 처리 중...
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {processingFileName}
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-2">
                        {isDragActive ? "파일을 놓으세요" : "클릭하거나 파일을 드래그하여 업로드"}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        지원 형식: TXT, MD, PDF, DOCX (최대 10MB)
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt,.md,.pdf,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        disabled={isProcessing}
                      />
                      <Button type="button" variant="secondary" disabled={isProcessing} onClick={() => fileInputRef.current?.click()}>
                        파일 선택
                      </Button>
                    </>
                  )}
                </div>
                {uploadError && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>업로드 오류</AlertTitle>
                    <AlertDescription className="whitespace-pre-line">{uploadError}</AlertDescription>
                  </Alert>
                )}
              </div>
              {text && (
                <div className="space-y-2">
                  <Label>업로드된 텍스트</Label>
                  <Textarea
                    className="min-h-[200px] resize-y"
                    value={text}
                    onChange={(e) => handleTextChange(e.target.value)}
                  />
                  <Button variant="outline" onClick={handleClear}>
                    초기화
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>

        {/* Statistics Section */}
        {stats && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Basic Stats */}
            <div>
              <h2 className="mb-4 flex items-center gap-2">
                <Hash className="w-5 h-5" />
                기본 통계
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="총 글자 수"
                  value={stats.totalCharacters.toLocaleString()}
                  icon={<Type className="w-5 h-5" />}
                />
                <StatCard
                  label="공백 제외 글자 수"
                  value={stats.charactersNoSpaces.toLocaleString()}
                  icon={<Type className="w-5 h-5" />}
                />
                <StatCard
                  label="총 단어 수"
                  value={stats.totalWords.toLocaleString()}
                  icon={<AlignLeft className="w-5 h-5" />}
                />
                <StatCard
                  label="고유 단어 수"
                  value={stats.uniqueWords.toLocaleString()}
                  icon={<Sparkles className="w-5 h-5" />}
                />
              </div>
            </div>

            {/* Structure Stats */}
            <div>
              <h2 className="mb-4 flex items-center gap-2">
                <List className="w-5 h-5" />
                구조 분석
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="문장 수"
                  value={stats.totalSentences.toLocaleString()}
                  icon={<FileText className="w-5 h-5" />}
                />
                <StatCard
                  label="문단 수"
                  value={stats.totalParagraphs.toLocaleString()}
                  icon={<AlignLeft className="w-5 h-5" />}
                />
                <StatCard
                  label="줄 수"
                  value={stats.totalLines.toLocaleString()}
                  icon={<List className="w-5 h-5" />}
                />
                <StatCard
                  label="예상 읽기 시간"
                  value={`${stats.readingTime}분`}
                  icon={<Clock className="w-5 h-5" />}
                />
              </div>
            </div>

            {/* Average Stats */}
            <div>
              <h2 className="mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                평균 통계
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatCard
                  label="평균 단어 길이"
                  value={`${stats.averageWordLength} 글자`}
                  icon={<Type className="w-5 h-5" />}
                />
                <StatCard
                  label="평균 문장 길이"
                  value={`${stats.averageSentenceLength} 단어`}
                  icon={<AlignLeft className="w-5 h-5" />}
                />
              </div>
            </div>

            {/* Word Frequency */}
            {stats.wordFrequency.length > 0 && (
              <div>
                <h2 className="mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  빈도수가 높은 단어 (Top 10)
                </h2>
                <Card className="p-6">
                  <div className="space-y-3">
                    {stats.wordFrequency.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <span className="text-muted-foreground min-w-[30px]">
                          #{index + 1}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{item.word}</span>
                            <span className="text-muted-foreground">
                              {item.count}회
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{
                                width: `${(item.count / stats.wordFrequency[0].count) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Letter Frequency */}
            {stats.letterFrequency.length > 0 && (
              <div>
                <h2 className="mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  빈도수가 높은 문자 (Top 10)
                </h2>
                <Card className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {stats.letterFrequency.map((item, index) => (
                      <div
                        key={index}
                        className="text-center p-4 bg-muted rounded-lg"
                      >
                        <div className="text-3xl font-semibold mb-2">
                          {item.letter}
                        </div>
                        <div className="text-muted-foreground">
                          {item.count}회
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!stats && (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2">텍스트를 입력하면 분석이 시작됩니다</h3>
            <p className="text-muted-foreground">
              위에서 텍스트를 입력하거나 파일을 업로드하세요
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
