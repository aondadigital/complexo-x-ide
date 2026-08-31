# Skill: Engenharia 3D, WebGPU & Gêmeos Digitais Arquitetônicos (2026)

Esta habilidade estabelece as diretrizes técnicas para construção de maquetes digitais, visualizações espaciais e aplicações 3D interativas no navegador utilizando Three.js, WebGPU e materiais PBR.

---

## 1. Padrões de Renderização 3D Web (WebGPU & Three.js)
* **WebGPURenderer:** Utilizar o renderizador WebGPU para cenas densas com milhões de polígonos ou partículas, com fallback transparente para WebGL2.
* **Gaussian Splatting (3DGS):** Para maquetes fotorealistas de ambientes físicos, utilizar o formato `.spz` ou extensões `KHR_gaussian_splatting` em contêineres `.glb`.
* **Controle de Câmera Suave:** Utilizar `OrbitControls` com damping ativo (`enableDamping = true; dampingFactor = 0.05`) para navegação espacial fluida e intuitiva.

---

## 2. Iluminação & Materiais PBR (Physically Based Rendering)
* **Materiais Realistas:** Utilizar `MeshStandardMaterial` ou `MeshPhysicalMaterial` com:
  * `roughness`: 0.1 a 0.3 para metais/vidros; 0.6 a 0.8 para concreto/madeira.
  * `metalness`: 0.8 a 1.0 para metais estruturais; 0.0 para isolantes/alvenaria.
  * `clearcoat`: Para superfícies envernizadas ou pisos polidos.
* **Iluminação de Três Pontos + HDR:**
  * Luz Direcional Solar (com sombras suaves via `PCFSoftShadowMap`).
  * Luz Ambiente ou Hemisférica sutil para preenchimento.
  * Mapa de Ambiente (HDRI/Environment Map) para reflexos fidedignos.

---

## 3. Performance & Otimização de Assets 3D
* **DRACO Compression:** Todo modelo `.glb` deve ser comprimido via DRACO para reduzir o tamanho de transferência em até 70%.
* **Nível de Detalhe (LOD):** Alternar malhas de alta resolução para malhas simplificadas quando a câmera se afastar da maquete.
* **Descarte de Recursos (*Memory Disposal*):** Ao desmontar componentes 3D, executar obrigatoriamente `.dispose()` em geometrias, materiais e texturas para evitar vazamentos de memória na GPU.
