# Especificação de Produto — Weather App

## Overview

O Weather App permite que uma pessoa pesquise uma cidade e consulte suas
condições meteorológicas atuais e a previsão para cinco dias. A experiência deve
ser utilizável em dispositivos móveis e oferecer alternância de temperatura
entre Celsius e Fahrenheit.

Esta versão usa Open-Meteo como fonte de dados, apresenta a interface em
português do Brasil, inicia em Celsius e interpreta “cinco dias” como hoje e os
quatro dias seguintes. Não há autenticação nem persistência de dados no servidor.

O objetivo do produto é ajudar as pessoas a entender as condições do tempo para
uma cidade escolhida e planejar atividades próximas. Os públicos e objetivos
prioritários ainda são hipóteses; consultar **Open Questions**.

**Status:** baseline especificada; não aprovada para produção até a resolução
dos gates de lançamento listados em **Open Questions**.

## Functional Requirements

**RF-01 — Pesquisar cidades**

- A pessoa deve poder pesquisar por nome de cidade e iniciar a busca por ação
  explícita.
- O sistema deve remover espaços em branco no início e no fim da consulta antes
  de enviá-la. Consultas vazias ou formadas apenas por espaços não devem ser
  enviadas.
- Cada resultado deve apresentar o nome da localidade e, quando fornecidos pelo
  serviço de geocodificação, região administrativa e país para distinguir
  homônimos.
- Busca parcial, códigos postais, coordenadas, sugestões enquanto digita,
  ordenação e limite de resultados ainda dependem de decisão; ver **Open
  Questions**.

**RF-02 — Selecionar a cidade**

- O sistema deve permitir que a pessoa escolha uma cidade entre os resultados
  encontrados.
- O nome da cidade e o contexto geográfico disponíveis devem permanecer visíveis
  junto aos dados meteorológicos.
- Os dados exibidos devem pertencer à seleção atual. Uma resposta atrasada de
  uma busca ou cidade anteriormente selecionada não pode substituir os dados da
  seleção mais recente.

**RF-03 — Consultar o clima atual**

- Para a cidade selecionada, o sistema deve apresentar informações do clima
  atual, incluindo temperatura e condição meteorológica, além de umidade,
  velocidade do vento, precipitação e pressão quando retornadas pela fonte.
- Temperatura, condição e métricas são campos opcionais no payload. Cada valor
  disponível deve ser identificado; campo ausente deve ser indicado como
  indisponível, sem inferência ou substituição por zero.
- Apresentar umidade em porcentagem, velocidade do vento em km/h, precipitação
  em mm e pressão em hPa.
- Data/hora da observação, sensação térmica e outros campos além dos listados
  não fazem parte da baseline confirmada; inclusão depende de decisão de produto.

**RF-04 — Consultar a previsão de cinco dias**

- Para a cidade selecionada, o sistema deve apresentar a previsão cobrindo hoje
  e os quatro dias seguintes.
- Cada período deve apresentar sua data, temperaturas máxima e mínima,
  condição e probabilidade máxima diária de precipitação quando disponíveis,
  sem criar valores para campos ou datas ausentes.
- A probabilidade de precipitação é apresentada em porcentagem; quando ausente,
  deve ser identificada como indisponível.
- Granularidade, variáveis obrigatórias e fuso que determina “hoje” ainda
  dependem de decisão; não liberar implementação/testes finais da previsão
  antes dessas definições.

**RF-05 — Alternar unidade de temperatura**

- O sistema deve permitir alternar entre Celsius e Fahrenheit.
- A unidade padrão na primeira visita deve ser Celsius.
- A unidade escolhida deve ser aplicada aos valores de temperatura apresentados
  no clima atual e na previsão.
- A escolha se aplica a todos os valores de temperatura disponíveis na tela,
  sem alterar datas, condições meteorológicas ou outros tipos de medida.
- Persistência da preferência e regra de arredondamento precisam ser definidas
  antes de fechar os critérios quantitativos; ver **Open Questions**.

**RF-06 — Informar estados da consulta**

- O sistema deve informar quando uma busca ou consulta meteorológica está em
  andamento, quando não há resultados e quando não é possível obter os dados.
- Cada falha deve encerrar o estado de carregamento e apresentar uma mensagem
  coerente com a ação que falhou, com possibilidade de iniciar nova tentativa.
- A versão inicial não apresenta dados em cache nem dados de uma consulta
  anterior após falha; informa a indisponibilidade em seu lugar.
- Timeout, limite de espera e diferenciação entre erros recuperáveis e
  permanentes dependem de decisão operacional; ver **Open Questions**.

**RF-07 — Apresentar a interface em português do Brasil**

- Rótulos, instruções, controles, estados, mensagens e conteúdo de data devem
  estar em português do Brasil. Formatos regionais de data e número devem ser
  definidos de modo consistente antes do aceite final.

## User Stories

- **US-01 (RF-01):** Como Bruna, pessoa que consulta o tempo antes de sair,
  quero pesquisar uma cidade e distinguir resultados semelhantes para encontrar
  o destino correto antes de sair.
- **US-02 (RF-02):** Como Ana, pessoa que usa leitor de tela, quero selecionar
  uma cidade dos resultados e confirmar qual foi selecionada para consultar o
  lugar certo de forma independente.
- **US-03 (RF-03):** Como Bruna, pessoa que consulta o tempo antes de sair,
  quero ver o clima atual da cidade selecionada para decidir o que vestir ou
  levar.
- **US-04 (RF-04):** Como Rafael, pessoa planejando uma viagem, quero consultar
  a previsão de hoje e dos quatro dias seguintes para organizar minhas
  atividades e bagagem.
- **US-05 (RF-05):** Como Rafael, pessoa planejando uma viagem, quero alternar
  entre Celsius e Fahrenheit para interpretar as temperaturas na unidade que
  prefiro.
- **US-06 (RF-06):** Como Ana, pessoa que usa leitor de tela, quero receber
  informações claras sobre carregamento, ausência de resultados e falhas para
  saber o estado da consulta e como prosseguir.
- **US-07 (RF-07):** Como Ana, pessoa que usa leitor de tela, quero receber
  instruções e mensagens em português do Brasil para compreender e usar o
  produto com clareza.

## Acceptance Criteria

Cada critério usa Given/When/Then (Dado/Quando/Então) e está identificado pelo
requisito funcional correspondente para apoiar a criação de testes automatizados.

**RF-01 — Pesquisar cidades**

- **CA-01.1:** **Given** uma consulta de cidade não vazia e resultados
  correspondentes disponíveis, **When** a pessoa solicita a busca, **Then** os
  resultados são apresentados.
- **CA-01.2:** **Given** uma consulta que retorna mais de uma localidade
  compatível, **When** os resultados são apresentados, **Then** cada resultado
  exibe o nome da cidade e os campos de região administrativa e país quando
  esses campos estiverem presentes na resposta da fonte.
- **CA-01.3:** **Given** um campo de busca vazio ou contendo apenas espaços,
  **When** a pessoa solicita a busca, **Then** nenhuma busca é enviada e uma
  indicação informa que é necessário inserir uma cidade.
- **CA-01.4:** **Given** uma consulta sem localidades correspondentes, **When**
  os resultados da busca são recebidos, **Then** a interface informa que nenhum
  resultado foi encontrado.
- **CA-01.5:** **Given** uma consulta com espaços antes ou depois do nome,
  **When** a pessoa solicita a busca, **Then** os espaços externos são removidos
  e a consulta enviada contém apenas o nome sem esses espaços.
- **CA-01.6:** **Given** uma falha na busca de localidades, **When** a solicitação
  termina, **Then** a interface informa que a busca falhou, não apresenta a
  falha como ausência de resultados e permite nova tentativa.

**RF-02 — Selecionar a cidade**

- **CA-02.1:** **Given** uma lista de resultados de busca, **When** a pessoa
  seleciona um resultado, **Then** o nome e o contexto geográfico desse
  resultado aparecem na área de consulta.
- **CA-02.2:** **Given** uma cidade selecionada, **When** os dados meteorológicos
  são apresentados, **Then** eles correspondem à localidade identificada no
  resultado selecionado.
- **CA-02.3:** **Given** uma consulta meteorológica da cidade A em andamento e
  uma seleção posterior da cidade B, **When** a resposta de A chega depois da
  resposta de B, **Then** a cidade B e seus dados permanecem apresentados.

**RF-03 — Consultar o clima atual**

- **CA-03.1:** **Given** uma cidade selecionada e dados atuais disponíveis,
  **When** a consulta termina, **Then** a interface apresenta a temperatura e a
  condição meteorológica retornadas pela fonte para essa cidade.
- **CA-03.2:** **Given** uma primeira visita e dados atuais disponíveis,
  **When** a temperatura é apresentada, **Then** o valor está identificado em
  Celsius.
- **CA-03.3:** **Given** dados atuais indisponíveis, **When** a consulta termina,
  **Then** a interface informa a indisponibilidade e não apresenta dados
  anteriores nem valores substitutos.
- **CA-03.4:** **Given** uma resposta atual sem temperatura ou sem condição,
  **When** a seção de clima atual é apresentada, **Then** cada campo disponível
  é mostrado e cada campo ausente é identificado como indisponível, sem valor
  inventado.
- **CA-03.5:** **Given** uma resposta atual com umidade, velocidade do vento,
  precipitação ou pressão disponíveis, **When** o clima atual é apresentado,
  **Then** cada métrica recebida é exibida com sua unidade (%, km/h, mm e hPa,
  respectivamente).
- **CA-03.6:** **Given** uma ou mais métricas atuais ausentes, **When** o clima
  atual é apresentado, **Then** as métricas ausentes são identificadas como
  indisponíveis e nenhuma é inferida ou substituída. Exceção de normalização
  solicitada: `current.precipitation` explicitamente `null` é convertido para
  `0 mm`; campo omitido permanece indisponível. A exceção não se aplica à
  probabilidade diária de precipitação.

**RF-04 — Consultar a previsão de cinco dias**

- **CA-04.1:** **Given** uma cidade selecionada e previsão disponível para cinco
  dias, **When** a previsão é apresentada, **Then** ela contém hoje e os quatro
  dias seguintes, totalizando cinco datas consecutivas.
- **CA-04.2:** **Given** uma previsão apresentada, **When** a pessoa ou uma
  tecnologia assistiva percorre os períodos, **Then** cada período está
  associado à sua data correspondente.
- **CA-04.3:** **Given** uma cidade selecionada, **When** a previsão é
  apresentada, **Then** os dados correspondem à localidade selecionada.
- **CA-04.4:** **Given** a previsão indisponível, **When** a consulta termina,
  **Then** a interface informa a indisponibilidade e não apresenta dados
  anteriores nem valores substitutos.
- **CA-04.5:** **Given** uma resposta de previsão com uma ou mais datas ou campos
  ausentes, **When** a previsão é apresentada, **Then** somente os dados
  recebidos são mostrados, os campos ausentes são identificados e nenhuma
  temperatura ou condição é inferida.
- **CA-04.6:** **Given** uma probabilidade diária de precipitação disponível,
  **When** a previsão é apresentada, **Then** o percentual é exibido; se estiver
  ausente, a interface o identifica como indisponível.

**RF-05 — Alternar unidade de temperatura**

- **CA-05.1:** **Given** uma sessão sem preferência de unidade previamente
  selecionada e com temperaturas disponíveis,
  **When** os dados meteorológicos são apresentados, **Then** todos os valores
  de temperatura estão identificados em Celsius.
- **CA-05.2:** **Given** temperaturas do clima atual e da previsão apresentadas
  em Celsius, **When** a pessoa seleciona Fahrenheit, **Then** todos esses
  valores são apresentados em Fahrenheit.
- **CA-05.3:** **Given** temperaturas apresentadas em Fahrenheit, **When** a
  pessoa seleciona Celsius, **Then** os valores são apresentados em Celsius.
- **CA-05.4:** **Given** qualquer temperatura apresentada, **When** a pessoa
  consulta o valor, **Then** a unidade selecionada está visível junto ao valor.

**RF-06 — Informar estados da consulta**

- **CA-06.1:** **Given** uma busca ou consulta meteorológica solicitada ainda
  sem resposta, **When** a solicitação está em andamento, **Then** a interface
  apresenta um estado de carregamento.
- **CA-06.2:** **Given** uma busca concluída sem resultados, **When** a
  interface apresenta o estado vazio, **Then** ela informa que não houve
  resultados e permite iniciar outra busca.
- **CA-06.3:** **Given** uma falha da fonte ou da conexão, **When** a solicitação
  termina, **Then** a interface apresenta uma mensagem de erro e não indica que
  a consulta foi bem-sucedida.
- **CA-06.4:** **Given** uma falha ou indisponibilidade após uma consulta
  anterior, **When** a interface apresenta o resultado da falha, **Then** não
  exibe os dados da consulta anterior nem os apresenta como atuais.
- **CA-06.5:** **Given** uma solicitação que ultrapassa o limite de timeout
  configurado, **When** o limite é atingido, **Then** o carregamento termina,
  uma mensagem de falha é apresentada e uma nova tentativa pode ser iniciada.
  **O limite numérico precisa ser aprovado em Open Questions antes de servir
  como teste automatizado.**

**RF-07 — Apresentar a interface em português do Brasil**

- **CA-07.1:** **Given** qualquer estado da interface (inicial, carregamento,
  resultados, ausência de resultados ou erro), **When** a pessoa visualiza ou
  navega pela interface, **Then** todos os rótulos, instruções, controles e
  mensagens funcionais são apresentados em português do Brasil.

## Non-Functional Requirements

Os alvos numéricos abaixo vieram da discovery e ainda não foram aprovados.
Estão registrados como critérios candidatos e são **bloqueadores para aceite de
produção** até que as partes interessadas confirmem valores e condições de
medição.

- **RNF-01 — Responsividade:** candidato de validação: em viewports de 320 px a
  1440 px, nas orientações retrato e paisagem, os fluxos de busca, seleção e
  consulta não devem cortar conteúdo funcional nem exigir rolagem horizontal.
  Aprovação da faixa, dispositivos e navegadores é pendente.
- **RNF-02 — Acessibilidade:** candidato: WCAG 2.2 nível AA. No mínimo, os
  controles de busca e unidade devem ser operáveis por teclado e possuir nome
  acessível; resultados e mudanças de estado devem ser anunciados por
  tecnologia assistiva. A conformidade AA e matriz de tecnologias assistivas
  precisam ser aprovadas.
- **RNF-03 — Desempenho:** candidato: busca e consulta meteorológica concluídas
  em até 3 segundos no percentil 95, medidos da ação da pessoa até a exibição
  dos resultados, sob rede, dispositivo e disponibilidade da fonte definidos.
  Perfil de medição e exclusões precisam ser aprovados.
- **RNF-04 — Disponibilidade:** candidato: 99,5% mensal. Escopo do serviço,
  dependências externas, janela de manutenção, monitoramento e cálculo de
  disponibilidade precisam ser aprovados antes de compromisso operacional.
- **RNF-05 — Resiliência:** toda solicitação deve terminar em sucesso, ausência
  de dados ou erro; nenhuma falha pode deixar o carregamento ativo
  indefinidamente. A duração máxima da solicitação depende do limite de timeout
  a aprovar. A versão inicial não reutiliza dados de consulta anterior.
- **RNF-06 — Privacidade:** não exigir conta, não persistir consultas ou dados
  meteorológicos associados à pessoa em servidor e não solicitar geolocalização.
  Consultas são enviadas a Open-Meteo para execução da busca/consulta; política
  de privacidade e obrigações de terceiros precisam ser revisadas antes do
  lançamento.

## Traceability Matrix

| User Story | Requisito funcional | Acceptance Criteria | RNFs relevantes |
| --- | --- | --- | --- |
| **US-01** — Bruna pesquisa e distingue cidades. | RF-01 | CA-01.1–CA-01.6 | RNF-01 (uso em diferentes telas), RNF-02 (busca acessível), RNF-03 (tempo de busca), RNF-05 (falha/timeout), RNF-06 (consulta enviada ao provedor). |
| **US-02** — Ana seleciona e confirma a cidade. | RF-02 | CA-02.1–CA-02.3 | RNF-01 (layout responsivo), RNF-02 (seleção acessível), RNF-03 (tempo de consulta), RNF-05 (resposta atrasada/falha), RNF-06 (sem persistência de dados meteorológicos associados). |
| **US-03** — Bruna consulta o clima atual. | RF-03 | CA-03.1–CA-03.4; CA-05.1 (unidade padrão) | RNF-01 (apresentação responsiva), RNF-02 (conteúdo acessível), RNF-03 (tempo de consulta), RNF-04 (disponibilidade), RNF-05 (dados ausentes/falhas), RNF-06 (privacidade da consulta). |
| **US-04** — Rafael consulta a previsão de cinco dias. | RF-04 | CA-04.1–CA-04.6 | RNF-01 (apresentação responsiva), RNF-02 (datas e dados acessíveis), RNF-03 (tempo de consulta), RNF-04 (disponibilidade), RNF-05 (resposta parcial/falhas), RNF-06 (privacidade da consulta). |
| **US-05** — Rafael alterna Celsius e Fahrenheit. | RF-05 | CA-05.1–CA-05.4 | RNF-01 (uso em diferentes telas), RNF-02 (controle acessível), RNF-06 (sem persistência no servidor; persistência local não definida). |
| **US-06** — Ana entende estados e como prosseguir. | RF-06 | CA-06.1–CA-06.5; CA-01.4 e CA-01.6 (estados de busca) | RNF-01 (estados em layouts responsivos), RNF-02 (estados acessíveis), RNF-03 (latência), RNF-05 (término de solicitações), RNF-06 (tratamento de dados). |
| **US-07** — Ana usa a interface em português do Brasil. | RF-07 | CA-07.1 | RNF-01 (conteúdo em telas diferentes), RNF-02 (nomes e mensagens acessíveis). |

**Nota:** RNF-01 a RNF-04 ainda são candidatos e dependem de aprovação dos
gates de produção em **Open Questions**. A matriz indica rastreabilidade e não
representa aprovação desses alvos nem acrescenta critérios funcionais.

## Edge Cases

- **Consulta vazia ou espaços:** não enviar a consulta; informar que é
  necessário inserir uma cidade.
- **Cidade inexistente/geocoding sem resultados:** informar ausência de
  resultados; não selecionar automaticamente outra cidade nem consultar clima.
- **Caracteres especiais e acentos:** enviar a consulta como texto, sem
  interpretá-la como comando; se não houver correspondência, apresentar estado
  sem resultados. Normalização de acentos e tolerância a erros de digitação
  dependem de decisão.
- **Localidades homônimas:** mostrar contexto geográfico disponível e exigir
  seleção explícita; não escolher silenciosamente a primeira opção.
- **Falha, limite de uso ou timeout da API:** encerrar carregamento, informar
  falha (não ausência de resultados), não exibir dados anteriores e permitir
  nova tentativa. Timeout e distinção das mensagens dependem de decisões em
  aberto.
- **Resposta parcial:** apresentar somente campos e datas recebidos; marcar
  ausências como indisponíveis e não inferir nem substituir valores. A previsão
  não deve sugerir cobertura integral se uma ou mais datas não chegaram.
- **Resposta inválida:** tratá-la como falha, sem exibir valores inválidos ou
  interpretar resposta malformada como sucesso.
- **Mudança de seleção durante carregamento:** ignorar resposta de seleção
  anterior se chegar após a resposta da seleção atual.
- **Troca de unidade com dados ausentes:** converter apenas temperaturas
  disponíveis; ausência continua indicada como indisponível.
- **Temperaturas extremas ou conversão:** aplicar a regra de arredondamento
  aprovada; essa regra é bloqueadora para teste numérico.
- **Data, fuso e horário de verão:** a definição do fuso da previsão é
  bloqueadora para determinar as cinco datas esperadas.
- **Queda de conexão:** encerrar carregamento com estado de erro, sem usar
  resposta anterior; permitir nova tentativa após a conexão voltar.
- **Viewport, teclado e leitor de tela:** manter todos os fluxos operáveis e
  conteúdos identificáveis na matriz aprovada de dispositivos e tecnologias.

## Assumptions

- Open-Meteo é a fonte de geocodificação e dados meteorológicos definida para
  esta versão, sem exigência de API key conforme a discovery; limites de uso,
  cobertura, licença, atribuição e disponibilidade precisam ser validados antes
  do lançamento.
- A previsão de cinco dias significa hoje e os quatro dias seguintes.
- Celsius é a unidade inicial, e a alternância para Fahrenheit permanece
  disponível.
- A interface da versão inicial é em português do Brasil.
- Não haverá autenticação nem persistência de dados no servidor nesta versão.
- A pessoa inicia a busca informando o nome de uma cidade; geolocalização
  automática não faz parte do escopo confirmado.
- O uso depende de conexão com a internet; modo offline e apresentação de
  respostas em cache estão excluídos.
- As personas descritas na discovery — consulta antes de sair, planejamento de
  viagem e uso com leitor de tela — são hipóteses a validar, não segmentos
  confirmados por pesquisa.
- A unidade permanece na seleção corrente da sessão; persistência entre visitas
  não está incluída até decisão em contrário.

## Risks

| Risco | Impacto | Mitigação |
| --- | --- | --- |
| Open-Meteo ficar indisponível, lento, limitado por cota ou não atender à cobertura necessária. | Busca ou consulta pode ficar indisponível, degradada ou sujeita a restrições inesperadas. | Confirmar limites, cobertura, licença, atribuição e disponibilidade; definir tratamento de falhas e monitoramento antes da entrega. |
| Uma cidade homônima ser selecionada incorretamente. | A pessoa pode tomar decisões com base em dados de outra localidade. | Exibir contexto geográfico nos resultados e exigir seleção explícita quando houver ambiguidade. |
| “Clima atual” ou “previsão de cinco dias” não corresponder à necessidade dos usuários. | O produto pode exibir dados insuficientes ou em formato inadequado. | Validar campos, granularidade, fuso e casos de uso antes de fechar o plano de entrega. |
| Dados indisponíveis ou diferença entre a fonte e as condições reais serem interpretados como exatos. | Perda de confiança e decisões inadequadas. | Não apresentar valores indisponíveis nem dados de consultas anteriores; validar política de atualização e contexto temporal antes do lançamento. |
| Busca ou consulta ser lenta em redes móveis. | Abandono e baixa utilidade em um contexto de uso móvel. | Confirmar condições de medição, acompanhar a meta de desempenho proposta e oferecer estado de carregamento e recuperação. |
| A interface não atender às necessidades de acessibilidade, dispositivos ou navegadores relevantes. | Algumas pessoas podem não conseguir pesquisar ou entender a previsão. | Confirmar matriz de suporte e critérios de acessibilidade; validar os principais fluxos em dispositivos e tecnologias assistivas. |
| Conversão de temperatura ou arredondamento inconsistente entre áreas. | Valores contraditórios reduzem a confiança. | Aplicar a alternância de forma consistente a todos os valores de temperatura e definir precisão antes de implementação. |
| Fuso horário ou horário de verão levar a uma data de previsão incorreta. | Períodos podem ser interpretados de forma errada, especialmente em viagens. | Decidir o fuso de referência e validar datas em localidades com fusos e transições distintos. |
| Uso futuro de geolocalização ou histórico ocorrer sem transparência ou proteção adequada. | Perda de confiança ou descumprimento de obrigações de privacidade. | Não incluir coleta não aprovada; minimizar dados e definir finalidade, consentimento e retenção antes de adicionar esses recursos. |
| Expectativas de recursos adicionais ampliarem o escopo sem priorização. | Retrabalho, atrasos e investimento fora do objetivo inicial. | Manter explícitos o escopo e os itens fora dele e controlar mudanças com as partes interessadas. |

## Out of Scope

Não fazem parte do escopo confirmado desta versão:

- Autenticação, contas de usuário ou persistência de dados no servidor.
- Geolocalização automática ou solicitação de permissão de localização.
- Favoritos, histórico ou alternância entre várias cidades salvas.
- Alertas meteorológicos, notificações, mapas, widgets ou compartilhamento.
- Uso offline ou apresentação de dados em cache.
- Aplicativo nativo instalável, PWA ou notificações push.
- Anúncios, monetização ou outras funcionalidades não identificadas na
  discovery.
- Seletor de idioma diferente de português do Brasil.
- Exibição obrigatória de horário da última atualização; é uma funcionalidade
  candidata que ainda precisa de decisão.

## Open Questions

As decisões abaixo são **gates de produção**: até aprovação, os itens
dependentes não têm critério de aceite final e não devem ser considerados
prontos para implementação/validação de lançamento.

1. **Cobertura e busca:** cobertura geográfica esperada; aceitação de nomes
   parciais, códigos postais ou regiões; normalização de acentos e erros de
   digitação; limite e ordenação dos resultados.
2. **Dados meteorológicos:** campos obrigatórios do clima atual; previsão diária,
   horária ou ambas; variáveis obrigatórias por período e política de resposta
   parcial. A baseline de UI inclui probabilidade máxima diária de precipitação
   em porcentagem quando disponível; granularidade e outros campos obrigatórios
   ainda precisam de aprovação.
3. **Datas e fuso:** qual fuso define “hoje” e as cinco datas da previsão. A
   recomendação é usar o fuso local da cidade consultada, mas precisa de
   aprovação para produzir datas de teste inequívocas.
4. **Unidades:** regra de arredondamento/precisão para Celsius e Fahrenheit e
   se a escolha deve persistir entre visitas.
5. **Atualidade:** frequência de atualização e necessidade de exibir horário de
   observação ou atualização.
6. **Operação:** timeout máximo por solicitação e tratamento/mensagem para
   limite de uso da fonte. O timeout precisa ser definido para finalizar CA-06.5.
7. **Metas de qualidade:** aprovar ou substituir a faixa de viewport
   320–1440 px, WCAG 2.2 AA, tempo de resposta de até 3 s no p95 e
   disponibilidade mensal de 99,5%; definir dispositivo, rede, amostra,
   dependências e exclusões de cada medição.
8. **Suporte:** sistemas operacionais, navegadores, orientações e tecnologias
   assistivas incluídos na matriz de lançamento; confirmar se desktop faz parte
   do suporte contratado.
9. **Open-Meteo:** validar limites de uso, cobertura, licença, atribuição,
   disponibilidade e adequação para o tráfego esperado; confirmar a revisão de
   privacidade das solicitações enviadas ao provedor.
10. **Público e sucesso:** validar as personas hipotéticas e definir a métrica de
    produto que determina sucesso. Não bloqueia os critérios funcionais atuais,
    mas é necessária para avaliar o resultado do lançamento.
