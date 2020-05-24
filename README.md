Disponível em 

# Tarefa 4.2

## Tarefas realizadas
Foram realizadas as seguintes tarefas e feitos os ajustes necessários:
* npm init (para o projeto de BackEnd)
* Instalar Express (npm install express --save)
* Executar o servidor (node server.js) que devolveu erro por não ter todos os módulos instalados
    * Cannot find module 'cors'
* Instalação dos módulos em falta:
    * npm install cors
    * npm install mysql
    * npm install nodemailer
    * npm install nodemailer-smtp-transport
    * npm install cookie-parser
    * npm install passport 
    * npm install express-session
    * npm install express-sanitizer
    * npm install sequelize
    * npm install express-validator
    * npm install bcrypt-nodejs
    * npm install passport-local
* No frontend mudou-se o urlBase dos javascript's para localhost (127.0.0.1:8080), endereço onde o backend está a executar (definido em server.js)
* Foram criados os javascript's correspondentes a cada entidade, nomeadamente: 
    * voluntarios.controller.js
    * comissao.controller.js
    * tarefas.controller.js
    * tipoTarefas.controller.js
* Foram adicionados os controladores e respetivas rotas ao ficheiro main.route.js (na diretoria routes)
* Estes controladores têm os mesmos métodos existentes em speaker.controller.js, mas acedem localmente ao respetivo ficheiro json (na pasta assets). Os métodos implementados são: 
    * read
    * readID
    * save
    * update
    * deleteF (desativa o registo)
    * deleteL (apaga o registo)
* De referir que os ficheiros json criados para simular a base de dados, são:
    * voluntarios.json
    * membrosComissao.json
    * tarefas.json
    * tipoTarefas.json
    * NOTA: ao editar estes ficheiros com o notepad, os mesmos deixam de poder ser lidos pelo parse de Json pois o notepad altera o formato para *UTF-8 with BOM*
 