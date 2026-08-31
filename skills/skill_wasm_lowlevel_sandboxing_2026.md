# SKILL: WebAssembly (WASM) & Low-Level Sandboxing (2026)

## 1. Missão e Propósito
Fornecer um ambiente de execução isolado de alta performance com páginas de memória linear de 64 KB para execução de rotinas compiladas de C, Rust e Go sem riscos de corrupção de memória ou buffer overflows.

## 2. Princípios Operacionais
- Todo acesso à memória deve ser contido no buffer linear alocado para a instância WASM.
- Validação estrita de cabeçalhos binários (`\x00asm`).
- Suporte a operações aritméticas rápidas e vetoriais estilo SIMD.

## 3. Comandos Centrais
```bash
python super_cli.py wasm exec add_i32 15 35
python super_cli.py wasm
```
