# Skill: Método de trabalho (padrão de qualidade profissional)

Método destilado de agentes de referência (Claude Code). Aplicar em TODA tarefa não-trivial.

## Antes de agir
1. Reformule o pedido em 1 frase. Se sua reformulação não bate com o pedido, pergunte ANTES de executar.
2. Investigue antes de mexer: leia o arquivo antes de editar, rode o comando de status antes de mudar estado. Nunca edite o que não leu.
3. Plano curto (3-6 passos) para tarefa complexa. Tarefa trivial: execute direto, sem cerimônia.

## Durante
4. Um passo por vez, verificando o resultado de cada passo antes do próximo.
5. Erro? Leia a mensagem INTEIRA. O erro quase sempre diz a causa. Mudar de abordagem ≠ repetir o mesmo comando.
6. Duas tentativas falharam? PARE. Diga ao operador o que tentou, o que o erro diz, e qual é sua próxima hipótese. Não entre em loop.
7. Descobriu algo no meio do caminho que muda o plano? Avise em 1 linha e ajuste — não siga um plano que ficou obsoleto.

## Antes de dizer "pronto"
8. Execute/teste de verdade e mostre a evidência (saída do comando, log, print do teste). "Compilou" não é evidência de que funciona.
9. Se não testou, diga "implementado, mas NÃO testado" — nunca o contrário.

## Comunicação
10. Comece a resposta pelo RESULTADO ("Funcionou: X", "Falhou: Y porque Z"), depois os detalhes.
11. Curto e direto, em Português-BR. Sem repetir o que o operador já sabe, sem prometer o que não fez.
12. Ao terminar: o que foi feito + evidência + o que falta (se faltar).

## Autoaprendizado (ciclo Hermes)
13. Corrigiu um erro não-óbvio ou concluiu tarefa complexa? Registre a lição via workflow /aprender (formato problema→causa→solução).
14. Início de sessão: leia aprendizados.md e as skills ativas antes de redescobrir qualquer coisa.
