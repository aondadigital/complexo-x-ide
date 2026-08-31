# Skill: Diagnóstico de Integridade do Complexo-X

Esta skill fornece uma rotina de diagnóstico estático adaptada da arquitetura do **Agente X (Zero Ghost)** para avaliar a saúde, conformidade e prontidão do ambiente de desenvolvimento do Complexo-X.

---

## Script Utilitário: `antigravity_diagnostico.py`

Salve o script a seguir no diretório do projeto e execute-o com `python antigravity_diagnostico.py`:

```python
import os
import sys
import subprocess
import datetime

ROOT = os.path.dirname(os.path.abspath(__file__))

def check_path_tools():
    """Checa a disponibilidade das ferramentas básicas de compiladores no PATH."""
    tools = {
        "git": ["git", "--version"],
        "node": ["node", "--version"],
        "npm": ["npm", "--version"],
        "pnpm": ["pnpm", "--version"],
        "yarn": ["yarn", "--version"],
        "tsc": ["tsc", "-v"],
        "ts-node": ["ts-node", "-v"],
        "ruff": ["ruff", "--version"]
    }
    
    results = {}
    print("\n[1/3] VERIFICANDO PATH DO WINDOWS:")
    for name, cmd in tools.items():
        try:
            # Roda via shell=True devido a scripts de lote no Windows
            res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True, timeout=3)
            if res.returncode == 0:
                ver = res.stdout.decode("utf-8").strip().split("\n")[0]
                print(f"  🟢 {name}: OK ({ver})")
                results[name] = True
            else:
                print(f"  🔴 {name}: Falha no retorno ({res.returncode})")
                results[name] = False
        except Exception as e:
            print(f"  🔴 {name}: Ausente no PATH ou travado ({e})")
            results[name] = False
    return results

def check_constitution():
    """Valida a integridade física dos arquivos da constituição operacional."""
    brain_path = r"C:\Users\conta\.gemini\antigravity-ide\brain\ff8f29bf-e266-447c-a756-580c258acd52"
    expected = [
        "constituicao_operacional.md",
        "ANTIGRAVITY_SYSTEM_CONSTITUTION.md",
        "GLOBAL_RULES.md",
        "SYSTEM_RULES.md"
    ]
    
    results = {}
    print("\n[2/3] VERIFICANDO ARQUIVOS DA CONSTITUIÇÃO:")
    for file in expected:
        full_path = os.path.join(brain_path, file)
        if os.path.exists(full_path):
            size = os.path.getsize(full_path)
            print(f"  🟢 {file}: PRESENTE ({size} bytes)")
            results[file] = True
        else:
            print(f"  🔴 {file}: AUSENTE!")
            results[file] = False
    return results

def check_backups():
    """Checa se os backups em E: e D: estão ativos e sincronizados."""
    paths = {
        "E: (Obsidian)": r"E:\ANTIGRAVITY - SUPER\OBSIDIAN - ANTIGRAVITY\01_RULES\constituicao_operacional.md",
        "E: (Biblioteca)": r"E:\ANTIGRAVITY - SUPER\BIBLIOTECA DE CONHECIMENTO\skill_windows_env_test.md"
    }
    
    print("\n[3/3] VERIFICANDO INTEGRIDADE DOS BACKUPS:")
    for desc, path in paths.items():
        if os.path.exists(path):
            mtime = datetime.datetime.fromtimestamp(os.path.getmtime(path)).strftime('%Y-%m-%d %H:%M:%S')
            print(f"  🟢 {desc}: ATIVO (Última sync: {mtime})")
        else:
            print(f"  🔴 {desc}: AUSENTE OU PENDENTE!")

def run_diagnose():
    print("=" * 60)
    print("  COMPLEXO-X | Diagnóstico de Integridade")
    print(f"  Data: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    path_ok = all(check_path_tools().values())
    const_ok = all(check_constitution().values())
    check_backups()
    
    print("\n" + "=" * 60)
    score = 100
    if not path_ok: score -= 30
    if not const_ok: score -= 40
    
    print(f"  SAÚDE GERAL: {score}/100 -- {'CONFORME' if score == 100 else 'ATENÇÃO'}")
    print("=" * 60)

if __name__ == "__main__":
    run_diagnose()
```
