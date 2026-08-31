# 🚀 COMPLEXO-X IDE

> **complexo-x.com.br/ide** — O ambiente de desenvolvimento agêntico movido por Motor Custo Zero, Equipe de Especialistas (Gerente, Designer, Programador, Marketeiro e SEO) e Biblioteca de Modelos de Design Visual.

---

## 🌟 Recursos Principais

- **Motor Custo Zero:** Suporte nativo a Claude Opus e GPT-4o via assinatura sem custos por token.
- **5 Painéis Integrados:**
  - **Monaco Code Editor:** Suporte a múltiplas abas, syntax highlighting em tema escuro proprietário.
  - **Live Preview:** Renderização de projetos em tempo real com alternância Desktop / Mobile.
  - **Chat de Missão:** Central de comando para envio de prompts e missões.
  - **Agent Dashboard:** Telemetria WebSocket com status dos 5 agentes em tempo real.
  - **Biblioteca de Modelos:** Captura de DNA visual e aplicação de templates canônicos (Stripe Dark, Linear Clean, Vercel Minimal).
- **Deploy Automático:** Orquestrado para VPS com Nginx, Systemd e SSL.

---

## 📁 Estrutura do Projeto

```
D:\PROJETOS\IDE\
├── backend/
│   ├── server.py             # Gateway FastAPI & WebSocket
│   └── capture_model.py      # Pipeline de captura visual
├── frontend/
│   ├── index.html            # Layout dos 5 painéis
│   ├── style.css             # Design system e tokens
│   └── app.js                # Lógica de interface e Monaco
├── modelos/                  # Templates de design (JSON/YAML)
│   ├── stripe_dark.json
│   ├── linear_clean.json
│   └── vercel_minimal.json
└── souls/                    # Almas dos Especialistas
    ├── soul_programador.md
    ├── soul_designer.md
    ├── soul_marketing.md
    └── soul_seo.md
```

---

## 🛠️ Como Rodar Localmente

1. Instale as dependências:
   ```bash
   pip install fastapi uvicorn pydantic
   ```
2. Inicie o servidor:
   ```bash
   python backend/server.py
   ```
3. Abra no navegador: `http://localhost:8080`