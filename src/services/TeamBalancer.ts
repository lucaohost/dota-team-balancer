import { Player } from "../models/Player";

export class TeamBalancer {

    private static instance: TeamBalancer;

    private players: Array<Player> = new Array<Player>();

    private radiant: Array<Player> = new Array<Player>();

    private dire: Array<Player> = new Array<Player>();


    private constructor(players?: Array<Player>) {
        this.setPlayers(players);
    }

    public static getInstance(players?: Array<Player>): TeamBalancer {
        if (TeamBalancer.instance === undefined) {
            TeamBalancer.instance = new TeamBalancer(players);
        }
        return TeamBalancer.instance;
    }

    public setPlayers(players?: Array<Player>) {
        if (players === undefined || players.length !== 10) {
            throw new Error("Team balancer works with 10 players only.");
        }
        this.players = players;
    }

    private randomTeams(): void {
        console.log("Randomizing teams.");
        //clean dire
        //clean radiant
        //randomize 2 teams with 5 players each, saving in radiant and dire
        // use arrow function foreach, something like that, I dont remember
        Math.floor(Math.random() * 11);

    }


    public balance(): void {
        this.randomTeams();
        //starts with 95% balancing confiability
        //change the biggest MMR in radiant with lowest mmr in dire
        // test the balancing confiability, if minor of 95% do the change more 4 times
        // each 5 times, we decrease the balancing confiability in 5% to avoid infinite tryings
        // log all steps
    }


}
