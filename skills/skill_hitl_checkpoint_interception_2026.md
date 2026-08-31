# SKILL: HITL Checkpoint Interception & Safety (2026)

## 1. Missão e Propósito
Interceptar em tempo de execução qualquer operação de alto risco (exclusões massivas, comandos destrutivos ou deploys em produção), pausando de forma durável o loop de execução em SQLite e exigindo ticket de aprovação explícito do Operador.

## 2. Princípios Operacionais
- Ações destrutivas nunca são executadas sem confirmação criptograficamente assinada.
- Retomada instantânea do loop assíncrono pós-aprovação.

## 3. Comandos Centrais
```bash
python super_cli.py hitl check "<comando>"
python super_cli.py hitl list
python super_cli.py hitl approve <ticket_id>
```
