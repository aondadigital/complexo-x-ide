# Skill: Design System & Engenharia de UI/UX de Alto Padrão (2026)

Esta habilidade estabelece as diretrizes estéticas inegociáveis para qualquer interface gráfica, website, landing page ou dashboard desenvolvido no ecossistema Complexo-X.

---

## 1. Princípio Estético: O Efeito "WOW" (Visual Premium)
* **Proibição de Cores Genéricas:** Nunca utilizar cores primárias puras ou saturadas ao extremo (`#ff0000`, `#0000ff`, `#00ff00`). Usar paletas HSL afinadas com matizes modernos (esmeralda, índigo profundo, violeta elétrico, ardósia, grafite).
* **Dark Mode Profundo (Deep Slate):** O fundo principal não deve ser `#000000` puro, mas sim tons sofisticados como `#0a0d14`, `#0f172a` ou `hsl(222, 47%, 7%)`.
* **Glassmorphism com Propósito:**
  ```css
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  ```

---

## 2. Tipografia e Escala Visual
* **Fontes Modernas:** Utilizar famílias tipográficas de alta legibilidade: *Inter*, *Outfit*, *Plus Jakarta Sans* ou *Geist Sans*.
* **Hierarquia Clara:**
  * Títulos: `font-weight: 700` ou `800` com `letter-spacing: -0.02em`.
  * Textos de Apoio: `color: rgba(255, 255, 255, 0.7)` com `line-height: 1.6`.

---

## 3. Micro-Interações & Animações Vivas
* **Transições Suaves:** Todo elemento interativo (botão, card, link) deve possuir `transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`.
* **Feedback de Hover:** Efeito sutil de elevação (`transform: translateY(-2px)`) e iluminação de borda no cursor.
* **Acessibilidade Obrigatória:** Contraste mínimo de texto de 4.5:1 (WCAG 2.2 AA).
