# Favicon-Manager
**Esta é uma extensão que funciona em navegadores baseados em Chromium. Sua principal funcionalidade é esconder os FavIcons de WebSites.**  

**Mais funcionalidades estão por vir! Ela funciona em conjunto com o tema [Node Clean.]() Dê uma olhada sobre o que ele se trata e então entenderá o propósito desta extensão.** 

---

# A Extensão  
**Seu funcionamento é bem simples, entretanto ela se torna um pouco complexa devido à quantidade pequenos detalhes que existem. Para desenvolvê-la, utilizei a API tabs do Chrome e JavaScript Puro. É claro que seu propósito *é* ser simples. Por isso a sua UI é minimalista. Possui apenas dois botões que são usados para esconder e mostrar o FavIcon.**

**Eu me diverti e aprendi _MUITO_ desenvolvendo-a. Para se ter uma ideia, nunca tinha escrito um JSON antes, usado uma API e muito menos escrito contruído uma extensão. Não conhecia o [Content Security Policy]() e passei em torno de 7 dias, aprendendo como tudo isso funcionava até chegar nessa versão beta.**

**É claro, não é porque é beta, que está incompleta. Sua premissa inicial era simplesmente esconder os FavIcons. Quero melhorá-la e torná-la "Completa". Aliás, esse foi o meu primeiro projeto.**

---

# Considerações

**Antes de explicar seu funcionamento, gostaria de fazer algumas considerações. Tive um trabalho _imenso_ ao desenvolvê-la. Como eu disse, eu não sabia de praticamente nada. A minha maior dificuldade foi achar fontes de informação. Eu sei, o [developer.chrome.com]() é o site oficial e oferece vários guias, mas eles não são práticos.**  

**Então me encontrei tendo que vasculhar a internet, utilizando tentativa e erro para ver o que funcionava e o que não. Se eu não tivesse perdido praticamente uns 4 dias apenas pesquisando, teria feito isto em muito menos tempo. Por outro lado, isso contribuiu em níveis inimagináveis para meu conhecimento e não me arrependendo.**

**Entretanto, dexarei tudo o que eu descobri nesse desenvolvimento nas issues, assim como as fontes de onde eu tirei as informações - Sim, eu salvei todas com medo de perdê-las. Dê uma olhada também no [JS-Runner](). Lá, eu conto um pouco mais do porquê quis começar a criar extensões**

---

# O Código

**Nessa seção, falarei um pouco de como o meu script funciona. Pedacinho por pedacinho. Gostaria de ressaltar que sou bem iniciante - Nunca ter escrito um JSON deixou isso bem claro. Por isso, as minhas soluções podem ser ineficientes e com certeza, devem existir melhores.**

**Entretanto, me dediquei ao máximo. Mais tarde, falarei sobre os Bugs que encontrei, como os resolvi e sobre os que eu ainda não resolvi.**

---

## Background

**O Background tem duas importantes responsabilidades: Atualizar e carregar o estado atual de uma Tab que esteja na memória e se este não existir, criar um. Ele não faz nada nada mais além disso. Através da API do Chrome, detecto toda vez que uma Tab termina de carregar completamente - Um processo que pode ocorrer mais de uma vez por Tab.**

**Após isso, começo a utilizar os módulos que criei. Seus nomes são bem intuitivos quanto ao que fazem:** ***setExtensionInfo(), unpack(), getURLs() e checkInMemory().*** **Estou utilizando o localStorage da extensão para armazenar os dados que preciso. Mas o que são esse dados? No momento em que escrevo, são eles:** ***url, mainURL, state, favIconUrl e empty.***

- **url - É a propriedade do objeto que contém a aliased URL ( Acho que é este o nome ). Logo, *https://github.com/***

- **mainURL - É a propriedade derivada da url que, neste caso é o nome do site. Logo, *github.com***

- **state - Pode possuir dois valores: 0 e 1. Quando 1, o favIcon é alterado. Quando 0, o favIcon do site retorna ao Original.**

- **favIconUrl - Contém a URL do FavIcon original do site. Sérios Bugs relacionados a ela.**

- **empty - Contém a URL da imagem usada para esconder o FavIcon do site.**

**Agora, chegamos à parte legal. O Objeto tab retornado pela API do Chrome, nem sempre contém a propriedade favIcon na primeira interação com um site ou quando um site é bugado, na questão de FavIcons - Mas para frente menciono isso. Por isso, já que a execução scripts nas Tabs é feita de forma assíncrona, preciso de uma Promise**

**Após o término, o Script me retorna a URL do primeiro elemento link válido que ele encontrar.Por motivos que mencionarei mais tarde, devemos priorizar a URL retornada pelo Chrome e usar a que achamos apenas como um fallback. Mas nem sempre podemos confiar no Chrome, pois ele nos passa a perna. Por isso, existe uma validação dessa URL.**

**Se tudo correu bem - ou não -, chegamos à parte final do Script. Nela, existem 4 caminhos a serem seguidos que precisam de certo destaque.**

- **O FavIcon é valido e o usuário já esteve na página antes: Neste caso, precisamos atualizar o FavIcon que está em memória. isto porque, alguns sites como [developer.mozilla.com]() alteram seu FavIcon conforme a página que você está.**

- **O FavIcon é válido e o usuário nunca esteve na página antes: Neste caso, devemos criar um novo objeto na memória para o site e utilizar como FavIcon, a url encontrada.**

- **O FavIcon é inválido e o usuário já esteve na página antes: Neste caso, apenas ignoramos. Se foi encontrado um objeto na memória, existe um FavIcon relacionado a ele que podemos usar, por isso, apenas o desconsideramos.**

- **O FavIcon é inválido e o usuário nunca esteve na página antes: Neste caso, estamos diante de um site com o bugado. Por que esse nome? Porque eu quis. Exemplos de site com este Bug: Amazon, os artigos da MDN - Não a Home, Evernote e outros que eu ainda não descobri.**

---

### O que faz um FavIcon ser válido?

**Na Primeira vez que você entra em um site, é esperado que ele me retorne um FavIcon. Quando isso acontece, há apenas um erro que pode acontecer, mas em geral, precisamos apenas salvar a URL encontrada na memória. Já quando lidamos com sites como a MDN, que alteram seu FavIcon durante a navegação, precisamos atualizá-lo a cada vez que você entra em um site. Mas se torna desnecessário quando a mesma URL já está na memória**

**Entretanto, por conta do Browser, existe a possibilidade de que este FavIcon retornado seja a imagem PNG que estou usando para esconder o ícone. Pode ter passado na sua cabeça: "Ah! É só usar o que você encontrou com a Promise." Sim, pode ser. Porém, é esse comportamento do Browser que me ajudará - Pois eu ainda não implementei - a resolver um dos bugs que existem.**

**Se eu preferir a Promise ao Browser, corrigir o erro torna-se um pouco mais difícil. Então, preferi manter assim.**

**O Retorno da imagem PNG ocorre quando o usuário escondeu o FavIcon e saiu do site. Isso a deixa cacheada no browser para ser utilizada nos bookmarks e para carregar este ícone mais rápido durante as interações posteriores. Nesses casos, preciso recorrer ao Icon. Se até mesmo ele não for válido, volte àqueles dois caminhos que eu disse. Além disso, quando o site não tem FavIcon, tudo que eu tentar me retorna undefined.**

**Recapitulando: Para um ícone ser válido, ele precisa:**

1. **Ser diferente do FavIcon que está na memória - chamado de original.**
1. **Ser diferente da imagem PNG que estou usando - chamada de empty.**
1. **Ser diferente de Undefined.**

---

## O Popup

**Já mencionei que o intuito desta extensão é ser minimalista e simples de ser usada. No Começo pensei apenas em esconder o FavIcon. Mas agora, estou com planos de alterar a imagem para qualquer uma que você quiser. Mesmo assim, existirão apenas dois botões.**

**Não há muito do que se falar sobre a minha UI. Ela possui o backgorund que o tema [Node Clean]() e nela existe um grande título e um pequeno subtítulo. Os Botões são dois Input Radios e a cor principal é um verde nem tão claro, nem tão escuro.**

**Já o Script, também faz algo simples. Ao clicar an extensão, ele busca pela URL da Tab e faz o mesmo processo do Background. Se o usuário abrir a extensão antes da página estar carregada completamente, haverá um erro quando eu implementar. Se a URL na memória estiver marcada como bugada - responsabilidade do Background - um erro será exibido também.**

**De forma simples, se não há erro, ao clicar alternadamente nos botões, o Script altera a UI, altera o objeto na memória e executa uma função proveniente dos módulos responsável por alterar e trazer de volta os FavIcons.**

---

## Options Page

**A Página de opções será uma espécie de painel de controle para esta extensão. Digo que ela será, mas o "core" dela já está pronto. Nela, existe uma tabela que contém o nome do Website, o estado atual dele, o FavIcon original, o Default e um botão de remove.**

**Abaixo dessa tabela, há 5 controles e existirão mais no futuro. São eles:** ***Change allFavIcons, Clear all Cache, Pause web Tracking, More Info e Errors Page;***

- **Change all favIcons simplesmente muda todos os states das Tabs em memória e para 1 e define que todas as novas tabs serão criadas com o state 1 e vice-versa. Change all favIcons faz isso através da função setextensionInfo(). Ela cria, atualiza e retorna um objeto na memória chamado extension-info. Pela propriedade "defaultState", determinanos com qual state novos objetos serão criados.**

- **Clear all Cache limpa todos os objetos em memória que possuem um estado igual a 0. Se o estado for 1, uma série de erros indicando que "Não é possível limpar objetos com estado 1" deverão ser mostrados. Essa foi uma maneira de corrigir o erro loop. Essa mesma validação funciona para os botões "remove".**

- **Pause Web Tracking é uma das maneiras que existirão para corrigir um determinado Bug. Ele impede a criação de novas tabs na memória, mas continua a atualizar as que já existem.**

- **More Info direciona o User para cá. Se você veio por lá, que demais!**

- **Erros Page como já mencionei, será uma outra página HTML que mostrará os logs dos erros que podem eventualmente ocorrer com a extensão.**

---

# Bugs 

**Bugs, Bugs e mais Bugs. Convive tanto tempo com alguns que carinhosamentem os apelidei de Loop, Bug Master e Burlador de CSP. Nesta seção irei falar um pouco deles: Como eu assassinei alguns e estou à procura de matar outros.**

---

## Loop

**Se você já deu uma olhada no meu código e prestou atenção no que eu escrevi, já notou que o Browser não é nosso amigo quando se trata dos FavIcons. Ele é o responsável por esses três Bugs. O Loop acontecia quando você escondia o favIcon através da extensão, deletava a Tab da memória através da Options page e abria o site novamente. Isso causava o retorno da Imagem PNG.**

**Na época, eu ainda não tinha implementado a validação e o sistema que tentava atualizar os ícones a cada vez que o usuário entrasse no site, fazendo com que a nova Tab que fosse criada pegasse como "original", a imagem PNG. Não importava o que você fizesse, a única maneira de resolvê-lo era desativar a extensão, entrar no site, sair e ativá-la novamente.**

---

## Bug Master

**Outro Bug que eu convivia, era o Bug Master. Existem algumas páginas que são bugadas, isto é, elas possuem um FavIcon, porém ele não está no main HTML da página. Como isso é possível eu não sei. E para piorar, na primeiríssima interação que você faz com um site. O Chrome não me retorna esse ícone.**

**Então, o original ganhava um belo de um undefinede ficava lá. Eu ainda não tinha implementado o sistema de tentar atualizar o Ícone. Com ele, agora caímos em um erro nesse cenário e eu posso avisar ao usuário que a Tab é Bugada e pedir que ele feche e abra a página novamente.**

**Mas por que ele é Master? Simplesmente por eu ter passado mais de dois dias descobrindo como ele ocorria e como eu poderia resolvê-lo. Como pensei que fosse o último Bug Ever, dei este nome. Acabei que estava errado. Existe mais um e só mais um. Ele, o Burlador de CSP**

## Burlador de CSP 

**Se você sabe um pouco mais, conhece o Content Security Policy e sabe que existe determinados sites não acietam imagens de Sources desconhecidos. Bom, a primeira coisa que você pode ter notado olhando meu Script é que eu executo um código que altera o href das tags link para a URL da minha PNG**

**A vasta maioria dos sites pelo que percebi, aceitam imagens de outros sources. O Problema com os que não é que se eu tentar mudar a imagem do favIcon, ele não funciona. Quer dizer...**

**Eu estava estudando esse "Bug" até que acidentalmente, descobri uma maneira ineficiente de burlar o CSP. O Browser guarda o FavIcon para utilizá-los nos bookmarks e carregá-lo de forma mais rápida, certo? E toda vez que alteramos os href das Tags Link, o Browser altera o favIcon guardado.**

**Sabemos que ao executar o script, as tags em si realmente mudam seu href, mas o site *refuses to use it.***

**De alguma forma que não sei, sites que não aceitam imagens de outros sources, na primeira interação, quando você seta para state 1, sai do site e entra nele novamente, o FavIcon se torna a empty PNG. Isso acontecia quando não havia a validação. Quando eu a implementei, isso parou.**

**Meu melhor palpite é que ao sair do site com os href's alterados, o Browser armazena o empty.png. Ao carregar de novo, o Icon salvo é carregado. No Background, o Icon retornado é o empty.png. Já o Icon é a URL original. Pela minha validação, eu já tenho Icon na memória e o retorno é empty. O Usuário já entrou na página uma vez, então ele ignora os dois e volta o ícone original.**

**Minha esperança é identificar os sites bugados e dar uma "passe livre" a eles. Assim, no Background, ocorre o update dos links, o site vai *refuse to use it* como fallback, recorrerá ao ícone salvo, que mal sabe ele que é o mesmo.**

**Existem alguns *gaps* na minha teoria. Se o site aceita "self" apenas, como ele usa o guardado e dá certo?. No mínimo, era undefined, não? Sim! Isso que pensei. Mas acho que ocorre uma sobreposição. Não é o site que fica com o FavIcon, é o Browser que sobrepõe o que o usuário está vendo. Eu não conheço 100% o CSP para afirmar nada, porém preciso achar uma solução para esse Bug e irei me basear nesta teoria.**
