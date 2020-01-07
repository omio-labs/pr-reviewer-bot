export interface File {
  filename: string;
  sha: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
  blob_url: string;
  raw_url: string;
  contents_url: string;
  patch: string;
}

export interface Review {
  id: number;
  state: string;
  body: string;
  pull_request_url: string;
  user: {
    login: string;
    id: number;
  };
}

export interface User {
  login: string;
  id: number;
  avatar_url: string;
  url: string;
}
