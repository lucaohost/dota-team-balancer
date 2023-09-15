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

    private shuffleTeams(): void {
        console.log("Shuffling teams.");
        for (let i = 0; i < 100; i++) {
            let randomPositionOne: number = Math.floor(Math.random() * 11);
            let randomPositionTwo: number = Math.floor(Math.random() * 11);
            let auxPlayer: Player = this.players[randomPositionOne];
            this.players[randomPositionOne] = this.players[randomPositionTwo];
            this.players[randomPositionTwo] = auxPlayer;
        }
        this.radiant = this.players.slice(0, 4);
        this.radiant = this.players.slice(5);
    }

    private cleanTeams() {
        console.log("Cleaning teams.");
        this.radiant = new Array<Player>();
        this.dire = new Array<Player>();
    }


    public balance(): void {
        this.cleanTeams();
        this.shuffleTeams();
        this.printCurrentResult();
        // calculate mmr difference and print it with teams combination
        // change biggest mmr of each side
        // calculate mmr difference and print it with teams combination
        // change second biggest mmr of each side
        // calculate mmr difference and print it with teams combination
        // change third biggest mmr of each side
        // calculate mmr difference and print it with teams combination
        // change fourth biggest mmr of each side
        // calculate mmr difference and print it with teams combination
        // change fifth biggest mmr of each side
        // calculate mmr difference and print it with teams combination
        // change 2 biggest mmr of each side
        // calculate mmr difference and print it with teams combination
        // change 3 biggest mmr of each side
        // calculate mmr difference and print it with teams combination
        // change 4 biggest mmr of each side
        // calculate mmr difference and print it with teams combination
    }

    private calculateMmrDiff(): number {
        return Math.abs(this.calculateTeamMmr(this.radiant) - this.calculateTeamMmr(this.dire));
    }

    private calculateTeamMmr(team: Array<Player>) {
        let totalTeamMmr: number = 0;
        team.forEach((player: Player) => {
            totalTeamMmr += player.getMmr();
        });
        return totalTeamMmr;
    }

    private printCurrentResult(): void {
        console.log("******************************")
        console.log("Radiant: ", this.radiant, " Dire: ", this.dire, " MMR Difference: ", this.calculateMmrDiff());
        console.log("******************************")
    }


}
