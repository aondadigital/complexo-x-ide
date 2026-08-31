# SKILL: Mutation Testing Harness & Auditoria de Testes (2026)

## 1. Missão e Propósito
Auditar formalmente a qualidade e eficácia de testes unitários através da injeção de mutantes sintéticos na AST. Elimina asserções fracas e falsos positivos gerados por modelos de IA.

## 2. Princípios Operacionais
- Testes que passam diante de código corrompido são classificados como FALSOS POSITIVOS.
- O Mutation Score deve ser rigorosamente acompanhado (Meta >= 80%).
- Restauração automática e segura do código original após a auditoria.

## 3. Comandos Centrais
```bash
python super_cli.py mutate <arquivo_fonte.py> --test-cmd python -m pytest
python super_cli.py mutate <arquivo_fonte.py> --max 15
```
