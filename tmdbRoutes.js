/**
 * Routes pour recherche de films via TMDB API
 */

const express = require('express');
const router = express.Router();
const { searchAndFormatMovie, searchMovie, getMovieDetails, formatMovieInfo } = require('./tmdbService');

/**
 * POST /api/tmdb/search
 * Recherche de films dans l'API TMDB
 */
router.post('/search', async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim().length < 2) {
    return res.status(400).json({ 
      error: 'Digite pelo menos 2 caracteres para pesquisar' 
    });
  }

  try {
    // Rechercher dans TMDB
    const searchResults = await searchMovie(query.trim(), 'pt-BR');
    
    if (!searchResults.results || searchResults.results.length === 0) {
      return res.json({
        success: true,
        results: [],
        total: 0,
        query: query
      });
    }

    // Formater les résultats pour le frontend
    const formattedResults = searchResults.results.slice(0, 20).map(movie => ({
      id: movie.id,
      titulo: movie.title || movie.original_title,
      tituloOriginal: movie.original_title,
      ano: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
      avaliacao: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
      numeroVotos: movie.vote_count || 0,
      sinopse: movie.overview || 'Sinopse não disponível',
      posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
      backdropUrl: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null,
      popularidade: movie.popularity || 0,
      idioma: movie.original_language,
      source: 'tmdb' // Indicador que vem do TMDB
    }));

    res.json({
      success: true,
      results: formattedResults,
      total: searchResults.total_results,
      page: searchResults.page,
      totalPages: searchResults.total_pages,
      query: query
    });

  } catch (error) {
    console.error('Erro ao pesquisar no TMDB:', error.message);
    
    // Retornar erro apropriado
    if (error.message.includes('Chave API')) {
      return res.status(503).json({ 
        error: 'Serviço de busca temporariamente indisponível. Configure a chave TMDB_API_KEY no backend.',
        fallbackToLocal: true
      });
    }
    
    return res.status(500).json({ 
      error: 'Erro ao pesquisar filmes. Tente novamente.',
      fallbackToLocal: true
    });
  }
});

/**
 * GET /api/tmdb/movie/:id
 * Obtém detalhes completos de um filme específico
 */
router.get('/movie/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID do filme não fornecido' });
  }

  try {
    const movieDetails = await getMovieDetails(parseInt(id), 'pt-BR');
    const formatted = formatMovieInfo(movieDetails);

    res.json({
      success: true,
      movie: formatted
    });

  } catch (error) {
    console.error('Erro ao obter detalhes do filme:', error.message);
    return res.status(500).json({ 
      error: 'Erro ao obter detalhes do filme' 
    });
  }
});

module.exports = router;
