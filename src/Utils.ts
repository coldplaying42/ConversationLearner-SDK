import * as builder from 'botbuilder';
import * as util from 'util';
import * as request from 'request';
import { BlisContext } from './BlisContext';
import { BlisMemory } from './BlisMemory';
import { PredictedEntity, EntitySuggestion, UserInput } from 'blis-models'

export class Utils  {

    public static SendTyping(bot : builder.UniversalBot, address : any)
    {
        let msg = <builder.IMessage>{ type: 'typing'};
        msg.address = address;
        bot.send(msg);
    }

    /** Send a text message */
    public static async SendMessage(bot : builder.UniversalBot, memory : BlisMemory, content : string | builder.Message)
    { 
        let address = await memory.BotState().Address();
        let session = await memory.BotState().Session(bot);

        if (content instanceof builder.Message) {
            session.send(content);
        }
        else { 
            let message = new builder.Message()
                .address(address)
                .text(content);
        
            session.send(message);
        }
    }

    public static SendAsAttachment(context : BlisContext, content: string)
    {
        var base64 = Buffer.from(content).toString('base64');

        let msg =  new builder.Message();
        (<any>msg).data.address = context.Address();
        let contentType = "text/plain";
        let attachment : builder.IAttachment =  
        {
            contentUrl: util.format('data:%s;base64,%s', contentType, base64),
            contentType: contentType,
            content: content
        }
        msg.addAttachment(attachment);
        context.bot.send(msg);
    }

    /** Handle that catch clauses can be any type */
    public static ErrorString(error : any) : string
    {
        if (typeof error == 'string')
        {
            return error;
        }
        else if (error.message)
        {
            return error.message + "\n\n" + error.stack;
        }
        return JSON.stringify(error);
    }

    public static ReadFromFile(url : string) : Promise<string>
    {
        return new Promise(
            (resolve, reject) => {
                const requestData = {
                    url: url, 
                    json: true,
                    encoding : 'utf8'
                }
                request.get(requestData, (error, response, body) => {
                    if (error) {
                        reject(error);
                    }
                    else if (response.statusCode >= 300) {
                        reject(body.message);
                    }
                    else {
                        let model = String.fromCharCode.apply(null, body.data);
                        resolve(model);
                    }

                });
            }
        )
    }

    public static async GetSuggestedEntity(userInput: UserInput, memory : BlisMemory) : Promise<PredictedEntity>
    {
        let suggestedEntity = await memory.BotState().SuggestedEntity() as EntitySuggestion;
        if (!suggestedEntity || !userInput || !userInput.text) {
            return null;
        }
        // Clear suggested entity (only use once)
        await memory.BotState().ClearSuggestedEntity();

        // Generate Predicated Entity
        let predictedEntity = new PredictedEntity({
            startCharIndex: 0,
            endCharIndex: userInput.text.length-1,
            entityName: suggestedEntity.entityName,
            entityId: suggestedEntity.entityId,
            entityText: userInput.text
        })
        return predictedEntity;
    }
}