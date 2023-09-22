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
        this.cleanTeams();
        this.shuffleTeams();
        this.sortPlayersByMmr();
        this.printCurrentResult();
    }

    private cleanTeams() {
        console.log("Cleaning teams.");
        this.radiant = new Array<Player>();
        this.dire = new Array<Player>();
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
        this.radiant = this.players.slice(0, 5);
        this.dire = this.players.slice(5);
    }

    private sortPlayersByMmr(): void {
        this.radiant.sort((playerOne, playerTwo) => playerOne.getMmr() - playerTwo.getMmr());
        this.dire.sort((playerOne, playerTwo) => playerOne.getMmr() - playerTwo.getMmr());
    }

    private printCurrentResult(): void {
        console.log("******************************")
        console.log("Radiant: ", this.radiant, " Dire: ", this.dire, " MMR Difference: ", this.calculateMmrDiff());
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

    private changePlayersAndRevert(position: number) {
        this.changePlayers(position, true);
    }

    private changePlayers(position: number, revertAtEnd: boolean = false): void {
        const aux: Player = this.radiant[position];
        this.radiant[position] = this.dire[position];
        this.dire[position] = aux;
        this.printCurrentResult();
        if (revertAtEnd) {
            this.revertChangedPlayer(position);
        }
    }

    private revertChangedPlayer(position: number): void {
        this.changePlayers(position);
    }

}
