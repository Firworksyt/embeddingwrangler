import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_similarity():
    response = client.post("/similarity", json={"word1": "king", "word2": "queen"})
    assert response.status_code == 200
    data = response.json()
    assert "cosine_similarity" in data
    assert "euclidean_distance" in data

def test_nearest_neighbors():
    response = client.get("/nearest_neighbors", params={"word": "king"})
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert "word" in data[0]
    assert "similarity" in data[0]

def test_word_arithmetic():
    response = client.post("/word_arithmetic", json={"words": ["king", "man", "woman"]})
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert "word" in data[0]
    assert "similarity" in data[0]

def test_visualize_embeddings():
    response = client.post("/visualize_embeddings", json={"words": ["king", "queen", "man", "woman"]})
    assert response.status_code == 200
    data = response.json()
    assert "words" in data
    assert "coordinates" in data
    assert len(data["words"]) == len(data["coordinates"])