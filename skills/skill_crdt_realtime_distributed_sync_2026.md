# SKILL: CRDT Realtime Distributed Sync (2026)

## 1. Missão e Propósito
Garantir sincronização determinística, convergência matemática e edição multi-agente peer-to-peer sem locks centrais via Conflict-Free Replicated Data Types (LWW-Element-Set e Sequence CRDTs).

## 2. Princípios Operacionais
- Toda alteração deve carregar timestamps de Lamport e identificadores únicos de nó.
- Merges devem ser matematicamente comutativos, associativos e idempotentes.
- Tombstones para deleção ordenada sem corrupção de sequência.

## 3. Comandos Centrais
```bash
python super_cli.py crdt test-set
python super_cli.py crdt test-text
```
