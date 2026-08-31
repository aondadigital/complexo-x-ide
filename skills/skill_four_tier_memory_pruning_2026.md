---
name: four_tier_memory_pruning_2026
description: Arquitetura de Memória em 4 Camadas (Working, Episodic, Semantic, Procedural) com Poda Ativa de Contexto (Context Pruning) e Pontuação de Confiança (Trust Scoring) contra Memory Rot.
---

# 🧠 Skill: Four-Tier Memory & Context Pruning (2026)
**Complexo-X | Autoridade Máxima: Luiz Cipolari**
**Blindagem Cognitiva contra Degradação de Atenção e Alucinações**

---

## 🎯 Objetivo
Evitar a "armadilha do contexto gigante" (long-context trap). Manter o contexto do agente sempre afunilado e afiado, dividindo o conhecimento em 4 camadas independentes e aplicando poda ativa de ruídos temporários.

---

## 🏛️ As 4 Camadas de Memória

| Camada | Escopo | Armazenamento | Propósito |
| :--- | :--- | :--- | :--- |
| **1. Working Memory** | Turno Atual (~4k tokens) | RAM / Prompt ativo | Contexto imediato da subtarefa em execução |
| **2. Episodic Memory** | Histórico de Sessões | Vetores HNSW / SQLite | "O que fizemos na sessão passada" |
| **3. Semantic Memory** | Fatos & Regras Mestre | Obsidian Vault / Grafos | Conhecimento consolidado imutável |
| **4. Procedural Memory** | Como Executar | Skills / Ferramentas | Métodos passo-a-passo e pipelines |

---

## ✂️ Diretrizes de Context Pruning (Poda Ativa)
1. **Descarte de Logs Brutos**: Após verificar que um comando/teste passou com sucesso, descarte a saída bruta de 500 linhas e guarde apenas o sumário atômico (`✅ Teste passou com 0 erros em 1.2s`).
2. **Trust Scoring**: Cada aprendizado deve ter um nível de confiança (1 a 5). Aprendizados provados em código físico têm Trust=5; hipóteses não testadas são podadas.
3. **Prevenção de Memory Rot**: Antes de cada nova resposta, descarte suposições antigas ou comandos que já falharam, impedindo insistência em erros passados.
