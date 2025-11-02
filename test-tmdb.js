/**
 * Script de test pour vérifier l'intégration TMDB
 * Usage: node test-tmdb.js
 */

require('dotenv').config();
const { searchMovie, getTMDBApiKey } = require('./tmdbService');

console.log('🧪 TEST DE L\'INTÉGRATION TMDB\n');
console.log('=' .repeat(50));

// Test 1: Vérifier la clé API
console.log('\n📋 Test 1: Vérification de la clé API TMDB');
const apiKey = getTMDBApiKey();
if (apiKey) {
  console.log('✅ Clé API TMDB configurée');
  console.log(`   Longueur: ${apiKey.length} caractères`);
  console.log(`   Préfixe: ${apiKey.substring(0, 8)}...`);
} else {
  console.error('❌ Clé API TMDB NON configurée');
  console.error('   Ajoutez TMDB_API_KEY dans le fichier .env');
  process.exit(1);
}

// Test 2: Recherche de film simple
console.log('\n📋 Test 2: Recherche de film "Avatar"');
searchMovie('Avatar', 'pt-BR')
  .then(results => {
    console.log(`✅ Requête réussie`);
    console.log(`   Total de résultats: ${results.total_results}`);
    console.log(`   Résultats sur cette page: ${results.results.length}`);
    
    if (results.results.length > 0) {
      const firstMovie = results.results[0];
      console.log('\n   Premier résultat:');
      console.log(`   - Titre: ${firstMovie.title}`);
      console.log(`   - Titre original: ${firstMovie.original_title}`);
      console.log(`   - Date de sortie: ${firstMovie.release_date}`);
      console.log(`   - Note: ${firstMovie.vote_average}/10`);
      console.log(`   - Votes: ${firstMovie.vote_count}`);
      console.log(`   - Popularité: ${firstMovie.popularity}`);
    }
    
    // Test 3: Recherche avec terme portugais
    console.log('\n📋 Test 3: Recherche de film "Deadpool"');
    return searchMovie('Deadpool', 'pt-BR');
  })
  .then(results => {
    console.log(`✅ Requête réussie`);
    console.log(`   Total de résultats: ${results.total_results}`);
    console.log(`   Résultats sur cette page: ${results.results.length}`);
    
    if (results.results.length > 0) {
      const firstMovie = results.results[0];
      console.log('\n   Premier résultat:');
      console.log(`   - Titre: ${firstMovie.title}`);
      console.log(`   - Note: ${firstMovie.vote_average}/10`);
    }
    
    // Test 4: Recherche sans résultat
    console.log('\n📋 Test 4: Recherche sans résultat "xyzabc123impossible"');
    return searchMovie('xyzabc123impossible', 'pt-BR');
  })
  .then(results => {
    console.log(`✅ Requête réussie (résultat attendu: 0)`);
    console.log(`   Total de résultats: ${results.total_results}`);
    
    if (results.total_results === 0) {
      console.log('   ✅ Comportement correct pour recherche sans résultat');
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ TOUS LES TESTS PASSÉS AVEC SUCCÈS!');
    console.log('='.repeat(50));
    console.log('\n💡 L\'API TMDB fonctionne correctement.');
    console.log('   Vous pouvez maintenant tester dans le frontend.\n');
  })
  .catch(error => {
    console.error('\n❌ ERREUR LORS DU TEST:');
    console.error(`   Message: ${error.message}`);
    console.error(`   Stack: ${error.stack}`);
    console.log('\n' + '='.repeat(50));
    console.log('❌ TESTS ÉCHOUÉS');
    console.log('='.repeat(50));
    process.exit(1);
  });
