import { Player } from "./models/Player";
import { TeamBalancer } from "./services/TeamBalancer";

const players = new Array<Player>(
    new Player(1, "Diogo", 3800),
    new Player(2, "Lucas", 2572),
    new Player(3, "Bernardo", 2181),
    new Player(4, "Gaah", 2500),
    new Player(5, "Fake", 4300),
    new Player(6, "Gustavo", 2220),
    new Player(7, "Yuyu", 2200),
    new Player(8, "Careca", 1800),
    new Player(9, "Elivelton", 4000),
    new Player(10, "Jean", 3817)
);
TeamBalancer.getInstance(players).balance();
