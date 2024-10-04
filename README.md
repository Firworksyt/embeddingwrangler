# Embedding Wrangler

Embedding Wrangler is a web application that allows users to explore and visualize word embeddings. It provides tools for comparing words, finding similar words, performing word arithmetic, and visualizing word relationships in a two-dimensional space.

## Features

- Word Comparison: Compare two words and see their cosine similarity and Euclidean distance.
- Nearest Neighbors: Find the most similar words to a given word.
- Word Arithmetic: Perform operations like "king - man" and find the resulting word.
- Embedding Visualization: Visualize word relationships in a 2D space.

## Tech Stack

- Frontend: React with Tailwind CSS
- Backend: FastAPI
- Word Embeddings: GloVe (glove-wiki-gigaword-100)

## Prerequisites

- Docker
- Docker Compose

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/embedding-wrangler.git
   cd embedding-wrangler
   ```

2. Build and run the Docker containers:
   ```
   docker-compose up --build
   ```

3. Access the application at `http://localhost:3000`

> [!NOTE]  
> The backend takes a few moments to fully start servicing requests so if you access the front end too quickly you may initially see failed responses.

## Usage

1. Enter words in the input fields to compare them, find nearest neighbors, or perform word arithmetic.
2. Click the respective buttons to perform operations.
3. View the results in the displayed cards and charts.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the WTFPL - see the [LICENSE](LICENSE) file for details.