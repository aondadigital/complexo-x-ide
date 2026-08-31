# Skill: Padrões de Programação de Elite (Engenharia Sênior 2026)

Esta habilidade estabelece as diretrizes técnicas inegociáveis de engenharia de software para o **Super Antigravity** em Python, TypeScript/JavaScript, SQL/PostgreSQL e Scripts de Automação.

---

## 1. Python de Elite
* **Tipagem Estrita Obrigatória:** Usar sempre type hints explícitos (`typing.Optional`, `typing.Union`, `typing.List`, `typing.Dict`).
* **Modelagem com Pydantic v2:** Validação de entradas e saídas de dados com models tipados, evitando dicionários soltos (`dict`) sem contrato.
* **Assincronismo Sem Bloqueio:** Funções I/O pesadas devem usar `asyncio` / `aiohttp` / `aiofiles`. Nunca executar chamadas síncronas bloqueantes dentro do event loop.
* **Gerenciadores de Contexto:** Manipulação de arquivos, conexões de banco e sockets sempre envolvidos em blocos `with` ou `async with`.
* **Tratamento Causal de Exceções:** Nunca usar `except:` vazio. Capturar exceções específicas e registrar a stack trace completa.

---

## 2. TypeScript / JavaScript Moderno
* **Eliminação Total de `any`:** Substituir por tipos genéricos, *interfaces* ou *Discriminated Unions*.
* **Validação de Schemas (Zod):** Todo payload recebido via API ou formulário deve ser validado via Zod antes de ser consumido pela aplicação.
* **Next.js & React 19 Patterns:** 
  * Server Components por padrão para busca de dados direta no banco/servidor sem expor segredos.
  * Client Components (`"use client"`) restritos estritamente a elementos interativos com estado (`useState`, `useEffect`, eventos de clique).
* **Tratamento de Promises no Express/Node:** Rotas assíncronas devem tratar erros com blocos `try/catch` ou middleware de erro centralizado, evitando *UnhandledPromiseRejection*.

---

## 3. SQL & PostgreSQL de Alta Performance
* **Queries 100% Parametrizadas:** Proibida interpolação de strings em queries (prevenção total de SQL Injection).
* **Transações Atômicas:** Operações multi-tabela sempre protegidas por `BEGIN ... COMMIT` com `ROLLBACK` automático em caso de exceção.
* **Indexação Consciente:** Chaves estrangeiras, colunas filtradas frequentemente em `WHERE` e colunas de ordenação `ORDER BY` devem possuir índices B-Tree ou GIN.
* **Paginação com Cursor:** Em tabelas com mais de 10.000 registros, utilizar paginação baseada em ID/Timestamp (`WHERE id > :last_id LIMIT 50`) em vez de `OFFSET`.

---

## 4. Shell & PowerShell no Windows
* **Interrupção Rápida em Erros:** Scripts devem conter `$ErrorActionPreference = 'Stop'` ou checagens explícitas de `$LASTEXITCODE`.
* **Tratamento de Caminhos com Espaços:** Sempre envolver caminhos em aspas duplas (ex: `"d:\ANTIGRAVITY - SUPER"`).
* **Zero Output Truncation:** Garantir buffers e encodings UTF-8 no console para não corromper caracteres ou quebrar JSONs.
