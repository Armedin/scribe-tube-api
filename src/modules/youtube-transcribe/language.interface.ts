export interface Language {
  language: string;
  code: string;
}

export interface TranscriptLanguage {
  videoId: string;
  url: string;
  language: Language;
}
