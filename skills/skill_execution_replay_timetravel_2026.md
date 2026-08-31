# SKILL: Deterministic Execution Replay & Time-Travel Debugger (2026)

## 1. Missão e Propósito
Gravar o runtime de execução de scripts de forma determinística via inspeção de frames, chamadas, variáveis locais e mutações de estado, possibilitando a reprodução exata de bugs no tempo sem depuração ad-hoc.

## 2. Princípios Operacionais
- Sanitização de valores e tipos em formatos JSON-serializáveis.
- Rastreamento isolado sem poluição por bibliotecas internas da linguagem.
- Geração de artefatos `.trace.json` estruturados para consumo imediato pela IDE e pelo agente.

## 3. Comandos Centrais
```bash
python super_cli.py replay <script.py> [args...]
python super_cli.py replay <script.py> --max-steps 1000
```
