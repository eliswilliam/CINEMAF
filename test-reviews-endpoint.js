/**
 * Script de test pour vérifier l'API des reviews
 * Usage: node test-reviews-endpoint.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Test de connexion MongoDB
async function testMongoDB() {
    console.log('\n🧪 TEST 1: Connexion MongoDB');
    console.log('=' .repeat(50));
    
    try {
        if (!process.env.MONGO_URI) {
            console.error('❌ MONGO_URI non définie dans .env');
            return false;
        }
        
        console.log('🔄 Connexion à MongoDB Atlas...');
        console.log('📍 URI (masquée):', process.env.MONGO_URI.substring(0, 30) + '...');
        
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        
        console.log('✅ MongoDB connecté avec succès!');
        console.log('📊 Base de données:', mongoose.connection.name);
        console.log('🔗 Host:', mongoose.connection.host);
        
        return true;
    } catch (error) {
        console.error('❌ Erreur de connexion:', error.message);
        return false;
    }
}

// Test du modèle Review
async function testReviewModel() {
    console.log('\n🧪 TEST 2: Modèle Review');
    console.log('=' .repeat(50));
    
    try {
        const Review = require('./src/models/reviewModel');
        console.log('✅ Modèle Review chargé avec succès');
        
        // Créer une review de test
        const testReview = new Review({
            movieId: 'test-123',
            username: 'Test User',
            userId: 'test-user-id',
            rating: 5,
            comment: 'Ceci est un commentaire de test pour vérifier le fonctionnement du système.',
            date: new Date()
        });
        
        console.log('📝 Review de test créée:', {
            movieId: testReview.movieId,
            username: testReview.username,
            rating: testReview.rating
        });
        
        // Sauvegarder
        await testReview.save();
        console.log('✅ Review sauvegardée dans MongoDB!');
        console.log('🆔 ID:', testReview._id);
        
        // Récupérer
        const found = await Review.findById(testReview._id);
        console.log('✅ Review récupérée:', found ? 'Oui' : 'Non');
        
        // Supprimer la review de test
        await Review.findByIdAndDelete(testReview._id);
        console.log('🗑️  Review de test supprimée');
        
        return true;
    } catch (error) {
        console.error('❌ Erreur avec le modèle:', error.message);
        console.error(error.stack);
        return false;
    }
}

// Test des opérations CRUD
async function testCRUDOperations() {
    console.log('\n🧪 TEST 3: Opérations CRUD');
    console.log('=' .repeat(50));
    
    try {
        const Review = require('./src/models/reviewModel');
        const movieId = 'crud-test-movie-' + Date.now();
        
        // CREATE - Créer plusieurs reviews
        console.log('📝 CREATE: Création de 3 reviews de test...');
        const reviews = await Review.insertMany([
            {
                movieId: movieId,
                username: 'Alice',
                rating: 5,
                comment: 'Excellent film, très divertissant!',
                date: new Date()
            },
            {
                movieId: movieId,
                username: 'Bob',
                rating: 4,
                comment: 'Bon film, mais un peu long.',
                date: new Date()
            },
            {
                movieId: movieId,
                username: 'Charlie',
                rating: 3,
                comment: 'Correct, sans plus.',
                date: new Date()
            }
        ]);
        console.log(`✅ ${reviews.length} reviews créées`);
        
        // READ - Lire les reviews d'un film
        console.log('\n📖 READ: Récupération des reviews du film...');
        const foundReviews = await Review.find({ movieId }).sort({ date: -1 });
        console.log(`✅ ${foundReviews.length} reviews trouvées`);
        foundReviews.forEach((r, i) => {
            console.log(`   ${i + 1}. ${r.username}: ${r.rating}⭐ - "${r.comment.substring(0, 30)}..."`);
        });
        
        // STATS - Calculer les statistiques
        console.log('\n📊 STATS: Calcul des statistiques...');
        const stats = await Review.aggregate([
            { $match: { movieId } },
            {
                $group: {
                    _id: '$movieId',
                    totalReviews: { $sum: 1 },
                    averageRating: { $avg: '$rating' }
                }
            }
        ]);
        
        if (stats.length > 0) {
            console.log('✅ Statistiques:');
            console.log(`   Total: ${stats[0].totalReviews} avaliações`);
            console.log(`   Média: ${stats[0].averageRating.toFixed(2)}/5`);
        }
        
        // DELETE - Supprimer les reviews de test
        console.log('\n🗑️  DELETE: Nettoyage des reviews de test...');
        const deleteResult = await Review.deleteMany({ movieId });
        console.log(`✅ ${deleteResult.deletedCount} reviews supprimées`);
        
        return true;
    } catch (error) {
        console.error('❌ Erreur CRUD:', error.message);
        console.error(error.stack);
        return false;
    }
}

// Test du controller
async function testController() {
    console.log('\n🧪 TEST 4: Controller');
    console.log('=' .repeat(50));
    
    try {
        const reviewController = require('./src/controllers/reviewController');
        console.log('✅ Controller chargé avec succès');
        
        // Simuler une requête
        const movieId = 'controller-test-' + Date.now();
        
        // Mock request et response
        const req = {
            body: {
                movieId: movieId,
                username: 'Test Controller',
                rating: 5,
                comment: 'Test du controller - Ce commentaire devrait être sauvegardé correctement.'
            }
        };
        
        const res = {
            status: function(code) {
                this.statusCode = code;
                return this;
            },
            json: function(data) {
                this.data = data;
                return this;
            }
        };
        
        // Test createReview
        console.log('📝 Test de createReview...');
        await reviewController.createReview(req, res);
        
        if (res.statusCode === 201 && res.data.success) {
            console.log('✅ Review créée via controller!');
            console.log('   ID:', res.data.data._id);
        } else {
            console.log('❌ Erreur lors de la création:', res.data);
        }
        
        // Test getReviewsByMovie
        console.log('\n📖 Test de getReviewsByMovie...');
        const getReq = { params: { movieId } };
        const getRes = {
            status: function(code) {
                this.statusCode = code;
                return this;
            },
            json: function(data) {
                this.data = data;
                return this;
            }
        };
        
        await reviewController.getReviewsByMovie(getReq, getRes);
        
        if (getRes.statusCode === 200 && getRes.data.success) {
            console.log('✅ Reviews récupérées via controller!');
            console.log(`   Total: ${getRes.data.count} review(s)`);
        } else {
            console.log('❌ Erreur lors de la récupération:', getRes.data);
        }
        
        // Nettoyage
        const Review = require('./src/models/reviewModel');
        await Review.deleteMany({ movieId });
        console.log('🗑️  Reviews de test supprimées');
        
        return true;
    } catch (error) {
        console.error('❌ Erreur controller:', error.message);
        console.error(error.stack);
        return false;
    }
}

// Exécuter tous les tests
async function runAllTests() {
    console.log('\n🚀 DÉBUT DES TESTS DE L\'API REVIEWS');
    console.log('=' .repeat(50));
    console.log('⏰ Date:', new Date().toLocaleString('fr-FR'));
    
    const results = {
        mongodb: false,
        model: false,
        crud: false,
        controller: false
    };
    
    // Test 1: MongoDB
    results.mongodb = await testMongoDB();
    
    if (results.mongodb) {
        // Test 2: Modèle
        results.model = await testReviewModel();
        
        // Test 3: CRUD
        results.crud = await testCRUDOperations();
        
        // Test 4: Controller
        results.controller = await testController();
    }
    
    // Résumé
    console.log('\n📊 RÉSUMÉ DES TESTS');
    console.log('=' .repeat(50));
    console.log('MongoDB Connection:', results.mongodb ? '✅ PASS' : '❌ FAIL');
    console.log('Review Model:      ', results.model ? '✅ PASS' : '❌ FAIL');
    console.log('CRUD Operations:   ', results.crud ? '✅ PASS' : '❌ FAIL');
    console.log('Controller:        ', results.controller ? '✅ PASS' : '❌ FAIL');
    
    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter(r => r).length;
    
    console.log('\n' + '=' .repeat(50));
    console.log(`📈 Score: ${passedTests}/${totalTests} tests réussis`);
    
    if (passedTests === totalTests) {
        console.log('🎉 TOUS LES TESTS SONT PASSÉS! Le système de reviews fonctionne correctement.');
    } else {
        console.log('⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus.');
    }
    
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('\n👋 Connexion MongoDB fermée');
}

// Exécuter
runAllTests().catch(error => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
});
