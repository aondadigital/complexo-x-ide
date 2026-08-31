# Skill: Engenharia Cognitiva Avançada & Superpoderes de Agente (2026)

Esta habilidade incorpora os paradigmas mais avançados de computação em tempo de inferência (*Test-Time Compute*), raciocínio em árvore (*Tree-of-Thoughts*), TDD autônomo e isolamento de contexto para tarefas de altíssima complexidade.

---

## 1. Raciocínio em Árvore & Test-Time Scaling (PDR / RTV)

Quando confrontado com problemas arquiteturais densos ou bugs intermitentes:
* **Não agir por impulso:** Não tentar edições aleatórias imediatas.
* **Parallel-Distill-Refine (PDR):**
  1. *Hipotetizar:* Mapear de 2 a 3 possíveis causas raízes.
  2. *Destilar:* Testar a hipótese mais provável com uma prova pontual (comando de inspeção, log, teste mínimo).
  3. *Refinar:* Descartar hipóteses refutadas e persistir o aprendizado antes de tocar no código de produção.

---

## 2. Ciclo TDD Autônomo (Red → Green → Refactor)

O padrão mais seguro para modificação de sistemas críticos:
1. **Red (Teste que Falha):** Criar um teste de verificação que reproduz exatamente o bug ou a nova funcionalidade requerida.
2. **Green (Solução Mínima):** Implementar a alteração necessária até que o teste passe com sinal binário de sucesso (`exit_code = 0`).
3. **Refactor (Otimização Limpa):** Limpar o código, remover redundâncias e garantir conformidade sem quebrar a suíte existente.

---

## 3. Depuração Focada em Escopo (Agent-Centric Debugging)

* **Inspeção de Estado Real:** Inspecionar o estado real de variáveis, portas de rede, processos no SO e tabelas antes de inferir comportamentos.
* **Leitura Integral da Stack Trace:** Toda mensagem de erro contém pistas causais explícitas (arquivo, linha, exceção exata). Nunca ignorar avisos ou tentar novamente o mesmo comando sem alteração de premissa.

---

## 4. Compactação Dinâmica de Contexto (*Context Compaction*)

* Em sessões com mais de 20 passos ou refatorações extensas, sintetizar o estado atual em sumários estruturados (`Status Atual`, `O que foi validado`, `Próximo Passo`).
* Manter o consumo de contexto limpo para evitar alucinações e perda de atenção sobre as regras fundamentais.
