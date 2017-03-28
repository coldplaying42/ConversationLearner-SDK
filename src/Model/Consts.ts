export const TakeTurnModes =
{
    CALLBACK : "lu_callback",
    TEACH :  "teach",
    ACTION :  "action",
    ERROR : "error"
}

export const ActionTypes =
{
    TEXT : "text",
    API : "api"
}

export const EntityTypes =
{
    LOCAL : "LOCAL",
    LUIS : "LUIS"
}

export const TeachStep =
{
    LABELENTITY : "label_entity",
    LABELACTION : "label_action"
}

export const SaveStep =
{
    INPUT : "input",
    ENTITY : "entity",
    RESPONSE : "response",
    API : "api"
}

export const Commands =
{
    ABANDON: "!abandon",
    ACTIONS : "!actions",
    ADDENTITY : "!addentity",
    ADDTEXTACTION : "!addtextaction",
    ADDAPIACTION : "!addapiaction",
    APPS : "!apps",
    CREATEAPP : "!createapp",
    DEBUG : "!debug",
    DEBUGHELP : "!debughelp",
    DELETEACTION : "!deleteaction",
    DELETEALLAPPS: "!deleteallapps",
    DELETEAPP : "!deleteapp",
    DELETEENTITY : "!deleteentity",
    DUMP : "!dump",
    ENTITIES : "!entities",
    EXPORTAPP : "!exportapp",
    HELP : "!help",
    IMPORTAPP : "!importapp",
    LOADAPP: "!loadapp",
    START: "!start",
    TEACH : "!teach",
    TRAINDIALOGS : "!traindialogs"
}

// Internal commands. (Not for user)
export const IntCommands =
{
    DELETEDIALOG : '~deletedialog',
    DONETEACH : "~doneteach",
    FORGETTEACH : "~forgetteach",
    SAVETEACH: "~saveteach",
}

// Internal commands. (Not for user)
export const APICalls =
{
    SAVEENTITY : "saveEntity"
}

export const ActionCommand =
{
    SUGGEST : "*",
    REQUIRE : "++",
    BLOCK : "--",
    SUBSTITUTE: "$"
}

export const Help =
{
    NEWAPP : "#newapp"
}

export const UserStates =
{
    APP : "APP",
    SESSION : "SESSION",
    MODEL : "MODEL",
    TEACH: "TEACH",
    DEBUG: "DEBUG",
    MEMORY: "MEMORY",
    ENTITYLOOKUP: "ENTITYLOOKUP",
    LASTSTEP: "LASTSTEP", 
    SAVELOOKUP: "SAVELOOKUP",           // ENTITY NAME -> SAVE API ACTION ID 
    TRAINSTEPS: "TRAINSTEPS"
}
