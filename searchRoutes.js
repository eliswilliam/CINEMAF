const express = require('express');
const router = express.Router();
const { searchMoviesInTMDB } = require('./tmdbService');

/**
 * POST /api/search
 * Endpoint para pesquisar filmes no TMDB
 */
router.post('/search', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim() === '') {
      return res.status(400).json({ 
        error: 'Query de pesquisa não fornecida',
        results: [] 
      });
    }

    console.log(`🔍 Pesquisando no TMDB: "${query}"`);

    // Buscar no TMDB
    const results = await searchMoviesInTMDB(query);

    console.log(`✅ Encontrados ${results.length} resultados no TMDB`);

    res.json({
      success: true,
      query: query,
      totalResults: results.length,
      results: results
    });

  } catch (error) {
    console.error('❌ Erro ao pesquisar no TMDB:', error.message);
    res.status(500).json({ 
      error: 'Erro ao pesquisar filmes',
      message: error.message,
      results: [] 
    });
  }
});

module.exports = router;
