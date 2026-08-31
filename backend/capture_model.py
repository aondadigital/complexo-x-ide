"""
Complexo-X IDE — Pipeline de Captura e Extração de Modelos Visuais
Extrai o DNA visual (paleta HSL/Hex, tipografia, layout, border-radius, animações) de qualquer URL.
"""

import sys
import json
import urllib.request
from pathlib import Path
from typing import Dict, Any

MODELS_DIR = Path(__file__).resolve().parent.parent / "modelos"
MODELS_DIR.mkdir(parents=True, exist_ok=True)

# Templates canônicos de largada para a biblioteca de modelos
DEFAULT_TEMPLATES = [
    {
        "id": "stripe_dark",
        "nome": "Stripe Dark SaaS",
        "categoria": "saas",
        "descricao": "Visual escuro ultra-tecnológico com mesh gradientes vibrantes em roxo e ciano, glassmorphism e tipografia Inter.",
        "cores": {
            "fundo": "#07080d",
            "superficie": "#0f1117",
            "primaria": "#7c3aed",
            "secundaria": "#06b6d4",
            "texto": "#e8eaf0",
            "texto_secundario": "#8b8fa3"
        },
        "tipografia": {
            "familia": "Inter, sans-serif",
            "h1": "52px",
            "h2": "36px",
            "corpo": "15px"
        },
        "layout": {
            "border_radius": "14px",
            "sombra": "0 0 30px rgba(124, 58, 237, 0.2)",
            "animacao": "fadeInUp 0.4s ease"
        }
    },
    {
        "id": "linear_clean",
        "nome": "Linear Clean Dashboard",
        "categoria": "dashboard",
        "descricao": "Interface minimalista de alta precisão, cinzas cirúrgicos, borders sutis e performance máxima.",
        "cores": {
            "fundo": "#0c0d0e",
            "superficie": "#151618",
            "primaria": "#5e6ad2",
            "secundaria": "#38bdf8",
            "texto": "#f7f8f8",
            "texto_secundario": "#8a8f98"
        },
        "tipografia": {
            "familia": "Inter, -apple-system, sans-serif",
            "h1": "44px",
            "h2": "28px",
            "corpo": "14px"
        },
        "layout": {
            "border_radius": "8px",
            "sombra": "0 1px 3px rgba(0,0,0,0.4)",
            "animacao": "fade 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
        }
    },
    {
        "id": "vercel_minimal",
        "nome": "Vercel Minimalist",
        "categoria": "landing",
        "descricao": "Monocromático de alto contraste, tipografia Geek/JetBrains Mono com Inter, elegância pura.",
        "cores": {
            "fundo": "#000000",
            "superficie": "#111111",
            "primaria": "#ffffff",
            "secundaria": "#0070f3",
            "texto": "#ededed",
            "texto_secundario": "#888888"
        },
        "tipografia": {
            "familia": "Geist, Inter, sans-serif",
            "h1": "64px",
            "h2": "32px",
            "corpo": "16px"
        },
        "layout": {
            "border_radius": "6px",
            "sombra": "0 0 0 1px #333",
            "animacao": "slideUp 0.3s ease"
        }
    }
]

def seed_templates():
    print("[+] Semeando biblioteca de modelos canônicos...")
    for tmpl in DEFAULT_TEMPLATES:
        file_path = MODELS_DIR / f"{tmpl['id']}.json"
        file_path.write_text(json.dumps(tmpl, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"  -> Modelo salvo: {file_path.name}")

if __name__ == "__main__":
    seed_templates()
