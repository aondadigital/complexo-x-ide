/* ============================================
   COMPLEXO-X IDE — Application Logic
   complexo-x.com.br/ide
   ============================================ */

// ---- CONFIG ----
const API_BASE = window.location.hostname === 'localhost' 
    ? 'http://localhost:8080' 
    : 'https://complexo-x.com.br/ide/api';

// ---- STATE ----
const state = {
    files: {
        'index.html': { lang: 'html', content: `<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Meu Projeto</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <header class="hero">\n        <h1>Bem-vindo</h1>\n        <p>Seu projeto começa aqui.</p>\n    </header>\n</body>\n</html>` },
        'style.css': { lang: 'css', content: `/* Seu CSS aqui */\n* { margin: 0; padding: 0; box-sizing: border-box; }\n\nbody {\n    font-family: 'Inter', sans-serif;\n    background: #0a0a0a;\n    color: #e5e5e5;\n}\n\n.hero {\n    min-height: 100vh;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    text-align: center;\n}\n\nh1 {\n    font-size: 3rem;\n    background: linear-gradient(135deg, #7c3aed, #06b6d4);\n    -webkit-background-clip: text;\n    -webkit-text-fill-color: transparent;\n}` },
        'api.py': { lang: 'python', content: `from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI(title="Meu Projeto API")\n\n\nclass Message(BaseModel):\n    text: str\n\n\n@app.get("/health")\ndef health():\n    return {"ok": True}\n\n\n@app.post("/api/contact")\ndef contact(msg: Message):\n    # TODO: integrar com WhatsApp\n    return {"status": "recebido", "message": msg.text}` }
    },
    activeFile: 'index.html',
    agents: {
        gerente:     { name: 'Gerente',     emoji: '🎯', status: 'idle', progress: 0, task: 'Aguardando missão...' },
        programador: { name: 'Programador', emoji: '👨‍💻', status: 'idle', progress: 0, task: 'Aguardando missão...' },
        designer:    { name: 'Designer',    emoji: '🎨', status: 'idle', progress: 0, task: 'Aguardando missão...' },
        marketeiro:  { name: 'Marketeiro',  emoji: '📢', status: 'idle', progress: 0, task: 'Aguardando missão...' },
        seo:         { name: 'SEO',         emoji: '🔍', status: 'idle', progress: 0, task: 'Aguardando missão...' },
    },
    chatMessages: [],
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

// ---- FILE TABS ----
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

// ---- LIVE PREVIEW ----
function updatePreview() {
    const iframe = document.getElementById('previewFrame');
    const html = state.files['index.html']?.content || '';
    const css = state.files['style.css']?.content || '';
    
    const fullHTML = html.replace('</head>', `<style>${css}</style></head>`);
    iframe.srcdoc = fullHTML;
}

// ---- CHAT ----
function addChatMessage(name, emoji, text, type = 'agent') {
    const chatBody = document.getElementById('chatMessages');
    
    // Remove welcome on first message
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

    // Simulate agent workflow
    simulateAgentWorkflow(text);
}

// ---- AGENT SIMULATION ----
function updateAgent(id, updates) {
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

    // Update count
    const activeCount = Object.values(state.agents).filter(a => a.status === 'working').length;
    const total = Object.keys(state.agents).length;
    document.getElementById('agentsCount').textContent = `${activeCount}/${total} ativos`;
}

async function simulateAgentWorkflow(mission) {
    // Gerente receives mission
    updateAgent('gerente', { status: 'working', progress: 20, task: 'Analisando missão...' });
    addChatMessage('Gerente', '🎯', `Missão recebida: "${mission}"\nAnalisando requisitos e montando equipe...`, 'system');

    await delay(1500);
    updateAgent('gerente', { progress: 60, task: 'Delegando para especialistas...' });
    addChatMessage('Gerente', '🎯', 'Plano definido. Delegando para 4 especialistas em paralelo.', 'agent');

    await delay(800);

    // Activate specialists in parallel
    updateAgent('designer',    { status: 'working', progress: 10, task: 'Analisando modelo de referência...' });
    updateAgent('programador', { status: 'working', progress: 10, task: 'Configurando projeto...' });
    updateAgent('marketeiro',  { status: 'working', progress: 10, task: 'Pesquisando o segmento...' });
    updateAgent('seo',         { status: 'working', progress: 10, task: 'Auditando requisitos SEO...' });

    // Designer progress
    await delay(2000);
    updateAgent('designer', { progress: 50, task: 'Gerando design system (cores, fontes)...' });
    addChatMessage('Designer', '🎨', 'Design system gerado: paleta dark premium, Inter 14-48px, border-radius 12px.', 'agent');

    await delay(1500);
    updateAgent('designer', { progress: 100, status: 'done', task: 'CSS com design tokens entregue' });
    addChatMessage('Designer', '🎨', '✅ Layout completo entregue. Componentes: hero, cards, CTA, footer.', 'agent');

    // Programador progress
    await delay(1000);
    updateAgent('programador', { progress: 40, task: 'Montando componentes HTML...' });

    await delay(2000);
    updateAgent('programador', { progress: 70, task: 'Integrando API backend...' });
    addChatMessage('Programador', '👨‍💻', 'Frontend montado. Integrando API com FastAPI (4 endpoints).', 'agent');

    // Marketeiro progress
    await delay(500);
    updateAgent('marketeiro', { progress: 60, task: 'Escrevendo copy de vendas...' });
    addChatMessage('Marketeiro', '📢', 'Headlines prontas: 3 variações com gatilhos de urgência e benefício.', 'agent');

    await delay(1500);
    updateAgent('marketeiro', { progress: 100, status: 'done', task: 'Copy completo entregue' });
    addChatMessage('Marketeiro', '📢', '✅ Copy de vendas finalizado: headline, subheadline, 3 CTAs, seção de benefícios.', 'agent');

    // SEO progress
    await delay(1000);
    updateAgent('seo', { progress: 50, task: 'Inserindo meta tags e schema...' });

    await delay(1500);
    updateAgent('seo', { progress: 100, status: 'done', task: 'SEO on-page completo' });
    addChatMessage('SEO', '🔍', '✅ SEO aplicado: title tag, meta description, Open Graph, Schema markup, sitemap.xml.', 'agent');

    // Programador finishes
    await delay(1000);
    updateAgent('programador', { progress: 100, status: 'done', task: 'Build completo e testado' });
    addChatMessage('Programador', '👨‍💻', '✅ Projeto completo: frontend + API + integração WhatsApp. Todos os testes passaram.', 'agent');

    // Update preview with a beautiful landing page
    updatePreviewWithResult();

    // Gerente wraps up
    await delay(500);
    updateAgent('gerente', { progress: 100, status: 'done', task: 'Missão concluída!' });
    addChatMessage('Gerente', '🎯', `🎉 **Missão concluída!**\n\n• Designer: CSS premium entregue\n• Programador: Frontend + API funcionando\n• Marketeiro: Copy de vendas aplicado\n• SEO: Otimização on-page completa\n\n🚀 Pronto para deploy. Clique no botão **Deploy** para publicar.`, 'system');
}

function updatePreviewWithResult() {
    const newHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meu Projeto — Construído no Complexo-X IDE</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
    <header class="hero">
        <nav class="nav"><span class="nav-brand">✦ Meu Projeto</span><div class="nav-links"><a href="#features">Recursos</a><a href="#about">Sobre</a><a href="#contact" class="nav-cta">Começar Agora</a></div></nav>
        <div class="hero-content">
            <span class="hero-badge">🚀 Novidade 2026</span>
            <h1>Transforme sua presença<br><span class="gradient-text">digital hoje</span></h1>
            <p class="hero-sub">Soluções completas para seu negócio crescer na internet com tecnologia de ponta e resultado real.</p>
            <div class="hero-actions"><a href="#contact" class="btn-primary">Começar Agora →</a><a href="#features" class="btn-secondary">Ver Recursos</a></div>
        </div>
    </header>
    <section class="features" id="features">
        <div class="feature-card"><span class="feature-icon">⚡</span><h3>Ultra Rápido</h3><p>Performance otimizada com Core Web Vitals nota máxima.</p></div>
        <div class="feature-card"><span class="feature-icon">🎨</span><h3>Design Premium</h3><p>Interface moderna que impressiona seus clientes à primeira vista.</p></div>
        <div class="feature-card"><span class="feature-icon">📱</span><h3>100% Responsivo</h3><p>Perfeito em qualquer dispositivo: celular, tablet e desktop.</p></div>
    </section>
</body>
</html>`;

    const newCSS = `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', sans-serif; background: #07080d; color: #e8eaf0; }
.nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; }
.nav-brand { font-weight: 800; font-size: 18px; }
.nav-links { display: flex; gap: 24px; align-items: center; }
.nav-links a { color: #8b8fa3; text-decoration: none; font-size: 14px; }
.nav-cta { background: #7c3aed !important; color: white !important; padding: 8px 20px; border-radius: 8px; }
.hero { min-height: 90vh; display: flex; flex-direction: column; }
.hero-content { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px; }
.hero-badge { background: rgba(124,58,237,0.15); color: #a78bfa; padding: 6px 16px; border-radius: 100px; font-size: 13px; font-weight: 600; }
h1 { font-size: 52px; font-weight: 800; line-height: 1.1; margin: 24px 0 16px; }
.gradient-text { background: linear-gradient(135deg, #7c3aed, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hero-sub { color: #8b8fa3; font-size: 18px; max-width: 500px; margin-bottom: 32px; line-height: 1.6; }
.hero-actions { display: flex; gap: 12px; }
.btn-primary { background: linear-gradient(135deg, #7c3aed, #5b21b6); color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 15px; box-shadow: 0 0 30px rgba(124,58,237,0.3); }
.btn-secondary { border: 1px solid rgba(255,255,255,0.15); color: #8b8fa3; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-size: 15px; }
.features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; padding: 60px 40px; }
.feature-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 32px; text-align: center; }
.feature-icon { font-size: 32px; display: block; margin-bottom: 16px; }
.feature-card h3 { font-size: 18px; margin-bottom: 8px; }
.feature-card p { color: #8b8fa3; font-size: 14px; line-height: 1.5; }`;

    state.files['index.html'].content = newHTML;
    state.files['style.css'].content = newCSS;
    
    if (state.monacoEditor && state.activeFile === 'index.html') {
        const model = monaco.editor.createModel(newHTML, 'html');
        state.monacoEditor.setModel(model);
    }
    
    const iframe = document.getElementById('previewFrame');
    iframe.srcdoc = newHTML.replace('</head>', `<style>${newCSS}</style></head>`);
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

// ---- MODAL ----
function closeModal(id) {
    document.getElementById(id).classList.remove('modal--open');
}

// ---- UTILITIES ----
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ---- EVENT LISTENERS ----
function initEvents() {
    // File tabs
    document.querySelectorAll('.tab[data-file]').forEach(tab => {
        tab.addEventListener('click', () => switchFile(tab.dataset.file));
    });

    // Chat send
    document.getElementById('btnSend').addEventListener('click', sendMessage);
    document.getElementById('chatInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });

    // Auto-resize textarea
    document.getElementById('chatInput').addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 80) + 'px';
    });

    // Clear chat
    document.getElementById('btnClearChat').addEventListener('click', () => {
        document.getElementById('chatMessages').innerHTML = '';
        Object.keys(state.agents).forEach(id => {
            updateAgent(id, { status: 'idle', progress: 0, task: 'Aguardando missão...' });
        });
    });

    // Refresh preview
    document.getElementById('btnRefresh').addEventListener('click', updatePreview);

    // Deploy button
    document.getElementById('btnDeploy').addEventListener('click', () => {
        addChatMessage('Sistema', '🚀', 'Deploy iniciado... Conectando com VPS via SSH...', 'system');
    });

    // Filter chips
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.chip').forEach(c => c.classList.remove('chip--active'));
            chip.classList.add('chip--active');
        });
    });
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
                    <span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:${t.cores.fundo};border:1px solid #444"></span>
                    <span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:${t.cores.primaria}"></span>
                    <span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:${t.cores.secundaria}"></span>
                </div>
                <button class="btn btn--sm btn--deploy" onclick="applyTemplate('${t.id}')">Usar como Modelo</button>
            `;
            grid.appendChild(card);
        });
    } catch (err) {
        console.warn('Templates offline, usando modo estático:', err);
    }
}

window.applyTemplate = function(templateId) {
    closeModal('templatesModal');
    addChatMessage('Sistema', '🎨', `Modelo **${templateId}** selecionado como referência visual da equipe.`, 'system');
    setPrompt(`Construa um projeto moderno usando como base visual o modelo ${templateId}`);
};

// ---- WEBSOCKET TELEMETRY ----
function initWebSocket() {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/ws/telemetry`;
    
    try {
        const ws = new WebSocket(wsUrl);
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
                }
            } catch (e) {}
        };
    } catch (e) {
        console.log('WS não conectado em modo preview local');
    }
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
    initMonaco();
    initSidebar();
    initDeviceToggle();
    initEvents();
    loadTemplates();
    initWebSocket();
    
    // Initial agent render
    Object.keys(state.agents).forEach(renderAgentCard);
});

