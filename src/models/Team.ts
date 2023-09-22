import { Player } from "./Player";

export class Team {

    private players: Array<Player> = new Array<Player>();

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

}