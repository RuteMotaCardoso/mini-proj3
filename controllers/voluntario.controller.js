const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonFilePath = __dirname + "/../assets/";
const jsonMessages = require(jsonMessagesPath + "bd");
const connect = require('../config/connectMySQL');

// https://stackabuse.com/reading-and-writing-json-files-with-node-js/
const fs = require('fs');

function read(req, res) {
    fs.readFile(jsonFilePath + 'voluntarios.json', (err, data) => {
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
    const idVoluntario = req.sanitize('id').escape();
    const post = { idVoluntario: idVoluntario };
    fs.readFile(jsonFilePath + 'voluntarios.json', (err, data) => {
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
                let posId = rowArray.rows.findIndex(x => x.idVoluntario == idVoluntario)
                console.log(`Registo ${idVoluntario} lido com sucesso`);
                res.send(rowArray.rows[posId]);
            }
        }
    });
}


function save(req, res) {
    console.log(req.body);
    const nome = req.sanitize('nome').escape();
    const email = req.sanitize('email').escape();
    const habilitacao = req.sanitize('habilitacao').escape();
    const lingua = req.sanitize('lingua').escape();
    const cargo = req.sanitize('cargo').escape();
    const area = req.sanitize('area').escape();
    req.checkBody("nome", "Insira apenas texto").matches(/^[a-zÀ-ú ]+$/i);
    req.checkBody("cargo", "Insira apenas texto").matches(/^[a-zÀ-ú ]+$/i);
    req.checkBody("email", "Insira um url válido.").optional({ checkFalsy: true }).isURL();
    req.checkBody("lingua", "Insira apenas texto").matches(/^[A-zÀ-ú ]+$/i);
    const errors = req.validationErrors();    
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (nome != "NULL" && lingua != "NULL" && typeof(nome) != "undefined") {
            const post = { idVoluntario: 0, nome: nome, email: email, habilitacao: habilitacao,  lingua: lingua, area: area, cargo: cargo, active: 1 };
            fs.readFile(jsonFilePath + 'voluntarios.json', (err, dataRead) => {
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
                           return parseInt(b['idVoluntario']) - parseInt(a['idVoluntario']);
                        }
                      )[0]['idVoluntario'];

                    let idVoluntario = maxId + 1;
                    post['idVoluntario'] = idVoluntario;
                    //console.log(maxId+1);
                    rowArray.rows.push(post);
                    //console.log(rowArray.rows);
                    let dataWrite = JSON.stringify(rowArray, null, 2);
                    fs.writeFile(jsonFilePath + 'voluntarios.json', dataWrite, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                        }
                        else {
                            console.log(`Registo ${idVoluntario} inserido com sucesso`);
                            res.status(jsonMessages.db.successInsert.status).location(rowArray.rows.idVoluntario).send(jsonMessages.db.successInsert);
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
    const email = req.sanitize('email').escape();
    const habilitacao = req.sanitize('habilitacao').escape();
    const lingua = req.sanitize('lingua').escape();
    const cargo = req.sanitize('cargo').escape();
    const area = req.sanitize('area').escape();
    const idVoluntario = req.sanitize('id').escape();
    req.checkBody("nome", "Insira apenas texto").matches(/^[a-zÀ-ú ]+$/i);
    req.checkBody("cargo", "Insira apenas texto").matches(/^[a-zÀ-ú ]+$/i);
    req.checkBody("email", "Insira um url válido.").optional({ checkFalsy: true }).isURL();
    req.checkBody("lingua", "Insira apenas texto").matches(/^[A-zÀ-ú ]+$/i);
    req.checkParams("id", "Insira um ID de Voluntario válido").isNumeric();
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (idVoluntario != "NULL" && typeof(nome) != 'undefined' && typeof(cargo) != 'undefined' && typeof(idVoluntario) != 'undefined') {
            const post = { idVoluntario: 0, nome: nome, email: email, habilitacao: habilitacao,  lingua: lingua, area: area, cargo: cargo, active: 1 };
            fs.readFile(jsonFilePath + 'voluntarios.json', (err, dataRead) => {
                if (err) {
                    console.log(err);
                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                }
                else {
                    let rowArray = JSON.parse(dataRead);
                    //console.log(post);

                    post['idVoluntario'] = parseInt(idVoluntario);
                    let posEditar = rowArray.rows.findIndex(i => i.idVoluntario == idVoluntario)
                    rowArray.rows[posEditar] = post;
                    //console.log(rowArray.rows);
                    let dataWrite = JSON.stringify(rowArray, null, 2);
                    fs.writeFile(jsonFilePath + 'voluntarios.json', dataWrite, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                        }
                        else {
                            console.log(`Registo ${idVoluntario} atualizado com sucesso`);
                            res.status(jsonMessages.db.successUpdate.status).location(rowArray.rows.idVoluntario).send(jsonMessages.db.successUpdate);
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
    const idVoluntario = req.sanitize('id').escape();
    console.log(idVoluntario);
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (idVoluntario != "NULL" && typeof(idVoluntario) != 'undefined') {
            fs.readFile(jsonFilePath + 'voluntarios.json', (err, dataRead) => {
                if (err) {
                    console.log(err);
                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                }
                else {
                    let rowArray = JSON.parse(dataRead);
                    //console.log(post);

                    let posEditar = rowArray.rows.findIndex(i => i.idVoluntario == idVoluntario);
                    rowArray.rows[posEditar]['active'] = 0;
                    console.log(rowArray.rows[posEditar]);
                    //console.log(rowArray.rows);
                    let dataWrite = JSON.stringify(rowArray, null, 2);
                    fs.writeFile(jsonFilePath + 'voluntarios.json', dataWrite, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                        }
                        else {
                            console.log(`Registo ${idVoluntario} desativado com sucesso`);
                            res.status(jsonMessages.db.successDelete.status).location(rowArray.rows.idVoluntario).send(jsonMessages.db.successDelete);
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
    const idVoluntario = req.sanitize('id').escape();
    console.log(idVoluntario);
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (idVoluntario != "NULL" && typeof(idVoluntario) != 'undefined') {
            fs.readFile(jsonFilePath + 'voluntarios.json', (err, dataRead) => {
                if (err) {
                    console.log(err);
                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                }
                else {
                    let rowArray = JSON.parse(dataRead);
                    //console.log(post);

                    let posApagar = rowArray.rows.findIndex(i => i.idVoluntario == idVoluntario);
                    if (posApagar >= 0) {
                        console.log(rowArray.rows[posApagar]);
                        rowArray.rows.splice(posApagar, 1)
                    }
                    //console.log(rowArray.rows);
                    let dataWrite = JSON.stringify(rowArray, null, 2);
                    fs.writeFile(jsonFilePath + 'voluntarios.json', dataWrite, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                        }
                        else {
                            console.log(`Registo ${idVoluntario} apagado com sucesso`);
                            res.status(jsonMessages.db.successDeleteU.status).location(rowArray.rows.idVoluntario).send(jsonMessages.db.successDeleteU);
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
