# SKILL: SMT Formal Verifier & Logic Constraints (2026)

## 1. Missão e Propósito
Provar matematicamente que sistemas críticos, regras de negócios e transições de estado não violam invariantes de segurança e estão 100% livres de deadlocks.

## 2. Princípios Operacionais
- Invariantes devem ser funções booleanas puras e determinísticas.
- Grafos de agentes devem ser auditados para garantir que todos os caminhos alcançam estados terminais válidos.
- Resoluções classificadas formalmente como SAT (Satisfatível) ou UNSAT (Violação).

## 3. Comandos Centrais
```bash
python super_cli.py smt
```
