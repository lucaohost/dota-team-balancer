import { Player } from "../models/Player";
import { Team } from "../models/Team";

export class TeamBalancer {

    private static instance: TeamBalancer;

    private players: Array<Player> = new Array<Player>();

    private radiant: Team;

    private dire: Team;


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

    public balance(): void {
        this.startTeams();
        for (let i: number = 0; i < 5; i++) {
            this.changePlayersAndRevert(i);
        }
        for (let i: number = 0; i < 5; i++) {
            this.changePlayers(i);
        }
    }

    private startTeams() {
        console.log("Creating teams.");
        this.radiant = new Team();
        this.dire = new Team();
        this.shuffleTeams();
        this.sortPlayersByMmr();
        this.printCurrentResult();
    }
    private shuffleTeams(): void {
        console.log("Shuffling teams.");
        for (let i = 0; i < 100; i++) {
            let randomPositionOne: number = Math.floor(Math.random() * 10);
            let randomPositionTwo: number = Math.floor(Math.random() * 10);
            let auxPlayer: Player = this.players[randomPositionOne];
            this.players[randomPositionOne] = this.players[randomPositionTwo];
            this.players[randomPositionTwo] = auxPlayer;
        }
        this.radiant.setPlayers(this.players.slice(0, 5));
        this.dire.setPlayers(this.players.slice(0, 5));
    }

    private sortPlayersByMmr(): void {
        this.radiant.sortPlayers();
        this.dire.sortPlayers();
    }

    private printCurrentResult(): void {
        console.log("******************************")
        console.log("Radiant: ", this.radiant.getPlayers(), " Dire: ", this.dire.getPlayers(), " MMR Difference: ", this.calculateMmrDiff());
    }

    private calculateMmrDiff(): number {
        return Math.abs(this.radiant.calculateTeamMmr() - this.dire.calculateTeamMmr());
    }

    private changePlayersAndRevert(position: number) {
        this.changePlayers(position, true);
    }

    private changePlayers(position: number, revertAtEnd: boolean = false): void {
        const aux: Player = this.radiant.getPlayer(position);
        this.radiant.setPlayer(position, this.dire.getPlayer(position));
        this.dire.setPlayer(position, aux);
        this.printCurrentResult();
        if (revertAtEnd) {
            this.revertChangedPlayer(position);
        }
    }

    private revertChangedPlayer(position: number): void {
        this.changePlayers(position);
    }

}
