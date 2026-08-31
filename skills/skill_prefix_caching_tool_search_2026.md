---
name: prefix_caching_tool_search_2026
description: Otimização de Prefix Caching e Carregamento Sob Demanda de Ferramentas (defer_loading e Tool Search) para redução de 60-90% em tokens e latência instantânea.
---

# ⚡ Skill: Prefix Caching & Tool Search (2026)
**Complexo-X | Autoridade Máxima: Luiz Cipolari**
**Padrão de Engenharia de Tokens e Caching de Alta Eficiência**

---

## 🎯 Objetivo
Manter o prefixo de prompt estático e determinístico para maximizar a taxa de acerto de KV-Cache (80-90% cache hit rate), evitando a injeção massiva de centenas de esquemas de ferramentas que poluem a atenção do modelo e invalidam o cache.

---

## 🏗️ Princípios de Arquitetura de Prefixo

### 1. Superfície Estática no Topo (Static Prefix)
- O cabeçalho de regras fundamentais, instruções imutáveis e ferramentas essenciais devem permanecer no topo com ordem estritamente determinística (alfabética ou chumbada).
- **Proibido**: Injetar timestamps, IDs dinâmicos ou mensagens de conversa no meio do bloco estático.

### 2. Carregamento Sob Demanda (`defer_loading` / Tool Search)
- Em vez de carregar os esquemas de 587 ferramentas no prompt inicial:
  - Mantém-se apenas um índice semântico leve (nome + descrição de 1 linha).
  - O agente invoca a ferramenta de busca (`tool_search(query)`) para resgatar a especificação completa apenas quando necessário.

### 3. Layout "Dynamic-Last"
```text
┌────────────────────────────────────────────────────────┐
│ 1. Regras Globais & Constituição (100% Estático)       │ ──► [CACHE HIT]
│ 2. Definições de Ferramentas Core (Ordem Determinística)│ ──► [CACHE HIT]
│ 3. Ponto de Corte (Breakpoint: cache_control)          │ ──► [CACHE BREAK]
├────────────────────────────────────────────────────────┤
│ 4. Estado Dinâmico Atual & Mensagens Recentes          │
│ 5. Resultados de Execução e Chamadas de Ferramentas    │
└────────────────────────────────────────────────────────┘
```

---

## 🛠️ Regras de Operação
1. Nunca altere a ordem dos nomes de ferramentas entre chamadas na mesma sessão.
2. Isole as saídas de ferramentas em blocos separados após o breakpoint.
3. Monitore continuamente a métrica de `cache_hit_rate` para garantir economia de tokens.
