---
name: colbert_graphrag_hybrid_retriever_2026
description: Recuperação Híbrida em 3 Estágios (BM25 + Vetores Densos + Re-ranking ColBERT MaxSim) integrada a Grafo de Conhecimento (GraphRAG) para 2026.
---

# 🔍 Skill: ColBERT & GraphRAG Hybrid Retriever (2026)
**Complexo-X | Autoridade Máxima: Luiz Cipolari**
**Recuperação de Informação com Precisão Cirúrgica e Zero Alucinação**

---

## 🎯 Objetivo
Substituir o RAG ingênuo por uma esteira de recuperação em 3 estágios que combina correspondência exata de termos (BM25), proximidade semântica (vetores) e alinhamento fino token-a-token (ColBERT MaxSim), enriquecida por nós e arestas de grafos de conhecimento.

---

## 🏗️ Os 3 Estágios da Recuperação Híbrida

```text
1. [RECUPERAÇÃO PRIMÁRIA]:
   • BM25 resgata termos exatos (códigos, marcas, nomes próprios).
   • Vetores densos resgatam sinônimos e contexto conceitual.
   • Fusão via Reciprocal Rank Fusion (RRF).

2. [RE-RANKING FINO (ColBERT MaxSim)]:
   • Calcula a similaridade máxima de cada token da query contra os tokens dos documentos.
   • Isola os 5 melhores fragmentos com grounded accuracy de 99%.

3. [ENRIQUECIMENTO GRAPHRAG]:
   • Conecta entidades irmãs e metadados estruturados do Obsidian Vault antes de injetar no LLM.
```

---

## 🛡️ Regras de Operação
1. Nunca responder com dados não ancorados no documento recuperado.
2. Calcular sempre o score de relevância ponderado antes de emitir a resposta final.
