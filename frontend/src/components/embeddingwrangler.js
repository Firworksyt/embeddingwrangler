import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const EmbeddingWrangler = () => {
  const [word1, setWord1] = useState('');
  const [word2, setWord2] = useState('');
  const [comparisonResult, setComparisonResult] = useState(null);
  const [nearestNeighbors, setNearestNeighbors] = useState([]);
  const [arithmeticResult, setArithmeticResult] = useState([]);
  const [visualizationData, setVisualizationData] = useState([]);
  const [error, setError] = useState('');

  const compareWords = async () => {
    try {
      const response = await fetch(`${API_URL}/similarity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word1, word2 }),
      });
      if (!response.ok) throw new Error('Failed to fetch similarity');
      const data = await response.json();
      setComparisonResult(data);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const findNeighbors = async () => {
    try {
      const response = await fetch(`${API_URL}/nearest_neighbors?word=${word1}`);
      if (!response.ok) throw new Error('Failed to fetch neighbors');
      const data = await response.json();
      setNearestNeighbors(data);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const performArithmetic = async () => {
    try {
      const response = await fetch(`${API_URL}/word_arithmetic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words: [word1, word2] }),
      });
      if (!response.ok) throw new Error('Failed to perform word arithmetic');
      const data = await response.json();
      setArithmeticResult(data);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const visualizeEmbeddings = async () => {
    try {
      const words = [word1, word2, ...nearestNeighbors.slice(0, 3).map(n => n.word)];
      const response = await fetch(`${API_URL}/visualize_embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words }),
      });
      if (!response.ok) throw new Error('Failed to visualize embeddings');
      const data = await response.json();
      setVisualizationData(data.coordinates.map((coord, i) => ({ x: coord[0], y: coord[1], word: data.words[i] })));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">Embedding Wrangler</h1>
          
          <div className="mb-8 text-gray-600 text-center">
            <p className="mb-2">
              This tool explores word embeddings from the GloVe (Global Vectors for Word Representation) model, 
              specifically the "glove-wiki-gigaword-100" dataset. These embeddings capture semantic relationships 
              between words based on their co-occurrence in a large corpus of text.
            </p>
            <p>
              You can compare words, find similar words, perform word arithmetic, and visualize word relationships 
              in a two-dimensional space. The embeddings allow us to perform operations on words as if they were 
              mathematical vectors, revealing interesting linguistic and semantic patterns.
            </p>
          </div>
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Word Comparison</h2>
            <div className="flex flex-wrap -mx-2 mb-4">
              <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
                <input
                  type="text"
                  value={word1}
                  onChange={(e) => setWord1(e.target.value)}
                  placeholder="Enter first word"
                  className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                />
              </div>
              <div className="w-full md:w-1/2 px-2">
                <input
                  type="text"
                  value={word2}
                  onChange={(e) => setWord2(e.target.value)}
                  placeholder="Enter second word"
                  className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                />
              </div>
            </div>
            <button onClick={compareWords} className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50">
              Compare
            </button>
            {comparisonResult && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="text-gray-700">Cosine Similarity: {comparisonResult.cosine_similarity.toFixed(4)}</p>
                <p className="text-gray-700">Euclidean Distance: {comparisonResult.euclidean_distance.toFixed(4)}</p>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Nearest Neighbors</h2>
            <div className="flex flex-wrap -mx-2 mb-4">
              <div className="w-full px-2">
                <input
                  type="text"
                  value={word1}
                  onChange={(e) => setWord1(e.target.value)}
                  placeholder="Enter a word"
                  className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                />
              </div>
            </div>
            <button onClick={findNeighbors} className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50">
              Find Neighbors
            </button>
            {nearestNeighbors.length > 0 && (
              <ul className="mt-4 p-4 bg-gray-50 rounded-md">
                {nearestNeighbors.map((neighbor, index) => (
                  <li key={index} className="text-gray-700">
                    {neighbor.word}: {neighbor.similarity.toFixed(4)}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Word Arithmetic</h2>
            <div className="flex flex-wrap -mx-2 mb-4">
              <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
                <input
                  type="text"
                  value={word1}
                  onChange={(e) => setWord1(e.target.value)}
                  placeholder="Positive word"
                  className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                />
              </div>
              <div className="w-full md:w-1/2 px-2">
                <input
                  type="text"
                  value={word2}
                  onChange={(e) => setWord2(e.target.value)}
                  placeholder="Negative word"
                  className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                />
              </div>
            </div>
            <button onClick={performArithmetic} className="w-full bg-purple-600 text-white p-2 rounded-md hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50">
              Calculate
            </button>
            {arithmeticResult.length > 0 && (
              <ul className="mt-4 p-4 bg-gray-50 rounded-md">
                {arithmeticResult.map((result, index) => (
                  <li key={index} className="text-gray-700">
                    {result.word}: {result.similarity.toFixed(4)}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Embedding Visualization</h2>
            <button onClick={visualizeEmbeddings} className="w-full bg-yellow-600 text-white p-2 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50">
              Visualize
            </button>
            {visualizationData.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md" style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid />
                    <XAxis type="number" dataKey="x" name="X" />
                    <YAxis type="number" dataKey="y" name="Y" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                    <Scatter data={visualizationData} fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-gray-300 p-2 rounded shadow">
        <p className="font-bold">{`Word: ${data.word}`}</p>
        <p>{`X: ${data.x.toFixed(4)}`}</p>
        <p>{`Y: ${data.y.toFixed(4)}`}</p>
      </div>
    );
  }
  return null;
};

export default EmbeddingWrangler;