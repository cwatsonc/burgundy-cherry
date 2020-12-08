import React from "react";
import { Ctx } from "boardgame.io";
import { Client } from "boardgame.io/react";
import { Local } from "boardgame.io/multiplayer";
import { Stage } from "boardgame.io/core";
import BoardView from "./BoardView";

const endStage = (G: any, ctx: Ctx) => {
  console.log(
    ctx.playerID,
    " enters endStage with: ",
    G.dealerChoice,
    " in dealerChoice"
  );
  console.log(ctx.playOrderPos);

  G.dealerChoice = G.dealerChoice
    ? G.dealerChoice
    : ctx.playerID === "0"
      ? "northDealer"
      : "southDealer";
  ctx?.events?.endStage?.();
};
const endTurn = (G: IGame, ctx: Ctx): void => {
  G.dealWasPassed = true;
  ctx.events?.endTurn?.();
};
const benign = (G: IGame, ctx: Ctx) => {
  console.log(ctx.playerID);
  console.log("just visiting");
};

interface IMoves {
  endStage: (G: IGame, ctx: Ctx) => void,
  endTurn: (G: IGame, ctx: Ctx) => void,
  benign: (G: IGame, ctx: Ctx) => void,
}
const moves: IMoves = { endStage, endTurn, benign };

interface IGame {
  dealWasPassed: boolean,
  dealerChoice: string,
  name: string,
  moves: IMoves,
  turn: any,
  phases: any,
}
const game: IGame = {
  name: "cardtable",
  moves,

  turn: {},

  phases: {
    preGame: {
      start: true,
      turn: {
        activePlayers: { all: "cutForDeal" },
        stages: {
          cutForDeal: {
            next: Stage.NULL
          }
        }
      },
      endIf: (G: IGame, ctx: Ctx) => {
        console.log(
          `inside Pregame endIf with activePlayers`,
          ctx.activePlayers,
          `and dealerChoice: `,
          G.dealerChoice
        );
        return ctx.activePlayers === null && G.dealerChoice
          ? {
            next:
              ctx.activePlayers === null && G.dealerChoice
                ? G.dealerChoice
                : "preGame"
          }
          : false;
      },
      onBegin(G: IGame, ctx: Ctx) {
        return { ...G, dealerChoice: null }
      },
      onEnd(G: IGame, ctx: Ctx) {
        return { ...G, dealerChoice: null }
      }
    },
    northDealer: {
      moves,
      onBegin: (G: IGame, ctx: Ctx) => {
        return { ...G, dealWasPassed: false }
      },
      onEnd: (G: IGame, ctx: Ctx) => {
        return { ...G, dealWasPassed: false }
      },
      turn: {
        order: {
          first: (G: IGame, ctx: Ctx) => 0,
          next: (G: IGame, ctx: Ctx) => (ctx.playOrderPos === 1 ? 0 : 1)
        },
        activePlayers: { all: Stage.NULL }
      },
      endIf: (G: IGame, ctx: Ctx) =>
        G.dealWasPassed && ctx.phase === "northDealer"
          ? {
            next: "southDealer"
          }
          : false
    },
    southDealer: {
      moves,
      turn: {
        order: {
          first: (G: IGame, ctx: Ctx) => 1,
          next: (G: IGame, ctx: Ctx) => (ctx.playOrderPos === 1 ? 0 : 1)
        },
        activePlayers: { all: Stage.NULL }
      },
      endIf: (G: IGame, ctx: Ctx) =>
        G.dealWasPassed && ctx.phase === "southDealer"
          ? {
            next: "northDealer"
          }
          : false,
    }
  },
}

const Board = Client({
  multiplayer: Local(),
  game,

  board: BoardView,
});

export default () => {
  return (
    <div style={{ display: "flex", gap: "2em" }}>
      <Board playerID="0" />
      <Board playerID="1" />
    </div>
  );
};
