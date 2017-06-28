var restify = require('restify');
import { BlisDebug} from '../BlisDebug';
import { BlisClient} from '../BlisClient';
import { BlisApp } from '../Model/BlisApp';
import { Action } from '../Model/Action';
import { Entity } from '../Model/Entity';
import { TrainDialog } from '../Model/TrainDialog'
import { ExtractorStep, ScorerResponse } from '../Model/TrainDialog'
import { deserialize, serialize } from 'json-typescript-mapper';

export class Server {
    private static server;

    // TEMP until we have an actual user
    private static InitClient() : void
    {
        let serviceUrl = "http://blis-service.azurewebsites.net/api/v1/";
        let user = "testuser";
        let secret = "none";
        let azureFunctionsUrl = "";
        let azureFunctionsKey = "";
        BlisClient.Init(serviceUrl, user, secret, azureFunctionsUrl, azureFunctionsKey);
    }

    // Parse error to return appropriate error message
    private static ErrorMessage(response) : Error
    {
        let msg : string;
        if (response.body)
        {
            return response.body;
        }
        else
        {
            return Error(response.statusMessage);  
        }  
    }

    public static Init() : void{
        this.server = restify.createServer();

        this.server.use(restify.bodyParser());

        this.server.listen(5000, (err) =>
        {
            if (err)
            {
                BlisDebug.Error(err);
            }
            else
            {
                BlisDebug.Log(`${this.server.name} listening to ${this.server.url}`);
            }
        });

        //========================================================
        // App
        //========================================================
            this.server.get("/app/:appId", async (req, res, next) =>
                {
                    let appId = req.params.appId;
                    if (!appId)
                    {
                        res.send(400, Error("Missing Application Id"));
                        return;
                    }
                    this.InitClient();  // TEMP

                    try
                    {
                        let app = await BlisClient.client.GetApp(appId);
                        res.send(serialize(app));
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );

            this.server.post("/app", async (req, res, next) =>
                {
                    try
                    {
                        this.InitClient();  // TEMP

                        let app = deserialize(BlisApp, req.body);
                        let appId = await BlisClient.client.AddApp(app);
                        res.send(appId);
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );

            this.server.put("/app/:appId", async (req, res, next) =>
                {
                    try
                    {
                        this.InitClient();  // TEMP

                        let app = deserialize(BlisApp, req.body);
                        
                        if (!app.appId)
                        {
                            app.appId = req.params.appId;
                        }
                        else if (req.params.appId != app.appId)
                        {
                            return next(new restify.InvalidArgumentError("AppId of object does not match URI"));
                        }

                        let appId = await BlisClient.client.EditApp(app);
                        res.send(appId);
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );

            this.server.del("/app/:appId", async (req, res, next) =>
            {
                    let appId = req.params.appId;
                    if (!appId)
                    {
                        res.send(400, Error("Missing Application Id"));
                        return;
                    }
                    this.InitClient();  // TEMP

                    try
                    {
                        await BlisClient.client.DeleteApp(appId);
                        res.send(200);
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );

            this.server.get("/apps", async (req, res, next) =>
                {
                    this.InitClient();  // TEMP

                    try
                    {
                        let apps = await BlisClient.client.GetApps();
                        res.send(serialize(apps));
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );

        //========================================================
        // Action
        //========================================================
            this.server.get("/app/:appId/action/:actionId", async (req, res, next) =>
                {
                    let appId = req.params.appId;
                    let actionId = req.params.actionId;
        
                    if (!actionId)
                    {
                        res.send(400, Error("Missing Action Id"));
                        return;
                    }
                    this.InitClient();  // TEMP

                    try
                    {
                        let action = await BlisClient.client.GetAction(appId, actionId);
                        res.send(serialize(action));
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );

            this.server.post("/app/:appId/action", async (req, res, next) =>
                {
                    try
                    {
                        this.InitClient();  // TEMP

                        let appId = req.params.appId;
                        let action = deserialize(Action, req.body);
                        let actionId = await BlisClient.client.AddAction(appId, action);
                        res.send(actionId);
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );

            this.server.put("/app/:appId/action/:actionId", async (req, res, next) =>
                {
                    try
                    {
                        this.InitClient();  // TEMP

                        let appId = req.params.appId;
                        let action = deserialize(Action, req.body);

                        if (!action.actionId)
                        {
                            action.actionId = req.params.actionId;
                        }
                        else if (req.params.actionId != action.actionId)
                        {
                            return next(new restify.InvalidArgumentError("ActionId of object does not match URI"));
                        }
                        let actionId = await BlisClient.client.EditAction(appId, action);
                        res.send(actionId);
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );

            this.server.del("/app/:appId/action/:actionId", async (req, res, next) =>
                {
                    let appId = req.params.appId;
                    let actionId = req.params.actionId;
    
                    if (!actionId)
                    {
                        res.send(400, Error("Missing Action Id"));
                        return;
                    }

                    this.InitClient();  // TEMP

                    try
                    {
                        await BlisClient.client.DeleteAction(appId, actionId);
                        res.send(200);
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );

            this.server.get("/app/:appId/actions", async (req, res, next) =>
                {
                    let appId = req.params.appId;

                    this.InitClient();  // TEMP

                    try
                    {
                        let actions = await BlisClient.client.GetActions(appId);
                        res.send(serialize(actions));
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );

            this.server.get("/app/:appId/actionIds", async (req, res, next) =>
                {
                    let appId = req.params.appId;

                    this.InitClient();  // TEMP

                    try
                    {
                        let actions = await BlisClient.client.GetActionIds(appId);
                        res.send(serialize(actions));
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );

        
 

        //========================================================
        // Entities
        //========================================================

            this.server.get("/app/:appId/entityIds", async (req, res, next) =>
                {
                    let appId = req.params.appId;

                    this.InitClient();  // TEMP

                    try
                    {
                        let actions = await BlisClient.client.GetEntityIds(appId);
                        res.send(serialize(actions));
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );

            this.server.get("/app/:appId/entity/:entityId", async (req, res, next) =>
                {
                    let appId = req.params.appId;
                    let entityId = req.params.entityId;
        
                    if (!entityId)
                    {
                        res.send(400, Error("Missing Entity Id"));
                        return;
                    }
                    this.InitClient();  // TEMP

                    try
                    {
                        let entity = await BlisClient.client.GetEntity(appId, entityId);
                        res.send(serialize(entity));
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );

            this.server.post("/app/:appId/entity", async (req, res, next) =>
                {
                    try
                    {
                        this.InitClient();  // TEMP

                        let appId = req.params.appId;
                        let entity = deserialize(Entity, req.body);
                        let entityId = await BlisClient.client.AddEntity(appId, entity);
                        res.send(entityId);
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );

            this.server.put("/app/:appId/entity/:entityId", async (req, res, next) =>
                {
                    try
                    {
                        this.InitClient();  // TEMP

                        let appId = req.params.appId;
                        let entity = deserialize(Entity, req.body);

                        if (!entity.entityId)
                        {
                            entity.entityId = req.params.entityId;
                        }
                        else if (req.params.entityId != entity.entityId)
                        {
                            return next(new restify.InvalidArgumentError("EntityId of object does not match URI"));
                        }

                        let entityId = await BlisClient.client.EditEntity(appId, entity);
                        res.send(entityId);
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );

            this.server.del("/app/:appId/entity/:entityId", async (req, res, next) =>
                {
                    let appId = req.params.appId;
                    let entityId = req.params.entityId;
    
                    if (!entityId)
                    {
                        res.send(400, Error("Missing Entity Id"));
                        return;
                    }

                    this.InitClient();  // TEMP

                    try
                    {
                        await BlisClient.client.DeleteEntity(appId, entityId);
                        res.send(200);
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );

            this.server.get("/app/:appId/entities", async (req, res, next) =>
                {
                    let appId = req.params.appId;

                    this.InitClient();  // TEMP

                    try
                    {
                        let entities = await BlisClient.client.GetEntities(appId);
                        res.send(serialize(entities));
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );

            this.server.get("/app/:appId/entityIds", async (req, res, next) =>
                {
                    let appId = req.params.appId;

                    this.InitClient();  // TEMP

                    try
                    {
                        let entityIds = await BlisClient.client.GetEntityIds(appId);
                        res.send(serialize(entityIds));
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );
        
        //========================================================
        // LogDialogs
        //========================================================
            this.server.get("/app/:appId/logdialog/:logDialogId", async (req, res, next) =>
                {
                    let appId = req.params.appId;
                    let logDialogId = req.params.logDialogId;
        
                    if (!logDialogId)
                    {
                        res.send(400, Error("Missing Log Dialog Id"));
                        return;
                    }
                    this.InitClient();  // TEMP

                    try
                    {
                        let logDialog = await BlisClient.client.GetLogDialog(appId, logDialogId);
                        res.send(serialize(logDialog));
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );

            this.server.del("/app/:appId/logdialogs/:logDialogId", async (req, res, next) =>
                {
                    let appId = req.params.appId;
                    let logDialogId = req.params.logDialogId;
    
                    if (!logDialogId)
                    {
                        res.send(400, Error("Missing Log Dialog Id"));
                        return;
                    }

                    this.InitClient();  // TEMP

                    try
                    {
                        await BlisClient.client.DeleteLogDialog(appId, logDialogId);
                        res.send(200);
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );

            this.server.get("/app/:appId/logdialogs", async (req, res, next) =>
                {
                    let appId = req.params.appId;
                    let query = req.getQuery();
                    this.InitClient();  // TEMP

                    try
                    {
                        let logDialogs = await BlisClient.client.GetLogDialogs(appId, query);
                        res.send(serialize(logDialogs));
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );

            this.server.get("/app/:appId/logDialogIds", async (req, res, next) =>
                {
                    let appId = req.params.appId;
                    let query = req.getQuery();
                    this.InitClient();  // TEMP

                    try
                    {
                        let logDialogIds = await BlisClient.client.GetLogDialogIds(appId);
                        res.send(serialize(logDialogIds));
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );

        //========================================================
        // TrainDialogs
        //========================================================
            
            this.server.post("/app/:appId/traindialog", async (req, res, next) =>
                {
                    try
                    {
                        this.InitClient();  // TEMP

                        let appId = req.params.appId;
                        let trainDialog = deserialize(TrainDialog, req.body);
                        let trainDialogId = await BlisClient.client.AddTrainDialog(appId, trainDialog);
                        res.send(trainDialogId);
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );

            this.server.put("/app/:appId/traindialog/:traindialogId", async (req, res, next) =>
                {
                    try
                    {
                        this.InitClient();  // TEMP

                        let appId = req.params.appId;
                        let trainDialog = deserialize(TrainDialog, req.body);

                        if (!trainDialog.trainDialogId)
                        {
                            trainDialog.trainDialogId = req.params.trainDialogId;
                        }
                        else if (req.params.trainDialogId != trainDialog.trainDialogId)
                        {
                            return next(new restify.InvalidArgumentError("ActionId of object does not match URI"));
                        }
                        let trainDialogId = await BlisClient.client.EditTrainDialog(appId, trainDialog);
                        res.send(trainDialogId);
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );

            this.server.get("/app/:appId/traindialog/:trainDialogId", async (req, res, next) =>
                {
                    let appId = req.params.appId;
                    let trainDialogId = req.params.trainDialogId;
        
                    if (!trainDialogId)
                    {
                        res.send(400, Error("Missing TrainDialog Id"));
                        return;
                    }
                    this.InitClient();  // TEMP

                    try
                    {
                        let trainDialog = await BlisClient.client.GetTrainDialog(appId, trainDialogId);
                        res.send(serialize(trainDialog));
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );

            this.server.del("/app/:appId/traindialogs/:trainDialogId", async (req, res, next) =>
                {
                    let appId = req.params.appId;
                    let trainDialogId = req.params.trainDialogId;
    
                    if (!trainDialogId)
                    {
                        res.send(400, Error("Missing TrainDialog Id"));
                        return;
                    }

                    this.InitClient();  // TEMP

                    try
                    {
                        await BlisClient.client.DeleteTrainDialog(appId, trainDialogId);
                        res.send(200);
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );

            this.server.get("/app/:appId/traindialogs", async (req, res, next) =>
                {
                    let appId = req.params.appId;
                    let query = req.getQuery();
                    this.InitClient();  // TEMP

                    try
                    {
                        let trainDialogs = await BlisClient.client.GetTrainDialogs(appId, query);
                        res.send(serialize(trainDialogs));
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );

            this.server.get("/app/:appId/trainDialogIds", async (req, res, next) =>
                {
                    let appId = req.params.appId;
                    let query = req.getQuery();
                    this.InitClient();  // TEMP

                    try
                    {
                        let trainDialogIds = await BlisClient.client.GetTrainDialogIds(appId);
                        res.send(serialize(trainDialogIds));
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );

        //========================================================
        // Sessions & Training
        //========================================================

            /** Uploads a labeled entity extraction instance
             * ie "commits" an entity extraction label, appending it to the teach session's
             * trainDialog, and advancing the dialog. This may yield produce a new package.
             */
            this.server.post("/app/:appId/teach/${sessionId}/extractor", async (req, res, next) =>
                {
                    try
                    {
                        this.InitClient();  // TEMP

                        let appId = req.params.appId;
                        let sessionId = req.params.sessionId;
                        let extractorStep = deserialize(ExtractorStep, req.body);
                        let response = await BlisClient.client.ExtractResponse(appId, sessionId, extractorStep);
                        res.send(response);
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );

            /** Uploads a labeled scorer step instance 
             * – ie "commits" a scorer label, appending it to the teach session's 
             * trainDialog, and advancing the dialog. This may yield produce a new package.
             */
            this.server.post("/app/:appId/teach/${sessionId}/scorer", async (req, res, next) =>
                {
                    try
                    {
                        this.InitClient();  // TEMP

                        let appId = req.params.appId;
                        let sessionId = req.params.sessionId;
                        let scorerResponse = deserialize(ScorerResponse, req.body);
                        let response = await BlisClient.client.ScoreResponse(appId, sessionId, scorerResponse);
                        res.send(response);
                    }
                    catch (error)
                    {
                        res.send(error.statusCode, Server.ErrorMessage(error));
                    }
                }
            );
    }
}