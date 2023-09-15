import { Player } from "./models/Player";
import { TeamBalancer } from "./services/TeamBalancer";

const players = new Array<Player>(
    new Player("Diogo", 4200),
    new Player("Lucas", 2100),
    new Player("Bernardo", 2300),
    new Player("Gaah", 2500),
    new Player("Fake", 4000),
    new Player("Lele", 2000),
    new Player("Yuyu", 3000),
    new Player("Careca", 1200),
    new Player("Marquim", 4000),
    new Player("Jean", 3000)
);
TeamBalancer.getInstance(players).balance();
