/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { TemplateEngine } from 'botbuilder-lg';
import { Template, RenderedActionArgument } from '@conversationlearner/models'
import * as fs from 'fs'
import * as path from 'path'

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

    public static RemoveEmptyArguments(formString: string) {
        return formString.replace(/{{\s*[\w\.]+\s*}}/g, '')
    }

    public static async RenderTemplate(lgFileName: string, templateArguments: RenderedActionArgument[]): Promise<any | null> {

        const lgName = path.join(this.LGDirectory(), `${lgFileName}.lg`);
        let engine = new TemplateEngine().addFile(lgName);
        let template = this.GetTemplates()
        if (template === null) {
            return null
        }

        let templateString = JSON.stringify(template)
        let argumentNames = new Array()
        for (var i = 0; i < template.length; i++) {
            argumentNames[i] = template[i].name;
        }

        for (let argumentName of argumentNames) {
            let renderedActionArgument = templateArguments.find(a => a.parameter == argumentName)
            if (renderedActionArgument) {
                renderedActionArgument.value = engine.evaluateTemplate(renderedActionArgument.parameter);
                templateString = templateString.replace(new RegExp(`{{${argumentName}}}`, 'g'), renderedActionArgument.value || '')
            }
        }
        templateString = this.RemoveEmptyArguments(templateString)
        return JSON.parse(templateString)
    }

    public static LGDirectory(): string {
        //TODO - make this configurable
        let templateDirectory = path.join(process.cwd(), './lg')

        // Try up a directory or two as could be in /lib or /dist folder depending on deployment
        if (!fs.existsSync(templateDirectory)) {
            templateDirectory = path.join(process.cwd(), '../lg')
        }
        if (!fs.existsSync(templateDirectory)) {
            templateDirectory = path.join(process.cwd(), '../../lg')
        }
        return templateDirectory;
    }
}