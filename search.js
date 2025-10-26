/**
 * Gestion de la recherche de films et séries
 * Recherche dans le catalogue local (data.js)
 */

(function() {
    'use strict';

    let searchInput = null;
    let searchButton = null;
    let searchOverlay = null;
    let currentSearchQuery = '';
    let allMovies = []; // Tous les films du catalogue

    // Initialisation
    document.addEventListener('DOMContentLoaded', function() {
        initSearchElements();
        loadLocalCatalog();
        createSearchOverlay();
        setupSearchListeners();
    });

    /**
     * Charge tous les films du catalogue local
     */
    function loadLocalCatalog() {
        allMovies = [];
        
        // Charger depuis APP_DATA (data.js)
        if (window.APP_DATA) {
            // Récupère tous les films de toutes les sections
            if (window.APP_DATA.sections && Array.isArray(window.APP_DATA.sections)) {
                window.APP_DATA.sections.forEach(section => {
                    if (section.items && Array.isArray(section.items)) {
                        section.items.forEach(item => {
                            allMovies.push({
                                ...item,
                                section: section.title // Ajoute la section d'origine
                            });
                        });
                    }
                });
            }

            // Ajoute aussi les films du hero si disponibles
            if (window.APP_DATA.hero && Array.isArray(window.APP_DATA.hero)) {
                window.APP_DATA.hero.forEach(item => {
                    allMovies.push({
                        ...item,
                        section: 'Destaques'
                    });
                });
            }
        }
        
        // Charger depuis CATEGORIES_DATA (categories-data.js)
        if (window.CATEGORIES_DATA) {
            Object.keys(window.CATEGORIES_DATA).forEach(categoryKey => {
                const category = window.CATEGORIES_DATA[categoryKey];
                if (category.items && Array.isArray(category.items)) {
                    category.items.forEach(item => {
                        // Vérifier si le film n'existe pas déjà dans allMovies
                        const exists = allMovies.some(movie => 
                            movie.title === item.title && movie.year === item.year
                        );
                        
                        if (!exists) {
                            allMovies.push({
                                ...item,
                                section: category.title // Ajoute la catégorie d'origine
                            });
                        }
                    });
                }
            });
        }

        console.log(`${allMovies.length} filmes carregados no catálogo (incluindo categorias)`);
    }

    // Initialisation
    document.addEventListener('DOMContentLoaded', function() {
        initSearchElements();
        createSearchOverlay();
        setupSearchListeners();
    });

    /**
     * Initialise les éléments de recherche
     */
    function initSearchElements() {
        searchInput = document.querySelector('.search-input');
        searchButton = document.querySelector('.search-button');
    }

    /**
     * Crée l'overlay pour afficher les résultats
     */
    function createSearchOverlay() {
        searchOverlay = document.createElement('div');
        searchOverlay.className = 'search-results-overlay';
        searchOverlay.innerHTML = `
            <div class="search-results-container">
                <div class="search-results-header">
                    <div>
                        <h1 class="search-results-title">
                            <span>Resultados para</span>: 
                            <span class="search-query"></span>
                        </h1>
                        <p class="search-results-count"></p>
                    </div>
                    <button class="search-close-btn" aria-label="Fechar resultados">×</button>
                </div>
                <div class="search-results-content"></div>
            </div>
        `;
        document.body.appendChild(searchOverlay);

        // Bouton de fermeture
        searchOverlay.querySelector('.search-close-btn').addEventListener('click', closeSearchResults);
        
        // Fermer avec ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                closeSearchResults();
            }
        });

        // Fermer en cliquant sur l'overlay
        searchOverlay.addEventListener('click', function(e) {
            if (e.target === searchOverlay) {
                closeSearchResults();
            }
        });
    }

    /**
     * Configure les écouteurs d'événements
     */
    function setupSearchListeners() {
        if (!searchInput || !searchButton) return;

        // Recherche au clic sur le bouton
        searchButton.addEventListener('click', function() {
            performSearch();
        });

        // Recherche avec Enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // Recherche en temps réel (optionnel, avec debounce)
        let searchTimeout = null;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length >= 3) {
                searchTimeout = setTimeout(() => {
                    performSearch();
                }, 500); // Attendre 500ms après la dernière frappe
            }
        });
    }

    /**
     * Effectue une recherche
     */
    function performSearch() {
        const query = searchInput.value.trim();
        
        if (query.length < 2) {
            alert(getTranslation('search.minLength') || 'Digite pelo menos 2 caracteres');
            return;
        }

        currentSearchQuery = query;
        openSearchResults();
        showLoading();
        
        // Recherche locale au lieu de l'API
        setTimeout(() => {
            searchInLocalCatalog(query);
        }, 300); // Petit délai pour montrer le loading
    }

    /**
     * Recherche dans le catalogue local
     */
    function searchInLocalCatalog(query) {
        const searchTerm = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        
        const results = allMovies.filter(movie => {
            const title = (movie.title || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const description = (movie.description || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const year = (movie.year || '').toString();
            
            return title.includes(searchTerm) || 
                   description.includes(searchTerm) || 
                   year.includes(searchTerm);
        });

        displayResults(results);
    }

    /**
     * Affiche les résultats de recherche
     */
    function displayResults(results) {
        const contentDiv = searchOverlay.querySelector('.search-results-content');
        const querySpan = searchOverlay.querySelector('.search-query');
        const countP = searchOverlay.querySelector('.search-results-count');

        querySpan.textContent = `"${currentSearchQuery}"`;
        
        if (results.length === 0) {
            countP.textContent = '0 resultados encontrados';
        } else if (results.length === 1) {
            countP.textContent = '1 resultado encontrado';
        } else {
            countP.textContent = `${results.length} resultados encontrados`;
        }

        if (results.length === 0) {
            contentDiv.innerHTML = `
                <div class="search-no-results">
                    <div class="search-no-results-icon">🔍</div>
                    <h2 class="search-no-results-title">Nenhum resultado encontrado</h2>
                    <p class="search-no-results-text">Tente usar palavras-chave diferentes</p>
                </div>
            `;
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'search-results-grid';

        results.forEach((item, index) => {
            const card = createResultCard(item, index);
            grid.appendChild(card);
        });

        contentDiv.innerHTML = '';
        contentDiv.appendChild(grid);

        // Appliquer les traductions si disponibles
        if (window.applyTranslations) {
            window.applyTranslations();
        }
    }

    /**
     * Affiche les résultats de recherche
     */
    function displayResults(results) {
        const contentDiv = searchOverlay.querySelector('.search-results-content');
        const querySpan = searchOverlay.querySelector('.search-query');
        const countP = searchOverlay.querySelector('.search-results-count');

        querySpan.textContent = `"${currentSearchQuery}"`;
        countP.textContent = `${results.length} ${getTranslation('search.found') || 'resultados encontrados'}`;

        if (results.length === 0) {
            contentDiv.innerHTML = `
                <div class="search-no-results">
                    <div class="search-no-results-icon">🔍</div>
                    <h2 class="search-no-results-title" data-i18n="search.noResults">Nenhum resultado encontrado</h2>
                    <p class="search-no-results-text" data-i18n="search.tryAgain">Tente usar palavras-chave diferentes</p>
                </div>
            `;
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'search-results-grid';

        results.forEach((item, index) => {
            const card = createResultCard(item, index);
            grid.appendChild(card);
        });

        contentDiv.innerHTML = '';
        contentDiv.appendChild(grid);

        // Appliquer les traductions si disponibles
        if (window.applyTranslations) {
            window.applyTranslations();
        }
    }

    /**
     * Générer les étoiles en fonction de la note
     */
    function generateStars(rating) {
        if (!rating || rating === 'N/A' || rating === '—') return '';
        
        const numRating = parseFloat(rating);
        const maxStars = 5;
        const maxRating = 10;
        
        // Calculer le nombre d'étoiles pleines (sur 5)
        const filledStars = Math.round((numRating / maxRating) * maxStars);
        const emptyStars = maxStars - filledStars;
        
        return '★'.repeat(filledStars) + '☆'.repeat(emptyStars);
    }

    /**
     * Crée une carte de résultat
     */
    function createResultCard(item, index) {
        const card = document.createElement('div');
        card.className = 'search-result-card';
        card.style.animationDelay = `${index * 0.05}s`;

        const title = item.title || 'Sem título';
        const year = item.year || '';
        const rating = item.rating || 'N/A';
        const description = item.description || 'Sem descrição disponível';
        const section = item.section || '';
        const image = item.image || null;

        card.innerHTML = `
            <div class="search-result-poster">
                ${image ? 
                    `<img src="${image}" alt="${title}" loading="lazy">` :
                    `<div class="search-result-no-poster">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12z"/>
                        </svg>
                        <span>Sem imagem</span>
                    </div>`
                }
                ${section ? `<span class="search-result-type">${section}</span>` : ''}
                ${rating !== 'N/A' && rating !== '—' ? `
                    <span class="search-result-rating">
                        <span class="stars">${generateStars(rating)}</span>
                        <span>${rating}</span>
                    </span>
                ` : ''}
            </div>
            <div class="search-result-info">
                <h3 class="search-result-title">${title}</h3>
                ${year ? `<p class="search-result-year">${year}</p>` : ''}
                <p class="search-result-overview">${description}</p>
            </div>
        `;

        // Événement de clic
        card.addEventListener('click', function() {
            console.log('Clicado em:', item);
            showItemDetails(item);
        });

        return card;
    }

    /**
     * Affiche les détails d'un film/série
     */
    function showItemDetails(item) {
        const title = item.title;
        let details = `📽️ ${title}\n\n`;
        
        if (item.year) {
            details += `📅 Ano: ${item.year}\n`;
        }
        
        if (item.rating && item.rating !== '—') {
            details += `⭐ Nota: ${item.rating}\n`;
        }
        
        if (item.section) {
            details += `📂 Seção: ${item.section}\n`;
        }
        
        details += `\n${item.description || 'Sem descrição disponível'}`;
        
        alert(details);
    }

    /**
     * Affiche le spinner de chargement
     */
    function showLoading() {
        const contentDiv = searchOverlay.querySelector('.search-results-content');
        contentDiv.innerHTML = `
            <div class="search-loading">
                <div class="search-spinner"></div>
                <p class="search-loading-text">Procurando...</p>
            </div>
        `;
    }

    /**
     * Affiche un message d'erreur
     */
    function showError(message) {
        const contentDiv = searchOverlay.querySelector('.search-results-content');
        contentDiv.innerHTML = `
            <div class="search-no-results">
                <div class="search-no-results-icon">⚠️</div>
                <h2 class="search-no-results-title">Erro</h2>
                <p class="search-no-results-text">${message}</p>
            </div>
        `;
    }

    /**
     * Affiche le spinner de chargement
     */
    function showLoading() {
        const contentDiv = searchOverlay.querySelector('.search-results-content');
        contentDiv.innerHTML = `
            <div class="search-loading">
                <div class="search-spinner"></div>
                <p class="search-loading-text" data-i18n="search.loading">Procurando...</p>
            </div>
        `;
    }

    /**
     * Affiche un message d'erreur
     */
    function showError(message) {
        const contentDiv = searchOverlay.querySelector('.search-results-content');
        contentDiv.innerHTML = `
            <div class="search-no-results">
                <div class="search-no-results-icon">⚠️</div>
                <h2 class="search-no-results-title">Erro</h2>
                <p class="search-no-results-text">${message}</p>
            </div>
        `;
    }

    /**
     * Ouvre l'overlay de résultats
     */
    function openSearchResults() {
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Ferme l'overlay de résultats
     */
    function closeSearchResults() {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * Récupère une traduction
     */
    function getTranslation(key) {
        if (window.t && typeof window.t === 'function') {
            return window.t(key);
        }
        return null;
    }

    // Exposer des fonctions globalement si nécessaire
    window.searchModule = {
        search: performSearch,
        close: closeSearchResults,
        reloadCatalog: loadLocalCatalog
    };
})();
