# Skill: Pipeline de Automação de Vídeos, Músicas & Cortes

Arquitetura distribuída entre Mac, VPS e Windows para captação, edição de áudio/vídeo e publicação.

---

## 1. Arquitetura Multi-Setor
1. **Setor 1 - Captação (Mac):** Varredura de perfis via `yt-dlp` com ordenação por contagem de views (`--sort-by view_count`) para selecionar o conteúdo de maior alcance.
2. **Setor 2 - Edição e Tratamento (VPS/Local):** 
   * Cortes automáticos de 1.5 a 3 minutos via FFmpeg.
   * Aplicação de filtros visuais (Preto e Branco nativo, título em duas linhas).
   * Higienização de metadados: `-map_metadata -1`.
3. **Setor 3 - Sincronização Precisa de Legendas (Whisper):**
   * Em músicas com introdução instrumental longa, ativar `word_timestamps=True` (modelo medium/large).
   * Marcar o surgimento do primeiro verso exatamente na entrada vocal, eliminando o erro de segmentação em t=0s.
4. **Setor 4 - Sentinela & Publicação:**
   * Monitoramento de batimento cardíaco (`.mac_last_seen`).
   * Alerta vermelho caso o heartbeat fique inativo por mais de 24 horas.
