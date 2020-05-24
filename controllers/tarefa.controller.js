const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonFilePath = __dirname + "/../assets/";
const jsonMessages = require(jsonMessagesPath + "bd");
const connect = require('../config/connectMySQL');

// https://stackabuse.com/reading-and-writing-json-files-with-node-js/
const fs = require('fs');

function read(req, res) {
    fs.readFile(jsonFilePath + 'tarefas.json', (err, data) => {
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            let rowArray = JSON.parse(data);
            console.log(rowArray.rows.length);
            if (rowArray.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                console.log(`${rowArray.rows.length} Registos lidos com sucesso`);
                res.send(rowArray.rows);
            }
        }
    });
}

function readID(req, res) {
    const idTarefa = req.sanitize('id').escape();
    const post = { idTarefa: idTarefa };
    fs.readFile(jsonFilePath + 'tarefas.json', (err, data) => {
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            let rowArray = JSON.parse(data);
            console.log(rowArray.rows.length);
            if (rowArray.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                let posId = rowArray.rows.findIndex(x => x.idTarefa == idTarefa)
                console.log(`Registo ${idTarefa} lido com sucesso`);
                res.send(rowArray.rows[posId]);
            }
        }
    });
}


function save(req, res) {
    console.log(req.body);
    const nome = req.sanitize('nome').escape();
    const data = req.sanitize('data').escape();
    const duracao = req.sanitize('duracao').escape();
    const voluntario = req.sanitize('voluntario').escape();
    const tipo = req.sanitize('tipo').escape();
    req.checkBody("nome", "Insira apenas texto").matches(/^[a-zÀ-ú ]+$/i);
    req.checkBody("data", "Insira uma data.").matches(/^\d{4}-\d{2}-\d{2}$/);
    req.checkBody("voluntario", "Insira apenas texto").matches(/^[A-zÀ-ú ]+$/i);
    req.checkBody("tipo", "Insira apenas texto").matches(/^[A-zÀ-ú ]+$/i);
    const errors = req.validationErrors();    
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (nome != "NULL" && voluntario != "NULL" && typeof(nome) != "undefined") {
            const post = { idTarefa: 0, nome: nome, data: data, duracao: duracao,  voluntario: voluntario, tipo: tipo, active: 1 };
            fs.readFile(jsonFilePath + 'tarefas.json', (err, dataRead) => {
                if (err) {
                    console.log(err);
                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                }
                else {
                    console.log(post);
                    //console.log(dataRead);
                    let rowArray = JSON.parse(dataRead);
                    var maxId = rowArray.rows.sort( 
                        function(a, b) {
                           return parseInt(b['idTarefa']) - parseInt(a['idTarefa']);
                        }
                      )[0]['idTarefa'];

                    let idTarefa = maxId + 1;
                    post['idTarefa'] = idTarefa;
                    //console.log(maxId+1);
                    rowArray.rows.push(post);
                    //console.log(rowArray.rows);
                    let dataWrite = JSON.stringify(rowArray, null, 2);
                    fs.writeFile(jsonFilePath + 'tarefas.json', dataWrite, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                        }
                        else {
                            console.log(`Registo ${idTarefa} inserido com sucesso`);
                            res.status(jsonMessages.db.successInsert.status).location(rowArray.rows.idTarefa).send(jsonMessages.db.successInsert);
                        }
                    });
                }
            });
        }
        else
            res.status(jsonMessages.db.requiredData.status).end(jsonMessages.db.requiredData);
    }
}

function update(req, res) {
    //console.log(req.body);
    const nome = req.sanitize('nome').escape();
    const data = req.sanitize('data').escape();
    const duracao = req.sanitize('duracao').escape();
    const voluntario = req.sanitize('voluntario').escape();
    const tipo = req.sanitize('tipo').escape();
    const idTarefa = req.sanitize('id').escape();
    req.checkBody("nome", "Insira apenas texto").matches(/^[a-zÀ-ú ]+$/i);
    req.checkBody("data", "Insira uma data.").matches(/^\d{4}-\d{2}-\d{2}$/);
    req.checkBody("voluntario", "Insira apenas texto").matches(/^[A-zÀ-ú ]+$/i);
    req.checkParams("id", "Insira um ID de Tarefa válido").isNumeric();
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (idTarefa != "NULL" && typeof(nome) != 'undefined' && typeof(idTarefa) != 'undefined') {
            const post = { idTarefa: 0, nome: nome, data: data, duracao: duracao, voluntario: voluntario, tipo: tipo, active: 1 };
            fs.readFile(jsonFilePath + 'tarefas.json', (err, dataRead) => {
                if (err) {
                    console.log(err);
                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                }
                else {
                    let rowArray = JSON.parse(dataRead);
                    //console.log(post);

                    post['idTarefa'] = parseInt(idTarefa);
                    let posEditar = rowArray.rows.findIndex(i => i.idTarefa == idTarefa)
                    rowArray.rows[posEditar] = post;
                    //console.log(rowArray.rows);
                    let dataWrite = JSON.stringify(rowArray, null, 2);
                    fs.writeFile(jsonFilePath + 'tarefas.json', dataWrite, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                        }
                        else {
                            console.log(`Registo ${idTarefa} atualizado com sucesso`);
                            res.status(jsonMessages.db.successUpdate.status).location(rowArray.rows.idTarefa).send(jsonMessages.db.successUpdate);
                        }
                    });
                }
            });
        }
        else
            res.status(jsonMessages.db.requiredData.status).end(jsonMessages.db.requiredData);
    }
}

function deleteL(req, res) {
    //console.log(req.body);
    const idTarefa = req.sanitize('id').escape();
    console.log(idTarefa);
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (idTarefa != "NULL" && typeof(idTarefa) != 'undefined') {
            fs.readFile(jsonFilePath + 'tarefas.json', (err, dataRead) => {
                if (err) {
                    console.log(err);
                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                }
                else {
                    let rowArray = JSON.parse(dataRead);
                    //console.log(post);

                    let posEditar = rowArray.rows.findIndex(i => i.idTarefa == idTarefa);
                    rowArray.rows[posEditar]['active'] = 0;
                    console.log(rowArray.rows[posEditar]);
                    //console.log(rowArray.rows);
                    let dataWrite = JSON.stringify(rowArray, null, 2);
                    fs.writeFile(jsonFilePath + 'tarefas.json', dataWrite, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                        }
                        else {
                            console.log(`Registo ${idTarefa} desativado com sucesso`);
                            res.status(jsonMessages.db.successDelete.status).location(rowArray.rows.idTarefa).send(jsonMessages.db.successDelete);
                        }
                    });
                }
            });
        }
        else
            res.status(jsonMessages.db.requiredData.status).end(jsonMessages.db.requiredData);
    }
}

function deleteF(req, res) {
    //console.log(req.body);
    const idTarefa = req.sanitize('id').escape();
    console.log(idTarefa);
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (idTarefa != "NULL" && typeof(idTarefa) != 'undefined') {
            fs.readFile(jsonFilePath + 'tarefas.json', (err, dataRead) => {
                if (err) {
                    console.log(err);
                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                }
                else {
                    let rowArray = JSON.parse(dataRead);
                    //console.log(post);

                    let posApagar = rowArray.rows.findIndex(i => i.idTarefa == idTarefa);
                    if (posApagar >= 0) {
                        console.log(rowArray.rows[posApagar]);
                        rowArray.rows.splice(posApagar, 1)
                    }
                    //console.log(rowArray.rows);
                    let dataWrite = JSON.stringify(rowArray, null, 2);
                    fs.writeFile(jsonFilePath + 'tarefas.json', dataWrite, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                        }
                        else {
                            console.log(`Registo ${idTarefa} apagado com sucesso`);
                            res.status(jsonMessages.db.successDeleteU.status).location(rowArray.rows.idTarefa).send(jsonMessages.db.successDeleteU);
                        }
                    });
                }
            });
        }
        else
            res.status(jsonMessages.db.requiredData.status).end(jsonMessages.db.requiredData);
    }
}


module.exports = {
    read: read,
    readID: readID,
    save: save,
    update: update,
    deleteL: deleteL,
    deleteF: deleteF,
};
