// Set detail page JavaScript
document.addEventListener('DOMContentLoaded', function () {
    loadSetDetails();
    setupEventListeners();
    loadRecentSets();
    setupSetPageSidebar();
});

// Load set details from localStorage
function loadSetDetails() {
    const currentSet = JSON.parse(localStorage.getItem('currentSet'));

    if (!currentSet) {
        // Redirect back to home if no set data
        window.location.href = 'index.html';
        return;
    }

    // Update page title and info
    document.getElementById('set-title').textContent = currentSet.name;
    document.getElementById('set-info').textContent =
        `${currentSet.series} • ${currentSet.date} • ${currentSet.cardCount} cards`;

    // Update page title
    document.title = `${currentSet.name} - PokéTCG Card Collector`;

    // Load cards for this set
    loadCards(currentSet.id);
}

// Setup event listeners for filters and back button
function setupEventListeners() {
    const cardSearch = document.getElementById('card-search');
    const setsSearchInput = document.getElementById('sets-search-input');

    if (cardSearch) cardSearch.addEventListener('input', handleCardFiltersFromSidebar);
    if (setsSearchInput) setsSearchInput.addEventListener('input', handleSetsSearch);

    // Setup sidebar filter items
    setupSetFilterItems();
}

// Setup sidebar for set page
function setupSetPageSidebar() {
    const sidebar = document.getElementById('filter-sidebar');
    const sidebarClose = document.getElementById('sidebar-close');
    const mobileToggle = document.getElementById('mobile-sidebar-toggle');

    // Close sidebar button
    if (sidebarClose) {
        sidebarClose.addEventListener('click', () => {
            sidebar.classList.add('collapsed');
        });
    }

    // Mobile floating toggle button
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            if (sidebar) {
                sidebar.classList.toggle('open');
                sidebar.classList.remove('collapsed');
            }
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && sidebar && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && !mobileToggle?.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
}

// Setup filter item click handlers for set page
function setupSetFilterItems() {
    // Rarity filter items
    document.querySelectorAll('#rarity-filters .filter-item').forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('active');
            handleCardFiltersFromSidebar();
        });
    });

    // Type filter items
    document.querySelectorAll('#type-filters .filter-item').forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('active');
            handleCardFiltersFromSidebar();
        });
    });
}

// Handle card filtering from sidebar
function handleCardFiltersFromSidebar() {
    const currentSet = JSON.parse(localStorage.getItem('currentSet'));
    let cards = window.sampleCards?.[currentSet.id] || generateSampleCards();

    // Apply search filter
    const cardSearch = document.getElementById('card-search');
    const searchTerm = cardSearch ? cardSearch.value.toLowerCase() : '';
    if (searchTerm) {
        cards = cards.filter(card =>
            card.name.toLowerCase().includes(searchTerm) ||
            card.number.includes(searchTerm)
        );
    }

    // Apply rarity filter from sidebar
    const activeRarities = Array.from(document.querySelectorAll('#rarity-filters .filter-item.active'))
        .map(item => item.dataset.rarity);

    if (activeRarities.length > 0) {
        cards = cards.filter(card => activeRarities.includes(card.rarity));
    }

    // Apply type filter from sidebar
    const activeTypes = Array.from(document.querySelectorAll('#type-filters .filter-item.active'))
        .map(item => item.dataset.type);

    if (activeTypes.length > 0) {
        cards = cards.filter(card => activeTypes.includes(card.type));
    }

    renderCards(cards);
}

// Load cards for the current set
function loadCards(setId) {
    // In a real application, this would fetch from an API
    // For demo purposes, we'll use sample data
    let cards = window.sampleCards?.[setId] || [];

    // If no specific cards for this set, generate some sample cards
    if (cards.length === 0) {
        cards = generateSampleCards();
    }

    renderCards(cards);
}

// Generate sample cards for demonstration
function generateSampleCards() {
    const sampleNames = [
        'Pikachu', 'Charizard', 'Blastoise', 'Venusaur', 'Mewtwo', 'Mew',
        'Lugia', 'Ho-Oh', 'Rayquaza', 'Groudon', 'Kyogre', 'Dialga',
        'Palkia', 'Giratina', 'Zekrom', 'Reshiram', 'Kyurem', 'Xerneas',
        'Professor Research', 'Ultra Ball', 'Quick Ball', 'Energy Switch',
        'Boss\'s Orders', 'Rare Candy', 'Switch', 'Potion',
        'Fire Energy', 'Water Energy', 'Grass Energy', 'Lightning Energy'
    ];

    const rarities = ['common', 'uncommon', 'rare', 'rare-holo', 'rare-ultra'];
    const types = ['pokemon', 'trainer', 'energy'];

    return sampleNames.map((name, index) => ({
        id: index + 1,
        name: name,
        number: String(index + 1).padStart(3, '0'),
        rarity: rarities[index % rarities.length],
        type: name.includes('Energy') ? 'energy' :
            ['Professor', 'Ball', 'Switch', 'Boss', 'Candy', 'Potion'].some(t => name.includes(t)) ? 'trainer' : 'pokemon'
    }));
}

// Render cards to the grid
function renderCards(cards) {
    const cardsGrid = document.getElementById('cards-grid');

    if (!cardsGrid) return;

    cardsGrid.innerHTML = '';

    cards.forEach(card => {
        const cardElement = createCardElement(card);
        cardsGrid.appendChild(cardElement);
    });

    if (cards.length === 0) {
        cardsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">🔍</div>
                <p class="empty-state-text">No cards found matching your filters.</p>
            </div>
        `;
    }
}

// Create individual card element with 3D hover effect
function createCardElement(card) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card-item';
    if (card.rarity === 'rare-holo' || card.rarity === 'rare-ultra') {
        cardDiv.classList.add('holo');
    }
    cardDiv.onclick = () => navigateToCard(card);

    // Get rarity display name
    const rarityNames = {
        'common': 'Common',
        'uncommon': 'Uncommon',
        'rare': 'Rare',
        'rare-holo': 'Rare Holo',
        'rare-ultra': 'Ultra Rare'
    };

    cardDiv.innerHTML = `
        <div class="card-image">
            <div style="text-align: center; color: var(--text-muted);">
                <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🃏</div>
                <div style="font-size: 0.8rem;">${card.name}</div>
            </div>
        </div>
        <div class="card-info">
            <div class="card-name">${card.name}</div>
            <div class="card-number">#${card.number} • ${rarityNames[card.rarity] || card.rarity}</div>
        </div>
    `;

    return cardDiv;
}

// Navigate to card price page
function navigateToCard(card) {
    // Store card data and current set info for the price page
    const currentSet = JSON.parse(localStorage.getItem('currentSet'));

    const cardData = {
        ...card,
        set: currentSet.name,
        setId: currentSet.id,
        setIcon: currentSet.icon
    };

    localStorage.setItem('currentCard', JSON.stringify(cardData));

    // Navigate to card detail page
    window.location.href = 'card.html';
}

// Load recent sets sidebar (same as card page)
function loadRecentSets(searchTerm = '') {
    const recentSetsList = document.getElementById('recent-sets-list');

    if (!recentSetsList) return;

    // Get all sets from window.pokemonSets (from script.js)
    let allSets = window.pokemonSets ? window.pokemonSets.slice(0, 20) : [];

    // Filter sets based on search term
    if (searchTerm) {
        allSets = window.pokemonSets.filter(set =>
            set.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            set.series.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 20);
    }

    recentSetsList.innerHTML = '';

    // Show filtered sets
    allSets.forEach(set => {
        const setItem = document.createElement('a');
        setItem.className = 'recent-set-item';
        setItem.href = '#';
        setItem.onclick = (e) => {
            e.preventDefault();
            navigateToSet(set);
        };

        setItem.innerHTML = `
            <div class="recent-set-icon ${set.seriesCode}">${set.icon}</div>
            <div class="recent-set-info">
                <div class="recent-set-name">${set.name}</div>
                <div class="recent-set-date">${set.date}</div>
            </div>
        `;

        recentSetsList.appendChild(setItem);
    });

    // Show message if no sets found
    if (allSets.length === 0 && searchTerm) {
        recentSetsList.innerHTML = '<p style="text-align: center; color: var(--text-muted); font-size: 0.875rem; padding: 1rem;">No sets found.</p>';
    }
}

// Handle sets search functionality
function handleSetsSearch() {
    const searchInput = document.getElementById('sets-search-input');
    const searchTerm = searchInput ? searchInput.value : '';
    loadRecentSets(searchTerm);
}

// Navigate to set (from recent sets sidebar)
function navigateToSet(set) {
    localStorage.setItem('currentSet', JSON.stringify(set));
    window.location.href = 'set.html';
}

// Toggle filter group (for sidebar accordion)
function toggleFilterGroup(header) {
    const group = header.parentElement;
    group.classList.toggle('collapsed');
}

// Export for global access
window.toggleFilterGroup = toggleFilterGroup;