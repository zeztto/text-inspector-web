import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeText } from '../src/app/components/TextAnalyzer.tsx';
import { validateFileType, validateFileSize, DocumentType } from '../src/lib/file-validator.ts';

test('Korean and English text produces deterministic counts and frequencies',()=>{
 const stats=analyzeText('안녕 world.\n\n안녕 world!');
 assert.equal(stats.totalWords,4);assert.equal(stats.totalSentences,2);assert.equal(stats.totalParagraphs,2);assert.equal(stats.totalLines,3);
 assert.deepEqual(stats.wordFrequency,[{word:'안녕',count:2},{word:'world',count:2}]);
});
test('empty content has zero metrics',()=>{const stats=analyzeText(' \n ');assert.equal(stats.totalCharacters,0);assert.deepEqual(stats.wordFrequency,[])});
test('supported file formats and 10MiB boundary are explicit',()=>{
 for(const [name,type,expected] of [['a.txt','text/plain',DocumentType.TEXT],['a.md','',DocumentType.MARKDOWN],['a.pdf','application/pdf',DocumentType.PDF],['a.docx','application/vnd.openxmlformats-officedocument.wordprocessingml.document',DocumentType.DOCX]] as const){assert.equal(validateFileType(new File(['test'],name,{type})).documentType,expected)}
 assert.equal(validateFileType(new File(['test'],'a.doc',{type:'application/msword'})).isValid,false);
 assert.equal(validateFileSize(new File([new Uint8Array(10*1024*1024)],'max.txt'),10*1024*1024),true);
 assert.equal(validateFileSize(new File([new Uint8Array(10*1024*1024+1)],'large.txt'),10*1024*1024),false);
});
