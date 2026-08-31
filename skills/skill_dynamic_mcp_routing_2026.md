# SKILL: Dynamic MCP Registry & Semantic Tool Routing (2026)

## 1. Missão e Propósito
Expor dinamicamente todo o arsenal de 160+ ferramentas físicas como endpoints padronizados do Model Context Protocol (MCP) com roteamento semântico Just-In-Time (JIT) para otimização de contexto e chamadas de ferramentas.

## 2. Princípios Operacionais
- Não poluir o prompt do agente com dezenas de definições de ferramentas que não serão usadas.
- Indexar dinamicamente metadados, parâmetros e esquemas de entrada de cada ferramenta.
- Fornecer manifesto MCP unificado e compatível com Cursor, Claude Code e Antigravity IDE.

## 3. Comandos Centrais
```bash
python super_cli.py mcp-route "<intencao ou tarefa>"
python "BIBLIOTECA DE CONHECIMENTO/tools/dynamic_mcp_router.py" manifest
```
