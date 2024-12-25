import { Player } from "./Player";

export class Team {

    public players: Array<Player> = new Array<Player>();

    constructor(players: Array<Player>) {
        this.players = players;
    }

    public getPlayers(): Array<Player> {
        return this.players;
    }

    public getPlayer(position: number): Player {
        return this.players[position];
    }

    public setPlayer(position: number, player: Player): void {
        this.players[position] = player;
    }

    public setPlayers(players: Array<Player>): void {
        if (players.length !== 5) {
            throw new Error("The teams need to have 5 players.");
        }
        this.players = players;
    }

    public sortPlayers(): void {
        this.players.sort((playerOne, playerTwo) => playerOne.getMmr() - playerTwo.getMmr());
    }

    public calculateTeamMmr(): number {
        let totalTeamMmr: number = 0;
        this.players.forEach((player: Player) => {
            totalTeamMmr += player.getMmr();
        });
        return totalTeamMmr;
    }

    public equals(team: Object) {
        return JSON.stringify(this) === JSON.stringify(team);
    }

    
    public overlapWith(otherTeam: Team): number {
        let overlapCount = 0;
        for (const player of this.players) {
            if (otherTeam.getPlayers().some(otherPlayer => otherPlayer.getName() === player.getName())) {
                overlapCount++;
            }
        }
        return overlapCount;
    }

    public toString(): string {
        return JSON.stringify(this);
    }

}