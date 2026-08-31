# Skill: Ambiente Windows do Operador (máquina `conta`)

Lições validadas sobre este ambiente. Aplicar sempre, sem redescobrir.

## Comandos Node.js em subprocess (Python)
- `npm`, `pnpm`, `yarn` no Windows são scripts `.cmd`/`.ps1`, NÃO binários `.exe`.
- Em `subprocess.run()` do Python, sempre usar `shell=True` para esses comandos, senão dá `FileNotFoundError`.
- Em caminhos dentro de strings (JS/TS/Python), usar barras normais `/` em vez de contra-barras `\` cruas (escapes inválidos).

## Terminal e shell
- Shell padrão: PowerShell 7+. Sintaxe bash (`&&` funciona no PS7, mas `export`, `head`, `tail`, `which` NÃO existem).
- Para multiline strings em PowerShell, usar here-strings `@'...'@` com o fechamento na coluna 0.

## Estrutura de discos
- `C:\` = área de trabalho ativa (IDE, agente, cérebro em `~\.gemini\antigravity-ide\`).
- `E:\` = backup redundante e projetos (`E:\ANTIGRAVITY - SUPER\` para espelhos do cérebro e biblioteca de conhecimento).

## Regras globais
- A fonte canônica das regras é `C:\Users\conta\.gemini\GEMINI.md` (Constituição V2, injetada automaticamente).
- NÃO criar cópias extras da constituição em outros arquivos; cópias duplicadas desatualizam e geram contradição.
