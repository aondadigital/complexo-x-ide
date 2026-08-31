# Skill: Cibersegurança, Defesa de Agentes IA & Arquitetura Zero Trust (2026)

Esta habilidade define as diretrizes rigorosas de segurança defensiva para sistemas agentic, proteção contra ataques adversariais de IA, criptografia e mitigação de vulnerabilidades OWASP.

---

## 1. As 5 Leis da Segurança Zero Trust
1. **Nunca Confiar em Inputs Externos:** Toda mensagem vinda de webhooks, clientes, formulários ou scraping da web deve passar pelo Firewall de Injeção de Prompt antes de ser interpretada pela IA.
2. **Criptografia Autenticada de Ponta a Ponta:** Chaves de API, credenciais e dados pessoais (LGPD) devem ser criptografados em disco usando AES-256-GCM com chaves derivadas via PBKDF2.
3. **Princípio do Menor Privilégio:** Subagentes e ferramentas não devem ter permissão de execução de comandos destrutivos sem aprovação explícita e validação de guardrails.
4. **Verificação Criptográfica de Integridade:** Binários e arquivos críticos devem ter seus hashes SHA-512 monitorados periodicamente para detectar adulterações.
5. **Defesa em Profundidade na Web:** Todo webapp deve aplicar cabeçalhos HTTP estritos (CSP restritivo, HSTS, X-Frame-Options DENY).
