# Skill: Harness Engineering & Montagem de Contexto Just-In-Time (JIT) (2026)

Esta habilidade consolida o padrão de engenharia rigorosa validado pelos principais laboratórios de IA (Anthropic, OpenAI, Cursor, DeepMind): a equação **Agente = Modelo + Harness**.

---

## 1. O Princípio do Harness (Andaime Operacional)

A inteligência de um agente em produção é determinada pela robustez do seu **Harness**:
* **Controle Determinístico:** O modelo provê o raciocínio; o Harness impõe regras invioláveis, sandboxes seguras, feedback sensors e rotas de recuperação.
* **Tese do SWE-bench Pro (97% de Acurácia):** Agentes de alta performance não vencem por "chutar melhor", mas sim por possuírem um scaffold que intercepta falhas antes da entrega.

---

## 2. Montagem de Contexto Just-In-Time (JIT Assembly)

Supera o vício de pré-carregar arquivos gigantescos que poluem a janela de contexto:
* **Carregamento Sob Demanda:** Inspecionar a estrutura de diretórios e contratos de interface primeiro. Só ler o corpo completo dos arquivos necessários na etapa exata da modificação.
* **Prevenção de Amortização Estéril:** Evita contexto obsoleto e alucinações de arquivos que mudaram durante a execução.

---

## 3. Sensores de Feedback & Guias Feedforward

1. **Guias Feedforward (Pré-Execução):**
   * Tipagem estática, verificação de linters e leitura de regras antes de gerar código.
2. **Sensores de Feedback (Pós-Execução):**
   * Validação por compiladores, comandos de teste reais e análise de códigos de saída (`exit_code`).
   * Se o sensor aponta falha, o Harness força o loop causal de auto-correção sem intervenção humana manual.
