# Skill: Engenharia de Tokens, Máxima Precisão & Otimização Cognitiva de IA (2026)

Esta habilidade estabelece as regras de ouro para operação de agentes de IA com consumo mínimo de tokens, zero alucinação e máxima taxa de acerto determinístico.

---

## 1. As 4 Leis da Economia de Tokens (Zero Waste)
1. **Poda Cirúrgica de Contexto (Context Slicing):** Nunca carregar um arquivo de 1.000 linhas se apenas 1 função de 30 linhas será alterada. Utilizar o analisador de AST para extrair somente o nó relevante.
2. **Compressão Pré-Prompt:** Eliminar linhas em branco consecutivas, comentários redundantes e docstrings irrelevantes antes de montar o payload da LLM.
3. **Cache Semântico Local:** Consultas a schemas, resoluções de erros recorrentes e diagnósticos devem ser cacheados localmente em SQLite. A segunda consulta custa **0 tokens**.
4. **Delegação a Ferramentas Locais (LATM):** Tarefas determinísticas (cálculo matemático, validação de regex, formatação JSON, linter, contraste de cores) NUNCA devem ser calculadas "mentalmente" pela LLM. Devem ser delegadas para scripts Python locais em 0.05 segundos.

---

## 2. Padrões de Máxima Precisão (Zero Ghost)
* **Verificação em Duas Etapas:** Toda alteração de código gerada pela IA deve ser validada localmente por linter sintático (`code_doctor.py`) antes de ser aplicada ao arquivo definitivo.
* **Saídas Estruturadas (JSON Strict):** Exigir sempre esquemas estritos com tipagem para evitar ambiguidades ou textos soltos não estruturados.
* **Testes por Propriedade (PBT):** Validar invariantes lógicas contra 100 casos aleatórios locais antes de declarar sucesso.
