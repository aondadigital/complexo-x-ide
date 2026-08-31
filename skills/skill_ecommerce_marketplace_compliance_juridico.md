# Skill: Compliance Jurídico, Leis e Regulamentação de E-commerce & Marketplaces (Brasil)

Esta habilidade estabelece as diretrizes jurídicas e técnicas obrigatórias para o desenvolvimento e operação de lojas virtuais e plataformas de marketplace no Brasil, em total conformidade com a legislação federal vigente.

---

## 1. Decreto Federal nº 7.962/2013 (A Lei do E-commerce)
Todo site de comércio eletrônico deve exibir de forma clara e visível:
1. **Identificação do Fornecedor:** Nome empresarial (Razão Social) ou nome completo, e número de inscrição no Cadastro Nacional de Pessoas Jurídicas (CNPJ) ou Cadastro de Pessoas Físicas (CPF).
2. **Localização Física:** Endereço físico completo da sede da empresa.
3. **Canais de Atendimento Fácil:** E-mail de suporte, telefone ou canal eletrônico de atendimento (SAC) com confirmação imediata de recebimento.
4. **Resumo do Pedido Obrigatório:** Discriminação do valor do produto, valor do frete, despesas adicionais, descontos e prazo de entrega antes do clique final de pagamento.

---

## 2. Código de Defesa do Consumidor (Artigo 49 - Direito de Arrependimento)
* O consumidor pode desistir do contrato no prazo de **7 (sete) dias corridos** a contar de sua assinatura ou do ato de recebimento do produto ou serviço.
* Se o consumidor exercitar o direito de arrependimento, os valores eventualmente pagos, a qualquer título (inclusive frete), durante o prazo de reflexão, serão devolvidos, de imediato, monetariamente atualizados.
* A loja deve fornecer mecanismo eletrônico facilitado para o exercício desse direito.

---

## 3. Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)
* **Princípio da Finalidade e Transparência:** Informar expressamente quais dados pessoais são coletados e para qual finalidade (processar pedidos, emissão de nota fiscal, marketing com consentimento).
* **Gestão de Cookies:** Disponibilizar banner de consentimento com opção de rejeitar cookies não essenciais.
* **Segurança da Informação:** Blindagem de dados sensíveis de pagamento (nunca salvar dados brutos de cartão de crédito no banco de dados da loja; utilizar tokenização via PCI-DSS).

---

## 4. Marketplaces Multi-Seller & Split de Pagamento
* **Responsabilidade Solidária:** Nos termos do CDC, a plataforma de marketplace responde solidariamente perante o consumidor por defeitos ou descumprimento de entrega de sellers parceiros.
* **Split de Pagamento Regulamentado:** A liquidação financeira e divisão de valores entre a plataforma (comissão/take rate) e o vendedor (seller) deve ocorrer via instituição de pagamento autorizada pelo Banco Central do Brasil.
