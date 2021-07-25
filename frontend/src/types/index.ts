export interface ChatRecord {
  [key: string]: {
    id: string;
    role: string;
    text: string;
  };
}
