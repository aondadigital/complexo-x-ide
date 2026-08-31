# SKILL: PagedAttention & KV-Cache VRAM Memory Optimization (2026)

## 1. Missão e Propósito
Otimizar o uso de memória de placas de vídeo e servidores de inferência de LLMs através da paginação virtual de KV-Cache em blocos não-contíguos, prevenindo fragmentação de VRAM e maximizando o paralelismo de múltiplos agentes.

## 2. Princípios Operacionais
- Não alocar memória contígua para o tamanho máximo hipotético de contexto.
- Dividir tensores de Keys e Values em blocos fixos de tokens (ex: 16 tokens por bloco).
- Liberar instantaneamente blocos de requisições concluídas.

## 3. Comandos Centrais
```bash
python super_cli.py paged-kv --prompt 4096 --gen 1024 --vram 24
```
