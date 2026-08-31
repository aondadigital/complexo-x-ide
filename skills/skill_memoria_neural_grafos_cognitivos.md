# Skill: Memória Neural, Grafos Cognitivos & Busca Vetorial Local (2026)

Esta habilidade define a arquitetura matemática e determinística para indexação de conhecimento de longo prazo, grafos conceituais e recuperação semântica por similaridade vetorial sem alucinações (Zero Ghost).

---

## 1. As 3 Camadas da Memória Neural
1. **Camada de Grafos (Conexões Semânticas):** Cada conceito, ferramenta e protocolo é um nó (`Node`). As relações entre eles são arestas direcionadas (`Edge`: *usa*, *calcula*, *integra*, *herda*). A travessia de grafos permite inferência dedutiva de múltiplos saltos.
2. **Camada Vetorial (Similaridade por Cosseno):** As lições e regras são vetorizadas no espaço vetorial. A busca semântica calcula o produto escalar entre o vetor da dúvida do usuário e os vetores armazenados, retornando o conhecimento exato mesmo com sinônimos.
3. **Camada de Consolidação (Poda e Deduplicação):** Lições antigas idênticas são fundidas; memórias com alta frequência de acertos ganham peso reforçado sináptico; ruídos intermediários são descartados.

---

## 2. Padrões de Persistência Determinística
* Toda a base de conhecimento neural é armazenada em formato aberto (SQLite local + Markdown no Obsidian) para garantir que qualquer engenheiro humano ou outro agente (Agente-X / Claude) possa ler, auditar e testar os dados em tempo real.
