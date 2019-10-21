/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { TemplateEngine } from 'botbuilder-lg';
import { Template, RenderedActionArgument } from '@conversationlearner/models'

// class RenderedActionArgument {
//     parameter: string;
//     value: string | null;
// }


export class TemplateProviderLG {

    public static GetTemplates(): Template[] {

        let templates: Template[] = []

        templates.push({
            name: "greeting",
            variables: [],
            body: "",
            validationError: null
        })

        templates.push({
            name: "askName",
            variables: [],
            body: "",
            validationError: null
        })

        templates.push({
            name: "askColor",
            variables: [{ key: "userName", type: "string" }],
            body: "",
            validationError: null
        })

        templates.push({
            name: "colorResponse",
            variables: [{ key: "userName", type: "string" }, { key: "color", type: "string" }],
            body: "",
            validationError: null
        })

        return templates
    }

    /* function GetArgumentNames(formString: string) {
        // Get set of unique entities
        let mustaches = formString.match(/{{\s*[\w\.]+\s*}}/g)
        if (mustaches) {
            let entities = [...new Set(mustaches.map(x => x.match(/[\w\.]+/)![0]))]
            return entities
        }
        return []
    } */

    public static RemoveEmptyArguments(formString: string) {
        return formString.replace(/{{\s*[\w\.]+\s*}}/g, '')
    }

    public static async RenderTemplate(lg_filename: string, templateArguments: RenderedActionArgument[]): Promise<any | null> {

        let engine = new TemplateEngine().addFile(lg_filename);
        let template = this.GetTemplates()
        if (template === null) {
            return null
        }

        let templateString = JSON.stringify(template)
        //let argumentNames = GetArgumentNames(templateString)
        let argumentNames = new Array()
        for (var i = 0; i < template.length; i++) {
            argumentNames[i] = template[i].name;
        }
        console.log(argumentNames)

        for (let argumentName of argumentNames) {
            let renderedActionArgument = templateArguments.find(a => a.parameter == argumentName)
            if (renderedActionArgument) {
                //console.log(renderedActionArgument);
                renderedActionArgument.value = engine.evaluateTemplate(renderedActionArgument.parameter);
                console.log(renderedActionArgument.value);
                templateString = templateString.replace(new RegExp(`{{${argumentName}}}`, 'g'), renderedActionArgument.value || '')
            }
        }
        templateString = this.RemoveEmptyArguments(templateString)
        return JSON.parse(templateString)
    }

}


// let lg_filename = `${__dirname}/tem.lg`;
// console.log(lg_filename)

// let templateArguments = new Array();
// var temparg = new RenderedActionArgument();
// temparg.parameter = "colorResponse";
// temparg.value = "";

// templateArguments[0] = temparg;

// let result = RenderTemplate(lg_filename, templateArguments);