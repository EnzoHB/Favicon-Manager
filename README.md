# Favicon-Manager
 Esta é uma extensão que funciona em navegadores baseados em Chromium. Sua principal funcionalidade é esconder os FavIcons de todos os WebSites. Mais funcionalidades virão! Quero dar um tempo, pois estou trabalhando nela por mais de 7 dias seguidos. Ela funciona em conjunto com o tema Node Clean - Que eu também fiz nesses 7 dias! Dê uma olhada sobre o que ele se trata e então entenderá o propósito desta extensão.  
 Sério, eu aprendi uma monte de coisas novas! Tive que realmente me esforçar, passei por incontáveis bugs, mas nada me fez desistir. Eu gostaria de contar toda a minah jornada fazendo essa extensão! Contar como ela funciona, alguns truques que aprendi no caminho e sei que isso definitivamente vai ajudar algumas pessoas.  
 Algumas considerações:
 Eu sou um completo iniciante. Basicamente só sei JavaScript, o básico de HTML e o mínimo do básico sobre CSS. Mas ainda sim, me esforço. Eu nunca tinha criado uma extensão antes, não sabia praticamente de nada! Aliás, para piorar a minha situação, me deparei com algumas informações erradas na própria documentação do Chrome que me fizeram dar voltas e não sair do lugar. Voltando a falar sobre a minha inexperiência, eu nunca tinha usado uma API antes. Eu sabia o que era, mas nunca tiha visto alguém usar e muito menos usado uma. Comecei do puro zero. Esqueci de mencionar que nunca tinha usado ES6 Modules e achei que poderia usar require() no navegador. Se por um acaso, você está lendo isso e se encontra nessa situação - Isso definitivamente é para você.
 Não só cobrirei todos os Bugs e dificuldades que enfrentei no caminho, como também minhas observações e soluções para os problemas. Espero muito, muito mesmo que alguém possa me ajudar a melhorar meus scripts. Existem ainda alguns bugs sem solução que eu provavelmente corrigirei no futuro.
 Ah! Durante as minhas intermináveis pesquisas, percebi que a search do Google busca informações nas issues do GitHub. Então por isso, a maioria das minhas observações estarão por lá.
 Antes de contar sobre a minha jornada gostaria de contar como a extensão funciona - É bem simples explicando através de linguagem natural, porém um pouco mais complicado no código devido à quantidade de exceções que isso tem.
 Toda vez que você abre uma Tab, o script procura pela Url da página - mais especificamente a requiredURL, como eu chamei. Eu realmente não sei o nome específico da primeira parte da URL. Vi que alguns chamam de url rule, mas só descobri isso muito tempo depois de começar.
Basicamente, é uma regular expression que dá match no protocolo://subdomain.domain.gtld.tld/ - logo, a requiredURL de https://mail.google.com/mail/u/0/#inbox seria https://mail.google.com/;
 Depois que o script já está com a URL dentro de uma variável, ele itera pelo localStorage - Uma espécie de instância da class Map que fica guardada na memória do navegador - procurando por essa URL. A partir daqui existem 4 casos possíveis, mas afim de encurtar a nossa história, iremos considerar apenas 2. O Primeiro caso é que ele não encontrou essa URL na memória e por isso, coloca um objeto stringfied contendo algumas informações importantes que usaremos mais para frente dentro de LocalStorage. O Segundo caso é que ele encontrou essa URL na memória. Uma vez que isso ocorra, ele puxa esse objeto e verifica o seu "state". Se o state for 0, ele não faz absolutamente nada. Do contrário, ele modifica o FavIcon do site. Simples! Este é o arquivo que roda 24h por dia enquanto o navegador estiver aberto. Ele é chamado background.
 Agora, partimos para a User Interface.
 
