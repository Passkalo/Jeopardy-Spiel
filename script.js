// Initial game data structure (empty)
let initialGameData = {
    categories: [],
};

// Game state variables
let gameData = JSON.parse(JSON.stringify(initialGameData));
let teams = [
    { id: 'team-1', name: 'Team A', score: 0 },
    { id: 'team-2', name: 'Team B', score: 0 },
];
let gameTitle = 'Jeopardy';
let brandenburgLogoUrl = ""; // CHANGED: Default logo URL is now empty
let mainColor = '#ad4d42';
// State for logo settings
let showLogo = false; // CHANGED: Logo is hidden by default
let logoPosition = 'right';
let logoSize = 80; // Default logo size in px

let activeQuestion = null; // Stores the currently active question
let board = []; // Stores the game board state during play

// HTML elements
const setupScreen = document.getElementById('setup-screen');
const playingScreen = document.getElementById('playing-screen');
const gameBoard = document.getElementById('game-board');
const questionModal = document.getElementById('question-modal');
const modalQuestion = document.getElementById('modal-question');
const modalAnswer = document.getElementById('modal-answer');
const modalPoints = document.getElementById('modal-points');
const teamScoresContainer = document.getElementById('team-scores');
const modalTeamsButtons = document.getElementById('modal-teams-buttons');
const gameTitleInput = document.getElementById('game-title-input');
const gameTitleDisplay = document.getElementById('game-title-display');
const logoUrlInput = document.getElementById('logo-url-input');
const mainColorInput = document.getElementById('main-color-input');
const topBar = document.getElementById('top-bar');
const teamsContainer = document.getElementById('teams-container');
const categoriesContainer = document.getElementById('categories-container');
const showAnswerContainer = document.getElementById('show-answer-container');
const answerContainer = document.getElementById('answer-container');
const showLogoCheckbox = document.getElementById('show-logo-checkbox');
const logoPositionSelect = document.getElementById('logo-position-select');
const logoSizeInput = document.getElementById('logo-size-input');
const headerContainer = document.getElementById('header-container');
const logoImgDisplay = document.getElementById('logo-img-display');
const logoSettingsCollapse = document.getElementById('logo-settings-collapse');
const logoSettingsContent = document.getElementById('logo-settings-content');
const logoSettingsArrow = document.getElementById('logo-settings-arrow');
const saveConfigBtn = document.getElementById('save-config-btn');
const loadConfigInput = document.getElementById('load-config-input');

// Event listeners
document.getElementById('start-game-btn').addEventListener('click', startGame);
document.getElementById('edit-settings-btn').addEventListener('click', () => {
    playingScreen.classList.add('hidden');
    setupScreen.classList.remove('hidden');
    renderSetupScreen();
});
document.getElementById('add-team-btn').addEventListener('click', addTeam);
document.getElementById('add-category-btn').addEventListener('click', addCategory);
document.getElementById('show-answer-btn').addEventListener('click', showAnswer);
document.getElementById('close-modal-btn').addEventListener('click', closeModal);
gameTitleInput.addEventListener('input', updateGameTitle);
logoUrlInput.addEventListener('input', updateLogoUrl);
mainColorInput.addEventListener('input', updateMainColor);
showLogoCheckbox.addEventListener('change', updateShowLogo);
logoPositionSelect.addEventListener('change', updateLogoPosition);
logoSizeInput.addEventListener('input', updateLogoSize);
document.getElementById('reset-defaults-btn').addEventListener('click', resetToDefaults);
logoSettingsCollapse.addEventListener('click', toggleLogoSettings);
saveConfigBtn.addEventListener('click', saveConfiguration);
loadConfigInput.addEventListener('change', loadConfiguration);

// Load state from the browser on page load
loadStateFromBrowser();
// Initial rendering of the setup screen
renderSetupScreen();

/**
 * Saves the current game configuration to the browser's local storage.
 * This ensures the state persists when the user reloads the page.
 */
function saveStateToBrowser() {
    try {
        const fullConfiguration = {
            gameData,
            teams,
            gameTitle,
            brandenburgLogoUrl,
            mainColor,
            showLogo,
            logoPosition,
            logoSize,
        };
        localStorage.setItem('jeopardyConfig', JSON.stringify(fullConfiguration));
    } catch (error) {
        console.error("Could not save state to browser:", error);
    }
}

/**
 * Loads a previously saved game configuration from local storage.
 * If no state is found or an error occurs, default values are used.
 */
function loadStateFromBrowser() {
    const savedState = localStorage.getItem('jeopardyConfig');
    if (savedState) {
        try {
            const loadedConfig = JSON.parse(savedState);
            gameData = loadedConfig.gameData;
            teams = loadedConfig.teams;
            gameTitle = loadedConfig.gameTitle;
            brandenburgLogoUrl = loadedConfig.brandenburgLogoUrl;
            mainColor = loadedConfig.mainColor;
            showLogo = loadedConfig.showLogo;
            logoPosition = loadedConfig.logoPosition;
            logoSize = loadedConfig.logoSize;
            
            // Update UI input fields
            gameTitleInput.value = gameTitle;
            logoUrlInput.value = brandenburgLogoUrl;
            mainColorInput.value = mainColor;
        } catch (error) {
            console.error("Error loading state from browser:", error);
            localStorage.removeItem('jeopardyConfig'); // Remove corrupted data
        }
    }
}


/**
 * Saves the current game configuration as a downloadable JSON file.
 * This allows users to back up or share their game setup.
 */
function saveConfiguration() {
    const fullConfiguration = {
        // Only save team names, scores are reset on load
        teams: teams.map(t => ({ name: t.name })), 
        gameData,
        gameTitle,
        brandenburgLogoUrl,
        mainColor,
        showLogo,
        logoPosition,
        logoSize,
    };

    const jsonString = JSON.stringify(fullConfiguration, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jeopardy-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Loads a game configuration from a user-selected JSON file.
 * This allows users to import a game setup.
 * @param {Event} event The file input change event.
 */
function loadConfiguration(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const loadedConfig = JSON.parse(e.target.result);

            if (!loadedConfig.gameData || !loadedConfig.teams || !loadedConfig.gameTitle) {
                alert('Error: The configuration file is invalid or corrupted.');
                return;
            }

            gameData = loadedConfig.gameData;
            // Re-create teams with new IDs and reset scores
            teams = loadedConfig.teams.map(team => ({
                id: crypto.randomUUID(),
                name: team.name,
                score: 0,
            }));
            
            gameTitle = loadedConfig.gameTitle;
            brandenburgLogoUrl = loadedConfig.brandenburgLogoUrl || "";
            mainColor = loadedConfig.mainColor || '#ad4d42';
            showLogo = typeof loadedConfig.showLogo === 'boolean' ? loadedConfig.showLogo : false;
            logoPosition = loadedConfig.logoPosition || 'right';
            logoSize = loadedConfig.logoSize || 80;
            
            gameTitleInput.value = gameTitle;
            logoUrlInput.value = brandenburgLogoUrl;
            mainColorInput.value = mainColor;

            renderSetupScreen();
            saveStateToBrowser(); // Save the loaded state to the browser
        } catch (error) {
            console.error("Error parsing JSON file:", error);
            alert('Error reading the file. Please ensure it is a valid JSON configuration file.');
        } finally {
            event.target.value = null; // Reset file input
        }
    };
    reader.readAsText(file);
}

/**
 * Toggles the visibility of the logo settings section.
 */
function toggleLogoSettings() {
    logoSettingsContent.classList.toggle('hidden');
    logoSettingsArrow.classList.toggle('rotate-180');
}

/**
 * Renders the setup screen based on the current gameData and teams state.
 * This function dynamically creates the UI for editing categories, questions, and teams.
 */
function renderSetupScreen() {
    teamsContainer.innerHTML = '';
    teams.forEach(team => {
        const teamDiv = document.createElement('div');
        teamDiv.className = 'flex items-center space-x-2';
        teamDiv.innerHTML = `
            <input type="text" class="p-2 border rounded-md" value="${team.name}" data-id="${team.id}" />
            <button class="bg-gray-500 text-white font-bold py-1 px-3 rounded-full hover:bg-gray-400" data-id="${team.id}">-</button>
        `;
        teamsContainer.appendChild(teamDiv);
        teamDiv.querySelector('button').addEventListener('click', (e) => removeTeam(e.target.dataset.id));
        teamDiv.querySelector('input').addEventListener('change', (e) => updateTeamName(e.target.dataset.id, e.target.value));
    });

    categoriesContainer.innerHTML = '';
    gameData.categories.forEach((category, categoryIndex) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-300';
        categoryDiv.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <input type="text" class="text-xl font-bold w-full p-2 border-b-2 border-gray-300 focus:outline-none" style="border-color: ${mainColor};" value="${category.name}" data-category-index="${categoryIndex}" />
                <button class="bg-gray-500 text-white font-bold py-1 px-3 rounded-full ml-2 hover:bg-gray-400" data-category-index="${categoryIndex}">Kategorie entfernen</button>
            </div>
            <div id="questions-container-${categoryIndex}"></div>
            <button class="mt-4 w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-400" data-category-index="${categoryIndex}">Neue Frage hinzufügen</button>
        `;
        categoriesContainer.appendChild(categoryDiv);

        const categoryNameInput = categoryDiv.querySelector(`input[data-category-index="${categoryIndex}"]`);
        categoryNameInput.addEventListener('change', (e) => updateCategoryName(e.target.dataset.categoryIndex, e.target.value));

        const questionsContainer = document.getElementById(`questions-container-${categoryIndex}`);
        category.questions.forEach((question, questionIndex) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'bg-gray-50 p-3 rounded-md mb-2 border border-gray-200';
            questionDiv.innerHTML = `
                <div class="flex justify-between items-center mb-2">
                    <h4 class="font-semibold">Frage ${questionIndex + 1}</h4>
                    <button class="bg-red-500 text-white font-bold py-1 px-2 rounded-full text-sm hover:bg-red-400" data-category-index="${categoryIndex}" data-question-index="${questionIndex}">Frage entfernen</button>
                </div>
                <div class="flex flex-col space-y-2">
                    <label>Punkte: <input type="number" class="w-full p-1 border rounded-md" value="${question.points}" data-category-index="${categoryIndex}" data-question-index="${questionIndex}" data-field="points" /></label>
                    <label>Frage: <input type="text" class="w-full p-1 border rounded-md" value="${question.question}" data-category-index="${categoryIndex}" data-question-index="${questionIndex}" data-field="question" /></label>
                    <label>Antwort: <input type="text" class="w-full p-1 border rounded-md" value="${question.answer}" data-category-index="${categoryIndex}" data-question-index="${questionIndex}" data-field="answer" /></label>
                </div>
            `;
            questionsContainer.appendChild(questionDiv);
            questionDiv.querySelectorAll('input').forEach(input => input.addEventListener('change', updateQuestion));
            questionDiv.querySelector('button').addEventListener('click', (e) => removeQuestion(parseInt(e.target.dataset.categoryIndex), parseInt(e.target.dataset.questionIndex)));
        });

        categoryDiv.querySelector(`button[data-category-index="${categoryIndex}"]`).addEventListener('click', (e) => removeCategory(parseInt(e.target.dataset.categoryIndex)));
        categoryDiv.querySelector(`button.bg-green-500`).addEventListener('click', (e) => addQuestion(parseInt(e.target.dataset.categoryIndex)));
    });

    // Update UI elements for branding settings
    showLogoCheckbox.checked = showLogo;
    logoPositionSelect.value = logoPosition;
    logoSizeInput.value = logoSize;
    updateBranding();
}

/**
 * Adds a new team to the game state.
 */
function addTeam() {
    const newTeamCount = teams.length + 1;
    const newTeam = { id: crypto.randomUUID(), name: `Team ${newTeamCount}`, score: 0 };
    teams.push(newTeam);
    renderSetupScreen();
    saveStateToBrowser();
}

/**
 * Removes a team from the game state by its ID.
 * @param {string} id The ID of the team to remove.
 */
function removeTeam(id) {
    teams = teams.filter(team => team.id !== id);
    renderSetupScreen();
    saveStateToBrowser();
}

/**
 * Updates a team's name.
 * @param {string} id The ID of the team.
 * @param {string} newName The new name for the team.
 */
function updateTeamName(id, newName) {
    const team = teams.find(t => t.id === id);
    if (team) team.name = newName;
    saveStateToBrowser();
}

/**
 * Updates a category's name.
 * @param {number} index The index of the category.
 * @param {string} newName The new name for the category.
 */
function updateCategoryName(index, newName) {
    const categoryIndex = parseInt(index);
    if (gameData.categories[categoryIndex]) gameData.categories[categoryIndex].name = newName;
    saveStateToBrowser();
}

/**
 * Adds a new, empty category to the game.
 */
function addCategory() {
    const newCategory = { name: `Neue Kategorie ${gameData.categories.length + 1}`, questions: [] };
    gameData.categories.push(newCategory);
    renderSetupScreen();
    saveStateToBrowser();
}

/**
 * Removes a category from the game.
 * @param {number} index The index of the category to remove.
 */
function removeCategory(index) {
    gameData.categories.splice(index, 1);
    renderSetupScreen();
    saveStateToBrowser();
}

/**
 * Adds a new, empty question to a specific category.
 * @param {number} categoryIndex The index of the category.
 */
function addQuestion(categoryIndex) {
    gameData.categories[categoryIndex].questions.push({ points: 0, question: "", answer: "" });
    renderSetupScreen();
    saveStateToBrowser();
}

/**
 * Updates a specific field (points, question, or answer) of a question.
 * @param {Event} e The change event from the input field.
 */
function updateQuestion(e) {
    const categoryIndex = parseInt(e.target.dataset.categoryIndex);
    const questionIndex = parseInt(e.target.dataset.questionIndex);
    const field = e.target.dataset.field;
    let value = e.target.value;
    if (field === 'points') value = parseInt(value) || 0;
    gameData.categories[categoryIndex].questions[questionIndex][field] = value;
    saveStateToBrowser();
}

/**
 * Removes a question from a category.
 * @param {number} categoryIndex The index of the category.
 * @param {number} questionIndex The index of the question.
 */
function removeQuestion(categoryIndex, questionIndex) {
    gameData.categories[categoryIndex].questions.splice(questionIndex, 1);
    renderSetupScreen();
    saveStateToBrowser();
}

/**
 * Updates the visual branding of the entire application (colors, logo, etc.).
 * This is called whenever a branding setting changes.
 */
function updateBranding() {
    gameTitleDisplay.style.color = mainColor;
    document.getElementById('setup-title').style.color = mainColor;
    topBar.style.backgroundColor = mainColor;
    document.querySelectorAll('input.border-b-2').forEach(input => input.style.borderColor = mainColor);
    document.getElementById('add-team-btn').style.backgroundColor = mainColor;
    document.getElementById('add-category-btn').style.backgroundColor = mainColor;
    document.getElementById('start-game-btn').style.backgroundColor = mainColor;
    gameBoard.style.gridTemplateColumns = `repeat(${gameData.categories.length}, 1fr)`;
    document.querySelectorAll('#game-board .text-white').forEach(title => title.style.backgroundColor = mainColor);
    document.querySelectorAll('#game-board .text-2xl').forEach(card => card.style.color = mainColor);
    
    // Logo display logic
    logoImgDisplay.src = brandenburgLogoUrl;
    logoImgDisplay.classList.toggle('hidden', !showLogo || !brandenburgLogoUrl);
    logoImgDisplay.style.height = `${logoSize}px`;
    headerContainer.classList.remove('items-start', 'items-center', 'items-end');
    gameTitleDisplay.classList.remove('self-start', 'self-center', 'self-end');
    headerContainer.classList.add('flex-col');
    logoImgDisplay.classList.add('order-first');
    gameTitleDisplay.classList.add('self-start');
    if (logoPosition === 'left') headerContainer.classList.add('items-start');
    else if (logoPosition === 'center') headerContainer.classList.add('items-center');
    else headerContainer.classList.add('items-end');
}

/**
 * Updates the game title and saves the state.
 * @param {Event} e The input event.
 */
function updateGameTitle(e) {
    gameTitle = e.target.value;
    gameTitleDisplay.textContent = gameTitle;
    saveStateToBrowser();
}

/**
 * Updates the logo URL and re-renders the branding.
 * @param {Event} e The input event.
 */
function updateLogoUrl(e) {
    brandenburgLogoUrl = e.target.value;
    updateBranding();
    saveStateToBrowser();
}

/**
 * Updates the main color and re-renders the branding.
 * @param {Event} e The input event.
 */
function updateMainColor(e) {
    mainColor = e.target.value;
    updateBranding();
    saveStateToBrowser();
}

/**
 * Updates the visibility of the logo and re-renders the branding.
 * @param {Event} e The change event.
 */
function updateShowLogo(e) {
    showLogo = e.target.checked;
    updateBranding();
    saveStateToBrowser();
}

/**
 * Updates the logo's position and re-renders the branding.
 * @param {Event} e The change event.
 */
function updateLogoPosition(e) {
    logoPosition = e.target.value;
    updateBranding();
    saveStateToBrowser();
}

/**
 * Updates the logo's size and re-renders the branding.
 * @param {Event} e The input event.
 */
function updateLogoSize(e) {
    logoSize = parseInt(e.target.value) || 80;
    updateBranding();
    saveStateToBrowser();
}

/**
 * Initializes the game board and switches from the setup screen to the playing screen.
 */
function startGame() {
    // Create a new board state with a 'played' flag for each question
    board = gameData.categories.map(category => ({
        ...category,
        questions: category.questions.map(q => ({ ...q, played: false }))
    }));
    setupScreen.classList.add('hidden');
    playingScreen.classList.remove('hidden');
    renderPlayingScreen();
}

/**
 * Resets the game configuration to its default values.
 */
function resetToDefaults() {
    teams = [
        { id: 'team-1', name: 'Team A', score: 0 },
        { id: 'team-2', name: 'Team B', score: 0 },
    ];
    gameTitle = 'Jeopardy';
    gameTitleInput.value = gameTitle;
    brandenburgLogoUrl = ""; // CHANGED: Default logo URL is now empty
    logoUrlInput.value = brandenburgLogoUrl;
    mainColor = '#ad4d42';
    mainColorInput.value = mainColor;
    showLogo = false; // CHANGED: Logo is hidden by default
    showLogoCheckbox.checked = showLogo;
    logoPosition = 'right';
    logoPositionSelect.value = logoPosition;
    logoSize = 80;
    logoSizeInput.value = logoSize;
    gameData = JSON.parse(JSON.stringify(initialGameData));
    renderSetupScreen();
    saveStateToBrowser(); // Save the empty state
}

/**
 * Renders the playing screen, including the game board and team scores.
 */
function renderPlayingScreen() {
    gameBoard.innerHTML = '';
    gameTitleDisplay.textContent = gameTitle;
    gameBoard.style.gridTemplateColumns = `repeat(${gameData.categories.length}, 1fr)`;

    // Render category headers
    gameData.categories.forEach((category, categoryIndex) => {
        const header = document.createElement('div');
        header.className = 'text-white text-center font-bold text-base md:text-xl p-2 rounded-t-lg border-b-2 border-white min-h-[60px] flex items-center justify-center';
        header.style.backgroundColor = mainColor;
        header.textContent = category.name;
        gameBoard.appendChild(header);
    });

    // Determine the maximum number of questions to render the grid correctly
    let maxQuestions = Math.max(0, ...gameData.categories.map(c => c.questions.length));

    // Render question cards for each category
    for (let questionIndex = 0; questionIndex < maxQuestions; questionIndex++) {
        gameData.categories.forEach((category, categoryIndex) => {
            const question = category.questions[questionIndex];
            const card = document.createElement('div');
            if (question) {
                // Style the card based on whether the question has been played
                card.className = `flex items-center justify-center p-4 cursor-pointer text-4xl md:text-5xl font-extrabold transition-all duration-300 transform hover:scale-105 rounded-lg ${board[categoryIndex].questions[questionIndex].played ? 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed' : 'bg-white border-2 border-gray-300 hover:bg-gray-200'}`;
                card.style.color = mainColor;
                card.innerHTML = `<span class="text-2xl font-bold" style="color: ${mainColor};">${question.points}</span>`;
                card.addEventListener('click', () => {
                    if (!board[categoryIndex].questions[questionIndex].played) {
                        handleQuestionClick(categoryIndex, questionIndex);
                    }
                });
            } else {
                // Render an empty card for categories with fewer questions
                card.className = 'bg-transparent p-4 rounded-lg cursor-not-allowed';
            }
            gameBoard.appendChild(card);
        });
    }

    // Render team scores
    teamScoresContainer.innerHTML = '';
    teams.forEach(team => {
        const teamDiv = document.createElement('div');
        teamDiv.className = 'flex flex-col items-center m-2';
        teamDiv.innerHTML = `
            <input type="text" class="text-center font-bold text-xl md:text-2xl text-black bg-transparent outline-none w-full border-b-2 focus:border-[#ad4d42] mb-2" style="border-color: ${mainColor}; color: ${mainColor};" value="${team.name}" data-id="${team.id}" />
            <div class="text-4xl md:text-5xl font-bold" style="color: ${mainColor};">${team.score} Punkte</div>
        `;
        teamScoresContainer.appendChild(teamDiv);
        teamDiv.querySelector('input').addEventListener('change', (e) => updateTeamName(e.target.dataset.id, e.target.value));
    });

    updateBranding();
}

/**
 * Handles a question card click. Displays the question modal.
 * @param {number} categoryIndex The index of the clicked question's category.
 * @param {number} questionIndex The index of the clicked question.
 */
function handleQuestionClick(categoryIndex, questionIndex) {
    activeQuestion = {
        ...board[categoryIndex].questions[questionIndex],
        categoryIndex,
        questionIndex
    };
    modalPoints.textContent = `${activeQuestion.points} Punkte`;
    modalPoints.style.color = mainColor;
    modalQuestion.textContent = activeQuestion.question;
    modalAnswer.textContent = activeQuestion.answer;
    modalAnswer.style.color = mainColor;
    showAnswerContainer.classList.remove('hidden');
    answerContainer.classList.add('hidden');
    modalTeamsButtons.innerHTML = '';
    questionModal.classList.remove('hidden');
}

/**
 * Reveals the answer in the modal and displays buttons to award points to teams.
 */
function showAnswer() {
    showAnswerContainer.classList.add('hidden');
    answerContainer.classList.remove('hidden');
    teams.forEach(team => {
        const button = document.createElement('button');
        button.className = 'bg-green-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 hover:scale-110 hover:bg-green-500 shadow-md';
        button.textContent = `${team.name}: +${activeQuestion.points} Punkte`;
        button.addEventListener('click', () => handleScoreUpdate(team.id, activeQuestion.points));
        modalTeamsButtons.appendChild(button);
    });
}

/**
 * Updates the score of a team and marks the current question as played.
 * @param {string} teamId The ID of the team to update.
 * @param {number} points The points to add to the team's score.
 */
function handleScoreUpdate(teamId, points) {
    const team = teams.find(t => t.id === teamId);
    if (team) team.score += points;
    board[activeQuestion.categoryIndex].questions[activeQuestion.questionIndex].played = true;
    closeModal();
    renderPlayingScreen();
    saveStateToBrowser(); // Save the new score
}

/**
 * Closes the question modal and resets the active question state.
 */
function closeModal() {
    questionModal.classList.add('hidden');
    activeQuestion = null;
}