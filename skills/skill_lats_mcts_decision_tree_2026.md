# SKILL: Language Agent Tree Search (LATS) & MCTS Code Explorer (2026)

## 1. Missão e Propósito
Orquestrar a exploração de hipóteses de código em árvore com Monte Carlo Tree Search (MCTS), balanceamento UCT (Upper Confidence Bound) e retropropagação de valor com rollback determinístico em SQLite.

## 2. Princípios Operacionais
- Não insistir em ramificações falhas (anti-bola de neve).
- Avaliar hipóteses com base em métricas reais (pass/fail de testes, tempo de execução, complexidade ciclomática).
- Selecionar a melhor trajetória candidata de forma orientada a dados.

## 3. Comandos Centrais
```bash
python super_cli.py lats start <session_id> "<objetivo>"
python super_cli.py lats expand <session_id> <parent_id> "<hipotese 1>" "<hipotese 2>"
python super_cli.py lats eval <node_id> <score 0.0-1.0> <status> --feedback "<msg>"
python super_cli.py lats best <session_id>
```
