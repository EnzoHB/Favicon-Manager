const regX = /.+?:\/\/.+?\//;
const enzo = regX.exec('https://github.com/EnzoHB/Favicon-Manager/tree/main/favicon-manager');

console.log(enzo[0]);