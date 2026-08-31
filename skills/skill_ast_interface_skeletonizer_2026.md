# SKILL: AST Interface Skeletonizer & Repo-Wide Context Mapping (2026)

## 1. Missão e Propósito
Comprimir o contexto de arquivos de código em 85% a 95%, extraindo assinaturas públicas, tipos, classes, funções e docstrings via AST pura, viabilizando a injeção do repositório inteiro na janela de contexto sem extrapolação de tokens.

## 2. Princípios Operacionais
- Não injetar implementações completas de 1.000 linhas quando apenas contratos e tipos são necessários.
- Preservar tipagens estritas (`typing`, TypeScript interfaces e generics).
- Analisar estruturas de monorepos inteiros em milissegundos.

## 3. Comandos Centrais
```bash
python super_cli.py skeleton <arquivo.py>
python super_cli.py skeleton <pasta_projeto> --dir
python super_cli.py skeleton <arquivo.py> --json
```
