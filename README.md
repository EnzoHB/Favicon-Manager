# Favicon-Manager
**Esta é uma extensão que funciona em navegadores baseados em Chromium. Sua principal funcionalidade é esconder os FavIcons de WebSites.**  

**Mais funcionalidades estão por vir! Ela funciona em conjunto com o tema [Node Clean.]() Dê uma olhada sobre o que ele se trata e então entenderá o propósito desta extensão.** 

# A Extensão  
**Seu funcionamento é bem simples explicando através de linguagem natural, porém um pouco mais complicado no código devido à quantidade pequenos detalhes que existem.**
**Para desenvolvê-la, utilizei a API tabs do Chrome e JavaScript Puro. Bem simples! É claro que seu propósito *é* ser simples. Por isso a sua UI é minimalista. Possui apenas dois botões que são usados para esconder e mostrar o FavIcon.**

**Eu me diverti e aprendi _MUITO_ desenvolvendo-a. Para se ter uma ideia, nunca tinha escrito um JSON antes, usado uma API e muito menos escrito contruído uma extensão. Não conhecia o [Content Security Policy]() e passei em torno de 7 dias, aprendendo como tudo isso funcionava até chegar nessa versão beta.**

**É claro, não é porque é beta, que está incompleta. Sua premissa inical era simplesmente esconder os FavIcons. Quero melhorá-la e torná-la "Completa". Aliás, esse foi o meu primeiro "Projeto".**

# Considerações

**Antes de explicar seu funcionamento, gostaria de fazer algumas considerações. Tive um trabalho _imenso_ ao desenvolvê-la. Como eu disse, eu não sabia de praticamente nada. A minha maior dificuldade foi achar fontes de informação. Eu sei, o [developer.chrome.com]() é o site oficial e oferece vários guias, mas eles não são práticos.**  

**Então me encontrei tendo que vasculhar a internet, utilizando tentativa e erro para ver o que funcionava e o que não. Se eu não tivesse perdido praticamente uns 4 dias apenas pesquisando, teria feito isto em muito menos tempo. Por outro lado, isso contribuiu em níveis inimagináveis para meu conhecimento e não me arrependendo.**

**Entretanto, dexarei tudo o que eu descobri nesse desenvolvimento nas issues, assim como as fontes de onde eu tirei essas informações - Sim, eu salvei todas com medo de perdê-las. Dê uma olhada tambeém no [JS-Runner](). Lá, eu conto um pouco mais do porquê quis começar a criar extensões**

---

# O Código

**Nessa seção, falarei um pouco de como o meu script funciona. Pedacinho por pedacinho. Gostaria de ressaltar que sou bem iniciante - Nunca ter escrito um JSON deixou isso bem claro. Por isso, as minhas soluções podem ser ineficientes e com certeza, devem existir melhores.**

**Entretanto, me dediquei ao máximo. Mais tarde, falarei sobre os Bugs que encontrei, como os resolvi e sobre os que eu ainda não resolvi. Não me esquecerei do meu arquivo JSON, que pode ser útil se você não sabe como a estrutura dele funciona**

## Background

**Um arquivo background em uma extensão é aquele que roda, obviamente, em plano de fundo. Nesses arquivos, você pode colocar listeners que escutam por _Browser Triggers_ ou _events._ Eventos no Browser são, por exemplo - criação de uma Tab, atualização de uma Tab, requests que você faz dentre vários outros.**

**Entrando no meu arquivo Background, você se assusta. Eu realmente não encontrei uma maneira mais fácil do que usar vários `import().then()` no meu arquivo para utilizar os módulos que eu criei. Esses módulos foram _SUPER ÚTEIS_ para refatorar o meu código - a primeira versão estava tão _entangled_ que eu não sei explicar como que aquilo estava funcionando.**

**Essa cara dele:** 
```
import('/modules/set-extension-info.js').then(({setExtensionInfo}) => {
import('/modules/check-in-memory.js').then(({checkInMemory}) => {
import('/modules/change-favicon.js').then(({changeFavIcon}) => {
import('/modules/backup-favicon.js').then(({backupFavIcon}) => {
import('/modules/find-favicon.js').then(({findFavIcon}) => {
import('/modules/get-urls.js').then(({getURLs}) => {
import('/modules/unpack.js').then(({unpack}) => {
import('/modules/pack.js').then(({pack}) => {

setExtensionInfo({});

chrome.tabs.onCreated.addListener(tabCreated => {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, newTab) => {
        if (changeInfo.status === 'complete') {
```
**Eu sou meio pirado na questão de organização. Você perceberá que eu não sei indentar direito ainda. Não sigo padrões. Mas perceba os imports estão organizados em ordem decrescente.**

**Para entender o que cada módulo faz, devemos primeiro observar o que eu mencionei: _Events_. Em geral, todo o meu backgroudn possui uma responsabilidade: Detectar a criação de Tabs e salvá-las na memória. Ele também atualiza as página quando necessário e corrigirá alguns erros que ocorrem em determinados sites.**

**chrome.tabs é a maneira que você chama a API do Chrome. Nela você pode colocar alguns eventos como onCreated e onUpdated. onCreated sempre será disparado quando uma Tab for criada e onUpdated, sempre que uma Tab for atualizada.**

**Combinando isso com uma propriedade de changeInfo que indica quando a Tab terminou de carregar, logo temos que: Toda vez que uma Tab terminar de carregar, meu script roda.**

___Segundo o Chrome, uma Tab pode ganhar o status de complete e loading várias vezes durante uma request. Por isso, meu script é executado, em média 5 vezes por página. O que é estranho mais ajuda a corrigir um Bug específico que tratarei no final.___

**Meu módulo `setExtensionInfo()` não tem importãncia por agora então vamos deixar ele de lado. Seguindo adiante, possuímos a segunda parte do código:**

```
const extensionInfo = setExtensionInfo({}); 
const tab = newTab;

const urls = getURLs(tab); 
const response = checkInMemory(tab); 
const URLObject = unpack(response.requiredURL); 

    const empty = response.found? URLObject.empty: undefined;
    const original = response.found? URLObject.original: undefined; 
```
