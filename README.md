# VendaVisão

[Repositório no GitHub](https://github.com/GuizinnN18/vendavisao)

Dashboard de vendas para portfólio de desenvolvimento frontend. Construído com React, TypeScript e Vite; todos os dados são fictícios.

## Executar

Requer Node.js 22.12+ (ou Node.js 24 LTS) e npm.

```sh
npm ci
npm run dev
```

Abra o endereço informado pelo Vite. Para produção:

```sh
npm test
npm run build
npm run preview
```

## Funcionalidades

- Faturamento, lucro bruto, pedidos e ticket médio calculados a partir de dados locais.
- Gráficos mensais e distribuição por categoria com Recharts.
- Filtros por semestre, trimestre, datas personalizadas e região.
- Ranking de produtos por faturamento.
- Busca sem distinção de acentos, ordenação e paginação da tabela.
- Exportação CSV com os pedidos que atendem aos filtros e à busca, incluindo todas as páginas.
- Interface em português, valores em reais, layout responsivo, foco visível, atalho para conteúdo e mensagens de estado vazio.

## Como os dados funcionam

São 600 pedidos de 2025, gerados com uma semente fixa para que a demonstração seja reproduzível. Há um produto por pedido, vendido em uma ou mais unidades. Os produtos, clientes e vendas são inventados.

- Faturamento: soma de quantidade × preço unitário.
- Lucro bruto: soma de quantidade × (preço unitário − custo unitário).
- Ticket médio: faturamento ÷ número de pedidos.
- Margem bruta: lucro bruto ÷ faturamento.

Valores são arredondados a centavos. Frete, impostos, devoluções e despesas operacionais não estão modelados; o lucro apresentado não é lucro líquido. A base contém apenas 2025. Datas são comparadas como datas civis ISO, sem conversão de fuso.

Filtros de período e região afetam todo o dashboard. A busca afeta apenas a tabela e o CSV. O CSV usa ponto e vírgula, decimais com vírgula e BOM UTF-8 para facilitar a abertura em planilhas; campos iniciados como fórmulas recebem apóstrofo.

## Organização

```text
src/
  App.tsx             composição, componentes e estado dos filtros
  analytics.ts        filtros, agregações e exportação CSV
  analytics.test.ts   testes de comportamento com valores conferidos à mão
  data.ts             tipos e geração determinística
  main.tsx            ponto de entrada React
  styles.css          identidade visual e responsividade
public/
  favicon.svg
```

A aplicação é estática e não requer backend, autenticação ou variáveis de ambiente. Nenhuma credencial deve ser adicionada ao repositório. Google Fonts fornece as fontes DM Sans e Manrope; há fontes de sistema de reserva caso estejam indisponíveis.

## Publicação

O comando `npm run build` gera `dist/`. A configuração `base: './'` permite servir os assets em um subdiretório.

- Vercel ou Netlify: comando de build `npm run build`, diretório de saída `dist`.
- GitHub Pages: após criar o repositório e enviar o código, selecione GitHub Actions em Settings → Pages e execute o workflow de publicação incluído. Ele é manual para evitar publicar o site sem uma escolha explícita.

O workflow de CI executa testes e build em pushes e pull requests. URLs do repositório e da demonstração devem ser adicionadas após a publicação efetiva.

## Decisões técnicas

TypeScript com modo estrito, funções puras para regras de negócio e um único estado de filtros para manter os painéis consistentes. Não há métricas de crescimento inventadas: os rodapés dos indicadores mostram contagens e margens reais da base demonstrativa. Componentes usam SVG e CSS, sem imagens externas essenciais.

## Licença

MIT. Veja LICENSE.
