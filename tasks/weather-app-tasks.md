# Backlog de Tarefas — Weather App

Backlog derivado do [plano técnico](../plans/weather-app-plan.md) e
rastreável aos critérios da [especificação](../specs/weather-app-spec.md).
As dependências listadas são diretas; IDs anteriores indicam a ordem sugerida,
mas não criam dependência implícita.

> **Gate de escopo:** os critérios dependentes de decisões ainda pendentes na
> spec não estão aprovados para lançamento. Conclua T-01 a T-03 antes de fechar
> a implementação e a validação de produção dos itens afetados. Não invente
> valores para parâmetros ainda sem aprovação.

## Matriz de rastreabilidade funcional

| Requisito da spec | Tarefas de implementação | Tarefas de teste/validação | Lacunas identificadas |
| --- | --- | --- | --- |
| **RF-01 — Pesquisar cidades** | T-01, T-07, T-09, T-13, T-14, T-19 | T-23, T-24, T-25, T-29 | Nenhuma lacuna funcional identificada. |
| **RF-02 — Selecionar a cidade** | T-04, T-08, T-09, T-14, T-15, T-16, T-18, T-19 | T-24, T-25, T-26, T-29, T-30 | Nenhuma lacuna funcional identificada. |
| **RF-03 — Consultar o clima atual** | T-04, T-06, T-08, T-09, T-15, T-18, T-19 | T-22, T-23, T-26, T-27, T-29 | Nenhuma lacuna funcional identificada. |
| **RF-04 — Consultar a previsão de cinco dias** | T-01, T-04, T-06, T-08, T-09, T-16, T-18, T-19 | T-22, T-23, T-26, T-29 | Nenhuma lacuna funcional identificada; granularidade e fuso continuam gates em T-01. |
| **RF-05 — Alternar unidade de temperatura** | T-01, T-04, T-05, T-09, T-15, T-16, T-17, T-18, T-19 | T-21, T-26, T-27, T-29 | Nenhuma lacuna funcional identificada; persistência e arredondamento são decisões de T-01. |
| **RF-06 — Informar estados da consulta** | T-02, T-09, T-10, T-11, T-12, T-13, T-18, T-19 | T-23, T-24, T-25, T-27, T-28, T-29, T-30 | Nenhuma lacuna funcional identificada; timeout e critérios operacionais permanecem gate em T-02. |
| **RF-07 — Apresentar a interface em português do Brasil** | T-06, T-10–T-20 | T-22, T-25–T-29 | **Cobertura parcial:** falta tarefa explícita para definir e validar formatos regionais consistentes de datas e números, exigidos pela spec antes do aceite final. |

## Prioridade, tamanho e sequência de entrega

Prioridade indica valor/necessidade na entrega: **P0** é o caminho crítico para
um primeiro produto utilizável; **P1** completa a baseline e sua validação;
**P2** pode ficar para antes do lançamento público, mas não deve ser confundida
com trabalho descartável. Tamanho relativo: **P** é focado e de baixo esforço;
**M** exige integração ou vários cenários; **G** tem decisões, coordenação ou
risco que podem exigir divisão durante a execução.

| Tarefa | Prioridade | Tamanho |
| --- | --- | --- |
| T-01 — Aprovar comportamento e contrato dos dados | P0 | G |
| T-02 — Aprovar metas de operação e suporte | P0 | M |
| T-03 — Validar condições da Open-Meteo e privacidade | P2 | M |
| T-04 — Definir os tipos normalizados do clima | P0 | P |
| T-05 — Implementar conversão e formatação de temperaturas | P0 | P |
| T-06 — Implementar rótulos WMO e formatação de datas | P1 | M |
| T-07 — Implementar serviço de geocodificação | P0 | M |
| T-08 — Implementar serviço de previsão meteorológica | P0 | G |
| T-09 — Orquestrar busca e clima no hook | P0 | G |
| T-10 — Criar estado acessível de carregamento | P0 | P |
| T-11 — Criar estado acessível vazio | P0 | P |
| T-12 — Criar estado acessível de erro | P0 | P |
| T-13 — Criar formulário de busca de cidades | P0 | P |
| T-14 — Criar lista de resultados de busca | P0 | M |
| T-15 — Criar apresentação do clima atual | P0 | M |
| T-16 — Criar lista acessível de previsão | P1 | M |
| T-17 — Criar controle de unidade | P0 | P |
| T-18 — Compor painel meteorológico | P0 | M |
| T-19 — Integrar componentes na aplicação | P0 | G |
| T-20 — Aplicar tema e estilos responsivos | P0 | M |
| T-21 — Testar funções puras | P0 | P |
| T-22 — Testar mapeamento de condições e datas | P1 | P |
| T-23 — Testar serviços de dados | P0 | M |
| T-24 — Testar orquestração do hook | P0 | M |
| T-25 — Testar componentes de busca | P0 | M |
| T-26 — Testar componentes de clima e previsão | P1 | M |
| T-27 — Testar controle e painel meteorológico | P0 | M |
| T-28 — Testar componentes nos estados de requisição | P0 | P |
| T-29 — Validar fluxo principal E2E e viewport mobile | P1 | G |
| T-30 — Endurecer falhas e concorrência antes do release | P1 | G |

### Sequência sugerida em fatias verticais

1. **Busca visível:** T-01, T-04, T-07, T-10–T-14 e uma composição inicial
   em T-19; separar de T-09 apenas a orquestração de busca. Entrega uma busca
   funcional com resultados, seleção e estados acessíveis, sem esperar por
   previsão ou acabamento visual completo.
2. **Clima atual utilizável:** T-02, T-05, T-08, T-12, T-15, T-17, T-18 e
   T-20; validar com T-21, T-23–T-25, T-27 e T-28. A tela passa a mostrar
   condição/temperatura da cidade escolhida e alternância de unidade.
3. **Previsão completa:** T-06 e T-16 junto dos ajustes necessários em T-08,
   T-18 e T-19; validar com T-22 e T-26. Entrega as datas e períodos da
   previsão conforme as decisões aprovadas em T-01.
4. **Pronto para release:** T-03, T-29 e T-30, fechando revisão operacional,
   condições de uso/privacidade, E2E mobile, concorrência e falhas.

**Ajuste recomendado para viabilizar as fatias sem bloquear a primeira tela:**
hoje T-09 combina busca e consulta do clima; T-08 junta clima atual e previsão;
T-18 depende da lista de previsão T-16; e T-19 depende de todos os componentes
meteorológicos. Divida hook (busca vs. clima), services (clima atual vs.
previsão), painel (clima atual vs. previsão) e integração (busca inicial vs.
tela completa), atualizando as dependências correspondentes. Também remova
dependências de estilos/integracão final dos testes unitários e de service que
não precisam da UI. As prioridades e tamanhos acima são estimativas relativas;
refiná-los após resolver os gates T-01 e T-02.

## Entrega 0 — Resolver gates e preparar decisões de lançamento

### T-01 — Aprovar comportamento e contrato dos dados

- **Descrição:** Resolver as decisões de produto que alteram busca, dados
  meteorológicos, datas e apresentação de temperaturas.
- **Critérios de aceite:**
  - A spec registra decisões para cobertura/normalização/limite da busca,
    variáveis obrigatórias, granularidade e parcialidade da previsão, fuso das
    datas, precisão/arredondamento, persistência da unidade e atualidade dos
    dados.
  - As decisões aprovadas são refletidas nos contratos e critérios de aceite
    afetados do plano, sem tratar propostas atuais como requisitos aprovados.
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `specs/weather-app-spec.md`,
  `plans/weather-app-plan.md`.
- **Tipo:** Infra.
- **Rastreabilidade:** CA-01.1–CA-01.6, CA-03.1–CA-03.4, CA-04.1–CA-04.5,
  CA-05.1–CA-05.4.

### T-02 — Aprovar metas de operação e suporte

- **Descrição:** Definir timeout e tratamento de limite da fonte, metas de
  qualidade, ambiente de medição e matriz de suporte.
- **Critérios de aceite:**
  - A spec registra limite de timeout e comportamento/mensagem para limite de
    uso da API.
  - Responsividade, acessibilidade, desempenho, disponibilidade, navegadores,
    dispositivos, orientações e tecnologias assistivas têm alvos e condições
    de validação aprovados ou explicitamente adiados.
  - CA-06.5 tem um limite aprovado antes de ser convertido em teste
    quantitativo.
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `specs/weather-app-spec.md`,
  `plans/weather-app-plan.md`.
- **Tipo:** Infra.
- **Rastreabilidade:** CA-06.1–CA-06.5, RNF-01–RNF-05.

### T-03 — Validar condições da Open-Meteo e privacidade

- **Descrição:** Confirmar se a chamada direta do cliente à Open-Meteo atende
  às condições operacionais, legais e de privacidade previstas para o app.
- **Critérios de aceite:**
  - Limites, cobertura, licença, atribuição, disponibilidade e adequação ao
    tráfego esperado estão verificados e registrados.
  - A revisão de privacidade confirma o envio das consultas à fonte e a
    ausência de conta, geolocalização e persistência de dados associados à
    pessoa em servidor.
  - Riscos ou restrições encontrados são registrados antes da decisão de
    lançamento; nenhum segredo é adicionado ao cliente.
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `plans/weather-app-plan.md`,
  `specs/weather-app-spec.md`.
- **Tipo:** Infra.
- **Rastreabilidade:** RNF-04, RNF-06.

## Entrega 1 — Tipos compartilhados

### T-04 — Definir os tipos normalizados do clima

- **Descrição:** Criar os contratos compartilhados de cidade, unidade, clima
  atual, previsão e dados meteorológicos, preservando campos ausentes.
- **Critérios de aceite:**
  - Os tipos seguem as decisões aprovadas em T-01 e representam campos
    opcionais sem convertê-los em valores padrão.
  - Os dados meteorológicos normalizados permanecem em Celsius e a previsão
    não declara cobertura ou granularidade além da aprovada.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/types/weather.ts`.
- **Tipo:** Data.
- **Rastreabilidade:** CA-02.1–CA-02.3, CA-03.1–CA-03.4, CA-04.1–CA-04.5,
  CA-05.1–CA-05.4.

## Entrega 2 — Funções puras

### T-05 — Implementar conversão e formatação de temperaturas

- **Descrição:** Criar funções puras para conversão entre Celsius e
  Fahrenheit e apresentação dos valores conforme as decisões aprovadas.
- **Critérios de aceite:**
  - Conversões nos dois sentidos seguem as fórmulas do plano e a regra
    aprovada de precisão/arredondamento.
  - Valores ausentes continuam indisponíveis; a formatação identifica a
    unidade selecionada.
  - As funções não alteram o dado normalizado nem iniciam requisições.
- **Dependências:** T-04.
- **Arquivos prováveis:** `src/lib/temperature.ts`.
- **Tipo:** Data.
- **Rastreabilidade:** CA-03.2, CA-05.1–CA-05.4.

### T-06 — Implementar rótulos WMO e formatação de datas

- **Descrição:** Criar funções puras para traduzir códigos meteorológicos WMO e
  formatar datas da previsão de acordo com o fuso e formato aprovados.
- **Critérios de aceite:**
  - Códigos conhecidos geram rótulos em pt-BR; código desconhecido ou ausente
    não é apresentado como uma descrição inventada.
  - Datas usam o contrato aprovado em T-01 e não são deslocadas para um fuso
    implícito do dispositivo.
  - As funções não dependem de rede ou estado React.
- **Dependências:** T-04.
- **Arquivos prováveis:** `src/lib/weatherCodes.ts`, `src/lib/date.ts`.
- **Tipo:** Data.
- **Rastreabilidade:** CA-03.1, CA-04.1, CA-04.2, CA-04.5, CA-07.1.

## Entrega 3 — Services de dados

### T-07 — Implementar serviço de geocodificação

- **Descrição:** Consultar a API de geocodificação e normalizar resultados para
  o contrato `City`.
- **Critérios de aceite:**
  - A consulta externa é aparada e usa os parâmetros e limites aprovados em
    T-01.
  - Resultados válidos preservam os campos geográficos disponíveis; lista
    vazia, falha HTTP/rede e payload inválido permanecem resultados distintos.
  - Erros são propagados de forma tipada, sem converter falhas em lista vazia.
- **Dependências:** T-01, T-04, T-05, T-06.
- **Arquivos prováveis:** `src/services/openMeteo.ts`.
- **Tipo:** Data.
- **Rastreabilidade:** CA-01.1, CA-01.2, CA-01.4–CA-01.6.

### T-08 — Implementar serviço de previsão meteorológica

- **Descrição:** Consultar a API Forecast para as coordenadas selecionadas,
  validar o payload e mapear dados atuais e de previsão.
- **Critérios de aceite:**
  - A requisição usa as variáveis, granularidade, horizonte, fuso e unidade
    aprovados, enviando temperaturas em Celsius.
  - A normalização associa os dados à cidade selecionada, aceita somente
    parcialidade prevista no contrato e não inventa valores ou datas.
  - Erros HTTP, rede, timeout e payload inválido são distinguíveis de resposta
    válida sem dados utilizáveis.
- **Dependências:** T-01, T-02, T-04, T-05, T-06.
- **Arquivos prováveis:** `src/services/openMeteo.ts`.
- **Tipo:** Data.
- **Rastreabilidade:** CA-02.2, CA-03.1–CA-03.4, CA-04.1–CA-04.5,
  CA-06.3–CA-06.5.

## Entrega 4 — Hook de estado e orquestração

### T-09 — Orquestrar busca e clima no hook

- **Descrição:** Implementar `useWeather` para coordenar busca, seleção,
  consulta de clima, unidade, retry e estados independentes.
- **Critérios de aceite:**
  - Busca e consulta meteorológica expõem estados discriminados de idle,
    loading, success, empty e error.
  - Selecionar outra cidade limpa dados anteriores e invalida/cancela a
    solicitação antiga; respostas fora de ordem não substituem a seleção atual.
  - Retry repete a busca ou a consulta da localidade correspondente, e toda
    solicitação termina em sucesso, vazio ou erro.
  - A unidade inicial e seu comportamento seguem as decisões aprovadas em T-01.
- **Dependências:** T-02, T-04, T-05, T-06, T-07, T-08.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`.
- **Tipo:** Data.
- **Rastreabilidade:** CA-01.3–CA-01.6, CA-02.1–CA-02.3, CA-05.1–CA-05.4,
  CA-06.1–CA-06.5.

## Entrega 5 — Componentes de interface

### T-10 — Criar estado acessível de carregamento

- **Descrição:** Implementar o componente compartilhado de carregamento.
- **Critérios de aceite:**
  - O carregamento é identificável por tecnologia assistiva e tem rótulo em
    pt-BR.
- **Dependências:** T-09.
- **Arquivos prováveis:** `src/components/states/LoadingState.tsx`.
- **Tipo:** UI.
- **Rastreabilidade:** CA-06.1, CA-07.1.

### T-11 — Criar estado acessível vazio

- **Descrição:** Implementar o componente compartilhado para ausência de
  resultados ou dados meteorológicos utilizáveis.
- **Critérios de aceite:**
  - O estado vazio é identificável por tecnologia assistiva e comunica a
    situação em pt-BR sem confundi-la com erro.
  - A interface permite iniciar nova busca quando o contexto for uma busca
    vazia.
- **Dependências:** T-09.
- **Arquivos prováveis:** `src/components/states/EmptyState.tsx`.
- **Tipo:** UI.
- **Rastreabilidade:** CA-01.4, CA-03.3, CA-04.4, CA-06.2, CA-07.1.

### T-12 — Criar estado acessível de erro

- **Descrição:** Implementar apresentação de falha e ação contextual de retry.
- **Critérios de aceite:**
  - O erro é identificável por tecnologia assistiva, comunicado em pt-BR e
    distinto de ausência de resultados.
  - A ação de retry, quando disponível, tem nome acessível e funciona por
    teclado.
- **Dependências:** T-09.
- **Arquivos prováveis:** `src/components/states/ErrorState.tsx`.
- **Tipo:** UI.
- **Rastreabilidade:** CA-01.6, CA-06.3, CA-06.4, CA-07.1.

### T-13 — Criar formulário de busca de cidades

- **Descrição:** Implementar entrada e envio explícito da consulta, validação
  local e feedback de carregamento/erro.
- **Critérios de aceite:**
  - Campo e botão têm nomes acessíveis em pt-BR e funcionam por teclado.
  - Enviar valor vazio ou só com espaços mostra validação local e não chama a
    busca.
  - Enviar consulta não vazia delega a busca ao hook e apresenta loading e
    retry conforme o estado.
- **Dependências:** T-09, T-10, T-12.
- **Arquivos prováveis:** `src/components/SearchForm.tsx`.
- **Tipo:** UI.
- **Rastreabilidade:** CA-01.3, CA-01.5, CA-01.6, CA-06.1, CA-07.1.

### T-14 — Criar lista de resultados de busca

- **Descrição:** Exibir localidades encontradas e comunicar a seleção
  explícita da cidade.
- **Critérios de aceite:**
  - Cada opção mostra nome e região administrativa/país quando disponíveis.
  - Cada resultado tem nome acessível, pode ser selecionado por teclado e
    identifica claramente a localidade selecionada.
  - Busca vazia e falha são exibidas de modo distinto de resultados disponíveis.
- **Dependências:** T-04, T-09, T-10, T-11, T-12.
- **Arquivos prováveis:** `src/components/SearchResults.tsx`.
- **Tipo:** UI.
- **Rastreabilidade:** CA-01.1, CA-01.2, CA-01.4, CA-02.1, CA-07.1.

### T-15 — Criar apresentação do clima atual

- **Descrição:** Exibir a cidade, temperatura e condição meteorológica atual,
  distinguindo campos disponíveis e ausentes.
- **Critérios de aceite:**
  - Conteúdo corresponde à cidade selecionada e mostra apenas dados recebidos.
  - Temperatura usa a unidade escolhida; condição usa rótulo WMO em pt-BR.
  - Umidade, vento, precipitação e pressão são mostrados com unidades
    identificadas quando recebidos.
  - Campos ausentes são identificados como indisponíveis, sem valores
    substitutos ou dados de seleção anterior.
- **Dependências:** T-04, T-05, T-06, T-09, T-12.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`.
- **Tipo:** UI.
- **Rastreabilidade:** CA-02.2, CA-03.1–CA-03.6, CA-05.1–CA-05.4, CA-07.1.

### T-16 — Criar lista acessível de previsão

- **Descrição:** Exibir os períodos de previsão com suas datas e valores
  disponíveis.
- **Critérios de aceite:**
  - Cada período está semanticamente associado à data recebida e formatada
    conforme T-06.
  - Ícone e condição usam o código WMO; temperaturas máximas/mínimas respeitam
    a unidade atual e exibem somente valores recebidos.
  - Probabilidade máxima diária de chuva é exibida em porcentagem quando
    recebida; campo ausente fica identificado, sem inferência.
  - Quantidade e granularidade dos períodos correspondem ao contrato aprovado
    em T-01 e os dados pertencem à cidade selecionada.
- **Dependências:** T-04, T-05, T-06, T-09, T-12.
- **Arquivos prováveis:** `src/components/ForecastList.tsx`,
  `src/components/ForecastCard.tsx`.
- **Tipo:** UI.
- **Rastreabilidade:** CA-02.2, CA-04.1–CA-04.6, CA-05.1–CA-05.4,
  CA-07.1.

### T-17 — Criar controle de unidade

- **Descrição:** Implementar alternância entre Celsius e Fahrenheit sem
  atualizar os dados meteorológicos.
- **Critérios de aceite:**
  - Celsius é selecionado inicialmente, conforme a decisão aprovada.
  - Controle acessível e operável por teclado alterna a unidade visível em
    todas as temperaturas disponíveis.
  - Alternar unidade não altera `WeatherData` nem inicia nova chamada de serviço.
- **Dependências:** T-04, T-05, T-09.
- **Arquivos prováveis:** `src/components/TemperatureUnitToggle.tsx`.
- **Tipo:** UI.
- **Rastreabilidade:** CA-05.1–CA-05.4.

### T-18 — Compor painel meteorológico

- **Descrição:** Reunir clima atual, previsão e controle de unidade em um
  painel que represente os estados de consulta.
- **Critérios de aceite:**
  - Painel apresenta dados da cidade selecionada e propaga a unidade para
    todas as temperaturas.
  - Loading, vazio, erro e sucesso parcial são apresentados sem reaproveitar
    dados anteriores.
  - Conteúdo e estados mantêm rótulos e mensagens em pt-BR.
- **Dependências:** T-09, T-10, T-11, T-12, T-15, T-16, T-17.
- **Arquivos prováveis:** `src/components/WeatherPanel.tsx`.
- **Tipo:** UI.
- **Rastreabilidade:** CA-02.2, CA-03.1–CA-03.4, CA-04.1–CA-04.5,
  CA-05.1–CA-05.4, CA-06.1–CA-06.4, CA-07.1.

## Entrega 6 — Integração da aplicação

### T-19 — Integrar componentes na aplicação

- **Descrição:** Conectar hook e componentes na tela principal.
- **Critérios de aceite:**
  - `App.tsx` compõe busca, resultados e painel usando `useWeather`, sem
    duplicar estado de domínio; `main.tsx` apenas inicializa a aplicação.
  - Fluxo busca → seleção → clima e retry funcionam na composição final.
- **Dependências:** T-09, T-13, T-14, T-15, T-16, T-17, T-18.
- **Arquivos prováveis:** `src/App.tsx`, `src/main.tsx`.
- **Tipo:** UI.
- **Rastreabilidade:** CA-01.1–CA-01.6, CA-02.1–CA-02.3,
  CA-06.1–CA-06.5, CA-07.1.

### T-20 — Aplicar tema e estilos responsivos

- **Descrição:** Implementar estilos globais e layout responsivo da aplicação.
- **Critérios de aceite:**
  - Estilos globais aplicam o tema dark glassmorphism previsto no plano.
  - Layout mantém os controles e conteúdo funcional utilizáveis na matriz
    responsiva aprovada em T-02, sem corte de conteúdo.
- **Dependências:** T-19.
- **Arquivos prováveis:** `src/styles/index.css`.
- **Tipo:** UI.
- **Rastreabilidade:** CA-07.1, RNF-01.

## Entrega 7 — Testes automatizados

### T-21 — Testar funções puras

- **Descrição:** Criar testes unitários dedicados à conversão Celsius/Fahrenheit.
- **Critérios de aceite:**
  - Testes unitários verificam conversão Celsius → Fahrenheit e Fahrenheit →
    Celsius com precisão/arredondamento aprovado.
  - Valores ausentes permanecem indisponíveis e os casos são determinísticos,
    sem DOM ou rede.
- **Dependências:** T-05, T-20.
- **Arquivos prováveis:** `tests/unit/lib/temperature.test.ts`.
- **Tipo:** Test.
- **Rastreabilidade:** CA-03.2, CA-05.1–CA-05.4.

### T-22 — Testar mapeamento de condições e datas

- **Descrição:** Cobrir a tradução de códigos WMO e a formatação de datas.
- **Critérios de aceite:**
  - Testes cobrem códigos conhecidos, desconhecidos e ausentes sem descrição
    inventada.
  - Testes cobrem a formatação de datas conforme os gates aprovados, sem
    depender do fuso implícito do dispositivo.
- **Dependências:** T-06, T-20.
- **Arquivos prováveis:** `tests/unit/lib/weatherCodes.test.ts`,
  `tests/unit/lib/date.test.ts`.
- **Tipo:** Test.
- **Rastreabilidade:** CA-03.1, CA-04.1, CA-04.2, CA-04.5, CA-07.1.

### T-23 — Testar serviços de dados

- **Descrição:** Testar os serviços de dados usando mock de `fetch`.
- **Critérios de aceite:**
  - `fetch` é mockado para cobrir URLs/parâmetros, normalização válida e
    parcial, resposta vazia, HTTP, rede, timeout e payload inválido.
  - A suíte não acessa a Open-Meteo real e verifica que falhas não viram
    respostas vazias.
- **Dependências:** T-07, T-08, T-20.
- **Arquivos prováveis:** `tests/unit/services/openMeteo.test.ts`.
- **Tipo:** Test.
- **Rastreabilidade:** CA-01.1–CA-01.6, CA-03.1–CA-03.6,
  CA-04.1–CA-04.5, CA-06.3–CA-06.5.

### T-24 — Testar orquestração do hook

- **Descrição:** Testar transições de estado, concorrência e retry no hook com
  serviços simulados.
- **Critérios de aceite:**
  - Testes cobrem loading, seleção, retry, limpeza de dados, cancelamento e
    descarte de resposta fora de ordem.
  - Resposta antiga não substitui a localidade selecionada mais recentemente.
- **Dependências:** T-09, T-20.
- **Arquivos prováveis:** `tests/unit/hooks/useWeather.test.ts`.
- **Tipo:** Test.
- **Rastreabilidade:** CA-01.3–CA-01.6, CA-02.1–CA-02.3,
  CA-06.1–CA-06.5.

### T-25 — Testar componentes de busca

- **Descrição:** Testar busca e seleção de localidades pelo comportamento
  observável dos componentes.
- **Critérios de aceite:**
  - Testes cobrem entrada vazia/aparada, loading, resultados, estado vazio,
    falha/retry e seleção.
  - Controles e resultados têm nomes acessíveis e são operáveis por teclado.
- **Dependências:** T-10, T-11, T-12, T-13, T-14, T-20.
- **Arquivos prováveis:** `tests/components/SearchForm.test.tsx`,
  `tests/components/SearchResults.test.tsx`.
- **Tipo:** Test.
- **Rastreabilidade:** CA-01.1–CA-01.6, CA-02.1, CA-06.1–CA-06.3,
  CA-07.1.

### T-26 — Testar componentes de clima e previsão

- **Descrição:** Testar apresentação de clima, previsão, unidade e estados
  meteorológicos.
- **Critérios de aceite:**
  - Testes cobrem dados completos/parciais, métricas meteorológicas,
    conversão da temperatura, campos indisponíveis e conteúdo associado à
    cidade selecionada.
  - Datas, probabilidade de precipitação e nomes acessíveis relevantes são
    verificados.
- **Dependências:** T-15, T-16, T-20.
- **Arquivos prováveis:** `tests/components/CurrentWeather.test.tsx`,
  `tests/components/ForecastList.test.tsx`.
- **Tipo:** Test.
- **Rastreabilidade:** CA-02.2, CA-03.1–CA-03.6, CA-04.1–CA-04.6,
  CA-07.1.

### T-27 — Testar controle e painel meteorológico

- **Descrição:** Testar a alternância de unidade e os estados do painel
  meteorológico.
- **Critérios de aceite:**
  - Unidade inicial e alternância são verificadas em todas as temperaturas; a
    alternância não inicia nova chamada ao serviço.
  - Painel cobre loading, vazio, erro e sucesso parcial sem exibir dados
    anteriores, com nomes acessíveis relevantes.
- **Dependências:** T-17, T-18, T-20.
- **Arquivos prováveis:** `tests/components/TemperatureUnitToggle.test.tsx`,
  `tests/components/WeatherPanel.test.tsx`.
- **Tipo:** Test.
- **Rastreabilidade:** CA-05.1–CA-05.4, CA-06.1–CA-06.4, CA-07.1.

### T-28 — Testar componentes nos estados de requisição

- **Descrição:** Criar testes de componentes dedicados aos estados loading,
  erro e vazio.
- **Critérios de aceite:**
  - Os testes verificam estado loading, erro e vazio visíveis e identificáveis
    por tecnologia assistiva.
  - Erro não é confundido com resultado vazio; estados e mensagens são
    apresentados em pt-BR.
  - Ações de nova busca/retry aplicáveis são operáveis por teclado e disparam
    o callback correto.
- **Dependências:** T-10, T-11, T-12, T-20.
- **Arquivos prováveis:** `tests/components/RequestStates.test.tsx`.
- **Tipo:** Test.
- **Rastreabilidade:** CA-01.4, CA-01.6, CA-03.3, CA-04.4,
  CA-06.1–CA-06.4, CA-07.1.

### T-29 — Validar fluxo principal E2E e viewport mobile

- **Descrição:** Testar o fluxo principal integrado com APIs interceptadas,
  incluindo viewport mobile.
- **Critérios de aceite:**
  - Playwright percorre busca → resultados → seleção → clima atual/previsão
    → alternância de unidade com respostas controladas.
  - O mesmo fluxo principal é verificado em ao menos um viewport mobile
    aprovado, sem corte de conteúdo funcional nem rolagem horizontal.
  - Os testes não dependem de rede externa e passam na matriz de viewport
    aprovada em T-02.
- **Dependências:** T-02, T-19, T-20.
- **Arquivos prováveis:** `tests/e2e/weather-flow.spec.ts`,
  `playwright.config.ts`.
- **Tipo:** Test.
- **Rastreabilidade:** CA-01.1–CA-01.6, CA-02.1–CA-02.3,
  CA-03.1–CA-03.4, CA-04.1–CA-04.5, CA-05.1–CA-05.4,
  CA-06.1–CA-06.5, CA-07.1, RNF-01, RNF-02.

## Entrega 8 — Hardening

### T-30 — Endurecer falhas e concorrência antes do release

- **Descrição:** Revisar e fechar o tratamento operacional de erros,
  cancelamento e respostas atrasadas nos limites de serviço e hook.
- **Critérios de aceite:**
  - Falhas HTTP, de rede, timeout e payload inválido encerram loading e mantêm
    a distinção entre erro e resposta vazia.
  - Seleção nova invalida solicitações antigas e nenhum erro ou resposta
    atrasada reapresenta dados de outra cidade.
  - As mensagens e retries respeitam as decisões aprovadas; não há fallback
    silencioso, segredo no cliente ou dependência de rede real nos testes.
  - Os cenários de hardening passam nos testes de serviços, hook e E2E.
- **Dependências:** T-02, T-03, T-21, T-22, T-23, T-24, T-25, T-26,
  T-27, T-28, T-29.
- **Arquivos prováveis:** `src/services/openMeteo.ts`,
  `src/hooks/useWeather.ts`.
- **Tipo:** Data.
- **Rastreabilidade:** CA-02.3, CA-06.1–CA-06.5, RNF-05, RNF-06.
