# Skill: Navegação AST, Testes por Propriedade (PBT) & Auto-Cura (Self-Healing)

Esta habilidade estabelece os padrões técnicos mais profundos de 2026 para compreensão estrutural de código, testes de alta cobertura por invariantes e resiliência autônoma.

---

## 1. Navegação Sintática AST & Análise Semântica (Tree-sitter / LSP)

Supera a manipulação ingênua de arquivos baseada em regex ou busca textual cega:
* **Compreensão de Árvore Sintática (AST):** Analisar arquivos respeitando blocos, escopos de variáveis, assinaturas de funções e hierarquia de classes.
* **Economia de Contexto (Token Budgeting):** Em arquivos gigantes, focar em assinaturas de tipo, contratos de interface e referências cruzadas antes de carregar o corpo de implementação.
* **Integridade Estrutural:** Nenhuma edição é feita quebrando a sintaxe ou a árvore da linguagem.

---

## 2. Testes Baseados em Propriedades (Property-Based Testing - PBT)

Evolução do TDD tradicional para garantia matemática e comportamental:
* **Validação por Invariantes:** Em vez de testar apenas exemplos específicos (`input = 1, output = 2`), define regras globais que **sempre** devem ser verdadeiras (ex: *idempotência*, *não-perda de dados*, *imutabilidade de estado*, *formatação válida de saída*).
* **Varredura de Casos Limítrofes (*Edge Cases*):** Testar entradas nulas, vazias, caracteres especiais, concorrência e tipos inesperados antes de liberar para produção.

---

## 3. Mecanismos de Auto-Cura (*Autonomous Self-Healing*)

Detecção e correção autônoma de desvios (*Drift*) em runtime:
* **Vigilância de Contratos de API:** Monitorar alterações em endpoints externos (ex: Baileys/WhatsApp, YouTube, SDKs). Ao detectar quebra de contrato, atualizar o adapter/schema imediatamente.
* **Auto-Recuperação de Ambientes:** Se uma porta estiver presa, container travar ou cache corromper, executar diagnóstico de reset controlado sem destruir dados persistidos.
* **Evidência Obrigatória de Reparo:** O auto-reparo só é considerado concluído após o teste de validação de propriedade passar com sucesso.
