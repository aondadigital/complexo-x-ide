# Skill: Evolution API v2 & Integração WhatsApp

Guia de configuração, resolução de problemas e padrões da Evolution API v2.2+ no ecossistema Complexo-X.

---

## 1. Requisitos Críticos de Infraestrutura
* **Redis Obrigatório:** A Evolution API v2 exige Redis ativo (`CACHE_REDIS_ENABLED=true` e `CACHE_REDIS_URI`) para handshake correto de instâncias Baileys. Sem Redis, o QR Code retorna `count: 0`.
* **Versão do Protocolo Baileys:** A variável de ambiente `CONFIG_SESSION_PHONE_VERSION` deve estar sincronizada com a versão mais recente oficial do Baileys para evitar rejeição no WhatsApp.

---

## 2. Tratamento de QR Code no Front-End / Rotas Next.js
* No endpoint de conexão da instância (`/instance/connect/{instanceName}`), o QR é retornado no objeto `data`:
  * `data.base64`: String Base64 pura da imagem PNG (sem prefixo `data:image`).
  * `data.code`: String de pareamento Baileys pura (usar com biblioteca `qrcode`).
* **Renderização:** Antes de passar para a tag `<img>`, injetar o prefixo: `data:image/png;base64,${data.base64}`.

---

## 3. Comandos de Reinicialização Segura
```bash
# Recriação de containers com limpeza de volume de cache
docker compose down -v && docker compose up -d
```
