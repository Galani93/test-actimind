let currentIndex = 0;
let allData = [];

const modal = document.getElementById("cardsModal");
const cardsContainer = document.getElementById("cards-container");

function openModal() {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
    if (currentIndex === 0) {
        loadCards();
    }
}

function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    cardsContainer.innerHTML = '';
    currentIndex = 0;
    allData = [];
    const loadButton = document.querySelector('.btn-load');
    if (loadButton) {
        loadButton.innerHTML = '<i class="fas fa-download"></i> Load Cards';
        loadButton.disabled = false;
    }
}

window.onclick = function(event) {
    if (event.target === modal) {
        closeModal();
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.style.display === "block") {
        closeModal();
    }
});

async function loadCards() {
    const loadButton = document.querySelector('.btn-load');
    if (loadButton.disabled) return;
    try {
        loadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        loadButton.disabled = true;

        if (allData.length === 0) {
            const response = await fetch('https://microsoftedge.github.io/Demos/json-dummy-data/64KB.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allData = await response.json();
        }

        const itemsToShow = allData.slice(currentIndex, currentIndex + 10);
        
        if (itemsToShow.length === 0) {
            showEndMessage();
            loadButton.innerHTML = '<i class="fas fa-check"></i> All Data Loaded';
            loadButton.disabled = true;
            return;
        }

        itemsToShow.forEach(item => {
            const card = createCard(item);
            cardsContainer.appendChild(card);
        });

        currentIndex += 10;

        const remainingItems = allData.length - currentIndex;
        if (remainingItems > 0) {
            loadButton.innerHTML = `<i class="fas fa-download"></i> Load More (${remainingItems} left)`;
            loadButton.disabled = false;
        } else {
            showEndMessage();
            loadButton.innerHTML = '<i class="fas fa-check"></i> All Data Loaded';
            loadButton.disabled = true;
        }

    } catch (error) {
        showErrorMessage(error.message);
        loadButton.innerHTML = '<i class="fas fa-download"></i> Load Cards';
        loadButton.disabled = false;
    }
}

function createCard(item) {
    const card = document.createElement('div');
    card.className = 'card';
    
    const initials = getInitials(item.name);
    
    card.innerHTML = `
        <div class="card-header">
            <div class="card-avatar">
                ${initials}
            </div>
            <div class="card-info">
                <h3>${item.name}</h3>
                <p>${item.language}</p>
            </div>
        </div>
        <div class="card-content">
            <p class="card-bio">${item.bio}</p>
        </div>
        <div class="card-footer">
            <span class="card-id">ID: ${item.id}</span>
            <span class="card-version">v${item.version}</span>
        </div>
    `;
    
    return card;
}

function getInitials(name) {
    return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function showAlert(type, message) {
    const alertDiv = document.getElementById('modal-alert');
    alertDiv.className = 'modal-alert ' + type;
    let icon = '';
    if (type === 'success') icon = '<span class="alert-icon"><i class="fas fa-check-circle"></i></span>';
    if (type === 'error') icon = '<span class="alert-icon"><i class="fas fa-exclamation-triangle"></i></span>';
    alertDiv.innerHTML = icon + message;
    alertDiv.style.display = 'flex';
    alertDiv.style.opacity = '1';
    alertDiv.style.transform = 'translateY(0)';
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        alertDiv.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            alertDiv.style.display = 'none';
        }, 300);
    }, 3000);
}

function showErrorMessage(message) {
    showAlert('error', `<strong>Loading Error:</strong> ${message}`);
}

function showEndMessage() {
    showAlert('success', `<strong>All Data Loaded!</strong> No more cards available.`);
}