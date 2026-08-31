# Skill: Arquitetura de Agentes Autônomos de Elite do Ocidente (2026)

Esta habilidade consolida as melhores práticas e padrões arquiteturais adotados pelos principais laboratórios de IA do mundo (Anthropic, OpenAI, DeepMind, Microsoft Research, LangChain e Cognition Labs) para operação de agentes duráveis, seguros e de alto desempenho.

---

## 1. Padrões Arquiteturais Fundamentais
1. **Durable Execution (Execução Durável):** O estado da missão é salvo a cada transição de nó em um banco de checkpoints transacional. Se o processo for interrompido, a execução retoma do último ponto estável sem recomeçar do zero.
2. **Orchestrator-Worker com Subagentes Efêmeros (Magentic-One):** O Orquestrador central delega tarefas isoladas para subagentes especializados de ciclo de vida curto. O subagente retorna apenas um resumo destilado com evidências, mantendo a janela de contexto do orquestrador limpa.
3. **Runtime Guardrails & Invariantes de Segurança:** Toda chamada a ferramentas de sistema, banco de dados ou rede deve ser filtrada por políticas determinísticas antes da execução física.
4. **StateGraph (Grafos de Estado):** O fluxo de raciocínio é modelado como um Grafo Direcionado Acíclico (DAG), onde cada nó possui pré-condições, execução e pós-condições validadas por testes.

---

## 2. Relação Mentoria Pai e Filho (Complexo-X)
* O Agente Central ("Pai") mantém o grafo de conhecimento, executa o checkpointing durável e audita os resultados; o Agente Executor ("Filho" / Agente-X) recebe ordens destiladas com contratos claros e ferramentas físicas verificadas.
