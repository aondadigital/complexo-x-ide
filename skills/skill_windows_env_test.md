# Skill: Teste de Conformidade de Ambiente Windows (PATH)

Esta skill descreve como auditar e validar de forma rápida a acessibilidade e operacionalidade das ferramentas de desenvolvimento fundamentais (`git`, `node`, `npm`, `pnpm`, `yarn`, `tsc`, `ts-node`, `ruff`) em sistemas operacionais Windows.

---

## Script Utilitário Python

Salve o código a seguir como `test_env.py` e execute-o com `pytest` ou `python test_env.py`:

```python
import subprocess
import os

def test_environment_readiness():
    """Valida se as ferramentas fundamentais estão no PATH do Windows."""
    # Comandos nativos e executáveis diretos
    direct_commands = [
        ["git", "--version"],
        ["node", "--version"]
    ]
    
    # Comandos que rodam através de scripts de lote do Node (.cmd / .ps1)
    shell_commands = [
        ["npm", "--version"],
        ["pnpm", "--version"],
        ["yarn", "--version"],
        ["tsc", "-v"],
        ["ts-node", "-v"],
        ["ruff", "--version"]
    ]
    
    for cmd in direct_commands:
        res = subprocess.run(cmd, stdout=subprocess.PIPE)
        assert res.returncode == 0, f"Falha ao executar: {cmd}"
        
    for cmd in shell_commands:
        res = subprocess.run(cmd, stdout=subprocess.PIPE, shell=True)
        assert res.returncode == 0, f"Falha ao executar (shell): {cmd}"

if __name__ == "__main__":
    try:
        test_environment_readiness()
        print("[SUCESSO] Todas as ferramentas estão operacionais no PATH do Windows.")
    except AssertionError as e:
        print(f"[ERRO] {e}")
```

## Como Usar
1. Use esta rotina de validação sempre que inicializar um novo workspace ou projeto no Windows para garantir que o ambiente está pronto.
2. Se ocorrer erro de escape ou de caminho não encontrado, utilize barras normais `/` nos caminhos de diretórios declarados nas chamadas de sub-processo.
