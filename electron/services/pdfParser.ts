import pdf from 'pdf-parse';
import fs from 'fs/promises';

export interface ExtractedMetadata {
  title?: string;
  authors?: string;
  journal?: string;
  year?: string;
  doi?: string;
}

export async function extractMetadata(filePath: string): Promise<ExtractedMetadata> {
  const buffer = await fs.readFile(filePath);
  const data = await pdf(buffer);

  const text = data.text;

  const metadata: ExtractedMetadata = {
    title: guessTitle(text),
    authors: guessAuthors(text),
    journal: guessJournal(text),
    year: guessYear(text),
    doi: guessDOI(text)
  };

  return metadata;
}

// Naive regex-based helpers
function guessDOI(text: string) {
  const match = text.match(/10\.\d{4,9}\/[-._;()/:A-Z0-9]+/i);
  return match ? match[0] : undefined;
}

function guessYear(text: string) {
  const match = text.match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : undefined;
}

function guessAuthors(text: string) {
  const lines = text.split('\n').slice(0, 10);
  return lines.find(l => l.includes(',') || l.split(' ').length >= 3) || '';
}

function guessJournal(text: string) {
  const journals = ['Nature', 'Science', 'IEEE', 'ACM', 'Springer', 'Elsevier', 'PLOS', 'Cell', 'Lancet'];
  return journals.find(j => text.includes(j));
}

function guessTitle(text: string) {
  return text.split('\n')[0];
}
