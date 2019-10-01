export interface StagedFile {
  filename: string;
  status: string;
}

export default function sgf(): Promise<StagedFile[]>;
