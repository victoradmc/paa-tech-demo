# Paa Tech Demo

Este projeto foi criado com [Angular CLI](https://github.com/angular/angular-cli) na versão 17.3.16 por sua compatibilidade com PrimeBlocks v17.x

# Como executar em ambiente local

## Pré-requisitos
Para rodar esse Tech-Demo em ambiente local, você precisará:

- [NodeJS v20 ou superior](https://nodejs.org/en/blog/release/v22.17.1). Neste link você poderá fazer o download de acordo com seu sistema operacional. A versão 22.17.1 é recomendada por estar em LTS e ser uma versão indicada para desenvolvimento (par). Ao instalar o Node, você também instalará o NPM.

- Angular CLI, o Command Line Interface do Angular. Você pode obtê-lo após instalar o NodeJS e o NPM simplesmente rodando o comando abaixo:

```
npm install -g @angular/cli
```

Para ler mais sobre o Angular CLI, você pode acessar (este link)[https://angular.dev/tools/cli/setup-local]

## Executando o projeto
Após instalar o NodeJS, NPM e o Angular CLI siga os passos abaixo:

- Clone este repistório;
- Navegue até a pasta do projeto, onde o arquivo package.json se encontra;
- Execute o comando ```npm install``` para instalar todas as dependências e criar a pasta node_modules;
- Após todas as dependências instaladas, execute o comando ```ng serve```para subir o serviço na porta 4200 (padrão do Angular);
- Acesse (http://localhost:4200)[http://localhost:4200]

## Possíveis problemas

### ng: command not found
- Se o Angular CLI não estiver instalado globalmente, você verá e mensagem ```ng: command not found``` ao tentar executar o ```ng serve```. Para verificar a instalação, use ```npm list -g @angular/cli``` e para corrigir um possível problema de configuração reinstalando através do comando ```npm install -g @angular/cli```

### Windows PATH
- É recomendado, caso o ambiente seja uma máquina Windows, que o sistema operacional seja reiniciado após a instalação do Node e do Angular CLI para que as devidas variáveis sejam adicionadas ao PATH do Windows.


### Permissões em sistema UNIX
- Ao instalar o Angular CLI, é necessário rodar permissões como superuser / root: ```sudo npm install -g @angular/cli```

