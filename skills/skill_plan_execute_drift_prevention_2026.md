---
name: plan_execute_drift_prevention_2026
description: Separação Estrita de Planejamento e Execução (Plan-Execute Separation) com Bloqueio de Desvio (Drift Prevention), Gating Intermediário e Auto-Rollback Atômico.
---

# 🛡️ Skill: Plan-Execute Drift Prevention (2026)
**Complexo-X | Autoridade Máxima: Luiz Cipolari**
**Controle Rigoroso de Trajetória e Imunidade a Desvios de Escopo**

---

## 🎯 Objetivo
Impedir o "mid-task drift" (desvio do objetivo durante a execução). O agente separa a fase de formulação do plano da fase de execução mecânica, validando cada etapa com critérios de aceite matemáticos antes de avançar.

---

## 🔒 Os 3 Pilares do Drift Prevention

### 1. Congelamento do Plano (Frozen Plan Scope)
- Antes de tocar em qualquer código ou comando, o objetivo é sintetizado em 1 frase e dividido em passos atômicos finitos (Passo 1 a N).
- Uma vez aprovado, o escopo fica congelado — o agente está proibido de inventar novos objetivos periféricos no meio da execução.

### 2. Gating Intermediário de Passos (Trajectory Gate)
- Cada passo gera uma evidência verificável (código compilando, teste com assert, log de 200, arquivo criado).
- Se a evidência do Passo $K$ falhar, o agente NÃO pode avançar para o Passo $K+1$.

### 3. Auto-Rollback em Caso de Erro
- Diante de falha em uma modificação, restaura-se o snapshot prévio atômico antes de recalibrar a abordagem.

---

## 📋 Checklist de Aceite por Passo
- [ ] O passo executado corresponde EXATAMENTE ao que foi planejado?
- [ ] A evidência física é real e auditada por comandos reais (sem mocks)?
- [ ] Houve regressão em algum módulo adjacente?
