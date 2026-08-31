# SKILL: Zero-Knowledge Proofs & Cryptographic Commitments (2026)

## 1. Missão e Propósito
Validar autenticações, integridade e conformidade de dados através de compromissos criptográficos (Commitments) e provas de conhecimento zero (ZK) sem necessidade de revelar chaves, credenciais ou dados sensíveis.

## 2. Princípios Operacionais
- Utilização de fatores de ofuscação (Blinding Factors) aleatórios e seguros.
- Separação estrita entre a testemunha privada (Witness) e a prova pública (Proof).
- Verificação matemática via digests de tempo constante para prevenção de timing attacks.

## 3. Comandos Centrais
```bash
python super_cli.py zk commit "<segredo>"
python super_cli.py zk
```
