import { Player } from "./models/Player";
import { TeamBalancer } from "./services/TeamBalancer";

const players = new Array<Player>(
    new Player("Diogo", 3800),
    new Player("Lucas", 2572),
    new Player("Bernardo", 2181),
    new Player("Gaah", 2500),
    new Player("Fake", 4300),
    new Player("Gustavo", 2220),
    new Player("Yuyu", 2200),
    new Player("Careca", 1800),
    new Player("Elivelton", 4000),
    new Player("Jean", 3817)
);
TeamBalancer.getInstance(players).balance();
