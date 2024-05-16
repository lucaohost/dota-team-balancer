import { Matchup } from "../models/Matchup";
import { Player } from "../models/Player";
import { Team } from "../models/Team";

export class TeamBalancer {

    private static instance: TeamBalancer;

    private players: Array<Player> = [];

    private radiant: Team = new Team([]);

    private dire: Team = new Team([]);

    private matchups: Array<Matchup> = [];


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
        this.onlyChangePlayers(0);
        for (let i: number = 1; i < 3; i++) {
            this.changePlayers(i);
        }
        this.sortMatchups();
        this.printResult();
    }

    private startTeams() {
        console.log("Creating teams.");
        this.shuffleTeams();
        this.sortPlayersByMmr();
        this.matchups.push(new Matchup(this.radiant, this.dire));
    }
    private shuffleTeams(): void {
        console.log("Shuffling teams.");
        for (let i = 0; i < 1000; i++) {
            let randomPositionOne: number = Math.floor(Math.random() * 10);
            let randomPositionTwo: number = Math.floor(Math.random() * 10);
            let auxPlayer: Player = this.players[randomPositionOne];
            this.players[randomPositionOne] = this.players[randomPositionTwo];
            this.players[randomPositionTwo] = auxPlayer;
        }
        this.radiant.setPlayers(this.players.slice(0, 5));
        this.dire.setPlayers(this.players.slice(5));
    }

    private sortPlayersByMmr(): void {
        this.radiant.sortPlayers();
        this.dire.sortPlayers();
    }

    private printResult(): void {
        this.matchups.forEach((matchup:Matchup, index:number) => {
            console.log("*****************************");
            console.log("Game ", index + 1);
            console.log("Radiant: ", matchup.getRadiantTeam(), " Dire: ", matchup.getDireTeam(), " MMR Difference: ", matchup.getMmrDifference());
        });
    }

    private changePlayersAndRevert(position: number) {
        this.changePlayers(position, true);
    }

    private changePlayers(position: number, revertAtEnd: boolean = false): void {
        this.onlyChangePlayers(position);
        this.matchups.push(new Matchup(this.radiant, this.dire));
        if (revertAtEnd) {
            this.onlyChangePlayers(position);
        }
    }

    private onlyChangePlayers(position: number) {
        const aux: Player = this.radiant.getPlayer(position);
        this.radiant.setPlayer(position, this.dire.getPlayer(position));
        this.dire.setPlayer(position, aux);
    }

    private sortMatchups(): void {
        this.matchups.sort((matchupOne, matchupTwo) => matchupOne.getMmrDifference() - matchupTwo.getMmrDifference());
    }

}
