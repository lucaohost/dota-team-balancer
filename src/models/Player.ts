export class Player {

    private name: string;

    private mmr: number;


    public constructor(name: string, mmr: number = 0) {
        this.name = name;
        this.mmr = mmr;
    }

    public getName() {
        return this.name;
    }

    public getMmr() {
        return this.mmr;
    }
    
}