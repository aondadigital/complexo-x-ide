# SKILL: DPO Preference Dataset Generator & Fine-Tuning (2026)

## 1. Missão e Propósito
Gerar datasets no formato de Otimização de Preferência Direta (DPO / JSONL) a partir das soluções aprovadas e rejeitadas em debates multi-agente, viabilizando o auto-treinamento contínuo de modelos de linguagem locais.

## 2. Princípios Operacionais
- Pares no padrão `{prompt, chosen, rejected}` compatíveis com Unsloth e HuggingFace TRL.
- Inclusão de metadados de score e margem de preferência.

## 3. Comandos Centrais
```bash
python super_cli.py export-dpo [dataset_out.jsonl]
```
