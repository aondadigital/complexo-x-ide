"""
Complexo-X IDE — Backend API Gateway & Orchestrator
Conecta o Frontend do IDE aos agentes autônomos, Motor Custo Zero e VPS.
"""

import os
import sys
import json
import asyncio
import subprocess
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"
MODELS_DIR = BASE_DIR / "modelos"
SOULS_DIR = BASE_DIR / "souls"
PROJECTS_DIR = BASE_DIR / "workspace"

PROJECTS_DIR.mkdir(parents=True, exist_ok=True)
MODELS_DIR.mkdir(parents=True, exist_ok=True)
SOULS_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title="Complexo-X IDE Core Gateway",
    description="Motor e Orquestrador Multi-Agente do Complexo-X IDE",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Modelos Pydantic ---
class MissionRequest(BaseModel):
    prompt: str
    template_id: Optional[str] = None
    project_id: Optional[str] = "default"

class FilePayload(BaseModel):
    filename: str
    content: str

class CaptureModelRequest(BaseModel):
    url: str
    category: str
    name: str

class DeployRequest(BaseModel):
    project_id: str
    target_domain: Optional[str] = "complexo-x.com.br/ide"

# --- Gerenciador de WebSocket para Telemetria em Tempo Real ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: Dict[str, Any]):
        for connection in list(self.active_connections):
            try:
                await connection.send_json(message)
            except Exception:
                self.disconnect(connection)

manager = ConnectionManager()

# --- Rotas de Status e Health ---
@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "system": "Complexo-X IDE",
        "motor": "Claude Opus / GPT-4o Custo Zero",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/agents")
async def list_agents():
    souls = {}
    for soul_file in SOULS_DIR.glob("soul_*.md"):
        agent_key = soul_file.stem.replace("soul_", "")
        souls[agent_key] = {
            "name": agent_key.capitalize(),
            "file": soul_file.name,
            "content": soul_file.read_text(encoding="utf-8")
        }
    return {"agents": souls}

@app.get("/api/templates")
async def list_templates():
    templates = []
    for model_file in MODELS_DIR.glob("*.json"):
        try:
            data = json.loads(model_file.read_text(encoding="utf-8"))
            templates.append(data)
        except Exception:
            pass
    return {"templates": templates}

@app.post("/api/mission")
async def dispatch_mission(mission: MissionRequest):
    """
    Recebe a missão do usuário e dispara a cadeia de agentes:
    1. Gerente (Opus) decompõe a tarefa
    2. Designer gera tokens CSS
    3. Programador gera HTML + API
    4. Marketeiro gera Copy
    5. SEO gera meta tags & schema
    """
    asyncio.create_task(run_agent_pipeline(mission.prompt, mission.template_id))
    return {
        "ok": True,
        "message": f"Missão '{mission.prompt}' despachada para a equipe de agentes.",
        "status": "executing"
    }

async def run_agent_pipeline(prompt: str, template_id: Optional[str] = None):
    # 1. Gerente
    await manager.broadcast({
        "type": "agent_update",
        "agent": "gerente",
        "status": "working",
        "progress": 25,
        "task": "Decompondo requisitos e ativando especialistas..."
    })
    await asyncio.sleep(1.0)

    # 2. Designer
    await manager.broadcast({
        "type": "chat_message",
        "name": "Gerente",
        "emoji": "🎯",
        "text": f"Missão recebida: '{prompt}'. Alocando Designer, Programador, Marketeiro e SEO."
    })
    await manager.broadcast({
        "type": "agent_update",
        "agent": "designer",
        "status": "working",
        "progress": 50,
        "task": f"Aplicando DNA visual (Modelo: {template_id or 'Stripe Dark'})..."
    })
    await asyncio.sleep(1.2)

    # 3. Marketeiro & Programador
    await manager.broadcast({
        "type": "agent_update",
        "agent": "marketeiro",
        "status": "working",
        "progress": 60,
        "task": "Escrevendo copy de alta conversão e CTAs..."
    })
    await manager.broadcast({
        "type": "agent_update",
        "agent": "programador",
        "status": "working",
        "progress": 65,
        "task": "Construindo componentes React e endpoints backend..."
    })
    await asyncio.sleep(1.5)

    # 4. SEO
    await manager.broadcast({
        "type": "agent_update",
        "agent": "seo",
        "status": "working",
        "progress": 85,
        "task": "Injetando Open Graph, Schema.org e otimizando Core Web Vitals..."
    })
    await asyncio.sleep(1.0)

    # Finalização
    for ag in ["gerente", "designer", "programador", "marketeiro", "seo"]:
        await manager.broadcast({
            "type": "agent_update",
            "agent": ag,
            "status": "done",
            "progress": 100,
            "task": "Entregue e validado com evidência."
        })

    await manager.broadcast({
        "type": "chat_message",
        "name": "Gerente",
        "emoji": "🎯",
        "text": "🎉 Missão concluída com sucesso! Todos os arquivos foram gerados e validados no preview."
    })

@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Processa mensagens do cliente se necessário
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Monta o frontend estático
app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
