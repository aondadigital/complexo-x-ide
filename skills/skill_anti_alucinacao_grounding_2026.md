---
name: anti-alucinacao-grounding-2026
description: Engenharia de anti-alucinação, Chain-of-Verification (CoVe), grounding simbólico no AST e verificação física factual.
---

# Skill: Anti-Alucinação & Grounding Factual 2026

Esta skill estabelece a blindagem anti-alucinação mandatória no ecossistema Antigravity / Complexo-X.

## 🎯 Pilares da Anti-Alucinação

### 1. Protocolo CoVe (Chain-of-Verification)
1. **Decomposição Factual:** Antes de emitir conclusões técnicas, decomponha afirmações em fatos elementares (nomes de arquivos, variáveis, funções, rotas).
2. **Inspeção Física:** Valide cada fato no disco SSD `D:\`, nas saídas reais do terminal ou nos arquivos do projeto via `view_file` / `run_command`.
3. **Assertividade Estrita:** Se um arquivo ou tabela não existir, relate explicitamente como inexistente. Proibido supor.

### 2. AST & Symbol Grounding
- Todo código gerado deve ter imports reais de bibliotecas instaladas no ambiente.
- Proibido inventar métodos ou classes de bibliotecas externas sem validar sua existência via documentação ou introspecção.

### 3. Execução do Grounder
```bash
python super_cli.py ground "<afirmação_ou_caminho_ou_código>"
```
