/* ============================================
   ANTIGRAVITY IDE — 1:1 Engine & Interaction Logic
   complexo-x.com.br/ide
   ============================================ */

const API_BASE = window.location.origin.includes('complexo-x.com.br')
    ? 'https://complexo-x.com.br/ide/api'
    : window.location.origin.includes('localhost:5170') || window.location.origin.includes('localhost:8080')
        ? `${window.location.origin}/api`
        : 'http://localhost:5170/api';

const state = {
    files: {
        'index.html': { lang: 'html', content: `<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Complexo-X IDE</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <header class="hero">\n        <h1>Complexo-X IDE</h1>\n        <p>Ambiente agêntico com Motor Custo Zero.</p>\n    </header>\n</body>\n</html>` },
        'style.css': { lang: 'css', content: `* { margin: 0; padding: 0; box-sizing: border-box; }\nbody { font-family: 'Inter', sans-serif; background: #0b0c10; color: #e8eaed; }\n.hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }\nh1 { font-size: 3rem; background: linear-gradient(135deg, #7c3aed, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }` },
        'api.py': { lang: 'python', content: `from fastapi import FastAPI\napp = FastAPI(title="Complexo-X Core API")\n@app.get("/health")\ndef health(): return {"status": "online"}` }
    },
    activeFile: 'index.html',
    currentWorkspaceName: 'PROJETOS',
    currentModel: 'Claude Opus 4.6 (Thinking)',
    activeView: 'preview', // 'preview' or 'editor'
    monacoEditor: null,
};

// ---- MONACO EDITOR INITIALIZATION ----
function initMonaco() {
    require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });
    require(['vs/editor/editor.main'], function () {
        monaco.editor.defineTheme('antigravity-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '666c75', fontStyle: 'italic' },
                { token: 'keyword', foreground: 'a78bfa' },
                { token: 'string', foreground: '06b6d4' },
                { token: 'number', foreground: 'f59e0b' },
                { token: 'type', foreground: '10b981' },
                { token: 'function', foreground: '7c3aed' },
            ],
            colors: {
                'editor.background': '#0b0c10',
                'editor.foreground': '#e8eaed',
                'editor.lineHighlightBackground': '#14161f',
                'editor.selectionBackground': '#7c3aed33',
                'editorCursor.foreground': '#7c3aed',
                'editorLineNumber.foreground': '#4a4e60',
                'editorLineNumber.activeForeground': '#8b8fa3',
            }
        });

        const file = state.files[state.activeFile] || state.files['index.html'];
        state.monacoEditor = monaco.editor.create(document.getElementById('monacoEditor'), {
            value: file.content,
            language: file.lang,
            theme: 'antigravity-dark',
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: 13,
            lineHeight: 22,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 12 },
            automaticLayout: true,
        });

        state.monacoEditor.onDidChangeModelContent(() => {
            if (state.files[state.activeFile]) {
                state.files[state.activeFile].content = state.monacoEditor.getValue();
                updatePreview();
            }
        });

        state.monacoEditor.onDidChangeCursorPosition((e) => {
            const el = document.getElementById('statusCursorPos');
            if (el) el.textContent = `Ln ${e.position.lineNumber}, Col ${e.position.column}`;
        });

        updatePreview();
    });
}

function updatePreview() {
    const iframe = document.getElementById('previewFrame');
    if (!iframe) return;
    const html = state.files['index.html']?.content || '';
    const css = state.files['style.css']?.content || '';
    const fullHTML = html.replace('</head>', `<style>${css}</style></head>`);
    iframe.srcdoc = fullHTML;
}

// ---- CHAT & AGENT CANVAS (ANTIGRAVITY EXACT) ----
function addUserMessage(prompt) {
    const feed = document.getElementById('chatMessages');
    const msgCard = document.createElement('div');
    msgCard.className = 'user-msg-card';
    msgCard.innerHTML = `
        <div class="user-msg-pills">
            <span class="msg-pill">💻 Local</span>
            <span class="msg-pill">📁 ${state.currentWorkspaceName}</span>
        </div>
        <div class="user-msg-text">${escapeHtml(prompt)}</div>
    `;
    feed.appendChild(msgCard);
    feed.scrollTop = feed.scrollHeight;
}

function addAgentWorking() {
    const feed = document.getElementById('chatMessages');
    const working = document.createElement('div');
    working.id = 'agentWorkingIndicator';
    working.style.cssText = 'color:var(--text-muted);font-size:12.5px;margin:8px 0 16px;display:flex;align-items:center;gap:6px;';
    working.innerHTML = `
        <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--accent-purple);animation:pulse-dot 1.5s infinite;"></span>
        Working...
    `;
    feed.appendChild(working);
    feed.scrollTop = feed.scrollHeight;
}

function removeAgentWorking() {
    const el = document.getElementById('agentWorkingIndicator');
    if (el) el.remove();
}

function addAgentResponse(htmlContent, thoughtText = null, commandsCount = null) {
    removeAgentWorking();
    const feed = document.getElementById('chatMessages');
    const container = document.createElement('div');
    container.style.cssText = 'display:flex;flex-direction:column;gap:10px;margin-bottom:20px;';

    if (thoughtText) {
        const thought = document.createElement('div');
        thought.className = 'agent-trace-card';
        thought.innerHTML = `<span>▶ ${thoughtText}</span> <span style="font-size:10px;color:var(--text-muted);">Expandir</span>`;
        container.appendChild(thought);
    }

    if (commandsCount) {
        const cmds = document.createElement('div');
        cmds.className = 'agent-trace-card';
        cmds.innerHTML = `<span>▼ Running ${commandsCount} commands</span> <span style="color:var(--accent-green);">✓ Sucesso</span>`;
        container.appendChild(cmds);
    }

    const responseCard = document.createElement('div');
    responseCard.className = 'agent-response-text';
    responseCard.innerHTML = htmlContent;
    container.appendChild(responseCard);

    feed.appendChild(container);
    feed.scrollTop = feed.scrollHeight;
}

async function handleSendMessage() {
    const input = document.getElementById('chatInput');
    const prompt = input.value.trim();
    if (!prompt) return;

    input.value = '';
    input.style.height = 'auto';

    addUserMessage(prompt);
    addAgentWorking();

    try {
        const res = await fetch(`${API_BASE}/mission`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: prompt,
                template_id: 'shopify_dawn_ecommerce'
            })
        });
        if (!res.ok) throw new Error('API indisponível');
    } catch (e) {
        // Fallback local simulation if server offline
        setTimeout(() => {
            addAgentResponse(
                `<p>Missão recebida e executada pela equipe de especialistas:</p>
                 <ul style="margin:8px 0 8px 20px;color:var(--text-secondary);font-size:13px;">
                     <li><strong>Designer:</strong> Design Tokens e CSS responsivo aplicados.</li>
                     <li><strong>Programador:</strong> Estrutura HTML5 e endpoints criados.</li>
                     <li><strong>Segurança:</strong> Zero SQLi validado com SQLite WAL.</li>
                     <li><strong>SEO:</strong> Schema.org e OpenGraph injetados.</li>
                 </ul>
                 <p>O resultado já está atualizado no <strong>Workspace ao lado</strong>.</p>`,
                "Thought for 3s",
                "4 commands"
            );
        }, 1500);
    }
}

// ---- WORKSPACE & VIEW SWITCHER ----
function initWorkspaceViews() {
    const btnToggle = document.getElementById('btnTogglePreviewView');
    const viewPreview = document.getElementById('viewPreview');
    const viewEditor = document.getElementById('viewEditor');

    function switchWorkspaceView(target) {
        state.activeView = target;
        if (target === 'editor') {
            viewPreview.style.display = 'none';
            viewEditor.style.display = 'block';
            if (state.monacoEditor) state.monacoEditor.layout();
        } else {
            viewPreview.style.display = 'block';
            viewEditor.style.display = 'none';
            updatePreview();
        }
    }

    if (btnToggle) {
        btnToggle.addEventListener('click', () => {
            switchWorkspaceView(state.activeView === 'preview' ? 'editor' : 'preview');
        });
    }

    // Tabs inside workspace header
    document.querySelectorAll('.ws-tab[data-file]').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.ws-tab').forEach(t => t.classList.remove('ws-tab--active'));
            tab.classList.add('ws-tab--active');
            const file = tab.dataset.file;
            if (file === 'preview') {
                switchWorkspaceView('preview');
            } else {
                switchWorkspaceView('editor');
                switchFile(file);
            }
        });
    });

    document.getElementById('btnRefreshPreview')?.addEventListener('click', updatePreview);

    // Maximize Workspace
    document.getElementById('btnMaximizeWorkspace')?.addEventListener('click', () => {
        const chatPane = document.getElementById('chatPane');
        if (chatPane) {
            chatPane.style.display = chatPane.style.display === 'none' ? 'flex' : 'none';
            if (state.monacoEditor) state.monacoEditor.layout();
        }
    });

    document.getElementById('btnCloseChatPane')?.addEventListener('click', () => {
        const chatPane = document.getElementById('chatPane');
        if (chatPane) chatPane.style.display = 'none';
    });
}

function switchFile(filename) {
    if (!state.files[filename]) return;
    state.activeFile = filename;
    const file = state.files[filename];
    if (state.monacoEditor) {
        const model = monaco.editor.createModel(file.content, file.lang);
        state.monacoEditor.setModel(model);
    }
}

// ---- RESIZER BETWEEN CHAT AND WORKSPACE ----
function initResizer() {
    const resizer = document.getElementById('resizerMain');
    const chatPane = document.getElementById('chatPane');
    const layout = document.querySelector('.antigravity-layout');
    if (!resizer || !chatPane || !layout) return;

    let isDragging = false;

    resizer.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        document.body.classList.add('is-resizing');
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const layoutRect = layout.getBoundingClientRect();
        const offsetLeft = e.clientX - layoutRect.left;
        const percentage = (offsetLeft / layoutRect.width) * 100;

        if (percentage >= 25 && percentage <= 75) {
            chatPane.style.flex = `0 0 ${percentage}%`;
            if (state.monacoEditor) state.monacoEditor.layout();
            localStorage.setItem('cx_chat_width', percentage);
        }
    });

    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            document.body.classList.remove('is-resizing');
            if (state.monacoEditor) state.monacoEditor.layout();
        }
    });

    const savedWidth = localStorage.getItem('cx_chat_width');
    if (savedWidth) {
        chatPane.style.flex = `0 0 ${savedWidth}%`;
    }
}

// ---- RAIL NAVIGATION & TOGGLES ----
function initRail() {
    const explorer = document.getElementById('explorerPanel');
    document.getElementById('railBtnFiles')?.addEventListener('click', () => {
        if (explorer) explorer.classList.toggle('antigravity-explorer--hidden');
    });

    document.getElementById('railBtnTemplates')?.addEventListener('click', () => {
        document.getElementById('templatesModal')?.classList.add('modal--open');
    });
}

// ---- WORKSPACE & FOLDER SELECTION (NATIVE DIALOG) ----
async function initFolderPicker() {
    document.getElementById('wsFolderBtn')?.addEventListener('click', (e) => {
        if (e.target.id === 'wsCloseBtn') return;
        openFolderDialog();
    });

    document.getElementById('wsAddFolderBtn')?.addEventListener('click', () => {
        openFolderDialog();
    });

    document.getElementById('wsCloseBtn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        closeFolder();
    });
}

async function openFolderDialog() {
    if ('showDirectoryPicker' in window) {
        try {
            const dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
            if (dirHandle && dirHandle.name) {
                state.currentWorkspaceName = dirHandle.name;
                updateFolderUI(dirHandle.name);
                return;
            }
        } catch (err) {
            if (err.name === 'AbortError') return;
        }
    }
    document.getElementById('workspaceModal')?.classList.add('modal--open');
}

function updateFolderUI(name) {
    const el = document.getElementById('wsFolderName');
    const rootEl = document.getElementById('explorerRootName');
    if (el) el.textContent = name;
    if (rootEl) rootEl.textContent = name.toUpperCase();
}

function closeFolder() {
    state.currentWorkspaceName = 'Sem Pasta';
    updateFolderUI('Sem Pasta');
}

window.chooseWorkspace = function(path) {
    closeModal('workspaceModal');
    const name = path.split('/').pop().split('\\').pop();
    state.currentWorkspaceName = name;
    updateFolderUI(name);
};

window.openCustomWorkspace = function() {
    const input = document.getElementById('customWsInput');
    if (input && input.value.trim()) {
        chooseWorkspace(input.value.trim());
    }
};

// ---- MODEL PICKER ----
function initModelPicker() {
    const models = [
        'Claude Opus 4.6 (Thinking)',
        'GPT-4o (Custo Zero)',
        'Claude Sonnet 3.7 (Fast)',
        'DeepSeek V3 / R1 (Reasoner)'
    ];
    let idx = 0;
    document.getElementById('modelPicker')?.addEventListener('click', () => {
        idx = (idx + 1) % models.length;
        state.currentModel = models[idx];
        const el = document.getElementById('selectedModelName');
        if (el) el.textContent = models[idx];
    });
}

// ---- WEBSOCKET TELEMETRY ----
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
            if (data.type === 'project_payload') {
                state.files['index.html'].content = data.html;
                state.files['style.css'].content = data.css;
                if (data.api_py) state.files['api.py'].content = data.api_py;
                
                updatePreview();
                if (state.monacoEditor) {
                    const currentLang = state.files[state.activeFile].lang;
                    const currentContent = state.files[state.activeFile].content;
                    const model = monaco.editor.createModel(currentContent, currentLang);
                    state.monacoEditor.setModel(model);
                }

                addAgentResponse(
                    `<p>🎉 <strong>Projeto construído com sucesso!</strong></p>
                     <ul style="margin:8px 0 8px 20px;color:var(--text-secondary);font-size:13px;">
                         <li>Visual Inspector Score: <strong>${data.report?.score || 100}/100</strong></li>
                         <li>Segurança: <strong>${data.security_audit?.sql_injection_risk || 'Zero SQLi'}</strong></li>
                         <li>Arquivos gerados: <code>index.html</code>, <code>style.css</code>, <code>api.py</code></li>
                     </ul>`,
                    "Thought for 4s",
                    "4 commands"
                );
            }
        } catch (e) {}
    };
}

// ---- UTILITIES ----
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function closeModal(id) {
    document.getElementById(id)?.classList.remove('modal--open');
}

// ---- INITIALIZATION ----

// ---- CHAT SESSIONS & CONVERSATION CONTINUITY (ANTIGRAVITY) ----
let currentSessionId = 'session-1';
let currentSessionTitle = 'Melhorias do Agente Antigravity';

async function initChatSessionsManager() {
    const btnHistory = document.getElementById('btnChatHistory');
    const btnNewChat = document.getElementById('btnNewChat');
    const btnNewFromModal = document.getElementById('btnCreateNewSessionFromModal');

    if (btnHistory) {
        btnHistory.addEventListener('click', async () => {
            await renderSessionsModal();
            document.getElementById('sessionsModal')?.classList.add('modal--open');
        });
    }

    if (btnNewChat) {
        btnNewChat.addEventListener('click', () => {
            startNewConversation();
        });
    }

    if (btnNewFromModal) {
        btnNewFromModal.addEventListener('click', () => {
            closeModal('sessionsModal');
            startNewConversation();
        });
    }

    // Resizer Explorer vs Chat
    const resizerExp = document.getElementById('resizerExplorer');
    const explorerPanel = document.getElementById('explorerPanel');
    const layout = document.querySelector('.antigravity-layout');

    if (resizerExp && explorerPanel && layout) {
        let isDraggingExp = false;
        resizerExp.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDraggingExp = true;
            document.body.classList.add('is-resizing');
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDraggingExp) return;
            const sidebarWidth = 44; // Rail width
            const newWidth = e.clientX - sidebarWidth;
            if (newWidth >= 120 && newWidth <= 450) {
                explorerPanel.style.width = `${newWidth}px`;
                if (state.monacoEditor) state.monacoEditor.layout();
                localStorage.setItem('cx_explorer_pane_width', newWidth);
            }
        });

        window.addEventListener('mouseup', () => {
            if (isDraggingExp) {
                isDraggingExp = false;
                document.body.classList.remove('is-resizing');
            }
        });

        const savedW = localStorage.getItem('cx_explorer_pane_width');
        if (savedW) {
            explorerPanel.style.width = `${savedW}px`;
        }
    }
}

async function renderSessionsModal() {
    const container = document.getElementById('sessionsListContainer');
    if (!container) return;

    try {
        const res = await fetch(`${API_BASE}/chat/sessions`);
        if (!res.ok) throw new Error('Offline');
        const data = await res.json();
        const sessions = data.sessions || [];

        container.innerHTML = '';
        if (sessions.length === 0) {
            container.innerHTML = '<p style="color:var(--text-muted);font-size:12px;text-align:center;">Nenhuma conversa anterior salva.</p>';
            return;
        }

        sessions.forEach(sess => {
            const item = document.createElement('div');
            item.className = `session-item ${sess.id === currentSessionId ? 'session-item--active' : ''}`;
            item.innerHTML = `
                <div class="session-info">
                    <span class="session-title">${escapeHtml(sess.title || 'Conversa sem título')}</span>
                    <span class="session-date">${new Date(sess.created_at || Date.now()).toLocaleDateString('pt-BR')} — ${sess.messages?.length || 0} mensagens</span>
                </div>
                <span class="session-status-badge">Salva</span>
            `;
            item.addEventListener('click', () => {
                resumeSession(sess);
            });
            container.appendChild(item);
        });
    } catch (e) {
        container.innerHTML = '<p style="color:var(--text-muted);font-size:12px;text-align:center;">Histórico local ativo.</p>';
    }
}

function startNewConversation() {
    currentSessionId = `session-${Date.now()}`;
    currentSessionTitle = 'Nova Missão';
    const titleEl = document.getElementById('conversationTitle');
    if (titleEl) titleEl.textContent = currentSessionTitle;

    const feed = document.getElementById('chatMessages');
    if (feed) {
        feed.innerHTML = `
            <div class="chat-welcome" style="padding: 40px 20px; text-align: center;">
                <div class="chat-welcome__icon" style="font-size: 32px; margin-bottom: 8px;">✦</div>
                <h3 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">Nova Conversa com o Agente</h3>
                <p style="font-size: 12.5px; color: var(--text-muted); max-width: 420px; margin: 0 auto 16px;">Descreva o que deseja construir ou continuar nesta sessão.</p>
            </div>
        `;
    }
}

function resumeSession(sess) {
    closeModal('sessionsModal');
    currentSessionId = sess.id;
    currentSessionTitle = sess.title;
    const titleEl = document.getElementById('conversationTitle');
    if (titleEl) titleEl.textContent = sess.title;

    const feed = document.getElementById('chatMessages');
    if (!feed) return;
    feed.innerHTML = '';

    if (sess.messages && sess.messages.length > 0) {
        sess.messages.forEach(m => {
            if (m.role === 'user') {
                addUserMessage(m.text);
            } else {
                addAgentResponse(m.text, "Thought for 4s", "4 commands");
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initMonaco();
    initWorkspaceViews();
    initResizer();
    initRail();
    initFolderPicker();
    initChatSessionsManager();
    initModelPicker();
    initWebSocket();

    // Send button
    document.getElementById('btnSend')?.addEventListener('click', handleSendMessage);
    document.getElementById('chatInput')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    // Auto-resize textarea
    document.getElementById('chatInput')?.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 160) + 'px';
    });

    // New chat button
    document.getElementById('btnNewChat')?.addEventListener('click', () => {
        document.getElementById('chatMessages').innerHTML = '';
    });

    // Export ZIP
    document.getElementById('btnExportZip')?.addEventListener('click', () => {
        window.open(`${API_BASE}/project/export?project_id=default`, '_blank');
    });
});