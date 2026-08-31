# Skill: LATM (Auto-Criação de Ferramentas) & Memória Tripartite Zettelkasten (2026)

Esta habilidade consolida o framework **LATM (*LLMs as Tool Makers*)** e a arquitetura de **Memória Tripartite Unificada** (Semântica, Episódica e Procedural) com organização estilo Zettelkasten para máxima retenção e autonomia de execução.

---

## 1. Framework LATM (Criador Autônomo de Ferramentas)

Quando uma tarefa envolver transformações de dados repetitivas, cálculos densos ou inspeções em lote:
* **Fase 1 - Tool Maker (Criação):** O agente programa um utilitário Python autocontido dentro de `BIBLIOTECA DE CONHECIMENTO/tools/`.
* **Fase 2 - Tool Verifier (Validação):** Executa o script com testes unitários em sandbox para garantir 100% de sucesso (`exit_code = 0`).
* **Fase 3 - Tool User (Reutilização):** Invoca a ferramenta diretamente nas próximas etapas, economizando 95% do tempo e dos tokens de raciocínio.

---

## 2. Memória Tripartite Unificada

O agente gerencia ativamente 3 níveis de memória estruturada:

| Nível de Memória | Função | Repositório no Complexo-X |
| :--- | :--- | :--- |
| **1. Semântica** | Fatos, IPs, portas, regras absolutas e topologia. | `GLOBAL_RULES.md` e arquivos de config |
| **2. Episódica** | Linha do tempo de incidentes, logs e deploys anteriores. | `OBSIDIAN - ANTIGRAVITY/` e histórico de sessões |
| **3. Procedural** | Instruções de "como fazer", scripts e manuais executáveis. | `BIBLIOTECA DE CONHECIMENTO/` (`SKILL.md`) |

---

## 3. Zettelkasten Cognitivo (Interconexão Causal)

* Ao registrar um novo aprendizado em `aprendizados.md`, referenciar a causa raiz conectando-a a lições anteriores (ex: *"Esta falha de conexão se relaciona com a regra de Redis da Evolution API..."*).
* Permite ao agente deduzir soluções em teia para problemas complexos nunca antes vistos diretamente.
