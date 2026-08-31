/* ============================================
   COMPLEXO-X IDE — Application Logic v2.0
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
        'api.py': { lang: 'python', content: `from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI(title="Complexo-X Commerce API")\n\nclass CheckoutPix(BaseModel):\n    amount: float\n    customer_name: str\n    customer_whatsapp: str\n\n@app.get("/api/health")\ndef health():\n    return {"status": "online", "engine": "Complexo-X Engine"}\n\n@app.post("/api/checkout/pix")\ndef create_pix(order: CheckoutPix):\n    # Integração com Pix Dinâmico e Conciliação Real\n    return {\n        "status": "pending",\n        "qr_code": "00020126580014BR.GOV.BCB.PIX...",\n        "amount": order.amount,\n        "customer": order.customer_name\n    }` }
    },
    activeFile: 'index.html',
    selectedTemplate: 'shopify_dawn_ecommerce',
    agents: {
        gerente:     { name: 'Gerente',     emoji: '🎯', status: 'idle', progress: 0, task: 'Aguardando missão...' },
        programador: { name: 'Programador', emoji: '👨‍💻', status: 'idle', progress: 0, task: 'Aguardando missão...' },
        designer:    { name: 'Designer',    emoji: '🎨', status: 'idle', progress: 0, task: 'Aguardando missão...' },
        marketeiro:  { name: 'Marketeiro',  emoji: '📢', status: 'idle', progress: 0, task: 'Aguardando missão...' },
        seo:         { name: 'SEO',         emoji: '🔍', status: 'idle', progress: 0, task: 'Aguardando missão...' },
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

// ---- WEBSOCKET TELEMETRY & AUTO-INJECTION ----
function initWebSocket() {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = window.location.host;
    const wsUrl = `${wsProtocol}//${wsHost}/ide/ws/telemetry`.replace('//ide/', '/ide/');
    
    // Fallback URL if root
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
                // Injeta código auto-corrigido pelo Visual Inspector no Editor e Preview
                state.files['index.html'].content = data.html;
                state.files['style.css'].content = data.css;
                
                if (state.monacoEditor) {
                    const currentLang = state.files[state.activeFile].lang;
                    const currentContent = state.files[state.activeFile].content;
                    const model = monaco.editor.createModel(currentContent, currentLang);
                    state.monacoEditor.setModel(model);
                }
                updatePreview();
            }
        } catch (e) {}
    };
}

// ---- SIDEBAR NAVIGATION ----
function initSidebar() {
    document.querySelectorAll('.sidebar__btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.sidebar__btn').forEach(b => b.classList.remove('sidebar__btn--active'));
            btn.classList.add('sidebar__btn--active');
            
            const panel = btn.dataset.panel;
            if (panel === 'templates') {
                document.getElementById('templatesModal').classList.add('modal--open');
            }
        });
    });
}

// ---- DEVICE TOGGLE ----
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
document.addEventListener('DOMContentLoaded', () => {
    initMonaco();
    initSidebar();
    initDeviceToggle();
    initEvents();
    loadTemplates();
    initWebSocket();
    Object.keys(state.agents).forEach(renderAgentCard);
});