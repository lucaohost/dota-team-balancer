"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Players = void 0;
var Players = /** @class */ (function () {
    function Players(name, mmr) {
        if (mmr === void 0) { mmr = 0; }
        this.name = name;
        this.mmr = mmr;
    }
    Players.prototype.getName = function () {
        return this.name;
    };
    Players.prototype.getMmr = function () {
        return this.mmr;
    };
    return Players;
}());
exports.Players = Players;
