export interface EwcCode {
  code: string;
  description: string;
  category: string;
  hazardous: boolean;
  confidence?: number;
}

export interface SearchState {
  isLoading: boolean;
  results: EwcCode[];
  error: string | null;
  query: string;
  imagePreview: string | null;
}

export enum SearchType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE'
}