import React from "react";
import { Ctx, Game } from "boardgame.io";
import { Client } from "boardgame.io/react";
import { Local } from "boardgame.io/multiplayer";
import { Stage } from "boardgame.io/core";
import BoardView from "./BoardView";

export interface IGameState {
  dealWasPassed: boolean,
  dealerChoice: string,
}

const endStage = (G: IGameState, ctx: Ctx) => {
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
const endTurn = (G: IGameState, ctx: Ctx): void => {
  G.dealWasPassed = true;
  ctx.events?.endTurn?.();
};
const benign = (G: IGameState, ctx: Ctx) => {
  console.log(ctx.playerID);
  console.log("just visiting");
};


export const moves = { endStage, endTurn, benign };

export const game: Game = {
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
      endIf: (G: IGameState, ctx: Ctx) => {

        return ctx.activePlayers === null && G.dealerChoice
          ? {
            next:
              ctx.activePlayers === null && G.dealerChoice
                ? G.dealerChoice
                : "preGame"
          }
          : false;
      },
      onBegin(G: IGameState, ctx: Ctx) {
        return { ...G, dealerChoice: null }
      },
      onEnd(G: IGameState, ctx: Ctx) {
        return { ...G, dealerChoice: null }
      }
    },
    northDealer: {
      moves,
      onBegin: (G: IGameState, ctx: Ctx) => {
        return { ...G, dealWasPassed: false }
      },
      onEnd: (G: IGameState, ctx: Ctx) => {
        return { ...G, dealWasPassed: false }
      },
      turn: {
        order: {
          first: (G: IGameState, ctx: Ctx) => 0,
          next: (G: IGameState, ctx: Ctx) => (ctx.playOrderPos === 1 ? 0 : 1)
        },
        activePlayers: { all: Stage.NULL }
      },
      endIf: (G: IGameState, ctx: Ctx) =>
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
          first: (G: IGameState, ctx: Ctx) => 1,
          next: (G: IGameState, ctx: Ctx) => (ctx.playOrderPos === 1 ? 0 : 1)
        },
        activePlayers: { all: Stage.NULL }
      },
      endIf: (G: IGameState, ctx: Ctx) =>
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
