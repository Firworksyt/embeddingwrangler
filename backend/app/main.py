from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import PCA
from typing import List, Dict
import gensim.downloader as api

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow the frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Load pre-trained word embeddings
print("Loading word embeddings...")
word_vectors = api.load("glove-wiki-gigaword-100")
print("Word embeddings loaded.")

class WordPair(BaseModel):
    word1: str
    word2: str

class WordList(BaseModel):
    words: List[str]

@app.post("/similarity")
async def get_similarity(word_pair: WordPair):
    try:
        vec1 = word_vectors[word_pair.word1]
        vec2 = word_vectors[word_pair.word2]
        
        cosine_sim = cosine_similarity([vec1], [vec2])[0][0]
        euclidean_dist = np.linalg.norm(vec1 - vec2)
        
        return {
            "cosine_similarity": float(cosine_sim),
            "euclidean_distance": float(euclidean_dist)
        }
    except KeyError:
        raise HTTPException(status_code=404, detail="One or both words not found in the embedding vocabulary")

@app.get("/nearest_neighbors")
async def get_nearest_neighbors(word: str, n: int = 10):
    try:
        neighbors = word_vectors.most_similar(word, topn=n)
        return [{"word": w, "similarity": float(s)} for w, s in neighbors]
    except KeyError:
        raise HTTPException(status_code=404, detail="Word not found in the embedding vocabulary")

@app.post("/word_arithmetic")
async def perform_word_arithmetic(words: WordList):
    try:
        result = word_vectors.most_similar(positive=words.words[:-1], negative=[words.words[-1]], topn=5)
        return [{"word": w, "similarity": float(s)} for w, s in result]
    except KeyError:
        raise HTTPException(status_code=404, detail="One or more words not found in the embedding vocabulary")

@app.post("/visualize_embeddings")
async def visualize_embeddings(words: WordList):
    try:
        vectors = [word_vectors[word] for word in words.words]
        pca = PCA(n_components=2)
        reduced_vectors = pca.fit_transform(vectors)
        
        return {
            "words": words.words,
            "coordinates": reduced_vectors.tolist()
        }
    except KeyError:
        raise HTTPException(status_code=404, detail="One or more words not found in the embedding vocabulary")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)