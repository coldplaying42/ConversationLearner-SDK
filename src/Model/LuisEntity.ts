import { JsonProperty } from 'json-typescript-mapper';

export class LuisEntity
{
    @JsonProperty('type')
    public type : string;

    @JsonProperty('entity')
    public entity : string;

    @JsonProperty('resolution')
    public resolution : {}; 

    public constructor(init?:Partial<LuisEntity>)
    {
        this.type = undefined;
        this.entity = undefined;
        this.resolution = undefined;
        (<any>Object).assign(this, init);
    }
}