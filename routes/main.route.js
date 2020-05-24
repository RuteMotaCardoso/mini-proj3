const router = require('express').Router();
const controllerSpeaker = require('../controllers/speaker.controller.js');
const controllerSponsor = require('../controllers/sponsor.controller.js');
const controllerConference = require('../controllers/conference.controller.js');
const controllerVoluntario = require('../controllers/voluntario.controller.js');
const controllerComissao = require('../controllers/comissao.controller.js');
const controllerTarefa = require('../controllers/tarefa.controller.js');
const controllerTipoTarefa = require('../controllers/tipoTarefa.controller.js');
const controllerMail = require('../controllers/mail.controller.js');
const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "login");
router.get('/', function(req, res) {
    res.send("FCA Book");
    res.end();
});

router.get('/speakers/', controllerSpeaker.read);
router.get('/speakers/:id', controllerSpeaker.readID);
router.post('/speakers/', isLoggedIn, controllerSpeaker.save);
router.put('/speakers/:id', isLoggedIn, isLoggedIn, controllerSpeaker.update);
router.put('/speakers/del/:id', isLoggedIn, controllerSpeaker.deleteL);
router.delete('/speakers/:id', isLoggedIn, controllerSpeaker.deleteF);

router.get('/sponsors/', controllerSponsor.read);
router.get('/sponsors/:id', controllerSponsor.readID);
router.post('/sponsors/', isLoggedIn, controllerSponsor.save);
router.put('/sponsors/:id', isLoggedIn, controllerSponsor.update);
router.put('/sponsors/del/:id', isLoggedIn, controllerSponsor.deleteL);
router.delete('/sponsors/:id', isLoggedIn, controllerSponsor.deleteF);

router.get('/conferences', controllerConference.readConference);
router.get('/conferences/:id', controllerConference.readConferenceID);

router.get('/conferences/:idconf/participants', controllerConference.readParticipant);
router.post('/conferences/:idconf/participants/:idparticipant/', controllerConference.saveParticipant);
router.delete('/conferences/:idconf/participants/:idparticipant', controllerConference.deleteParticipant);

router.get('/conferences/:idconf/sponsors/', controllerConference.readSponsor);
router.post('/conferences/:idconf/sponsors/:idsponsor', isLoggedIn, controllerConference.saveSponsor);
router.delete('/conferences/:idconf/sponsors/:idsponsor', isLoggedIn, controllerConference.deleteSponsor);

router.get('/conferences/:idconf/speakers/', controllerConference.readSpeaker);
router.post('/conferences/:idconf/speakers/:idspeaker', isLoggedIn, controllerConference.saveSpeaker);
router.delete('/conferences/:idconf/speakers/:idspeaker', controllerConference.deleteSpeaker);

router.get('/voluntarios/', controllerVoluntario.read);
router.get('/voluntarios/:id', controllerVoluntario.readID);
router.post('/voluntarios/', isLoggedIn, controllerVoluntario.save);
router.put('/voluntarios/:id', isLoggedIn, isLoggedIn, controllerVoluntario.update);
router.put('/voluntarios/del/:id', isLoggedIn, controllerVoluntario.deleteL);
router.delete('/voluntarios/:id', isLoggedIn, controllerVoluntario.deleteF);

router.get('/membrosComissao/', controllerComissao.read);
router.get('/membrosComissao/:id', controllerComissao.readID);
router.post('/membrosComissao/', isLoggedIn, controllerComissao.save);
router.put('/membrosComissao/:id', isLoggedIn, isLoggedIn, controllerComissao.update);
router.put('/membrosComissao/del/:id', isLoggedIn, controllerComissao.deleteL);
router.delete('/membrosComissao/:id', isLoggedIn, controllerComissao.deleteF);

router.get('/tarefas/', controllerTarefa.read);
router.get('/tarefas/:id', controllerTarefa.readID);
router.post('/tarefas/', isLoggedIn, controllerTarefa.save);
router.put('/tarefas/:id', isLoggedIn, isLoggedIn, controllerTarefa.update);
router.put('/tarefas/del/:id', isLoggedIn, controllerTarefa.deleteL);
router.delete('/tarefas/:id', isLoggedIn, controllerTarefa.deleteF);

router.get('/tiposTarefa/', controllerTipoTarefa.read);
router.get('/tiposTarefa/:id', controllerTipoTarefa.readID);
router.post('/tiposTarefa/', isLoggedIn, controllerTipoTarefa.save);
router.put('/tiposTarefa/:id', isLoggedIn, isLoggedIn, controllerTipoTarefa.update);
router.put('/tiposTarefa/del/:id', isLoggedIn, controllerTipoTarefa.deleteL);
router.delete('/tiposTarefa/:id', isLoggedIn, controllerTipoTarefa.deleteF);

router.post('/contacts/emails', controllerMail.send);

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        /*  res.status(jsonMessages.login.unauthorized.status).send(jsonMessages.login.unauthorized);*/
        return next();
    }
}
