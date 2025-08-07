// Global variables
let moviesData = [];
let filteredMovies = [];
let currentPage = 1;
const moviesPerPage = 12;
let currentSliderIndex = 0;

// DOM Ready
document.addEventListener('DOMContentLoaded', function () {
    // Load movies from XML
    loadMoviesFromXML();

    // Initialize components based on current page
    if (document.getElementById('movies-slider')) {
        initializeSlider();
    }

    if (document.getElementById('movies-grid')) {
        initializeCatalog();
    }

    if (document.getElementById('contact-form')) {
        initializeContactForm();
    }

    // Initialize navigation
    initializeNavigation();
});

// Load movies from XML file
async function loadMoviesFromXML() {
    try {
        const response = await fetch('movies.xml');
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        const movies = xmlDoc.getElementsByTagName('movie');
        moviesData = [];

        for (let movie of movies) {
            const movieData = {
                id: movie.getAttribute('id'),
                title: movie.getElementsByTagName('title')[0].textContent,
                year: movie.getElementsByTagName('year')[0].textContent,
                genre: movie.getElementsByTagName('genre')[0].textContent,
                director: movie.getElementsByTagName('director')[0].textContent,
                rating: movie.getElementsByTagName('rating')[0].textContent,
                price: parseFloat(movie.getElementsByTagName('price')[0].textContent),
                poster: movie.getElementsByTagName('poster')[0].textContent,
                description: movie.getElementsByTagName('description')[0].textContent,
                featured: movie.getElementsByTagName('featured')[0].textContent === 'true'
            };
            moviesData.push(movieData);
        }

        filteredMovies = [...moviesData];

        // Render content based on current page
        if (document.getElementById('movies-slider')) {
            renderFeaturedMovies();
        }

        if (document.getElementById('movies-grid')) {
            renderCatalogMovies();
            updateMovieCount();
        }

    } catch (error) {
        console.error('Error loading movies:', error);
        showErrorMessage('Failed to load movies. Please try again later.');
    }
}

// Initialize slider functionality
function initializeSlider() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentSliderIndex = Math.max(0, currentSliderIndex - 1);
            updateSliderPosition();
        });

        nextBtn.addEventListener('click', () => {
            const maxIndex = Math.max(0, getFeaturedMovies().length - 5);
            currentSliderIndex = Math.min(maxIndex, currentSliderIndex + 1);
            updateSliderPosition();
        });
    }
}

// Get featured movies
function getFeaturedMovies() {
    return moviesData.filter(movie => movie.featured);
}

// Render featured movies slider
function renderFeaturedMovies() {
    const slider = document.getElementById('movies-slider');
    if (!slider) return;

    const featuredMovies = getFeaturedMovies();

    slider.innerHTML = featuredMovies.map(movie => `
        <div class="movie-card">
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster" loading="lazy">
            <div class="movie-info">
                <h4 class="movie-title">${movie.title}</h4>
                <p class="movie-year">${movie.year}</p>
                <p class="movie-genre">${movie.genre}</p>
                <p class="movie-price">$${movie.price.toFixed(2)}</p>
                <button class="movie-buy-btn" onclick="buyMovie('${movie.id}')">
                    🛒 Buy Now
                </button>
            </div>
        </div>
    `).join('');
}

// Update slider position
function updateSliderPosition() {
    const slider = document.getElementById('movies-slider');
    if (!slider) return;

    const cardWidth = 220; // Including gap
    const translateX = -currentSliderIndex * cardWidth;
    slider.style.transform = `translateX(${translateX}px)`;

    // Update button states
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn) prevBtn.disabled = currentSliderIndex === 0;
    if (nextBtn) {
        const maxIndex = Math.max(0, getFeaturedMovies().length - 5);
        nextBtn.disabled = currentSliderIndex >= maxIndex;
    }
}

// Initialize catalog functionality
function initializeCatalog() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    // Filter functionality
    const genreFilter = document.getElementById('genre-filter');
    const priceFilter = document.getElementById('price-filter');
    const yearFilter = document.getElementById('year-filter');
    const sortSelect = document.getElementById('sort-select');

    if (genreFilter) genreFilter.addEventListener('change', applyFilters);
    if (priceFilter) priceFilter.addEventListener('change', applyFilters);
    if (yearFilter) yearFilter.addEventListener('change', applyFilters);
    if (sortSelect) sortSelect.addEventListener('change', applyFilters);
}

// Handle search
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();

    if (searchTerm === '') {
        filteredMovies = [...moviesData];
    } else {
        filteredMovies = moviesData.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm) ||
            movie.director.toLowerCase().includes(searchTerm) ||
            movie.genre.toLowerCase().includes(searchTerm)
        );
    }

    currentPage = 1;
    renderCatalogMovies();
    updateMovieCount();
}

// Apply filters and sorting
function applyFilters() {
    const genreFilter = document.getElementById('genre-filter').value;
    const priceFilter = document.getElementById('price-filter').value;
    const yearFilter = document.getElementById('year-filter').value;
    const sortOrder = document.getElementById('sort-select').value;
    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();

    // Start with all movies
    filteredMovies = [...moviesData];

    // Apply search filter
    if (searchTerm !== '') {
        filteredMovies = filteredMovies.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm) ||
            movie.director.toLowerCase().includes(searchTerm) ||
            movie.genre.toLowerCase().includes(searchTerm)
        );
    }

    // Apply genre filter
    if (genreFilter !== '') {
        filteredMovies = filteredMovies.filter(movie =>
            movie.genre.toLowerCase().includes(genreFilter.toLowerCase())
        );
    }

    // Apply price filter
    if (priceFilter !== '') {
        const [min, max] = priceFilter.split('-').map(p => p.replace('+', ''));
        filteredMovies = filteredMovies.filter(movie => {
            if (max) {
                return movie.price >= parseFloat(min) && movie.price <= parseFloat(max);
            } else {
                return movie.price >= parseFloat(min);
            }
        });
    }

    // Apply year filter
    if (yearFilter !== '') {
        filteredMovies = filteredMovies.filter(movie => {
            const year = parseInt(movie.year);
            switch (yearFilter) {
                case '2020s': return year >= 2020;
                case '2010s': return year >= 2010 && year < 2020;
                case '2000s': return year >= 2000 && year < 2010;
                case '1990s': return year >= 1990 && year < 2000;
                case 'classic': return year < 1990;
                default: return true;
            }
        });
    }

    // Apply sorting
    filteredMovies.sort((a, b) => {
        switch (sortOrder) {
            case 'newest':
                return parseInt(b.year) - parseInt(a.year);
            case 'oldest':
                return parseInt(a.year) - parseInt(b.year);
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'title':
                return a.title.localeCompare(b.title);
            case 'rating':
                return parseFloat(b.rating) - parseFloat(a.rating);
            default:
                return 0;
        }
    });

    currentPage = 1;
    renderCatalogMovies();
    updateMovieCount();
}

// Render catalog movies with pagination
function renderCatalogMovies() {
    const grid = document.getElementById('movies-grid');
    if (!grid) return;

    const startIndex = (currentPage - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    const moviesToShow = filteredMovies.slice(startIndex, endIndex);

    grid.innerHTML = moviesToShow.map(movie => `
        <div class="movie-card">
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster" loading="lazy">
            <div class="movie-info">
                <h4 class="movie-title">${movie.title}</h4>
                <p class="movie-year">${movie.year}</p>
                <p class="movie-genre">${movie.genre}</p>
                <p class="movie-price">$${movie.price.toFixed(2)}</p>
                <button class="movie-buy-btn" onclick="buyMovie('${movie.id}')">
                    🛒 Buy Now
                </button>
            </div>
        </div>
    `).join('');

    renderPagination();
}

// Render pagination
function renderPagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
    let paginationHTML = '';

    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button class="page-btn" onclick="changePage(${currentPage - 1})">← Prev</button>`;
    }

    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        paginationHTML += `<button class="page-btn ${activeClass}" onclick="changePage(${i})">${i}</button>`;
    }

    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button class="page-btn" onclick="changePage(${currentPage + 1})">Next →</button>`;
    }

    pagination.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    currentPage = page;
    renderCatalogMovies();
    scrollToTop();
}

// Update movie count display
function updateMovieCount() {
    const countElement = document.getElementById('movie-count');
    if (countElement) {
        countElement.textContent = `Showing ${filteredMovies.length} movies`;
    }
}

// Initialize contact form
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', handleContactFormSubmit);

    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearError(input));
    });
}

// Handle contact form submission
async function handleContactFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    // Validate all fields
    let isValid = true;
    const fields = ['name', 'email', 'subject', 'message'];

    fields.forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!validateField(field)) {
            isValid = false;
        }
    });

    if (!isValid) {
        return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    submitBtn.disabled = true;

    // Simulate form submission
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Show success message
        form.style.display = 'none';
        document.getElementById('form-success').style.display = 'block';

    } catch (error) {
        showErrorMessage('Failed to send message. Please try again.');
    } finally {
        // Reset loading state
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
    }
}

// Validate individual field
function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Clear previous error
    clearError(field);

    switch (fieldName) {
        case 'name':
            if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters long';
                isValid = false;
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            break;

        case 'subject':
            if (value === '') {
                errorMessage = 'Please select a subject';
                isValid = false;
            }
            break;

        case 'message':
            if (value.length < 10) {
                errorMessage = 'Message must be at least 10 characters long';
                isValid = false;
            }
            break;
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

// Show field error
function showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    field.style.borderColor = 'var(--accent-red)';
}

// Clear field error
function clearError(field) {
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    field.style.borderColor = 'var(--border-color)';
}

// Initialize navigation
function initializeNavigation() {
    // Handle hero buttons
    const browseCatalogBtn = document.querySelector('.btn-primary');
    if (browseCatalogBtn && browseCatalogBtn.textContent.includes('Browse Catalog')) {
        browseCatalogBtn.addEventListener('click', () => {
            window.location.href = 'catalog.html';
        });
    }
}

// Buy movie function
function buyMovie(movieId) {
    const movie = moviesData.find(m => m.id === movieId);
    if (movie) {
        // Simulate purchase process
        if (confirm(`Purchase "${movie.title}" for $${movie.price.toFixed(2)}?`)) {
            alert(`Thank you for purchasing "${movie.title}"! You will receive download instructions via email.`);
        }
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showErrorMessage(message) {
    alert(message); // In a real app, you'd use a better notification system
}

// Export functions for global access
window.changePage = changePage;
window.buyMovie = buyMovie;
