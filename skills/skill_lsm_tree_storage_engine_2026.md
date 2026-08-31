# SKILL: LSM-Tree Storage Engine & Database Internals (2026)

## 1. Missão e Propósito
Estruturar motores de persistência de altíssima vazão de escrita usando Log-Structured Merge-Trees, MemTable volátil, WAL para durabilidade ACID, SSTables imutáveis no disco, Filtros de Bloom e Compactação em níveis.

## 2. Princípios Operacionais
- Escritas nunca sobrescrevem dados no disco; são apensadas no WAL e MemTable.
- Filtros de Bloom em memória evitam acessos desnecessários de I/O em disco para chaves inexistentes.
- Compactação periódica consolida múltiplas SSTables e descarta registros marcados como tombstones.

## 3. Comandos Centrais
```bash
python super_cli.py lsm put <chave> <valor>
python super_cli.py lsm get <chave>
python super_cli.py lsm compact
```
