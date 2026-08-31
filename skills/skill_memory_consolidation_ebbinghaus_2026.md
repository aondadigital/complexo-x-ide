# SKILL: Memory Consolidation Daemon & Ebbinghaus Decay (2026)

## 1. Missão e Propósito
Executar manutenção contínua, compactação e otimização das bases de dados SQLite de memória neural e vetores, aplicando a curva de esquecimento de Ebbinghaus e deduplicação Zettelkasten.

## 2. Princípios Operacionais
- Execução de VACUUM e WAL Checkpoints para evitar fragmentação e locks no banco de dados.
- Preservação de memórias de alta estabilidade e poda de ruídos efêmeros.

## 3. Comandos Centrais
```bash
python super_cli.py consolidate
```
