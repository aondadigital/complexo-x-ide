# SKILL: Git Worktrees Sandboxing & Concorrência Multitarefa (2026)

## 1. Missão e Propósito
Permitir a execução paralela de múltiplos agentes em ramos efêmeros isolados sem sujar ou travar a árvore de trabalho principal do desenvolvedor.

## 2. Princípios Operacionais
- Todo experimento, teste massivo ou refatoração profunda deve ocorrer em um worktree isolado sob `.worktrees/`.
- Antes de aplicar na branch principal, o sandbox deve ser compilado e passar nos testes automatizados.
- Merge atômico com squash para manter o histórico Git cristalino.

## 3. Comandos Centrais
```bash
python super_cli.py worktree create <task_id>
python super_cli.py worktree exec <task_id> <comando...>
python super_cli.py worktree merge <task_id> --target main
python super_cli.py worktree remove <task_id>
```
