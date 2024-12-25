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
        console.log("* Evaluating all possible team combinations.");
        try {
            const data = await fs.readFile('/mnt/c/git/dota-team-balancer/src/data/matchups.json', 'utf-8');
            const matchups = JSON.parse(data);
            if (matchups.length > 0) {
                await this.printResults(matchups);
                return;
            }
        } catch (err) {
            console.log("* Error reading matchups file: ", err);
            return;
        }

        // Generate all possible team combinations.
        const combinations = this.generateCombinations();

        // Create matchups from the combinations.
        const matchups = combinations.map(([radiantPlayers, direPlayers]) => {
            const radiant = new Team(radiantPlayers);
            const dire = new Team(direPlayers);
            return new Matchup(radiant, dire);
        });

        // Sorting matchups by MMR difference.
        matchups.sort((a, b) => a.getMmrDifference() - b.getMmrDifference());

        // Filtering matchups to ensure at least 2 different players between teams.
        const uniqueMatchups = matchups.filter((matchup, _, allMatchups) => this.hasTwoDifferentPlayers(matchup, allMatchups));

        // Selecting the 10 best matchups.
        const selectedMatchups = uniqueMatchups.slice(0, 10);

        await this.saveMatchups(selectedMatchups);

        await this.printResults(selectedMatchups);

    }

    private generateCombinations(): [Player[], Player[]][] {
        const combinations: [Player[], Player[]][] = [];
        const totalPlayers = this.players.length;
        let teamGenerated = [];

        // Create an array of indices corresponding to the players.
        const indices = Array.from({ length: totalPlayers }, (_, i) => i);

        // Helper function to generate combinations of a certain size (k).
        const getCombinations = (arr: number[], k: number): number[][] => {
            if (k === 0) return [[]]; // Base case: one combination of size 0 (empty set).
            if (arr.length === 0) return []; // No combinations possible if array is empty.
            const [first, ...rest] = arr;
            const withFirst = getCombinations(rest, k - 1).map(comb => [first, ...comb]);
            const withoutFirst = getCombinations(rest, k);
            return [...withFirst, ...withoutFirst];
        };

        // Generate all combinations of 5 players for the radiant team.
        const radiantCombinations = getCombinations(indices, totalPlayers / 2);

        for (const radiantIndices of radiantCombinations) {
            // Map indices to players for radiant and dire teams.
            const radiantPlayers = radiantIndices.map(index => this.players[index]);
            const direPlayers = this.players.filter((_, index) => !radiantIndices.includes(index));

            // Ensure unique matchups by sorting and checking for duplicates.
            const radiantSorted = radiantPlayers.slice().sort((a, b) => a.getId() - b.getId());
            const direSorted = direPlayers.slice().sort((a, b) => a.getId() - b.getId());
            const matchupKey = JSON.stringify([radiantSorted, direSorted]);
            const reverseKey = JSON.stringify([direSorted, radiantSorted]);

            if (teamGenerated[matchupKey] === undefined && teamGenerated[reverseKey] === undefined) {
                teamGenerated[matchupKey] = true;
                teamGenerated[reverseKey] = true;
                combinations.push([radiantPlayers, direPlayers]);
            }
        }
        return combinations;
    }

    private hasTwoDifferentPlayers(currentMatchup: Matchup, allMatchups: Matchup[]): boolean {
        for (const otherMatchup of allMatchups) {
            // Check the overlap of players in both teams.
            const radiantOverlap = currentMatchup.getRadiantTeam().overlapWith(otherMatchup.getRadiantTeam());
            const direOverlap = currentMatchup.getDireTeam().overlapWith(otherMatchup.getDireTeam());

            // Ensure at least two different players across both teams.
            if ((radiantOverlap < 4 && direOverlap < 4) || (radiantOverlap + direOverlap <= 8)) {
                return true;
            }
        }
        return false;
    }

    private async saveMatchups(matchups: Matchup[]): Promise<void> {
        try {
            // Convert matchups to JSON format for saving.
            // const jsonString = JSON.stringify(matchups.map(matchup => matchup.toJSON()), null, 2);
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
        console.log("* Matchup found!")
        console.log("* Removing matchup to not repeat.");
        await fs.writeFile('/mnt/c/git/dota-team-balancer/src/data/matchups.json', JSON.stringify(selectedMatchups, null, 2), 'utf-8');
        await this.countdown(3);
        console.log("*****************************");
        console.log("Game " + (10 - selectedMatchups.length))
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
