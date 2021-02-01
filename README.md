# Favicon-Manager
**Esta é uma extensão que funciona em navegadores baseados em Chromium. Sua principal funcionalidade é esconder os FavIcons de WebSites.**  

**Mais funcionalidades estão por vir! Ela funciona em conjunto com o tema [Node Clean.]() Dê uma olhada sobre o que ele se trata e então entenderá o propósito desta extensão.** 

# A Extensão  
**Seu funcionamento é bem simples explicando através de linguagem natural, porém um pouco mais complicado no código devido à quantidade pequenos detalhes que existem.**
**Para desenvolvê-la, utilizei a API tabs do Chrome e JavaScript Puro. Bem simples! É claro que seu propósito *é* ser simples. Por isso a sua UI é minimalista. Possui apenas dois botões que são usados para esconder e mostrar o FavIcon.**

**Eu me diverti e aprendi _MUITO_ desenvolvendo-a. Para se ter uma ideia, nunca tinha escrito um JSON antes, usado uma API e muito menos escrito contruído uma extensão. Não conhecia o [Content Security Policy]() e passei em torno de 7 dias, aprendendo como tudo isso funcionava até chegar nessa versão beta.**

**É claro, não é porque é beta, que está incompleta. Sua premissa inicial era simplesmente esconder os FavIcons. Quero melhorá-la e torná-la "Completa". Aliás, esse foi o meu primeiro projetinho.**

# Considerações

**Antes de explicar seu funcionamento, gostaria de fazer algumas considerações. Tive um trabalho _imenso_ ao desenvolvê-la. Como eu disse, eu não sabia de praticamente nada. A minha maior dificuldade foi achar fontes de informação. Eu sei, o [developer.chrome.com]() é o site oficial e oferece vários guias, mas eles não são práticos.**  

**Então me encontrei tendo que vasculhar a internet, utilizando tentativa e erro para ver o que funcionava e o que não. Se eu não tivesse perdido praticamente uns 4 dias apenas pesquisando, teria feito isto em muito menos tempo. Por outro lado, isso contribuiu em níveis inimagináveis para meu conhecimento e não me arrependendo.**

**Entretanto, dexarei tudo o que eu descobri nesse desenvolvimento nas issues, assim como as fontes de onde eu tirei as informações - Sim, eu salvei todas com medo de perdê-las. Dê uma olhada também no [JS-Runner](). Lá, eu conto um pouco mais do porquê quis começar a criar extensões**

---

# O Código

**Nessa seção, falarei um pouco de como o meu script funciona. Pedacinho por pedacinho. Gostaria de ressaltar que sou bem iniciante - Nunca ter escrito um JSON deixou isso bem claro. Por isso, as minhas soluções podem ser ineficientes e com certeza, devem existir melhores.**

**Entretanto, me dediquei ao máximo. Mais tarde, falarei sobre os Bugs que encontrei, como os resolvi e sobre os que eu ainda não resolvi. Não me esquecerei do meu arquivo JSON, que pode ser útil se você não sabe como a estrutura dele funciona**

## Background

**Um arquivo background em uma extensão é aquele que roda, obviamente, em plano de fundo. Nesses arquivos, você pode colocar listeners que escutam por _Browser Triggers_ ou _events._ Eventos no Browser são, por exemplo - criação de uma Tab, atualização de uma, requests que você faz, dentre vários outros.**

**Depois de várias versões que estavam uma bagunça, decidi fazer alguns módulos que me ajudariam. Porém, não achei uma maneira mais prática de utilizá-los no meu arquivo Background do que usar _import().then()_. Confesso que ficou um pouco bagunçado. Entretanto, aqueles módulos foram _SUPER ÚTEIS_ para refatoração do meu código.**

**Uma coisa que não mencionei ainda foi que estou usando o localStorage guardar os meus dados, que neste caso, cada site válido que o usuário entrar. Digo válido, pois alguns não permitem a execução de scripts e trocar imagens através do [Content Security Policy]() ou simplesmente são URLs proibidas como as que começam com `edge://`,`file://`,`chrome://` e a Chrome Web Store**

**Aliás, isso ainda não foi implementado. Existe um bug que me permite burlar o Content Security Policy e executar um Script na página que descobri ao acaso. Não entendo como ele funciona, mas estou tentando implementar outro fallback que automaticamente corrigi o erro e avisa ao usuário que existe um problema.**

**A segunda coisa que o Script faz é buscar algumas informações que ele precisa, verificando se o usuário já entrou naquela Tab antes. Ele faz isso dando match nas keys do localStorage e comparando com a requiredUrl de um site - protocol://subdomain?.domain.gtld?.tld?/**

**Eu realmente não sei como a primeira parte da URL se chama, então criei este nome. Vi que alguns a chamam de URL Rule, mas descobri isso após bom tempo.**

**Seguindo a diante temos uma Promise itera pelo HTML utilizando o `chrome.tabs.executeScript()` em busca do primeiro `<link rel='icon'>` que encontrar. `chrome.tabs.query({...}, () => {...})` retorna um favIcon, mas nem sempre. Por isso, preciso que um ícone qualquer seja pego como fallback. Se a Promise for rejeitada, sei que o CSP não me deixa executar o Script na página.**

---

**A partir daqui temos 4 caminhos a serem seguidos:**

- **O FavIcon é valido e o usuário já esteve na página antes: Neste caso, precisamos atualizar o FavIcon que está em memória. isto porque, alguns sites como [developer.mozilla.com]() alteram seu FavIcon conforme a página que você está.**

- **O FavIcon é válido e o usuário nunca esteve na página antes: Neste caso, devemos criar um novo objeto na memória para o site e utilizar como FavIcon, a url encontrada.**

- **O FavIcon é inválido e o usuário já esteve na página antes: Neste caso, apenas ignoramos. Se foi encontrado um objeto na memória, existe um FavIcon relacionado a ele que podemos usar, por isso, apenas o desconsideramos.**

- **O FavIcon é inválido e o usuário nunca esteve na página antes: Neste caso, estamos diante de um site com o Bug Master. Por que esse nome? Porque eu quis. Exemplos de site com este Bug: Amazon, os artigos da MDN - Não a Home, www.evernote.com**

---

### O que faz um FavIcon ser válido?

**Na Primeira vez que você entra em um site, é esperado que ele me retorne um FavIcon. Quando isso acontece, não existe outro na memória, pois esta é a primeira navegamos. Já quando lidamos com sites como a MDN, que alteram seu FavIcon durante a navegação, precisamos atualizá-lo novamente. Mas isso não é necssário quando o mesmo FavIcon já se encontra na memória.**

**Entretanto, por conta do Browser, existe a possibilidade de que este FavIcon retornado seja a imagem PNG que estou usando para esconder o ícone. Pode ter passado na sua cabeça: "Ah! É só usar o que você encontrou com a Promise." Sim. Porém, o Browser me dá o FavIcon demensionado para o monitor da pessoa. É preferível isto a pegar um 16x16, por exemplo.**

**O Retorno da imagem PNG ocorre quando o usuário escondeu o FavIcon e saiu do site. Isso deixa a última imagem chacheada no Browser. Preste atenção nessa frase. Além disso, quando o site não tem FavIcon, tudo que eu tentar me retorna undefined.**

**Neste caso, até poderíamos esconder o ícone e retorná-lo ao estado anterior. Mas isto significaria criar mais uma condiconal. É melhor deixar as coisas assim.**

**Recapitulando: Para um ícone ser válido, ele precisa:**

1. **Ser diferente do FavIcon que está na memória - chamado de original.**
1. **Ser diferente da imagem PNG que estou usando - chamada de empty.**
1. **Ser diferente de Undefined.**

---

### O que é este tal de Bug Master?

**Venho falando dele há um tempinho. Ele ocorre quando o usuário nunca entrou no site antes e o FavIcon não é válido. Ele apenas ocorre na primeiríssima interação com um site em um dispositivo. Existem sites que não possuem uma tag que dá match com a minha RegExp - `/shortcut icon|icon/gi`.**

**Além disso, o Browser não me retorna nenhum ícone... Da primeira vez. Pelo que percebi, o Browser, de alguma forma mágica, tem acesso a qualquer FavIcon e os guarda em algum lugar para ser carregado de forma mais rápida na segunda interação e para eventualmente ser utilizado nos bookmarks. Toda vez que este ícone é alterado, o Browser altera o guardado.**

**Por este motivo, minha imagem PNG às vezes é retornada. No instante que você carrega o site, após ter saído com o ícone alterado, com o intuito de carregar mais rápido, o Browser puxa o favIcon que está guardado - A Imagem PNG. Isso faz com que meu script se confunda. Nesses casos, o FavIcon caí como inválido e como não há objeto em memória, caímos no erro.**

**Essa é uma das poucas vezes que um erro ocorre. Como resolvê-lo? Incrivelmente, recaregando a página. Na segunda interação, o FavIcon retornado é o correto. Mas porque este Bug é Master? Simplesmente pelo fato de eu ter passado mais de 2 dias tentando entender como ele ocorria e como resolvê-lo. Escrevendo aqui, faz o parecer simples. Mas acredite que foi um sofrimento gigantesco.**

## O Popup














