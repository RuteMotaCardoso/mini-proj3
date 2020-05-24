const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonFilePath = __dirname + "/../assets/";
const jsonMessages = require(jsonMessagesPath + "bd");
const connect = require('../config/connectMySQL');

// https://stackabuse.com/reading-and-writing-json-files-with-node-js/
const fs = require('fs');

function read(req, res) {
    fs.readFile(jsonFilePath + 'tipoTarefas.json', (err, data) => {
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
    const idTipoTarefa = req.sanitize('id').escape();
    const post = { idTipoTarefa: idTipoTarefa };
    fs.readFile(jsonFilePath + 'tipoTarefas.json', (err, data) => {
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
                let posId = rowArray.rows.findIndex(x => x.idTipoTarefa == idTipoTarefa)
                console.log(`Registo ${idTipoTarefa} lido com sucesso`);
                res.send(rowArray.rows[posId]);
            }
        }
    });
}


function save(req, res) {
    console.log(req.body);
    const tipo = req.sanitize('tipo').escape();
    const cor = req.sanitize('cor').escape();
    req.checkBody("tipo", "Insira apenas texto").matches(/^[A-zÀ-ú ]+$/i);
    const errors = req.validationErrors();    
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (tipo != "NULL" && typeof(tipo) != "undefined") {
            const post = { idTipoTarefa: 0, tipo: tipo, cor: cor, active: 1 };
            fs.readFile(jsonFilePath + 'tipoTarefas.json', (err, dataRead) => {
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
                           return parseInt(b['idTipoTarefa']) - parseInt(a['idTipoTarefa']);
                        }
                      )[0]['idTipoTarefa'];

                    let idTipoTarefa = maxId + 1;
                    post['idTipoTarefa'] = idTipoTarefa;
                    //console.log(maxId+1);
                    rowArray.rows.push(post);
                    //console.log(rowArray.rows);
                    let dataWrite = JSON.stringify(rowArray, null, 2);
                    fs.writeFile(jsonFilePath + 'tipoTarefas.json', dataWrite, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                        }
                        else {
                            console.log(`Registo ${idTipoTarefa} inserido com sucesso`);
                            res.status(jsonMessages.db.successInsert.status).location(rowArray.rows.idTipoTarefa).send(jsonMessages.db.successInsert);
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
    const tipo = req.sanitize('tipo').escape();
    const cor = req.sanitize('cor').escape();
    const idTipoTarefa = req.sanitize('id').escape();
    req.checkBody("tipo", "Insira apenas texto").matches(/^[a-zÀ-ú ]+$/i);
    req.checkParams("id", "Insira um ID de Tipo Tarefa válido").isNumeric();
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (idTipoTarefa != "NULL" && typeof(tipo) != 'undefined' && typeof(idTipoTarefa) != 'undefined') {
            const post = { idTipoTarefa: 0, tipo: tipo, cor: cor, active: 1 };
            fs.readFile(jsonFilePath + 'tipoTarefas.json', (err, dataRead) => {
                if (err) {
                    console.log(err);
                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                }
                else {
                    let rowArray = JSON.parse(dataRead);
                    //console.log(post);

                    post['idTipoTarefa'] = parseInt(idTipoTarefa);
                    let posEditar = rowArray.rows.findIndex(i => i.idTipoTarefa == idTipoTarefa)
                    rowArray.rows[posEditar] = post;
                    //console.log(rowArray.rows);
                    let dataWrite = JSON.stringify(rowArray, null, 2);
                    fs.writeFile(jsonFilePath + 'tipoTarefas.json', dataWrite, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                        }
                        else {
                            console.log(`Registo ${idTipoTarefa} atualizado com sucesso`);
                            res.status(jsonMessages.db.successUpdate.status).location(rowArray.rows.idTipoTarefa).send(jsonMessages.db.successUpdate);
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
    const idTipoTarefa = req.sanitize('id').escape();
    console.log(idTipoTarefa);
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (idTipoTarefa != "NULL" && typeof(idTipoTarefa) != 'undefined') {
            fs.readFile(jsonFilePath + 'tipoTarefas.json', (err, dataRead) => {
                if (err) {
                    console.log(err);
                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                }
                else {
                    let rowArray = JSON.parse(dataRead);
                    //console.log(post);

                    let posEditar = rowArray.rows.findIndex(i => i.idTipoTarefa == idTipoTarefa);
                    rowArray.rows[posEditar]['active'] = 0;
                    console.log(rowArray.rows[posEditar]);
                    //console.log(rowArray.rows);
                    let dataWrite = JSON.stringify(rowArray, null, 2);
                    fs.writeFile(jsonFilePath + 'tipoTarefas.json', dataWrite, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                        }
                        else {
                            console.log(`Registo ${idTipoTarefa} desativado com sucesso`);
                            res.status(jsonMessages.db.successDelete.status).location(rowArray.rows.idTipoTarefa).send(jsonMessages.db.successDelete);
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
    const idTipoTarefa = req.sanitize('id').escape();
    console.log(idTipoTarefa);
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (idTipoTarefa != "NULL" && typeof(idTipoTarefa) != 'undefined') {
            fs.readFile(jsonFilePath + 'tipoTarefas.json', (err, dataRead) => {
                if (err) {
                    console.log(err);
                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                }
                else {
                    let rowArray = JSON.parse(dataRead);
                    //console.log(post);

                    let posApagar = rowArray.rows.findIndex(i => i.idTipoTarefa == idTipoTarefa);
                    if (posApagar >= 0) {
                        console.log(rowArray.rows[posApagar]);
                        rowArray.rows.splice(posApagar, 1)
                    }
                    //console.log(rowArray.rows);
                    let dataWrite = JSON.stringify(rowArray, null, 2);
                    fs.writeFile(jsonFilePath + 'tipoTarefas.json', dataWrite, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                        }
                        else {
                            console.log(`Registo ${idTipoTarefa} apagado com sucesso`);
                            res.status(jsonMessages.db.successDeleteU.status).location(rowArray.rows.idTipoTarefa).send(jsonMessages.db.successDeleteU);
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
