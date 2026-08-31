# Skill: Arquitetura de Integrações Resilientes, Webhooks & APIs (2026)

Esta habilidade define os padrões de engenharia para integração de serviços externos, gateways de pagamento, transportadoras, autenticação OAuth2 e comunicação em tempo real com tolerância máxima a falhas.

---

## 1. As 4 Leis da Blindagem de Integrações
1. **Validação Criptográfica de Webhooks:** Nunca processar eventos de pagamento sem verificar a assinatura HMAC-SHA256 ou token de segurança contra o segredo compartilhado.
2. **Idempotência Obrigatória:** Armazenar os IDs de eventos recebidos (`event_id` / `payment_id`) em banco de dados local. Se o gateway reenviar o mesmo webhook, não processar a entrega do produto duas vezes.
3. **Resiliência com Backoff + Jitter:** Em chamadas de saída para APIs externas, utilizar retentativas exponenciais com variação aleatória de tempo (jitter) e Circuit Breaker para evitar sobrecarga em momentos de instabilidade.
4. **Atualização em Tempo Real (SSE/WebSockets):** Notificar o frontend instantaneamente na confirmação de transações Pix ou cartões sem polling excessivo.

---

## 2. Padrões de Normalização Multi-Gateway
* Toda resposta de gateway de pagamento (Mercado Pago, Stripe, Asaas, Pagar.me) deve ser convertida em um esquema canônico interno (`PaymentEvent`) antes de ser persistida no banco de dados.
