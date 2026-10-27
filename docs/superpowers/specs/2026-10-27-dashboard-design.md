# Dashboard de vendas — proposta

## Objetivo
Projeto de portfólio de desenvolvimento web com dados fictícios e código preparado para GitHub. Demonstrar componentes, TypeScript, cálculos, filtros e interface responsiva.

## Abordagens
React + TypeScript + Vite terá dados locais e publicação estática simples. É a escolha do assistente, a quem o usuário delegou a decisão técnica. Next.js com banco permitiria login e persistência, mas acrescentaria infraestrutura dispensável para esta demonstração.

## Escopo
Interface em português, valores em reais e nome provisório VendaVisão. Indicadores de faturamento, lucro bruto, pedidos e ticket médio. Gráficos de evolução mensal e vendas por categoria, além de ranking de produtos. Filtros por período e região devem atualizar todos os indicadores, gráficos e tabela. Tabela com busca, ordenação, paginação e exportação CSV dos registros filtrados. Layout responsivo, navegação por teclado, estados vazios e indicação de dados demonstrativos. README com execução, funcionalidades e publicação.

## Dados e cálculos
Aproximadamente 600 pedidos determinísticos de janeiro a dezembro de 2025, nas cinco regiões brasileiras. Um produto por pedido, com identificador, data, cliente fictício, região, categoria, produto, quantidade, preço e custo unitários. Faturamento = quantidade × preço. Lucro bruto = faturamento − custo. Ticket médio = faturamento / pedidos. Conjuntos vazios retornam zero; datas civis não devem mudar por fuso horário.

## Limites e escolhas delegadas
Sem login, banco, pagamentos ou integrações externas. Bibliotecas, paleta, tipografia e estrutura ficam a cargo do assistente, com foco em legibilidade e apresentação profissional. Nome e direção visual são propostas do assistente. Verificar cálculos e filtros, executar compilação e inspecionar responsividade conforme ferramentas disponíveis.

## GitHub e entrega
Preparar projeto local executável e Git. Verificar acesso ao GitHub antes de publicar. Conta, nome definitivo, visibilidade do repositório e destino da demonstração precisam ser definidos antes da publicação externa. Sem acesso, entregar projeto local completo e explicar o impedimento. Não afirmar publicação sem confirmação.

## Conclusão
Filtros consistentes, cálculos corretos, busca e CSV funcionais, layout adaptável, compilação aprovada e README suficiente para executar. Publicação online depende de destino disponível e autorizado.
