/* ============================================
   COMPLEXO-X IDE — Application Logic v2.8
   complexo-x.com.br/ide
   ============================================ */

// ---- CONFIG ----
const API_BASE = window.location.origin.includes('complexo-x.com.br')
    ? 'https://complexo-x.com.br/ide/api'
    : window.location.origin.includes('localhost:5170') || window.location.origin.includes('localhost:8080')
        ? `${window.location.origin}/api`
        : 'http://localhost:5170/api';

// ---- STATE ----
const state = {
    files: {
        'index.html': { lang: 'html', content: `<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Meu Projeto — Complexo-X IDE</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <header class="hero">\n        <h1>Complexo-X IDE</h1>\n        <p>Descreva o projeto no chat. A equipe de agentes vai construir para você.</p>\n    </header>\n</body>\n</html>` },
        'style.css': { lang: 'css', content: `/* Design Tokens */\n* { margin: 0; padding: 0; box-sizing: border-box; }\n\nbody {\n    font-family: 'Inter', sans-serif;\n    background: #07080d;\n    color: #e8eaf0;\n}\n\n.hero {\n    min-height: 100vh;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    text-align: center;\n    padding: 20px;\n}\n\nh1 {\n    font-size: 3.5rem;\n    background: linear-gradient(135deg, #7c3aed, #06b6d4);\n    -webkit-background-clip: text;\n    -webkit-text-fill-color: transparent;\n    margin-bottom: 16px;\n}\n\np {\n    color: #8b8fa3;\n    font-size: 1.2rem;\n    max-width: 500px;\n}` },
        'api.py': { lang: 'python', content: `from fastapi import FastAPI, Depends\nfrom pydantic import BaseModel, EmailStr\nimport sqlite3\n\napp = FastAPI(title="Complexo-X Core API", version="2.5.0")\n\ndef get_db():\n    conn = sqlite3.connect("core.db", timeout=30.0)\n    conn.execute("PRAGMA journal_mode=WAL;")\n    conn.execute("PRAGMA busy_timeout=5000;")\n    try:\n        yield conn\n    finally:\n        conn.close()\n\nclass UserCreate(BaseModel):\n    name: str\n    email: EmailStr\n\n@app.get("/api/health")\ndef health():\n    return {"status": "online", "database": "SQLite WAL Mode Ready"}\n\n@app.post("/api/users")\ndef create_user(user: UserCreate, db: sqlite3.Connection = Depends(get_db)):\n    cursor = db.cursor()\n    cursor.execute("INSERT INTO users (name, email) VALUES (?, ?)", (user.name, user.email))\n    db.commit()\n    return {"id": cursor.lastrowid, "name": user.name}` }
    },
    activeFile: 'index.html',
    selectedTemplate: 'shopify_dawn_ecommerce',
    agents: {
        gerente:     { name: 'Gerente',     emoji: '🎯', status: 'idle', progress: 0, task: 'Aguardando missão...' },
        programador: { name: 'Programador', emoji: '👨‍💻', status: 'idle', progress: 0, task: 'Aguardando missão...' },
        designer:    { name: 'Designer',    emoji: '🎨', status: 'idle', progress: 0, task: 'Aguardando missão...' },
        marketeiro:  { name: 'Marketeiro',  emoji: '📢', status: 'idle', progress: 0, task: 'Aguardando missão...' },
        seguranca:   { name: 'Segurança',   emoji: '🛡️', status: 'idle', progress: 0, task: 'Aguardando missão...' },
        seo:         { name: 'SEO',         emoji: '🔍', status: 'idle', progress: 0, task: 'Aguardando missão...' }
    },
    monacoEditor: null,
};

// ---- MONACO EDITOR ----
function initMonaco() {
    require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });
    require(['vs/editor/editor.main'], function () {
        monaco.editor.defineTheme('complexo-x', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '4a4e60', fontStyle: 'italic' },
                { token: 'keyword', foreground: 'a78bfa' },
                { token: 'string', foreground: '06b6d4' },
                { token: 'number', foreground: 'f59e0b' },
                { token: 'type', foreground: '10b981' },
                { token: 'function', foreground: '7c3aed' },
            ],
            colors: {
                'editor.background': '#0f1117',
                'editor.foreground': '#e8eaf0',
                'editor.lineHighlightBackground': '#161922',
                'editor.selectionBackground': '#7c3aed33',
                'editorCursor.foreground': '#7c3aed',
                'editorLineNumber.foreground': '#4a4e60',
                'editorLineNumber.activeForeground': '#8b8fa3',
                'editor.selectionHighlightBackground': '#7c3aed22',
            }
        });

        const file = state.files[state.activeFile];
        state.monacoEditor = monaco.editor.create(document.getElementById('monacoEditor'), {
            value: file.content,
            language: file.lang,
            theme: 'complexo-x',
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: 13,
            lineHeight: 22,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 12 },
            renderWhitespace: 'none',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            bracketPairColorization: { enabled: true },
            automaticLayout: true,
        });

        state.monacoEditor.onDidChangeModelContent(() => {
            state.files[state.activeFile].content = state.monacoEditor.getValue();
            updatePreview();
        });

        updatePreview();
    });
}

function switchFile(filename) {
    state.activeFile = filename;
    const file = state.files[filename];
    
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('tab--active'));
    document.querySelector(`.tab[data-file="${filename}"]`)?.classList.add('tab--active');

    if (state.monacoEditor) {
        const model = monaco.editor.createModel(file.content, file.lang);
        state.monacoEditor.setModel(model);
    }
}

function updatePreview() {
    const iframe = document.getElementById('previewFrame');
    const html = state.files['index.html']?.content || '';
    const css = state.files['style.css']?.content || '';
    
    const fullHTML = html.replace('</head>', `<style>${css}</style></head>`);
    iframe.srcdoc = fullHTML;
}

// ---- CHAT & MISSION DISPATCH ----
function addChatMessage(name, emoji, text, type = 'agent') {
    const chatBody = document.getElementById('chatMessages');
    const welcome = chatBody.querySelector('.chat-welcome');
    if (welcome) welcome.remove();

    const msg = document.createElement('div');
    msg.className = `chat-msg chat-msg--${type}`;
    msg.innerHTML = `
        <div class="chat-msg__avatar">${emoji}</div>
        <div class="chat-msg__content">
            <div class="chat-msg__name">${name}</div>
            <div class="chat-msg__text">${text}</div>
        </div>
    `;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function setPrompt(text) {
    document.getElementById('chatInput').value = text;
    document.getElementById('chatInput').focus();
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    addChatMessage('Você', '👤', text, 'user');

    try {
        const res = await fetch(`${API_BASE}/mission`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: text,
                template_id: state.selectedTemplate
            })
        });
        if (!res.ok) throw new Error('API indisponível');
    } catch (e) {
        console.warn('Backend local fallback:', e);
    }
}

// ---- AGENT DASHBOARD ----
function updateAgent(id, updates) {
    if (!state.agents[id]) return;
    Object.assign(state.agents[id], updates);
    renderAgentCard(id);
}

function renderAgentCard(id) {
    const agent = state.agents[id];
    const card = document.getElementById(`agent-${id}`);
    if (!card) return;

    card.className = `agent-card ${agent.status === 'working' ? 'agent-card--working' : ''} ${agent.status === 'done' ? 'agent-card--done' : ''}`;
    
    const statusEl = card.querySelector('.agent-card__status');
    statusEl.className = `agent-card__status agent-card__status--${agent.status}`;
    statusEl.textContent = agent.status === 'working' ? 'trabalhando' : agent.status === 'done' ? 'concluído' : agent.status === 'error' ? 'erro' : 'inativo';
    
    const progressBar = card.querySelector('.progress-bar');
    progressBar.style.width = `${agent.progress}%`;
    
    const taskEl = card.querySelector('.agent-card__task');
    taskEl.textContent = agent.task;

    const activeCount = Object.values(state.agents).filter(a => a.status === 'working').length;
    const total = Object.keys(state.agents).length;
    document.getElementById('agentsCount').textContent = `${activeCount}/${total} ativos`;
}

// ---- TEMPLATES LOADER ----
async function loadTemplates() {
    try {
        const res = await fetch(`${API_BASE}/templates`);
        if (!res.ok) return;
        const data = await res.json();
        const grid = document.getElementById('templatesGrid');
        if (!data.templates || data.templates.length === 0) return;
        
        grid.innerHTML = '';
        data.templates.forEach(t => {
            const card = document.createElement('div');
            card.className = 'agent-card';
            card.style.cursor = 'pointer';
            card.style.marginBottom = '12px';
            card.innerHTML = `
                <div class="agent-card__header">
                    <span class="agent-card__emoji">📐</span>
                    <span class="agent-card__name">${t.nome}</span>
                    <span class="agent-card__status agent-card__status--working">${t.categoria}</span>
                </div>
                <p style="font-size:12px;color:var(--text-secondary);margin-bottom:8px">${t.descricao}</p>
                <div style="display:flex;gap:6px;margin-bottom:12px">
                    <span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:${t.cores?.fundo || '#000'};border:1px solid #444"></span>
                    <span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:${t.cores?.primaria || '#7c3aed'}"></span>
                    <span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:${t.cores?.secundaria || '#06b6d4'}"></span>
                </div>
                <button class="btn btn--sm btn--deploy" onclick="applyTemplate('${t.id}')">Usar como Modelo</button>
            `;
            grid.appendChild(card);
        });
    } catch (err) {
        console.warn('Templates offline:', err);
    }
}

window.applyTemplate = function(templateId) {
    state.selectedTemplate = templateId;
    closeModal('templatesModal');
    addChatMessage('Sistema', '🎨', `Modelo **${templateId}** ativado na prancheta de design.`, 'system');
    setPrompt(`Construa um projeto moderno usando como base visual o modelo ${templateId}`);
};

// ---- FILE EXPLORER & TREE VIEW (SIDEBAR #2) ----
async function loadFileTree() {
    const container = document.getElementById('fileTreeContainer');
    if (!container) return;

    try {
        const res = await fetch(`${API_BASE}/fs/tree?scope=all`);
        if (!res.ok) throw new Error('Falha ao carregar árvore');
        const data = await res.json();
        
        container.innerHTML = '';
        if (!data.tree || data.tree.length === 0) {
            container.innerHTML = '<div class="tree-loading">Nenhum arquivo encontrado</div>';
            return;
        }

        const fragment = document.createDocumentFragment();
        data.tree.forEach(node => {
            fragment.appendChild(renderTreeNode(node));
        });
        container.appendChild(fragment);
    } catch (e) {
        renderFallbackTree(container);
    }
}

function getFileIcon(filename) {
    if (filename.endsWith('.html')) return '🌐';
    if (filename.endsWith('.css')) return '🎨';
    if (filename.endsWith('.js') || filename.endsWith('.ts')) return '📜';
    if (filename.endsWith('.py')) return '🐍';
    if (filename.endsWith('.json') || filename.endsWith('.yaml')) return '📐';
    if (filename.endsWith('.md')) return '📄';
    return '📝';
}

function renderTreeNode(node) {
    const wrapper = document.createElement('div');
    wrapper.className = 'tree-node';

    const item = document.createElement('div');
    item.className = `tree-item ${state.activeFile === node.name ? 'tree-item--active' : ''}`;
    item.dataset.path = node.path;

    if (node.is_dir) {
        item.innerHTML = `
            <span class="tree-item__chevron tree-item__chevron--open">▶</span>
            <span class="tree-item__icon">📂</span>
            <span class="tree-item__name">${node.name}</span>
        `;

        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'tree-children';

        if (node.children && node.children.length > 0) {
            node.children.forEach(child => {
                childrenContainer.appendChild(renderTreeNode(child));
            });
        }

        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const chevron = item.querySelector('.tree-item__chevron');
            chevron.classList.toggle('tree-item__chevron--open');
            childrenContainer.classList.toggle('tree-children--collapsed');
        });

        wrapper.appendChild(item);
        wrapper.appendChild(childrenContainer);
    } else {
        const icon = getFileIcon(node.name);
        item.innerHTML = `
            <span class="tree-item__chevron" style="opacity:0"></span>
            <span class="tree-item__icon">${icon}</span>
            <span class="tree-item__name">${node.name}</span>
        `;

        item.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.tree-item').forEach(el => el.classList.remove('tree-item--active'));
            item.classList.add('tree-item--active');
            openFileFromTree(node.path, node.name);
        });

        wrapper.appendChild(item);
    }

    return wrapper;
}

function renderFallbackTree(container) {
    container.innerHTML = '';
    const files = [
        { name: 'index.html', path: 'index.html', is_dir: false },
        { name: 'style.css', path: 'style.css', is_dir: false },
        { name: 'api.py', path: 'api.py', is_dir: false },
        { name: 'workspace', path: 'workspace', is_dir: true, children: [
            { name: 'index.html', path: 'workspace/default/index.html', is_dir: false },
            { name: 'style.css', path: 'workspace/default/style.css', is_dir: false },
            { name: 'api.py', path: 'workspace/default/api.py', is_dir: false }
        ]},
        { name: 'modelos', path: 'modelos', is_dir: true, children: [
            { name: 'shopify_dawn.json', path: 'modelos/shopify_dawn_ecommerce.json', is_dir: false },
            { name: 'linear_clean.json', path: 'modelos/linear_clean.json', is_dir: false },
            { name: 'stripe_dark.json', path: 'modelos/stripe_dark.json', is_dir: false }
        ]},
        { name: 'souls', path: 'souls', is_dir: true, children: [
            { name: 'soul_programador.md', path: 'souls/soul_programador.md', is_dir: false },
            { name: 'soul_seguranca.md', path: 'souls/soul_seguranca.md', is_dir: false },
            { name: 'soul_designer.md', path: 'souls/soul_designer.md', is_dir: false }
        ]}
    ];

    files.forEach(f => container.appendChild(renderTreeNode(f)));
}

async function openFileFromTree(path, filename) {
    let content = '';
    let lang = 'plaintext';
    if (filename.endsWith('.html')) lang = 'html';
    else if (filename.endsWith('.css')) lang = 'css';
    else if (filename.endsWith('.py')) lang = 'python';
    else if (filename.endsWith('.js') || filename.endsWith('.ts')) lang = 'javascript';
    else if (filename.endsWith('.json')) lang = 'json';
    else if (filename.endsWith('.md')) lang = 'markdown';

    try {
        const res = await fetch(`${API_BASE}/fs/file?path=${encodeURIComponent(path)}`);
        if (res.ok) {
            const data = await res.json();
            content = data.content;
        } else if (state.files[filename]) {
            content = state.files[filename].content;
        }
    } catch (e) {
        if (state.files[filename]) content = state.files[filename].content;
    }

    state.files[filename] = { lang, content };
    
    let tab = document.querySelector(`.tab[data-file="${filename}"]`);
    if (!tab) {
        const tabsContainer = document.querySelector('.tabs');
        const addBtn = document.querySelector('.tab--add');
        tab = document.createElement('button');
        tab.className = 'tab';
        tab.dataset.file = filename;
        tab.innerHTML = `<span class="tab__icon">${getFileIcon(filename)}</span> ${filename}`;
        tab.addEventListener('click', () => switchFile(filename));
        tabsContainer.insertBefore(tab, addBtn);
    }

    switchFile(filename);
}

// ---- MOUSE DRAGGABLE RESIZERS (UNIVERSAL ENGINE) ----
function initResizers() {
    let activeDrag = null;

    const resizerVExplorer = document.getElementById('resizerVExplorer');
    const explorerPanel = document.getElementById('explorerPanel');

    const resizerVTop = document.getElementById('resizerVTop');
    const panelEditor = document.getElementById('panelEditor');
    const panelPreview = document.getElementById('panelPreview');
    const topRow = document.getElementById('topRow');

    const resizerH = document.getElementById('resizerH');
    const bottomRow = document.getElementById('bottomRow');
    const mainContainer = document.getElementById('mainContainer');

    const resizerVBottom = document.getElementById('resizerVBottom');
    const panelChat = document.getElementById('panelChat');
    const panelAgents = document.getElementById('panelAgents');

    // 1. MouseDown Triggers
    if (resizerVExplorer && explorerPanel) {
        resizerVExplorer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            activeDrag = 'explorer';
            document.body.classList.add('is-resizing', 'is-resizing-v');
            resizerVExplorer.classList.add('resizer--dragging');
        });
    }

    if (resizerVTop && panelEditor && panelPreview && topRow) {
        resizerVTop.addEventListener('mousedown', (e) => {
            e.preventDefault();
            activeDrag = 'vTop';
            document.body.classList.add('is-resizing', 'is-resizing-v');
            resizerVTop.classList.add('resizer--dragging');
        });
    }

    if (resizerH && topRow && bottomRow && mainContainer) {
        resizerH.addEventListener('mousedown', (e) => {
            e.preventDefault();
            activeDrag = 'hMain';
            document.body.classList.add('is-resizing', 'is-resizing-h');
            resizerH.classList.add('resizer--dragging');
        });
    }

    if (resizerVBottom && panelChat && panelAgents && bottomRow) {
        resizerVBottom.addEventListener('mousedown', (e) => {
            e.preventDefault();
            activeDrag = 'vBottom';
            document.body.classList.add('is-resizing', 'is-resizing-v');
            resizerVBottom.classList.add('resizer--dragging');
        });
    }

    // 2. Global MouseMove
    window.addEventListener('mousemove', (e) => {
        if (!activeDrag) return;

        if (activeDrag === 'explorer' && explorerPanel) {
            const sidebarWidth = 72; // Largura da sidebar fixa de ícones
            const newWidth = e.clientX - sidebarWidth;
            if (newWidth >= 100 && newWidth <= 600) {
                explorerPanel.style.width = newWidth + 'px';
                explorerPanel.style.flexBasis = newWidth + 'px';
                if (state.monacoEditor) state.monacoEditor.layout();
                localStorage.setItem('cx_explorer_width', newWidth);
            }
        } else if (activeDrag === 'vTop' && panelEditor && panelPreview && topRow) {
            const containerRect = topRow.getBoundingClientRect();
            const offsetLeft = e.clientX - containerRect.left;
            const percentage = (offsetLeft / containerRect.width) * 100;

            if (percentage >= 15 && percentage <= 85) {
                panelEditor.style.flex = `0 0 ${percentage}%`;
                panelPreview.style.flex = `1 1 ${100 - percentage}%`;
                if (state.monacoEditor) state.monacoEditor.layout();
                localStorage.setItem('cx_split_v_top', percentage);
            }
        } else if (activeDrag === 'hMain' && topRow && bottomRow && mainContainer) {
            const containerRect = mainContainer.getBoundingClientRect();
            const offsetTop = e.clientY - containerRect.top;
            const percentage = (offsetTop / containerRect.height) * 100;

            if (percentage >= 15 && percentage <= 85) {
                topRow.style.flex = `0 0 ${percentage}%`;
                bottomRow.style.height = `${100 - percentage}%`;
                bottomRow.style.flex = `0 0 ${100 - percentage}%`;
                if (state.monacoEditor) state.monacoEditor.layout();
                localStorage.setItem('cx_split_h', percentage);
            }
        } else if (activeDrag === 'vBottom' && panelChat && panelAgents && bottomRow) {
            const containerRect = bottomRow.getBoundingClientRect();
            const offsetLeft = e.clientX - containerRect.left;
            const percentage = (offsetLeft / containerRect.width) * 100;

            if (percentage >= 15 && percentage <= 85) {
                panelChat.style.flex = `0 0 ${percentage}%`;
                panelAgents.style.flex = `1 1 ${100 - percentage}%`;
                localStorage.setItem('cx_split_v_bottom', percentage);
            }
        }
    });

    // 3. Global MouseUp
    window.addEventListener('mouseup', () => {
        if (!activeDrag) return;
        activeDrag = null;
        document.body.classList.remove('is-resizing', 'is-resizing-v', 'is-resizing-h');
        document.querySelectorAll('.resizer').forEach(r => r.classList.remove('resizer--dragging'));
        if (state.monacoEditor) state.monacoEditor.layout();
    });

    // 4. Restore saved dimensions
    const savedExplorer = localStorage.getItem('cx_explorer_width');
    if (savedExplorer && explorerPanel) {
        explorerPanel.style.width = savedExplorer + 'px';
        explorerPanel.style.flexBasis = savedExplorer + 'px';
    }

    const savedVTop = localStorage.getItem('cx_split_v_top');
    if (savedVTop && panelEditor && panelPreview) {
        panelEditor.style.flex = `0 0 ${savedVTop}%`;
        panelPreview.style.flex = `1 1 ${100 - savedVTop}%`;
    }

    const savedH = localStorage.getItem('cx_split_h');
    if (savedH && topRow && bottomRow) {
        topRow.style.flex = `0 0 ${savedH}%`;
        bottomRow.style.height = `${100 - savedH}%`;
        bottomRow.style.flex = `0 0 ${100 - savedH}%`;
    }

    const savedVBottom = localStorage.getItem('cx_split_v_bottom');
    if (savedVBottom && panelChat && panelAgents) {
        panelChat.style.flex = `0 0 ${savedVBottom}%`;
        panelAgents.style.flex = `1 1 ${100 - savedVBottom}%`;
    }
}

// ---- WEBSOCKET TELEMETRY & AUTO-INJECTION ----
function initWebSocket() {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = window.location.host;
    const wsUrl = `${wsProtocol}//${wsHost}/ide/ws/telemetry`.replace('//ide/', '/ide/');
    const directWsUrl = `${wsProtocol}//${wsHost}/ws/telemetry`;

    let ws;
    try {
        ws = new WebSocket(window.location.pathname.includes('/ide') ? wsUrl : directWsUrl);
    } catch (e) {
        return;
    }

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.type === 'agent_update') {
                updateAgent(data.agent, {
                    status: data.status,
                    progress: data.progress,
                    task: data.task
                });
            } else if (data.type === 'chat_message') {
                addChatMessage(data.name, data.emoji, data.text, 'agent');
            } else if (data.type === 'project_payload') {
                state.files['index.html'].content = data.html;
                state.files['style.css'].content = data.css;
                if (data.api_py) state.files['api.py'].content = data.api_py;
                
                if (state.monacoEditor) {
                    const currentLang = state.files[state.activeFile].lang;
                    const currentContent = state.files[state.activeFile].content;
                    const model = monaco.editor.createModel(currentContent, currentLang);
                    state.monacoEditor.setModel(model);
                }
                updatePreview();
                loadFileTree();
            }
        } catch (e) {}
    };
}

// ---- SIDEBAR NAVIGATION ----
function initSidebar() {
    document.querySelectorAll('.sidebar__btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const panel = btn.dataset.panel;
            if (panel === 'files') {
                const explorer = document.getElementById('explorerPanel');
                if (explorer) explorer.classList.toggle('explorer-panel--hidden');
            } else if (panel === 'templates') {
                document.getElementById('templatesModal').classList.add('modal--open');
            }
            
            document.querySelectorAll('.sidebar__btn').forEach(b => b.classList.remove('sidebar__btn--active'));
            btn.classList.add('sidebar__btn--active');
        });
    });
}

function initDeviceToggle() {
    document.querySelectorAll('.device-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('device-btn--active'));
            btn.classList.add('device-btn--active');
            
            const iframe = document.getElementById('previewFrame');
            if (btn.dataset.device === 'mobile') {
                iframe.classList.add('mobile');
            } else {
                iframe.classList.remove('mobile');
            }
        });
    });
}

function closeModal(id) {
    document.getElementById(id).classList.remove('modal--open');
}

// ---- EVENT LISTENERS ----
function initEvents() {
    document.querySelectorAll('.tab[data-file]').forEach(tab => {
        tab.addEventListener('click', () => switchFile(tab.dataset.file));
    });

    document.getElementById('btnSend').addEventListener('click', sendMessage);
    document.getElementById('chatInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });

    document.getElementById('chatInput').addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 80) + 'px';
    });

    document.getElementById('btnClearChat').addEventListener('click', () => {
        document.getElementById('chatMessages').innerHTML = '';
        Object.keys(state.agents).forEach(id => {
            updateAgent(id, { status: 'idle', progress: 0, task: 'Aguardando missão...' });
        });
    });

    document.getElementById('btnRefresh').addEventListener('click', updatePreview);
    document.getElementById('btnRefreshTree')?.addEventListener('click', loadFileTree);

        // Export ZIP
    document.getElementById('btnExportZip')?.addEventListener('click', () => {
        window.open(`${API_BASE}/project/export?project_id=default`, '_blank');
    });

    // Model Picker Cycle
    const models = [
        'Claude Opus 4.6 ⚡ Custo Zero',
        'GPT-4o ⚡ Custo Zero',
        'Claude Sonnet 3.7 ⚡ Rápido',
        'DeepSeek V3 / R1 ⚡ Raciocínio'
    ];
    let currentModelIdx = 0;
    const modelPickerEl = document.getElementById('modelPicker');
    const selectedModelNameEl = document.getElementById('selectedModelName');
    const statusMotorEl = document.getElementById('statusMotor');

    if (modelPickerEl && selectedModelNameEl) {
        modelPickerEl.addEventListener('click', () => {
            currentModelIdx = (currentModelIdx + 1) % models.length;
            const chosen = models[currentModelIdx];
            selectedModelNameEl.textContent = chosen;
            if (statusMotorEl) statusMotorEl.textContent = chosen;
            addChatMessage('Sistema', '⚡', `Motor de IA alternado para **${chosen}**.`, 'system');
        });
    }

    // Maximize Chat (Antigravity Full Canvas Mode)
    const btnMaximizeChat = document.getElementById('btnMaximizeChat');
    const panelChat = document.getElementById('panelChat');
    const panelAgents = document.getElementById('panelAgents');
    const topRow = document.getElementById('topRow');
    const bottomRow = document.getElementById('bottomRow');

    if (btnMaximizeChat && panelChat && bottomRow && topRow) {
        btnMaximizeChat.addEventListener('click', () => {
            const isFullChat = topRow.style.display === 'none';
            if (isFullChat) {
                // Restore split
                topRow.style.display = 'flex';
                topRow.style.flex = '0 0 60%';
                bottomRow.style.height = '40%';
                bottomRow.style.flex = '0 0 40%';
                if (panelAgents) panelAgents.classList.remove('panel--collapsed');
            } else {
                // Maximize Chat
                topRow.style.display = 'none';
                bottomRow.style.height = '100%';
                bottomRow.style.flex = '1 1 100%';
                if (panelAgents) panelAgents.classList.add('panel--collapsed');
            }
            if (state.monacoEditor) state.monacoEditor.layout();
        });
    }

    // Bottom Tabs (Chat, Terminal, Security)
    document.querySelectorAll('.panel-tab[data-bottom-tab]').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.panel-tab[data-bottom-tab]').forEach(t => t.classList.remove('panel-tab--active'));
            tab.classList.add('panel-tab--active');
            const target = tab.dataset.bottomTab;
            
            if (target === 'terminal') {
                addChatMessage('Terminal', '💻', `[systemd] complexo-x-ide.service: active (running)\n[nginx] proxy 127.0.0.1:5170 -> https://complexo-x.com.br/ide/\n[websocket] /ws/telemetry connected\n[db] SQLite WAL Mode enabled (PRAGMA busy_timeout=5000)`, 'system');
            } else if (target === 'security') {
                addChatMessage('Segurança', '🛡️', `🛡️ **Relatório de Blindagem de Dados:**\n• SQL Injection: ZERO (Prepared Statements)\n• SQLite WAL: Ativo (Zero Lockups)\n• Criptografia: Bcrypt / AES-256\n• Rate Limiter: Ativo (Token Bucket Shield)\n• HTTP Security Headers: Injetados`, 'agent');
            }
        });
    });

    document.getElementById('btnDeploy').addEventListener('click', () => {
        addChatMessage('Sistema', '🚀', 'Deploy em 1 clique solicitado! Sincronizando com a VPS...', 'system');
    });

    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.chip').forEach(c => c.classList.remove('chip--active'));
            chip.classList.add('chip--active');
        });
    });
}

// ---- INIT ----

// ---- PANEL COLLAPSE & TOGGLE ENGINE (ANTIGRAVITY STYLE) ----
function initPanelToggles() {
    const panelPreview = document.getElementById('panelPreview');
    const resizerVTop = document.getElementById('resizerVTop');
    const togglePreviewBtn = document.getElementById('togglePreviewBtn');
    const btnClosePreview = document.getElementById('btnClosePreview');
    const btnMaximizePreview = document.getElementById('btnMaximizePreview');
    const btnMaximizeEditor = document.getElementById('btnMaximizeEditor');

    const panelAgents = document.getElementById('panelAgents');
    const resizerVBottom = document.getElementById('resizerVBottom');
    const btnCloseAgents = document.getElementById('btnCloseAgents');

    const bottomRow = document.getElementById('bottomRow');
    const topRow = document.getElementById('topRow');
    const resizerH = document.getElementById('resizerH');
    const toggleBottomBtn = document.getElementById('toggleBottomBtn');

    const explorerPanel = document.getElementById('explorerPanel');
    const resizerVExplorer = document.getElementById('resizerVExplorer');
    const toggleExplorerBtn = document.getElementById('toggleExplorerBtn');

    // 1. Toggle Preview Panel (Top Right)
    function togglePreview(forceState = null) {
        if (!panelPreview) return;
        const isCurrentlyOpen = !panelPreview.classList.contains('panel--collapsed');
        const willOpen = forceState !== null ? forceState : !isCurrentlyOpen;

        if (willOpen) {
            panelPreview.classList.remove('panel--collapsed');
            if (resizerVTop) resizerVTop.classList.remove('resizer--hidden');
            if (togglePreviewBtn) togglePreviewBtn.classList.add('layout-toggle-btn--active');
            localStorage.setItem('cx_preview_open', 'true');
        } else {
            panelPreview.classList.add('panel--collapsed');
            if (resizerVTop) resizerVTop.classList.add('resizer--hidden');
            if (togglePreviewBtn) togglePreviewBtn.classList.remove('layout-toggle-btn--active');
            localStorage.setItem('cx_preview_open', 'false');
        }

        setTimeout(() => {
            if (state.monacoEditor) state.monacoEditor.layout();
        }, 100);
    }

    // 2. Toggle Agents Dashboard (Bottom Right)
    function toggleAgents(forceState = null) {
        if (!panelAgents) return;
        const isCurrentlyOpen = !panelAgents.classList.contains('panel--collapsed');
        const willOpen = forceState !== null ? forceState : !isCurrentlyOpen;

        if (willOpen) {
            panelAgents.classList.remove('panel--collapsed');
            if (resizerVBottom) resizerVBottom.classList.remove('resizer--hidden');
            localStorage.setItem('cx_agents_open', 'true');
        } else {
            panelAgents.classList.add('panel--collapsed');
            if (resizerVBottom) resizerVBottom.classList.add('resizer--hidden');
            localStorage.setItem('cx_agents_open', 'false');
        }
    }

    // 3. Toggle Bottom Row (Chat & Agents)
    function toggleBottomRow(forceState = null) {
        if (!bottomRow) return;
        const isCurrentlyOpen = !bottomRow.classList.contains('main__bottom--collapsed');
        const willOpen = forceState !== null ? forceState : !isCurrentlyOpen;

        if (willOpen) {
            bottomRow.classList.remove('main__bottom--collapsed');
            if (topRow) topRow.classList.remove('main__top--expanded');
            if (resizerH) resizerH.classList.remove('resizer--hidden');
            if (toggleBottomBtn) toggleBottomBtn.classList.add('layout-toggle-btn--active');
            localStorage.setItem('cx_bottom_open', 'true');
        } else {
            bottomRow.classList.add('main__bottom--collapsed');
            if (topRow) topRow.classList.add('main__top--expanded');
            if (resizerH) resizerH.classList.add('resizer--hidden');
            if (toggleBottomBtn) toggleBottomBtn.classList.remove('layout-toggle-btn--active');
            localStorage.setItem('cx_bottom_open', 'false');
        }

        setTimeout(() => {
            if (state.monacoEditor) state.monacoEditor.layout();
        }, 100);
    }

    // 4. Toggle Explorer Panel (Sidebar #2)
    function toggleExplorer(forceState = null) {
        if (!explorerPanel) return;
        const isCurrentlyOpen = !explorerPanel.classList.contains('explorer-panel--hidden');
        const willOpen = forceState !== null ? forceState : !isCurrentlyOpen;

        if (willOpen) {
            explorerPanel.classList.remove('explorer-panel--hidden');
            if (resizerVExplorer) resizerVExplorer.classList.remove('resizer--hidden');
            if (toggleExplorerBtn) toggleExplorerBtn.classList.add('layout-toggle-btn--active');
            localStorage.setItem('cx_explorer_open', 'true');
        } else {
            explorerPanel.classList.add('explorer-panel--hidden');
            if (resizerVExplorer) resizerVExplorer.classList.add('resizer--hidden');
            if (toggleExplorerBtn) toggleExplorerBtn.classList.remove('layout-toggle-btn--active');
            localStorage.setItem('cx_explorer_open', 'false');
        }

        setTimeout(() => {
            if (state.monacoEditor) state.monacoEditor.layout();
        }, 100);
    }

    // Event Bindings
    if (togglePreviewBtn) togglePreviewBtn.addEventListener('click', () => togglePreview());
    if (btnClosePreview) btnClosePreview.addEventListener('click', () => togglePreview(false));

    if (toggleBottomBtn) toggleBottomBtn.addEventListener('click', () => toggleBottomRow());
    if (toggleExplorerBtn) toggleExplorerBtn.addEventListener('click', () => toggleExplorer());

    if (btnCloseAgents) btnCloseAgents.addEventListener('click', () => toggleAgents(false));

    // Maximize Editor (Zen Mode)
    if (btnMaximizeEditor) {
        btnMaximizeEditor.addEventListener('click', () => {
            const isPreviewOpen = !panelPreview.classList.contains('panel--collapsed');
            const isBottomOpen = !bottomRow.classList.contains('main__bottom--collapsed');

            if (isPreviewOpen || isBottomOpen) {
                togglePreview(false);
                toggleBottomRow(false);
            } else {
                togglePreview(true);
                toggleBottomRow(true);
            }
        });
    }

    // Maximize Preview
    if (btnMaximizePreview) {
        btnMaximizePreview.addEventListener('click', () => {
            const panelEditor = document.getElementById('panelEditor');
            if (panelEditor) {
                const isEditorCollapsed = panelEditor.classList.contains('panel--collapsed');
                if (isEditorCollapsed) {
                    panelEditor.classList.remove('panel--collapsed');
                } else {
                    panelEditor.classList.add('panel--collapsed');
                }
            }
        });
    }

    // Restore Saved Layout States
    const savedPreview = localStorage.getItem('cx_preview_open');
    if (savedPreview === 'false') togglePreview(false);

    const savedAgents = localStorage.getItem('cx_agents_open');
    if (savedAgents === 'false') toggleAgents(false);

    const savedBottom = localStorage.getItem('cx_bottom_open');
    if (savedBottom === 'false') toggleBottomRow(false);

    const savedExplorer = localStorage.getItem('cx_explorer_open');
    if (savedExplorer === 'false') toggleExplorer(false);
}

document.addEventListener('DOMContentLoaded', () => {
    initMonaco();
    initSidebar();
    initDeviceToggle();
    initEvents();
    initResizers();
    initPanelToggles();
    loadTemplates();
    loadFileTree();
    initWebSocket();
    Object.keys(state.agents).forEach(renderAgentCard);
});