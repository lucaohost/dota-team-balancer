export class Player {

    private id: number;

    private name: string;

    private mmr: number;


    public constructor(id: number, name: string, mmr: number = 0) {
        this.id = id;
        this.name = name;
        this.mmr = mmr;
    }

    public getId() {
        return this.id;
    }

    public getName() {
        return this.name;
    }

    public getMmr() {
        return this.mmr;
    }
    
}