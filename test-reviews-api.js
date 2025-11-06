/**
 * Script de teste pour l'API Reviews
 * Utilisation: node test-reviews-api.js
 */

const API_BASE_URL = 'http://localhost:3001/api/reviews';

// Couleurs pour console
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m'
};

async function testHealthCheck() {
    console.log(`\n${colors.cyan}📡 Teste 1: Health Check${colors.reset}`);
    try {
        const response = await fetch('http://localhost:3001/health');
        const data = await response.json();
        console.log(`${colors.green}✅ Servidor funcionando!${colors.reset}`, data);
        return true;
    } catch (error) {
        console.error(`${colors.red}❌ Servidor não está rodando!${colors.reset}`, error.message);
        return false;
    }
}

async function testCreateReview() {
    console.log(`\n${colors.cyan}⭐ Teste 2: Criar Avaliação${colors.reset}`);
    
    const review = {
        movieId: '533535',
        username: 'TestUser',
        rating: 5,
        comment: 'Este é um teste automático do sistema de avaliações. Filme incrível!'
    };
    
    console.log('Enviando:', review);
    
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(review)
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log(`${colors.green}✅ Avaliação criada com sucesso!${colors.reset}`);
            console.log('Resposta:', data);
            return data.data._id;
        } else {
            console.error(`${colors.red}❌ Erro ao criar avaliação:${colors.reset}`, data);
            return null;
        }
    } catch (error) {
        console.error(`${colors.red}❌ Erro de conexão:${colors.reset}`, error.message);
        return null;
    }
}

async function testGetReviews(movieId) {
    console.log(`\n${colors.cyan}📋 Teste 3: Buscar Avaliações${colors.reset}`);
    
    try {
        const response = await fetch(`${API_BASE_URL}/${movieId}`);
        const data = await response.json();
        
        if (data.success) {
            console.log(`${colors.green}✅ ${data.count} avaliações encontradas!${colors.reset}`);
            console.log('Reviews:', JSON.stringify(data.data, null, 2));
            return data.data;
        } else {
            console.error(`${colors.red}❌ Erro ao buscar avaliações:${colors.reset}`, data);
            return null;
        }
    } catch (error) {
        console.error(`${colors.red}❌ Erro de conexão:${colors.reset}`, error.message);
        return null;
    }
}

async function testGetStats(movieId) {
    console.log(`\n${colors.cyan}📊 Teste 4: Buscar Estatísticas${colors.reset}`);
    
    try {
        const response = await fetch(`${API_BASE_URL}/${movieId}/stats`);
        const data = await response.json();
        
        if (data.success) {
            console.log(`${colors.green}✅ Estatísticas carregadas!${colors.reset}`);
            console.log('Stats:', JSON.stringify(data.data, null, 2));
            return data.data;
        } else {
            console.error(`${colors.red}❌ Erro ao buscar estatísticas:${colors.reset}`, data);
            return null;
        }
    } catch (error) {
        console.error(`${colors.red}❌ Erro de conexão:${colors.reset}`, error.message);
        return null;
    }
}

// Executar todos os testes
async function runAllTests() {
    console.log(`${colors.cyan}🎬 INICIANDO TESTES DA API DE REVIEWS${colors.reset}`);
    console.log(`API URL: ${API_BASE_URL}\n`);
    
    // 1. Health Check
    const serverOk = await testHealthCheck();
    if (!serverOk) {
        console.log(`\n${colors.yellow}⚠️  Certifique-se de que o servidor está rodando:${colors.reset}`);
        console.log('   node src/app.js\n');
        return;
    }
    
    // 2. Criar avaliação
    const reviewId = await testCreateReview();
    
    // 3. Buscar avaliações
    await testGetReviews('533535');
    
    // 4. Buscar estatísticas
    await testGetStats('533535');
    
    console.log(`\n${colors.green}🎉 TESTES CONCLUÍDOS!${colors.reset}\n`);
}

// Executar
runAllTests();
