export interface Repository {
  name: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

export type ScoredRepository = {
  name: string;
  score: number;
};

export type FetchRepositoriesParams = {
  language: string;
  date: string;
  perPage: number;
  page: number;
  order: string;
};

export type FetchRepositoriesResponse = {
  items: Repository[];
  total_count: number;
};

export type GetScoredRepositoriesParams = {
  language: string;
  date: string;
  perPage: number;
  page: number;
  order: string;
};

export type GetScoredRepositoriesResponse = {
  items: ScoredRepository[];
  totalCount: number;
  count: number;
  page: number;
  totalPages: number;
};
