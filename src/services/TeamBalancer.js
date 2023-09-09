"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamBalancer = void 0;
var TeamBalancer = /** @class */ (function () {
    function TeamBalancer(players) {
        this.players = players;
    }
    TeamBalancer.getInstance = function () {
        console.log(TeamBalancer.instance);
        console.log(TeamBalancer.instance === null);
        console.log(TeamBalancer.instance === undefined);
    };
    return TeamBalancer;
}());
exports.TeamBalancer = TeamBalancer;
