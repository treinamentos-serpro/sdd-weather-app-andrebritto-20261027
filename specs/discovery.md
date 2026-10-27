# Discovery — Aplicação de Previsão do Tempo

## Contexto

A empresa solicitou uma aplicação para que usuários consultem informações meteorológicas de cidades. O briefing identifica quatro capacidades do produto — busca de cidades, consulta do clima atual, previsão para cinco dias e alternância de unidades — e informa que a aplicação deve poder ser usada em dispositivos móveis. Fonte de dados, público prioritário, regras de apresentação e critérios de qualidade ainda precisam ser definidos.

## Requisitos Funcionais

- **RF-01 — Buscar cidades:** permitir que o usuário pesquise uma cidade.
- **RF-02 — Consultar clima atual:** exibir as condições meteorológicas atuais da cidade selecionada.
- **RF-03 — Consultar previsão:** exibir uma previsão do tempo para cinco dias para a cidade selecionada.
- **RF-04 — Alternar unidade de temperatura:** permitir alternar entre Celsius e Fahrenheit e apresentar as temperaturas na unidade escolhida.

**Revisão item a item:** RF-01 a RF-04 estão classificados corretamente como funcionais: cada um descreve uma ação ou capacidade oferecida pelo produto.

**Candidato funcional a validar:** exibir a data e o horário da última atualização dos dados. Mostrar essa informação é um comportamento do produto, portanto seria funcional; o briefing não solicita explicitamente esse recurso.

## Requisitos Não-Funcionais

Os quatro primeiros itens abaixo são requisitos não funcionais sugeridos para o tipo de produto. Os critérios numéricos são propostas iniciais para discussão, não compromissos já aprovados.

- **RNF-01 — Responsividade:** a interface deve permitir concluir busca e consulta em celular, tablet e desktop sem perda de conteúdo ou rolagem horizontal. Validar, como ponto de partida, larguras de viewport de 320 px a 1440 px e orientações retrato e paisagem. A faixa final deve ser acordada.
- **RNF-02 — Acessibilidade:** os fluxos de busca e alternância de unidade devem ser operáveis por teclado, ter nomes acessíveis e funcionar com leitor de tela. Sugestão de aceite: WCAG 2.2 nível AA, a confirmar com as partes interessadas.
- **RNF-03 — Desempenho:** busca e carregamento dos dados meteorológicos devem responder em até 3 segundos no percentil 95, sob condições de rede e disponibilidade da fonte a serem definidas. A meta é uma proposta inicial a validar.
- **RNF-04 — Disponibilidade e resiliência:** indisponibilidade da fonte externa não deve deixar a interface bloqueada nem apresentar dados antigos como atuais. Sugestão de disponibilidade mensal de 99,5% para o serviço, com escopo, dependências e tratamento de manutenção a acordar.
- **RNF-05 — Localização e formatos (classificação condicional):** consistência de idioma, datas, horas e convenções regionais é uma característica de qualidade. O briefing não define localidade. Se houver seletor para o usuário trocar o idioma, essa capacidade deve ser especificada separadamente como requisito funcional.
- **RNF-06 — Atualidade e contexto dos dados (classificação condicional):** a frequência de atualização e a clareza sobre a cidade e o período dos dados são atributos de qualidade. Exibir uma marcação explícita com a data/hora da última atualização é um comportamento funcional candidato, não solicitado no briefing.

**Resultado da revisão:** não há erro evidente na classificação de RF-01 a RF-04 nem nos RNF-01 a RNF-04. RNF-05 e RNF-06 misturavam atributos de qualidade com possíveis funcionalidades; a distinção acima evita tratar essas funcionalidades adicionais como requisitos já aprovados.

## Riscos

As probabilidades são avaliações iniciais com base no briefing incompleto e devem ser revistas após as decisões de discovery.

| Risco | Probabilidade | Impacto | Estratégia de mitigação |
| --- | --- | --- | --- |
| A API meteorológica ou de geocodificação ficar indisponível, lenta, limitada por cota ou mudar suas condições de uso. | Média | Alto: busca e consulta podem ficar indisponíveis, degradadas ou gerar custos não previstos. | Avaliar cobertura, limites, SLA, licenciamento e custos antes de escolher a fonte; definir timeouts, tratamento de erros e monitoramento. |
| A busca selecionar uma cidade homônima ou uma localidade incorreta. | Média | Alto: o usuário recebe informações meteorológicas de outro lugar e pode tomar decisões inadequadas. | Exibir contexto para desambiguação, como região e país; definir regras de ordenação e exigir seleção explícita quando necessário. |
| “Previsão de cinco dias” ou “clima atual” não corresponder à expectativa dos usuários. | Alta | Médio | Validar período, granularidade, campos e horário de referência com usuários/negócio e documentar critérios de aceite antes da implementação. |
| Dados desatualizados ou diferenças entre a fonte e as condições reais serem apresentados como atuais e exatos. | Média | Alto: perda de confiança e decisões baseadas em dados inadequados. | Definir política de atualização, origem e horário dos dados; indicar indisponibilidade ou desatualização e evitar afirmar precisão não garantida pela fonte. |
| Busca e consulta demorarem em redes móveis ou em regiões com conectividade ruim. | Média | Alto: abandono do fluxo e baixa utilidade em um contexto explicitamente móvel. | Definir metas de desempenho por rede/dispositivo; medir latência; limitar requisições redundantes e apresentar estados de carregamento e recuperação. |
| A interface móvel, acessibilidade ou suporte a navegadores não atender às necessidades do público. | Média | Alto: parte dos usuários não consegue pesquisar ou interpretar a previsão. | Definir matriz de dispositivos e navegadores; validar fluxos em tamanhos de tela reais, teclado e leitor de tela; incluir critérios de acessibilidade nos testes. |
| Conversões ou alternância entre Celsius e Fahrenheit serem inconsistentes entre componentes ou apresentarem arredondamento confuso. | Baixa | Médio: valores contraditórios reduzem a confiança nos dados. | Definir unidade padrão, escopo da preferência, precisão e regras de arredondamento; testar todos os valores e estados de alternância. |
| Fuso horário, horário de verão ou formato de data agruparem a previsão no dia errado. | Média | Alto: usuários podem interpretar incorretamente o período previsto para a cidade escolhida. | Definir que fuso rege a previsão e os limites de cada dia; validar datas em localidades de fusos distintos e em transições de horário. |
| Geolocalização ou histórico de buscas serem coletados sem necessidade, transparência ou proteção adequada. | Baixa | Alto: perda de confiança e possível descumprimento de obrigações de privacidade. | Minimizar coleta e retenção; pedir permissão antes de usar localização; documentar finalidade, consentimento e exclusão conforme requisitos legais aplicáveis. |
| Credenciais, cotas ou integrações da fonte serem expostas ou abusadas. | Baixa | Alto: consumo indevido, interrupção de serviço ou custos inesperados. | Não expor segredos no cliente; restringir credenciais e cotas quando aplicável; monitorar uso e definir controles contra abuso. |
| Novas expectativas (favoritos, alertas, mapas, offline ou login) ampliarem o escopo sem priorização. | Alta | Médio: retrabalho, atrasos e investimento em funções sem valor validado. | Registrar explicitamente o escopo inicial e itens fora de escopo; priorizar por valor com as partes interessadas e controlar mudanças. |

## Personas

As personas abaixo são hipóteses baseadas nas capacidades do briefing, não resultados de pesquisa. Devem ser validadas e ajustadas com usuários reais.

| Persona | Objetivo principal | Contexto de uso | Métrica de sucesso do ponto de vista da persona |
| --- | --- | --- | --- |
| **Bruna, pessoa que consulta o tempo antes de sair** | Ver rapidamente as condições atuais para decidir o que vestir ou levar. | Principalmente no celular, em uma consulta breve antes de sair de casa ou durante o deslocamento. | Encontra a cidade correta e entende a temperatura e condição atual em até 30 segundos, sem precisar repetir a busca. |
| **Rafael, pessoa planejando uma viagem** | Consultar a previsão dos próximos dias para preparar atividades e bagagem. | Geralmente no desktop ao planejar e no celular durante a viagem; consulta uma cidade e os cinco dias apresentados. | Identifica a condição prevista para cada dia relevante e a unidade de temperatura que prefere, sem confundir datas ou localidade. |
| **Ana, pessoa que usa leitor de tela** | Pesquisar uma cidade e compreender o clima atual e a previsão sem depender de conteúdo visual. | Celular ou desktop com leitor de tela e navegação por teclado, em consultas cotidianas. | Conclui a busca e acessa os dados atuais e a previsão de cinco dias de forma independente, sem controles inacessíveis ou informação ambígua. |

## Decisões

As decisões abaixo foram definidas para destravar a especificação. Elas encerram as perguntas indicadas, sem presumir respostas para aspectos relacionados que ainda não foram decididos.

| Decisão | Justificativa | Perguntas em aberto que resolve |
| --- | --- | --- |
| Usar **Open-Meteo** como fonte de dados, sem API key. | Evita exigir uma chave de API para a integração prevista e define o provedor a ser avaliado na arquitetura. | Qual fonte de dados será usada? É necessária uma chave de API? Permanecem em aberto limites de uso, cobertura, licença, atribuição e disponibilidade do serviço. |
| Interpretar “5 dias” como **hoje + os quatro dias seguintes**. | Define claramente o intervalo da previsão solicitada. | O período inclui hoje ou os cinco dias seguintes? Permanecem em aberto a granularidade (diária/horária), os campos exibidos e o fuso que determina o dia. |
| Usar **Celsius como unidade padrão**. | Estabelece uma apresentação inicial consistente com a localidade da interface definida abaixo; a alternância para Fahrenheit continua disponível. | Qual unidade deve ser usada na primeira visita? Permanecem em aberto persistência da escolha, escopo da conversão e regras de arredondamento. |
| Não oferecer **autenticação nem persistência de dados no servidor**. | Mantém o escopo do produto sem contas e evita armazenar dados de usuário no servidor nesta versão. | É necessário login? Deve haver persistência no servidor? Permanecem em aberto favoritos/histórico e eventual persistência local no dispositivo. |
| Usar **pt-BR como idioma da interface**. | Define o idioma inicial do produto para o público-alvo deste treinamento. | Qual idioma será suportado? Permanecem em aberto formatos específicos de data/número, fuso horário e a necessidade de permitir troca de idioma. |

## Perguntas em Aberto (Open Questions)

As decisões registradas acima já encerram parte das lacunas do briefing. As perguntas abaixo listam o que ainda precisa de resposta; os impactos indicam o risco de avançar sem decisão.

| Área | Pergunta em aberto | Impacto se ficar sem resposta |
| --- | --- | --- |
| Produto e público | Quem são os usuários prioritários e em que situação consultarão o app (planejar viagem, decidir roupa, acompanhar alertas ou outra)? | Sem um público e objetivo prioritários, não é possível decidir quais dados, fluxos e compromissos de experiência têm maior valor. |
| Produto e sucesso | Qual problema de negócio deve ser resolvido e como o sucesso será medido (por exemplo, consultas concluídas, retorno de usuários ou satisfação)? | A equipe pode otimizar para uma solução que funciona tecnicamente, mas não atende ao resultado esperado pelo negócio. |
| Cobertura geográfica | O produto deve atender cidades de um país específico ou localidades do mundo todo? Há cobertura prioritária? | Afeta a escolha da fonte, geocodificação, idiomas, unidades, fusos horários e relevância dos resultados. |
| Busca | A busca aceita nomes de cidades, códigos postais, regiões ou coordenadas? Deve sugerir resultados enquanto o usuário digita? | Define o comportamento do campo, o serviço de geocodificação e os critérios de busca. |
| Busca | Como tratar erros de digitação, acentos, nomes alternativos, termos parciais e busca sem resultados? | Resultados inconsistentes ou ausência de feedback podem impedir o usuário de encontrar a localidade desejada. |
| Busca | Como diferenciar localidades com nomes iguais (país, estado/região, coordenadas) e quantos resultados mostrar? | O usuário pode selecionar a cidade errada e tomar decisões com base em uma previsão de outra localidade. |
| Localização | A localização atual do dispositivo deve ser solicitada? A busca manual continua disponível se a permissão for negada ou indisponível? | Afeta o fluxo inicial, permissões, privacidade e a capacidade de usar o app em navegadores sem geolocalização. |
| Cidade selecionada | O app mostra uma única cidade por vez ou permite alternar entre cidades recentes/favoritas? | Altera navegação, persistência, escopo de busca e a necessidade de armazenamento local ou de conta. |
| Clima atual | Quais informações compõem “clima atual” (temperatura, sensação térmica, condição, umidade, vento, precipitação, pressão ou outras)? | Sem definição, conteúdo e hierarquia da tela podem divergir das expectativas e variar conforme a fonte escolhida. |
| Atualidade | Com que frequência os dados precisam ser atualizados? Deve ser exibido o horário da observação ou da última atualização? | Dados antigos podem ser confundidos com condições atuais; frequência também impacta custo, limites de API e desempenho. |
| Previsão | Com o período definido como hoje + quatro dias, qual granularidade e quais variáveis a previsão deve apresentar? | Define os dados necessários, a complexidade da interface e a utilidade da previsão para os casos de uso. |
| Previsão | A previsão será diária, horária ou ambas? Quais variáveis e nível de detalhe devem ser apresentados? | Define os dados necessários, a complexidade da interface e a utilidade da previsão para os casos de uso. |
| Tempo e fuso | Datas e períodos devem seguir o fuso da cidade consultada, o fuso do usuário ou outro padrão? Como tratar mudança de horário? | Horários e limites de cada dia podem ser interpretados incorretamente, sobretudo em viagens e cidades distantes. |
| Unidades | Com Celsius definido como padrão, a escolha do usuário deve persistir? A alternância aplica-se a todas as temperaturas ou também a outras medidas? | Sem decisão, a unidade pode mudar inesperadamente ou valores diferentes podem ser apresentados em escalas inconsistentes. |
| Unidades | Como arredondar conversões e apresentar valores extremos ou ausentes? | Conversões diferentes entre telas e valores sem tratamento reduzem confiança e dificultam testes objetivos. |
| Fonte de dados | Com Open-Meteo definido sem API key, quais são os limites de uso, cobertura, licença, atribuição exigida e disponibilidade aplicáveis? | O serviço pode não atender à cobertura ou ao uso esperado, exigir atribuição ou impor restrições operacionais não consideradas. |
| Idioma e formatos | Com a interface definida em pt-BR, quais formatos de data/número e convenções regionais serão usados? Deve haver opção de trocar o idioma? | Formatos inconsistentes prejudicam a compreensão; um seletor de idioma alteraria o escopo funcional. |
| Dispositivos | Quais larguras de tela, orientações, sistemas operacionais e navegadores móveis devem ser suportados? Desktop também é requisito? | “Usar em dispositivos móveis” não é verificável sem uma matriz de suporte; pode haver falhas em dispositivos relevantes. |
| Experiência móvel | Basta uma interface responsiva no navegador ou são esperados recursos de app instalável, como PWA, notificações ou uso offline? | A interpretação altera escopo, arquitetura, permissões e esforço de entrega. |
| Estados da interface | O que deve ocorrer durante carregamento, erro, ausência de resultados, dados indisponíveis ou localização negada? | Fluxos incompletos podem deixar a interface sem orientação, travada ou com dados incorretos apresentados como válidos. |
| Conectividade | O produto precisa funcionar offline? Pode exibir dados em cache; por quanto tempo e com qual indicação de desatualização? | Determina estratégia de cache, persistência e risco de apresentar dados obsoletos como atuais. |
| Preferências e conta | Sem autenticação nem persistência no servidor, favoritos, cidades recentes ou unidade escolhida devem persistir localmente entre sessões? | Define se há armazenamento no dispositivo, seu comportamento entre sessões e os requisitos de privacidade associados. |
| Privacidade | Se houver geolocalização ou histórico, quais dados podem ser coletados, armazenados e por quanto tempo? É necessário consentimento ou exclusão? | Pode haver coleta excessiva, perda de confiança ou descumprimento de obrigações de privacidade aplicáveis. |
| Acessibilidade | Quais padrões e necessidades devem ser atendidos (teclado, leitor de tela, contraste, ampliação, linguagem clara)? | Sem critérios, barreiras de uso podem passar despercebidas e não há base objetiva para validação de acessibilidade. |
| Desempenho | Quais metas de tempo de resposta são aceitáveis para busca e consulta, em quais redes e dispositivos? | “Rápido” não é testável sem metas e condições; desempenho inadequado pode comprometer o uso móvel. |
| Disponibilidade e falhas | Quais metas de disponibilidade e recuperação se aplicam? O que fazer quando a fonte externa limita ou interrompe o serviço? | A experiência e os compromissos operacionais ficam indefinidos; indisponibilidade externa pode tornar o serviço inutilizável. |
| Segurança e abuso | Há limites de frequência, proteção contra automação abusiva ou requisitos adicionais para dados e integrações? | A aplicação pode sofrer abuso da API, custos inesperados ou exposição de dados e credenciais. |
| Escopo excluído | Alertas meteorológicos, mapas, widgets, compartilhamento, anúncios ou monetização estão fora do escopo? | Funcionalidades implicitamente esperadas podem surgir tarde, causando expansão de escopo e retrabalho. |

## Suposições (Assumptions)

- A busca é iniciada pelo usuário informando o nome de uma cidade; o briefing não menciona geolocalização automática.
- “Clima atual” e “previsão de cinco dias” referem-se à cidade selecionada pelo usuário.
- Alternar entre Celsius e Fahrenheit aplica-se aos valores de temperatura exibidos; confirmar se há outros valores ou preferências envolvidos.
- O acesso em dispositivos móveis implica uma interface responsiva e utilizável por toque, mas não define dispositivos ou navegadores específicos.
- O uso normal do produto depende de conexão com a internet; suporte offline não foi solicitado e permanece em aberto.
- Não haverá autenticação nem persistência de dados no servidor nesta versão; persistência local de preferências, favoritos ou histórico ainda precisa ser decidida.