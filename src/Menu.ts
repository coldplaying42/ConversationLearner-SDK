import * as builder from 'botbuilder';
import {  UserStates } from './Model/Consts';
import { IntCommands, LineCommands } from './CommandHandler';
import { Utils } from './Utils';
import { Help } from './Model/Help';
import { Action } from './Model/Action';
import { Entity } from './Model/Entity';
import { BlisContext} from './BlisContext';

export class Menu {

    public static AddEditApp(context : BlisContext, responses : (string|builder.IIsAttachment)[]) : (string|builder.IIsAttachment)[]
    {
        // Only add edit menu when not in teach mode
        if (context.state[UserStates.TEACH])
        {
            return responses;
        }
        return responses.concat(Menu.EditApp(true));
    }

    public static EditApp(newLine? : boolean) : (string|builder.IIsAttachment)[]
    {
        let cards = [];
        if (newLine) cards.push(null);
        cards.push(Utils.MakeHero("Entities", null, null, 
        {
            "List" : LineCommands.ENTITIES, 
            "Search" : IntCommands.ENTITIES, 
            "Add" : IntCommands.ADDENTITY
        }));
        cards.push(Utils.MakeHero("Responses", null, null, 
        {
            "List" : LineCommands.RESPONSES,
            "Search" : IntCommands.RESPONSES, 
            "Add" : IntCommands.ADDRESPONSE
        }));
        cards.push(Utils.MakeHero("API Calls", null, null, 
        {
            "List" : LineCommands.APICALLS, 
            "Search" : IntCommands.APICALLS, 
            "Add" : IntCommands.ADDAPICALL
        }));
        cards.push(null);
        cards.push(Utils.MakeHero("Train Dialogs", null, null, 
        {
            "List" : LineCommands.TRAINDIALOGS, 
            "Search" : IntCommands.TRAINDIALOGS, 
            "Add" : LineCommands.TEACH
        }));
        cards = cards.concat(this.AppPanel("Apps"));
        cards.push(Utils.MakeHero("Bot", null, null, 
        {
            "Start" : LineCommands.START, 
            "Teach" : LineCommands.TEACH,
        }));
        return cards;
    }

    public static Home(title : string, subheader? : string, body? : string) : (string|builder.IIsAttachment)[]
    { 
        let cards = [];
        cards.push(Utils.MakeHero(title, subheader, body, 
        {
            "Start" : LineCommands.START, 
            "Teach" : LineCommands.TEACH,
            "Edit" : IntCommands.EDITAPP
        }));
        return cards;
    }

    public static AppPanel(title : string, subheader? : string, body? : string) : (string|builder.IIsAttachment)[]
    { 
        let cards = [];
        cards.push(Utils.MakeHero(title, subheader, body, 
        {
            "List" : LineCommands.APPS,
            "Search" : IntCommands.APPS, 
            "Create" : IntCommands.CREATEAPP
        }));
        return cards;
    }

    public static AddAPICall() : builder.IIsAttachment
    {
        let card = Utils.MakeHero(`Add API Call`, null, "Enter new API Call",  
        {  
            "Help" : Help.ADDAPICALL,
            "Cancel" : IntCommands.CANCEL
        });
        return card;
    }

    public static AddEntity() : builder.IIsAttachment
    {
        let card = Utils.MakeHero(`Add Entity`, null, "Enter new Entity", 
        {  
            "Help" : Help.ADDENTITY,  
            "Cancel" : IntCommands.CANCEL
        });
        return card;
    }

    public static AddResponse() : builder.IIsAttachment
    {
        let card = Utils.MakeHero(`Add Response`, null, "Enter new Response",  
        {  
            "Help" : Help.ADDRESPONSE,
            "Cancel" : IntCommands.CANCEL
        });
        return card;
    }

    public static APICalls() : builder.IIsAttachment
    {
        let card = Utils.MakeHero(`Find API call`, null, "Enter search term", 
        {  
                "Cancel" : IntCommands.CANCEL
        });
        return card;
    }

    public static Apps() : builder.IIsAttachment
    {
        let card = Utils.MakeHero(`Find App`, null, "Enter search term", 
        {  
            "Cancel" : IntCommands.CANCEL
        });
        return card;
    }

   public static CreateApp() : builder.IIsAttachment
    {
        let card = Utils.MakeHero(`Create App`, '{appName} {LUIS key}', "Enter new App name and Luis Key",
        {  
                "Cancel" : IntCommands.CANCEL
        });
        return card;
    }

    public static EditAPICall(action? : Action) : builder.IIsAttachment
    {
        let subheader = action ? action.content : null;
        let card = Utils.MakeHero(`Edit API Call`, subheader, "Enter new API Name", 
        {  
            "Help" : Help.EDITAPICALL,
            "Cancel" : IntCommands.CANCEL
        });
        return card;
    }

    public static EditEntity(entity? : Entity) : builder.IIsAttachment
    {
        let title = entity ? `Edit: (${entity.name})` : "";
        let subheader = entity ? (entity.luisPreName ? entity.luisPreName : entity.entityType) : "";
        let type = entity.luisPreName ? entity.luisPreName : entity.entityType;
        let card = Utils.MakeHero(title, subheader, "Enter new Entity name",
        {  
            "Help" : Help.EDITENTITY,
            "Cancel" : IntCommands.CANCEL
        });
        return card;
    }

    public static EditResponse(action? : Action) : builder.IIsAttachment
    {
        let subheader = action ? action.content : null;
        let card = Utils.MakeHero(`Edit Response`, subheader, "Enter new Response context", 
        {  
            "Help" : Help.EDITRESPONSE,
            "Cancel" : IntCommands.CANCEL
        });
        return card;
    }

    public static Entities() : builder.IIsAttachment
    {
        let card = Utils.MakeHero(`Find Entity`, null, "Enter search term", 
        {  
                "Cancel" : IntCommands.CANCEL
        });
        return card;
    }

    public static Responses() : builder.IIsAttachment
    {
        let card = Utils.MakeHero(`Find Response`, null, "Enter search term", 
        {  
                "Cancel" : IntCommands.CANCEL
        });
        return card;
    }

    public static TrainDialogs() : builder.IIsAttachment
    {
        let card = Utils.MakeHero(`Find Training Dialog`, null, "Enter search term", 
        {  
                "Cancel" : IntCommands.CANCEL
        });
        return card;
    }
}