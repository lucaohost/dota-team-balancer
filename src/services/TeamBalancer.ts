import { Matchup } from "../models/Matchup";
import { Player } from "../models/Player";
import { Team } from "../models/Team";
import * as fs from 'fs/promises';

export class TeamBalancer {

    private static instance: TeamBalancer;

    private players: Array<Player> = [];

    private radiant: Team = new Team([]);

    private dire: Team = new Team([]);

    private matchups: Array<Matchup> = [];

    private previousMatchups: Array<Matchup> = [];

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

    public async balance(): Promise<void> {
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
        console.log("Creating and shuffling teams.");
        this.shuffleTeams();
        this.sortPlayersByMmr();
        this.matchups.push(new Matchup(this.radiant, this.dire));
    }
    private shuffleTeams(): void {
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

    private async printResult(): Promise<void> {
        console.log("Trying to find matchup with MMR difference less than 300 and different previous matchups.");
        let foundMatchup: boolean = false;
        for (let matchup of this.matchups) {
            if (matchup.getMmrDifference() < 300 && await this.uniqueMatchup(matchup)) {
                console.log("*****************************");
                console.log("Radiant: ", matchup.getRadiantTeam(), " Dire: ", matchup.getDireTeam(), " MMR Difference: ", matchup.getMmrDifference());
                foundMatchup = true;
                console.log("*****************************");
                console.log("Saving matchup to not repeat.")
                this.saveMatchup(matchup);
                break;
            }
        }
        if (!foundMatchup) {
            console.log("Couldn't find matchup. Trying again...");
            this.balance();
        }
    }

    private async uniqueMatchup(matchup: Matchup): Promise<boolean> {
        this.previousMatchups = await this.loadJsonFile();
        for (let previousMatchup of this.previousMatchups) {
            if (matchup.getDireTeam().equals(previousMatchup.dire) || matchup.getDireTeam().equals(previousMatchup.radiant)) {
                return false;
            }
        }
        return true;
    }

    private changePlayersAndRevert(position: number) {
        this.changePlayers(position, true);
    }

    private changePlayers(position: number, revertAtEnd: boolean = false): void {
        this.onlyChangePlayers(position);
        this.radiant.sortPlayers();
        this.dire.sortPlayers();
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

    private async saveMatchup(matchup: Matchup) {
        try {
            matchup.getDireTeam().sortPlayers();
            matchup.getRadiantTeam().sortPlayers();
            this.previousMatchups.push(matchup);
            const jsonString = JSON.stringify(this.previousMatchups, null, 2);
            await fs.writeFile('./data/previousMatchups.json', jsonString, 'utf-8');
            console.log('Matchup saved.');
        } catch (err) {
            console.error('Error saving matchup.', err);
        }
    }

    private async loadJsonFile(): Promise<Matchup[]> {
        try {
            const data = await fs.readFile('./data/previousMatchups.json', 'utf-8');
            if (data.trim().length === 0) {
                console.log("No previous matchups detected.");
                return [];
            }
            return JSON.parse(data) as Array<Matchup>;
        } catch (err) {
            console.error('Error reading or parsing file', err);
            throw err;
        }
    }

}
