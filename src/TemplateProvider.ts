/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as fs from 'fs'
import * as path from 'path'
import { Template, TemplateVariable, RenderedActionArgument } from '@conversationlearner/models'
import { CLDebug } from './CLDebug'
import { TemplateEngine, ActivityFactory } from 'botbuilder-lg'

export class TemplateProvider {

    private static hasSubmitError = false

    public static LGTemplateDirectory(): string {
        //TODO - make this configurable
        let templateDirectory = path.join(process.cwd(), './lgs')

        // Try up a directory or two as could be in /lib or /dist folder depending on deployment
        if (!fs.existsSync(templateDirectory)) {
            templateDirectory = path.join(process.cwd(), '../lgs')
        }
        if (!fs.existsSync(templateDirectory)) {
            templateDirectory = path.join(process.cwd(), '../../lgs')
        }
        return templateDirectory
    }

    // TODO: Decouple template renderer from types from Action classes
    // E.g. use generic key,value object instead of RenderedActionArgument
    public static async RenderTemplate(templateName: string, templateArguments: RenderedActionArgument[]): Promise<any | null> {
        let entities = {}

        for (let templateArgument of templateArguments) {
            entities[templateArgument.parameter] = templateArgument.value
        }

        let templateDirectory = this.LGTemplateDirectory()
        let lgFilename = templateDirectory + "//" + templateName + ".lg";
        //Currently, we assume that each lg file only has one template    
        let engine = new TemplateEngine().addFile(lgFilename);
        let tempString = engine.evaluateTemplate(engine.templates[0].name, entities)

        return ActivityFactory.CreateActivity(tempString)
    }

    public static GetTemplates(): Template[] {

        let templates: Template[] = []
        let files = this.GetTemplatesNames()

        for (let file of files) {
            const fileName = path.join(this.LGTemplateDirectory(), `${file}.lg`)
            let engine = new TemplateEngine().addFile(fileName);
            let templateBody = ""
            let validationError = this.hasSubmitError
                ? `Template "${file}" has an "Action.Submit" item but no data.  Submit item must be of the form: "type": "Action.Submit", "data": string` : null

            let tvs: TemplateVariable[] = []
            for (let par of engine.templates[0].parameters) {
                //Here type could be change
                let tv: TemplateVariable = { key: par, type: 'lg' }
                tvs.push(tv)
            }

            let template: Template = {
                name: file,
                variables: tvs,
                body: templateBody,
                validationError: validationError
            }
            templates.push(template)
        }
        return templates
    }

    public static GetTemplatesNames(): string[] {
        try {
            let fileNames: string[] = fs.readdirSync(this.LGTemplateDirectory())
            fileNames = fileNames.filter(fn => fn.endsWith('.lg'))
            let templates = fileNames.map(f => f.slice(0, f.lastIndexOf('.')))
            return templates
        } catch {
            CLDebug.Log("No LG directory found")
            return []
        }
    }
}
