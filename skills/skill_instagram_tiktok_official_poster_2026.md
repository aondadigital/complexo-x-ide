---
name: instagram_tiktok_official_poster_2026
description: Esteira Oficial de Publicação de Vídeos e Reels via Meta Instagram Graph API e TikTok Content Posting API com verificação em duas etapas e pre-flight quota.
---

# 📱 Skill: Instagram & TikTok Official Video Poster (2026)
**Complexo-X | Autoridade Máxima: Luiz Cipolari**
**Automação Blindada e Conforme de Publicação de Mídia**

---

## 🎯 Objetivo
Publicar Reels e vídeos gerados pelas esteiras do Complexo-X (*O Poder da Mente Sábia, AvePro, A Onda*) diretamente no Instagram e TikTok usando exclusivamente as APIs oficiais sem risco de banimento.

---

## 🏗️ Fluxo Oficial da Meta (Instagram Graph API)

```text
1. [UPLOAD CONTAINER]
   POST https://graph.facebook.com/v21.0/{ig-user-id}/media
   Payload: { media_type: "REELS", video_url: "https://...", caption: "..." }
   Retorno: { id: "<creation_id>" }

2. [PRE-FLIGHT STATUS POLL]
   GET https://graph.facebook.com/v21.0/{creation_id}?fields=status_code
   Aguarda status: "FINISHED"

3. [PUBLISH DISPATCH]
   POST https://graph.facebook.com/v21.0/{ig-user-id}/media_publish
   Payload: { creation_id: "<creation_id>" }
   Retorno: { id: "<media_id>" } -> NO AR!
```

---

## 🛡️ Regras de Segurança
1. Proibido usar scraping ou emuladores não-oficiais.
2. Validar proporção de aspecto (9:16 vertical, 1080x1920) e áudio estéreo 44.1kHz antes do disparo.
3. Respeitar limites de taxa com backoff exponencial.
