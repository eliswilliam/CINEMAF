/**
 * User Reviews System - CINEMAF
 * Système de gestion des évaluations et commentaires des utilisateurs
 * Backend: MongoDB via API REST
 */

const UserReviews = {
    currentRating: 0,
    currentMovieId: null,
    apiBaseUrl: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:3001/api/reviews'
        : 'https://cinemaf.onrender.com/api/reviews',

    // Inicializar o sistema
    init() {
        console.log('🎬 UserReviews: Inicializando sistema de avaliações...');
        console.log('🌐 API Base URL:', this.apiBaseUrl);
        console.log('🌍 Hostname:', window.location.hostname);
        console.log('📍 Full URL:', window.location.href);
        
        // Obter ID do filme da URL
        const urlParams = new URLSearchParams(window.location.search);
        this.currentMovieId = urlParams.get('id');

        if (!this.currentMovieId) {
            console.warn('⚠️ ID do filme não encontrado na URL');
            return;
        }

        console.log('🎬 Movie ID:', this.currentMovieId);

        this.setupEventListeners();
        this.loadReviews();
        this.updateCharCount();
        
        console.log('✅ UserReviews: Sistema pronto!');
    },

    // Configurar event listeners
    setupEventListeners() {
        // Estrelas de rating
        const stars = document.querySelectorAll('.star-input');
        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                this.setRating(parseInt(e.target.dataset.value));
            });

            star.addEventListener('mouseenter', (e) => {
                this.highlightStars(parseInt(e.target.dataset.value));
            });
        });

        const ratingContainer = document.getElementById('star-rating-input');
        if (ratingContainer) {
            ratingContainer.addEventListener('mouseleave', () => {
                this.highlightStars(this.currentRating);
            });
        }

        // Contador de caracteres
        const textarea = document.getElementById('user-comment');
        if (textarea) {
            textarea.addEventListener('input', () => {
                this.updateCharCount();
            });
        }

        // Botão de envio
        const submitBtn = document.getElementById('submit-review-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.submitReview();
            });
        }
    },

    // Destacar estrelas
    highlightStars(count) {
        const stars = document.querySelectorAll('.star-input');
        stars.forEach((star, index) => {
            if (index < count) {
                star.textContent = '★';
                star.classList.add('filled');
            } else {
                star.textContent = '☆';
                star.classList.remove('filled');
            }
        });
    },

    // Definir rating
    setRating(value) {
        this.currentRating = value;
        this.highlightStars(value);
        
        const ratingValue = document.getElementById('rating-value');
        if (ratingValue) {
            ratingValue.textContent = `${value}/5`;
        }
    },

    // Atualizar contador de caracteres
    updateCharCount() {
        const textarea = document.getElementById('user-comment');
        const charCount = document.getElementById('char-count');
        
        if (textarea && charCount) {
            const length = textarea.value.length;
            charCount.textContent = `${length}/500`;
            
            if (length > 450) {
                charCount.style.color = '#ef4444';
            } else {
                charCount.style.color = 'rgba(255, 255, 255, 0.5)';
            }
        }
    },

    // Obter chave de armazenamento
    getStorageKey() {
        return `cinehome_reviews_${this.currentMovieId}`;
    },

    // Obter perfil atual
    getCurrentProfile() {
        const profileName = localStorage.getItem('cinehome_current_profile_name') || 
                           localStorage.getItem('cinehome_current_profile') || 
                           'Usuário';
        return profileName;
    },

    // Carregar avaliações do backend
    async loadReviews() {
        try {
            const url = `${this.apiBaseUrl}/${this.currentMovieId}`;
            console.log(`📡 Carregando avaliações do filme ${this.currentMovieId}...`);
            console.log(`🔗 URL completa: ${url}`);
            
            const response = await fetch(url);
            console.log(`📥 Response status: ${response.status} ${response.statusText}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('📦 Dados recebidos:', result);
            
            if (!result.success) {
                throw new Error(result.message || 'Erro ao carregar avaliações');
            }

            const reviews = result.data || [];
            console.log(`📋 ${reviews.length} avaliações carregadas do servidor`);
            this.displayReviews(reviews);
            
        } catch (error) {
            console.error('❌ Erro ao carregar avaliações do servidor:', error);
            console.error('❌ Error details:', {
                message: error.message,
                stack: error.stack
            });
            
            // Fallback: tentar carregar do localStorage
            console.log('🔄 Tentando carregar do localStorage...');
            this.loadReviewsFromLocalStorage();
        }
    },

    // Fallback: Carregar do localStorage
    loadReviewsFromLocalStorage() {
        try {
            const storageKey = this.getStorageKey();
            const reviewsData = localStorage.getItem(storageKey);
            const reviews = reviewsData ? JSON.parse(reviewsData) : [];
            
            console.log(`📋 ${reviews.length} avaliações carregadas do localStorage`);
            this.displayReviews(reviews);
        } catch (error) {
            console.error('❌ Erro ao carregar do localStorage:', error);
            this.displayReviews([]);
        }
    },

    // Exibir avaliações
    displayReviews(reviews) {
        const container = document.getElementById('reviews-container');
        const noReviews = document.getElementById('no-reviews');
        
        if (!container) return;

        if (reviews.length === 0) {
            if (noReviews) noReviews.style.display = 'flex';
            return;
        }

        if (noReviews) noReviews.style.display = 'none';

        // Ordenar por data (mais recente primeiro)
        reviews.sort((a, b) => new Date(b.date) - new Date(a.date));

        container.innerHTML = reviews.map(review => this.createReviewHTML(review)).join('');
    },

    // Criar HTML de uma avaliação
    createReviewHTML(review) {
        const stars = this.generateStarsHTML(review.rating);
        const initials = this.getInitials(review.username);
        const formattedDate = this.formatDate(review.date);

        return `
            <div class="review-card" data-review-id="${review.id}">
                <div class="review-header">
                    <div class="review-user-info">
                        <div class="review-avatar">${initials}</div>
                        <div class="review-user-details">
                            <div class="review-username">${this.escapeHTML(review.username)}</div>
                            <div class="review-date">${formattedDate}</div>
                        </div>
                    </div>
                    <div class="review-rating">
                        ${stars}
                    </div>
                </div>
                <p class="review-comment">${this.escapeHTML(review.comment)}</p>
            </div>
        `;
    },

    // Gerar HTML das estrelas
    generateStarsHTML(rating) {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                html += '<span class="review-star">★</span>';
            } else {
                html += '<span class="review-star empty">☆</span>';
            }
        }
        return html;
    },

    // Obter iniciais do nome
    getInitials(name) {
        const words = name.trim().split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    },

    // Formatar data
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Hoje';
        } else if (diffDays === 1) {
            return 'Ontem';
        } else if (diffDays < 7) {
            return `${diffDays} dias atrás`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} ${weeks === 1 ? 'semana' : 'semanas'} atrás`;
        } else {
            return date.toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
            });
        }
    },

    // Escapar HTML para prevenir XSS
    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // Submeter avaliação
    async submitReview() {
        const textarea = document.getElementById('user-comment');
        const comment = textarea.value.trim();

        // Validações
        if (this.currentRating === 0) {
            if (window.notify) {
                window.notify.warning('Atenção', 'Por favor, selecione uma nota de 1 a 5 estrelas');
            }
            return;
        }

        if (comment.length === 0) {
            if (window.notify) {
                window.notify.warning('Atenção', 'Por favor, escreva um comentário sobre o filme');
            }
            return;
        }

        if (comment.length < 10) {
            if (window.notify) {
                window.notify.warning('Atenção', 'Seu comentário deve ter pelo menos 10 caracteres');
            }
            return;
        }

        // Criar objeto de avaliação
        const review = {
            movieId: this.currentMovieId,
            username: this.getCurrentProfile(),
            rating: this.currentRating,
            comment: comment
        };

        // Desabilitar botão durante envio
        const submitBtn = document.getElementById('submit-review-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Publicando...';
        }

        // Salvar avaliação no backend
        const success = await this.saveReview(review);

        // Reabilitar botão
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
                Publicar Avaliação
            `;
        }

        if (success) {
            // Limpar formulário
            this.resetForm();

            // Notificação de sucesso
            if (window.notify) {
                window.notify.success(
                    'Avaliação Publicada!', 
                    'Obrigado por compartilhar sua opinião sobre o filme'
                );
            }
        }
    },

    // Salvar avaliação no backend
    async saveReview(review) {
        try {
            console.log('📡 Enviando avaliação para o servidor...', review);
            
            const response = await fetch(this.apiBaseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(review)
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Erro ao salvar avaliação');
            }

            console.log('✅ Avaliação salva no servidor:', result.data);
            
            // Recarregar avaliações
            await this.loadReviews();
            
            return true;
            
        } catch (error) {
            console.error('❌ Erro ao salvar no servidor:', error);
            
            // Fallback: salvar no localStorage
            if (window.notify) {
                window.notify.warning(
                    'Modo Offline', 
                    'Sua avaliação foi salva localmente e será sincronizada quando possível'
                );
            }
            
            this.saveReviewToLocalStorage(review);
            return true;
        }
    },

    // Fallback: Salvar no localStorage
    saveReviewToLocalStorage(review) {
        try {
            const storageKey = this.getStorageKey();
            const reviewsData = localStorage.getItem(storageKey);
            const reviews = reviewsData ? JSON.parse(reviewsData) : [];
            
            // Adicionar ID e data
            review.id = Date.now().toString();
            review.date = new Date().toISOString();
            
            reviews.push(review);
            localStorage.setItem(storageKey, JSON.stringify(reviews));
            
            console.log('💾 Avaliação salva no localStorage:', review);
            
            // Recarregar avaliações
            this.loadReviewsFromLocalStorage();
        } catch (error) {
            console.error('❌ Erro ao salvar no localStorage:', error);
            if (window.notify) {
                window.notify.error('Erro', 'Não foi possível salvar sua avaliação. Tente novamente.');
            }
        }
    },

    // Resetar formulário
    resetForm() {
        // Reset rating
        this.currentRating = 0;
        this.highlightStars(0);
        
        const ratingValue = document.getElementById('rating-value');
        if (ratingValue) {
            ratingValue.textContent = '0/5';
        }

        // Reset textarea
        const textarea = document.getElementById('user-comment');
        if (textarea) {
            textarea.value = '';
        }

        // Reset char count
        this.updateCharCount();
    }
};

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        UserReviews.init();
    });
} else {
    UserReviews.init();
}

// Exportar para window
window.UserReviews = UserReviews;
