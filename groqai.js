// Carregar configuração de variáveis de ambiente
require('dotenv').config();

const express = require('express');
const Groq = require('groq-sdk').default;
const { searchMovies, getMovieByTitle, getAllMovies, getMoviesByCategory } = require('./moviesData');
const { searchAndFormatMovie, getTMDBApiKey } = require('./tmdbService');

const router = express.Router();

// Inicializar cliente Groq com chave API
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Função para obter resposta do chat Groq com contexto dos filmes
 * @param {string} message - Mensagem do usuário
 * @returns {Promise} - Promise com a resposta da API
 */
async function getGroqChatCompletion(message) {
  // Buscar informações relevantes sobre filmes na mensagem
  let context = "";
  let tmdbInfo = null;
  
  // Tentar extrair nome de filme da mensagem
  const movieKeywords = message.toLowerCase();
  
  // Verificar se usuário está pedindo busca no TMDB
  const wantsTMDBSearch = movieKeywords.includes('busca') || 
                          movieKeywords.includes('pesquisa') || 
                          movieKeywords.includes('procura') ||
                          movieKeywords.includes('tmdb') ||
                          movieKeywords.includes('informação atualizada') ||
                          movieKeywords.includes('informacao atualizada');
  
  // Buscar por filmes mencionados (busca mais inteligente)
  const allMovies = getAllMovies();
  
  // Criar lista de palavras-chave para buscar
  const searchTerms = [
    'john wick', 'avatar', 'top gun', 'homem-aranha', 'homem aranha', 'spider', 
    'doutor estranho', 'doctor strange', 'estranho', 'strange',
    'batman', 'cavaleiro', 'parasita', 'duna', 'interestelar',
    'senhor dos aneis', 'chefao', 'godfather', 'chihiro', 'pulp fiction',
    'shutter island', 'prisioneiros', 'corra', 'zodíaco', 'garota exemplar',
    'seven', 'silencio', 'guardioes', 'guardians', 'thor', 'ragnarok',
    'deadpool', 'jumanji', 'branquelas', 'beber', 'mario', 'aranhaverso',
    'vingadores', 'avengers', 'ultimato', 'mad max', 'missao impossivel',
    'gladiador', 'iluminado', 'shining', 'exorcista', 'hereditario',
    'invocacao', 'conjuring', 'bruxa', 'lugar silencioso'
  ];
  
  // Verificar se algum termo de busca está na mensagem
  let mentionedMovies = [];
  
  for (const term of searchTerms) {
    if (movieKeywords.includes(term)) {
      const foundMovies = allMovies.filter(movie => 
        movie.title.toLowerCase().includes(term) ||
        term.includes(movie.title.toLowerCase().split(':')[0].trim().toLowerCase())
      );
      mentionedMovies = [...mentionedMovies, ...foundMovies];
    }
  }
  
  // Remover duplicatas
  mentionedMovies = mentionedMovies.filter((movie, index, self) =>
    index === self.findIndex((m) => m.title === movie.title)
  );
  
  // Se encontrou filmes mencionados na base local, adicionar ao contexto
  if (mentionedMovies.length > 0) {
    context += "\n\n=== INFORMAÇÕES DOS FILMES DISPONÍVEIS NA CINEHOME (Base Local) ===\n";
    mentionedMovies.forEach(movie => {
      context += `\nTÍTULO: ${movie.title}\n`;
      context += `ANO: ${movie.year}\n`;
      context += `AVALIAÇÃO: ${movie.rating}/10\n`;
      if (movie.description) {
        context += `DESCRIÇÃO: ${movie.description}\n`;
      }
      context += `---\n`;
    });
  }
  
  // Se usuário pede busca no TMDB ou não encontrou na base local
  if (wantsTMDBSearch || (mentionedMovies.length === 0 && movieKeywords.includes('filme'))) {
    try {
      // Tentar extrair nome do filme da mensagem
      const movieNameMatch = message.match(/(?:filme|movie)\s+["']?([^"'?!.]+)["']?/i);
      if (movieNameMatch && movieNameMatch[1]) {
        const movieName = movieNameMatch[1].trim();
        tmdbInfo = await searchAndFormatMovie(movieName);
        
        if (tmdbInfo.encontrado) {
          const filme = tmdbInfo.filme;
          context += "\n\n=== INFORMAÇÕES DO TMDB (The Movie Database) ===\n";
          context += `\nTÍTULO: ${filme.titulo}\n`;
          context += `TÍTULO ORIGINAL: ${filme.tituloOriginal}\n`;
          context += `ANO: ${filme.ano}\n`;
          context += `AVALIAÇÃO TMDB: ${filme.avaliacao}/10 (${filme.numeroVotos} votos)\n`;
          context += `GÊNEROS: ${filme.generos}\n`;
          context += `DURAÇÃO: ${filme.duracao}\n`;
          context += `SINOPSE: ${filme.sinopse}\n`;
          context += `POPULARIDADE: ${filme.popularidade.toFixed(1)}\n`;
          context += `---\n`;
          if (tmdbInfo.resultadosAdicionais > 0) {
            context += `\nNOTA: Encontrei ${tmdbInfo.resultadosAdicionais} outros resultados similares no TMDB.\n`;
          }
        }
      }
    } catch (error) {
      console.error('Erro ao buscar no TMDB:', error.message);
      // Continuar sem informações do TMDB
    }
  }
  
  // Detectar perguntas sobre categorias
  if (movieKeywords.includes('ação') || movieKeywords.includes('acao')) {
    const actionMovies = getMoviesByCategory('action');
    context += "\n\n=== FILMES DE AÇÃO DISPONÍVEIS ===\n";
    actionMovies.forEach(m => {
      context += `- ${m.title} (${m.year}) - Avaliação: ${m.rating}/10\n`;
    });
  }
  
  if (movieKeywords.includes('comédia') || movieKeywords.includes('comedia')) {
    const comedyMovies = getMoviesByCategory('comedy');
    context += "\n\n=== FILMES DE COMÉDIA DISPONÍVEIS ===\n";
    comedyMovies.forEach(m => {
      context += `- ${m.title} (${m.year}) - Avaliação: ${m.rating}/10\n`;
    });
  }
  
  if (movieKeywords.includes('suspense')) {
    const suspenseMovies = getMoviesByCategory('suspense');
    context += "\n\n=== FILMES DE SUSPENSE DISPONÍVEIS ===\n";
    suspenseMovies.forEach(m => {
      context += `- ${m.title} (${m.year}) - Avaliação: ${m.rating}/10\n`;
    });
  }
  
  if (movieKeywords.includes('terror')) {
    const horrorMovies = getMoviesByCategory('horror');
    context += "\n\n=== FILMES DE TERROR DISPONÍVEIS ===\n";
    horrorMovies.forEach(m => {
      context += `- ${m.title} (${m.year}) - Avaliação: ${m.rating}/10\n`;
    });
  }
  
  if (movieKeywords.includes('em alta') || movieKeywords.includes('populares') || movieKeywords.includes('trending')) {
    const trendingMovies = getMoviesByCategory('trending');
    context += "\n\n=== FILMES EM ALTA NA CINEHOME ===\n";
    trendingMovies.forEach(m => {
      context += `- ${m.title} (${m.year}) - Avaliação: ${m.rating}/10\n`;
    });
  }
  
  if (movieKeywords.includes('melhor avaliado') || movieKeywords.includes('top rated') || movieKeywords.includes('melhores')) {
    const topMovies = getMoviesByCategory('topRated');
    context += "\n\n=== FILMES MAIS BEM AVALIADOS ===\n";
    topMovies.forEach(m => {
      context += `- ${m.title} (${m.year}) - Avaliação: ${m.rating}/10\n`;
    });
  }

  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Você é o assistente virtual oficial da CINEHOME, uma plataforma de streaming de filmes e séries. 

🎬 ACESSO À BASE DE DADOS EM TEMPO REAL:
Você tem acesso COMPLETO a duas fontes de dados:
1. Base de dados LOCAL da CINEHOME (filmes disponíveis na plataforma)
2. API do TMDB (The Movie Database) para informações atualizadas de qualquer filme

⚠️ REGRAS IMPORTANTES:
1. SEMPRE use os dados fornecidos no contexto quando disponíveis
2. Se houver informações do TMDB, mencione que são dados atualizados da base mundial
3. Se houver dados locais, mencione que o filme está disponível na CINEHOME
4. NUNCA invente avaliações ou informações sobre filmes
5. Se um filme estiver no contexto, forneça TODAS as informações disponíveis
6. Responda de forma clara, direta e amigável
7. Use emojis para tornar as respostas mais agradáveis
8. SEMPRE responda em português brasileiro

📋 SUAS RESPONSABILIDADES:
- Informar avaliações, anos de lançamento e descrições dos filmes
- Buscar informações atualizadas no TMDB quando solicitado
- Recomendar filmes baseado nas preferências do usuário
- Ajudar com navegação, conta, perfis e configurações da plataforma
- Responder dúvidas sobre funcionalidades do CINEHOME

${context}`,
      },
      {
        role: "user",
        content: message,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
}

/**
 * Endpoint POST /api/chat
 * Recebe mensagem do usuário e retorna resposta do chatbot
 */
router.post('/chat', async (req, res) => {
  const { message } = req.body;

  // Validar se mensagem foi fornecida
  if (!message) {
    return res.status(400).json({ error: "Mensagem não fornecida!" });
  }

  try {
    // Chamar API Groq com contexto dos filmes
    const responseGroq = await getGroqChatCompletion(message);

    console.log("Resposta da API Groq:", responseGroq.choices[0]?.message.content);

    // Retornar resposta ao cliente
    res.json({ response: responseGroq.choices[0]?.message?.content || "" });
  } catch (error) {
    console.error("Erro ao chamar a API da Groq:", error.message);
    return res.status(500).json({ error: "Erro ao consultar a API da Groq." });
  }
});

module.exports = router;

