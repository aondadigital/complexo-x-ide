# Skill: Infraestrutura & Topologia VPS Contabo (Complexo-X)

Manual operacional e topologia da VPS Ubuntu 24.04 (Host: `complexo-x` / `vps-antigravity`).

---

## 1. Topologia de Diretórios da VPS
* `/opt/apps/`: Aplicações web de produção (Node.js, Next.js, Vite, Express 5).
* `/opt/automacao/`: Scripts autônomos, bots Python, pipelines de processamento.
* `/opt/infra/`: Scripts de backup, configurações de deploy, scripts de manutenção.
* `/opt/staging/`: Ambientes de teste e homologação isolados.

---

## 2. Padrões de Execução & Serviços
* **Gerenciamento de Serviços:** Utilizar exclusivamente **systemd** (`systemctl status <servico>`, `systemctl restart <servico>`).
* **Web Server & Reverse Proxy:** Nginx configurado com bloqueio global de arquivos ocultos (`/\.*` retorna 404) e SSL via Let's Encrypt.
* **Segurança Ativa:** UFW (firewall) e Fail2ban sempre habilitados.
* **Bancos de Dados:** PostgreSQL 16 e Redis 7 (Docker).

---

## 3. Diretrizes de Backup e Restauração
* **Rotina de Backup:** Retenção de 3 dias em `/opt/infra/backups/` com espelhamento para armazenamento externo.
* **Conexão Direta:** Acesso rápido via terminal com `ssh complexo-x` ou `ssh vps-antigravity`.
