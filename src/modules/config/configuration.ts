export function configuration() {
  return {
    github: {
      baseUrl: process.env.GITHUB_BASE_URL,
      token: process.env.GITHUB_TOKEN,
    },
    scoring: {
      starsWeight: parseFloat(process.env.STARS_WEIGHT),
      forksWeight: parseFloat(process.env.FORKS_WEIGHT),
      recencyWeight: parseFloat(process.env.RECENCY_WEIGHT),
    },
  };
}
