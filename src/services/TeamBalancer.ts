import { Matchup } from "../models/Matchup";
import { Player } from "../models/Player";
import { Team } from "../models/Team";
import * as fs from 'fs/promises';

export class TeamBalancer {

    private static instance: TeamBalancer;
    private players: Array<Player> = [];

    private constructor(players?: Array<Player>) {
        this.setPlayers(players);
    }

    public static getInstance(players?: Array<Player>): TeamBalancer {
        if (!TeamBalancer.instance) {
            TeamBalancer.instance = new TeamBalancer(players);
        }
        return TeamBalancer.instance;
    }

    public setPlayers(players?: Array<Player>) {
        if (!players || players.length !== 10) {
            throw new Error("Team balancer works with 10 players only.");
        }
        this.players = players;
    }

    public async balance(): Promise<void> {
        console.log("* Evaluating all possible team combinations.");
        const matchupsStored = await this.loadMatchups();
        if (matchupsStored.length > 0) {
            await this.printResults(matchupsStored);
            return;
        }

        const combinations = this.generateCombinations();
        const matchups = this.createMatchups(combinations);
        const uniqueMatchups = this.filterUniqueMatchups(matchups);
        const selectedMatchups = uniqueMatchups.slice(0, 10);

        await this.saveMatchups(selectedMatchups);
        await this.printResults(selectedMatchups);
    }

    private async loadMatchups(): Promise<Matchup[]> {
        try {
            const data = await fs.readFile('/mnt/c/git/dota-team-balancer/src/data/matchups.json', 'utf-8');
            return JSON.parse(data);
        } catch (err) {
            console.log("* Error reading matchups file: ", err);
            return [];
        }
    }

    private generateCombinations(): [Player[], Player[]][] {
        const combinations: [Player[], Player[]][] = [];
        const totalPlayers = this.players.length;
        const indices = Array.from({ length: totalPlayers }, (_, i) => i);
        const teamGenerated = new Set<string>();

        const getCombinations = (arr: number[], k: number): number[][] => {
            if (k === 0) return [[]];
            if (arr.length === 0) return [];
            const [first, ...rest] = arr;
            const withFirst = getCombinations(rest, k - 1).map(comb => [first, ...comb]);
            const withoutFirst = getCombinations(rest, k);
            return [...withFirst, ...withoutFirst];
        };

        const radiantCombinations = getCombinations(indices, totalPlayers / 2);

        for (const radiantIndices of radiantCombinations) {
            const radiantPlayers = radiantIndices.map(index => this.players[index]);
            const direPlayers = this.players.filter((_, index) => !radiantIndices.includes(index));

            const radiantSorted = radiantPlayers.slice().sort((a, b) => a.getId() - b.getId());
            const direSorted = direPlayers.slice().sort((a, b) => a.getId() - b.getId());
            const matchupKey = JSON.stringify([radiantSorted, direSorted]);
            const reverseKey = JSON.stringify([direSorted, radiantSorted]);

            if (!teamGenerated.has(matchupKey) && !teamGenerated.has(reverseKey)) {
                teamGenerated.add(matchupKey);
                teamGenerated.add(reverseKey);
                combinations.push([radiantPlayers, direPlayers]);
            }
        }
        return combinations;
    }

    private createMatchups(combinations: [Player[], Player[]][]): Matchup[] {
        return combinations.map(([radiantPlayers, direPlayers]) => {
            const radiant = new Team(radiantPlayers);
            const dire = new Team(direPlayers);
            return new Matchup(radiant, dire);
        }).sort((a, b) => a.getMmrDifference() - b.getMmrDifference());
    }

    private filterUniqueMatchups(matchups: Matchup[]): Matchup[] {
        return matchups.filter((matchup, _, allMatchups) => this.hasTwoDifferentPlayers(matchup, allMatchups));
    }

    private hasTwoDifferentPlayers(currentMatchup: Matchup, allMatchups: Matchup[]): boolean {
        for (const otherMatchup of allMatchups) {
            const radiantOverlap = currentMatchup.getRadiantTeam().overlapWith(otherMatchup.getRadiantTeam());
            const direOverlap = currentMatchup.getDireTeam().overlapWith(otherMatchup.getDireTeam());

            if ((radiantOverlap < 4 && direOverlap < 4) || (radiantOverlap + direOverlap <= 8)) {
                return true;
            }
        }
        return false;
    }

    private async saveMatchups(matchups: Matchup[]): Promise<void> {
        try {
            const jsonString = JSON.stringify(matchups);
            await fs.writeFile('/mnt/c/git/dota-team-balancer/src/data/matchups.json', jsonString, 'utf-8');
            console.log('* Matchups saved successfully.');
        } catch (err) {
            console.error('Error saving matchups.', err);
        }
    }

    private async printResults(selectedMatchups: Matchup[]): Promise<void> {
        console.log("* Picking matchup with less MMR difference.");
        const matchup = selectedMatchups.shift();
        console.log("* Matchup found!");
        console.log("* Removing matchup to not repeat.");
        await this.saveMatchups(selectedMatchups);
        await this.countdown(3);
        console.log("*****************************");
        console.log("Game " + (10 - selectedMatchups.length));
        console.log("*****************************");
        console.log("Radiant: ", matchup?.radiant, " Dire: ", matchup?.dire, " MMR Difference: ", matchup?.mmrDifference);
        console.log("*****************************");
    }

    private countdown(seconds: number): Promise<void> {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (seconds !== 0) {
                    console.log("* " + seconds);
                }
                seconds--;
                if (seconds < 0) {
                    clearInterval(interval);
                    resolve();
                }
            }, 1000);
        });
    }
}
