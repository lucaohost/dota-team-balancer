import { Team } from "./Team";

export class Matchup {

    private radiant: Team;

    private dire: Team;

    private mmrDifference: number;

    public constructor(radiant: Team, dire: Team) {
        this.radiant = new Team([...radiant.getPlayers()]);
        this.dire = new Team([...dire.getPlayers()]);
        this.mmrDifference = Math.abs(this.radiant.calculateTeamMmr() - this.dire.calculateTeamMmr());
    }


    public getRadiantTeam(): Team {
        return this.radiant;
    }

    public getDireTeam(): Team {
        return this.dire;
    }

    public getMmrDifference(): number {
        return this.mmrDifference;
    }


}