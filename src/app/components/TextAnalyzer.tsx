export interface TextStats {
  totalCharacters: number;
  charactersNoSpaces: number;
  totalWords: number;
  totalSentences: number;
  totalParagraphs: number;
  totalLines: number;
  averageWordLength: number;
  averageSentenceLength: number;
  readingTime: number;
  wordFrequency: Array<{ word: string; count: number }>;
  letterFrequency: Array<{ letter: string; count: number }>;
  uniqueWords: number;
}

export function analyzeText(text: string): TextStats {
  if (!text || text.trim().length === 0) {
    return {
      totalCharacters: 0,
      charactersNoSpaces: 0,
      totalWords: 0,
      totalSentences: 0,
      totalParagraphs: 0,
      totalLines: 0,
      averageWordLength: 0,
      averageSentenceLength: 0,
      readingTime: 0,
      wordFrequency: [],
      letterFrequency: [],
      uniqueWords: 0,
    };
  }

  // Character count
  const totalCharacters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;

  // Word count
  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  const totalWords = words.length;

  // Sentence count (periods, exclamation marks, question marks)
  const sentences = text
    .split(/[.!?]+/)
    .filter((sentence) => sentence.trim().length > 0);
  const totalSentences = sentences.length;

  // Paragraph count (split by double line breaks)
  const paragraphs = text
    .split(/\n\s*\n/)
    .filter((para) => para.trim().length > 0);
  const totalParagraphs = paragraphs.length;

  // Line count
  const lines = text.split(/\n/);
  const totalLines = lines.length;

  // Average word length
  const totalWordLength = words.reduce((sum, word) => {
    return sum + word.replace(/[^a-zA-Z0-9가-힣]/g, "").length;
  }, 0);
  const averageWordLength =
    totalWords > 0 ? parseFloat((totalWordLength / totalWords).toFixed(2)) : 0;

  // Average sentence length
  const averageSentenceLength =
    totalSentences > 0
      ? parseFloat((totalWords / totalSentences).toFixed(2))
      : 0;

  // Reading time (assuming 200 words per minute)
  const readingTime = Math.ceil(totalWords / 200);

  // Word frequency
  const wordMap = new Map<string, number>();
  words.forEach((word) => {
    const cleanWord = word.toLowerCase().replace(/[^a-zA-Z0-9가-힣]/g, "");
    if (cleanWord.length > 0) {
      wordMap.set(cleanWord, (wordMap.get(cleanWord) || 0) + 1);
    }
  });
  const wordFrequency = Array.from(wordMap.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Unique words
  const uniqueWords = wordMap.size;

  // Letter frequency
  const letterMap = new Map<string, number>();
  const allLetters = text
    .toLowerCase()
    .replace(/[^a-zA-Z가-힣]/g, "")
    .split("");
  allLetters.forEach((letter) => {
    letterMap.set(letter, (letterMap.get(letter) || 0) + 1);
  });
  const letterFrequency = Array.from(letterMap.entries())
    .map(([letter, count]) => ({ letter, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalCharacters,
    charactersNoSpaces,
    totalWords,
    totalSentences,
    totalParagraphs,
    totalLines,
    averageWordLength,
    averageSentenceLength,
    readingTime,
    wordFrequency,
    letterFrequency,
    uniqueWords,
  };
}
