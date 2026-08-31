# Skill: Quadro de Recados & Sincronização VPS com Claude

Esta habilidade padroniza a comunicação autônoma entre o **Super Antigravity** (PC Windows) e o **Claude** (Guardião do Sistema / VPS), eliminando a necessidade de o Operador atuar como intermediário manual.

---

## 1. Protocolo de Comunicação Obrigatório (Regra 12)

### Início de Sessão (Leitura de Ordens)
No início de qualquer tarefa ou sessão, verificar o portal e ler os recados pendentes deixados pelo Claude:

```bash
# 1. Verificar portal e identidade
ssh vps-antigravity "portal"

# 2. Ler ordens e instruções do Claude
ssh vps-antigravity "recado ler antigravity"
```

### Fim de Etapa ou Bloqueio (Envio de Evidência)
Ao concluir uma missão, validar um build ou encontrar um bloqueio técnico:

```bash
# Enviar relatório com evidência comprovada
ssh vps-antigravity "RECADO_DE=antigravity recado para windows '<relatório sucinto com provas de execução>'"
```

### Consulta e Registro no Livro de Operações
Antes de mexer em infraestrutura/deploy e após validar mudanças:

```bash
# Consultar histórico da área
ssh vps-antigravity "livro deploy"

# Registrar aprendizado validado (funcionou / falhou / cuidado)
ssh vps-antigravity "RECADO_DE=antigravity livro deploy funcionou 'Descrição da solução validada'"
```

### Busca de Contexto Rápido na VPS
```bash
ssh vps-antigravity "lembrar <termo_ou_assunto>"
```

---

## 2. Travas de Segurança da VPS (Invioláveis)
* **Proibido:** `rm -rf`, `systemctl stop` ou `docker compose down` em serviços de clientes ativos (`avepro`, `akitem`, `aondadigital`).
* **Firewall & SSH:** Não desativar `ufw`, `fail2ban`, nem alterar regras de `/etc/ssh/`.
* **Gerenciador de Processos:** Os serviços na VPS são gerenciados via **systemd** (PM2 está desabilitado).
* **Segredos:** Arquivos `.env`, chaves de API e tokens **NUNCA** devem ser commitados no Git.
