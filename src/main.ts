import { Player } from "./models/Player";
import { TeamBalancer } from "./services/TeamBalancer";

const players = new Array<Player>(
    new Player("Alice", 1700),
    new Player("Bob", 1800),
    new Player("Charlie", 1900),
    new Player("David", 2000),
    new Player("Eve", 2100),
    new Player("Frank", 2200),
    new Player("Grace", 2300),
    new Player("Helen", 2400),
    new Player("Ivy", 2500),
    new Player("Jack", 2600)
);
TeamBalancer.getInstance(players).balance();