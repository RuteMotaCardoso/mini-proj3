const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonFilePath = __dirname + "/../assets/";
const jsonMessages = require(jsonMessagesPath + "bd");
const connect = require('../config/connectMySQL');

// https://stackabuse.com/reading-and-writing-json-files-with-node-js/
const fs = require('fs');

function read(req, res) {
    fs.readFile(jsonFilePath + 'membrosComissao.json', (err, data) => {
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
    const idMembro = req.sanitize('id').escape();
    const post = { idMembro: idMembro };
    fs.readFile(jsonFilePath + 'membrosComissao.json', (err, data) => {
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
                let posId = rowArray.rows.findIndex(x => x.idMembro == idMembro)
                console.log(`Registo ${idMembro} lido com sucesso`);
                res.send(rowArray.rows[posId]);
            }
        }
    });
}


function save(req, res) {
    console.log(req.body);
    const nome = req.sanitize('nome').escape();
    const instituto = req.sanitize('instituto').escape();
    const pais = req.sanitize('pais').escape();
    req.checkBody("nome", "Insira apenas texto").matches(/^[a-zÀ-ú ]+$/i);
    req.checkBody("instituto", "Insira apenas texto").matches(/^[a-zÀ-ú ]+$/i);
    req.checkBody("pais", "Insira apenas texto").matches(/^[A-zÀ-ú ]+$/i);
    const errors = req.validationErrors();    
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (nome != "NULL" && pais != "NULL" && typeof(nome) != "undefined") {
            const post = { idMembro: 0, nome: nome, instituto: instituto, pais: pais, active: 1 };
            fs.readFile(jsonFilePath + 'membrosComissao.json', (err, dataRead) => {
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
                           return parseInt(b['idMembro']) - parseInt(a['idMembro']);
                        }
                      )[0]['idMembro'];

                    let idMembro = maxId + 1;
                    post['idMembro'] = idMembro;
                    //console.log(maxId+1);
                    rowArray.rows.push(post);
                    //console.log(rowArray.rows);
                    let dataWrite = JSON.stringify(rowArray, null, 2);
                    fs.writeFile(jsonFilePath + 'membrosComissao.json', dataWrite, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                        }
                        else {
                            console.log(`Registo ${idMembro} inserido com sucesso`);
                            res.status(jsonMessages.db.successInsert.status).location(rowArray.rows.idMembro).send(jsonMessages.db.successInsert);
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
    const instituto = req.sanitize('instituto').escape();
    const pais = req.sanitize('pais').escape();
    const idMembro = req.sanitize('id').escape();
    req.checkBody("nome", "Insira apenas texto").matches(/^[a-zÀ-ú ]+$/i);
    req.checkBody("instituto", "Insira apenas texto").matches(/^[a-zÀ-ú ]+$/i);
    req.checkBody("pais", "Insira apenas texto").matches(/^[A-zÀ-ú ]+$/i);
    req.checkParams("id", "Insira um ID de MembroComissao válido").isNumeric();
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (idMembro != "NULL" && typeof(nome) != 'undefined' &&  typeof(idMembro) != 'undefined') {
            const post = { idMembro: 0, nome: nome, instituto: instituto, pais: pais, active: 1 };
            fs.readFile(jsonFilePath + 'membrosComissao.json', (err, dataRead) => {
                if (err) {
                    console.log(err);
                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                }
                else {
                    let rowArray = JSON.parse(dataRead);
                    //console.log(post);

                    post['idMembro'] = parseInt(idMembro);
                    let posEditar = rowArray.rows.findIndex(i => i.idMembro == idMembro)
                    rowArray.rows[posEditar] = post;
                    //console.log(rowArray.rows);
                    let dataWrite = JSON.stringify(rowArray, null, 2);
                    fs.writeFile(jsonFilePath + 'membrosComissao.json', dataWrite, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                        }
                        else {
                            console.log(`Registo ${idMembro} atualizado com sucesso`);
                            res.status(jsonMessages.db.successUpdate.status).location(rowArray.rows.idMembro).send(jsonMessages.db.successUpdate);
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
    const idMembro = req.sanitize('id').escape();
    console.log(idMembro);
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (idMembro != "NULL" && typeof(idMembro) != 'undefined') {
            fs.readFile(jsonFilePath + 'membrosComissao.json', (err, dataRead) => {
                if (err) {
                    console.log(err);
                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                }
                else {
                    let rowArray = JSON.parse(dataRead);
                    //console.log(post);

                    let posEditar = rowArray.rows.findIndex(i => i.idMembro == idMembro);
                    rowArray.rows[posEditar]['active'] = 0;
                    console.log(rowArray.rows[posEditar]);
                    //console.log(rowArray.rows);
                    let dataWrite = JSON.stringify(rowArray, null, 2);
                    fs.writeFile(jsonFilePath + 'membrosComissao.json', dataWrite, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                        }
                        else {
                            console.log(`Registo ${idMembro} desativado com sucesso`);
                            res.status(jsonMessages.db.successDelete.status).location(rowArray.rows.idMembro).send(jsonMessages.db.successDelete);
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
    const idMembro = req.sanitize('id').escape();
    console.log(idMembro);
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (idMembro != "NULL" && typeof(idMembro) != 'undefined') {
            fs.readFile(jsonFilePath + 'membrosComissao.json', (err, dataRead) => {
                if (err) {
                    console.log(err);
                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                }
                else {
                    let rowArray = JSON.parse(dataRead);
                    //console.log(post);

                    let posApagar = rowArray.rows.findIndex(i => i.idMembro == idMembro);
                    if (posApagar >= 0) {
                        console.log(rowArray.rows[posApagar]);
                        rowArray.rows.splice(posApagar, 1)
                    }
                    //console.log(rowArray.rows);
                    let dataWrite = JSON.stringify(rowArray, null, 2);
                    fs.writeFile(jsonFilePath + 'membrosComissao.json', dataWrite, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                        }
                        else {
                            console.log(`Registo ${idMembro} apagado com sucesso`);
                            res.status(jsonMessages.db.successDeleteU.status).location(rowArray.rows.idMembro).send(jsonMessages.db.successDeleteU);
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
