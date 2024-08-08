# Github Repository Scoring

This project implements a backend application for scoring repositories on GitHub based on their popularity. The application is built using NestJS and calculates scores based on stars, forks, and recency of updates.


## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)
- [Testing](#testing)

## Prerequisites

- Node.js installed on your machine (version 14.x or higher recommended). You can download it
  from [here](https://nodejs.org/).
- Npm (v6 or higher)
- A GitHub token for accessing the GitHub API. [How to get the token](https://docs.catalyst.zoho.com/en/tutorials/githubbot/java/generate-personal-access-token/). 


## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd github-repo-scoring
   ```

2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure the environment variables:
    - Copy `.env.example` to `.env`
    - Update the values in `.env` as needed

## Running the Project

**Start the Node.js application**:
```sh
  npm run start
```

## API Documentation

Swagger documentation is available at [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

## Testing

### Running Tests
```sh
npm run test
```
