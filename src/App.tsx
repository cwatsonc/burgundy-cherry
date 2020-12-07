import React from "react";
import { Ctx } from "boardgame.io";
import { Client } from "boardgame.io/react";
import { Local } from "boardgame.io/multiplayer";
import { Stage } from "boardgame.io/core";
import { Grid, Button, List, ListItem, ListItemText } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import css from "./App.css";

const endStage = (_: any, ctx: Ctx) => {
  console.log(
    ctx.playerID,
    " enters endStage with: ",
    _.dealerChoice,
    " in dealerChoice"
  );
  console.log(ctx.playOrderPos);

  _.dealerChoice = _.dealerChoice
    ? _.dealerChoice
    : ctx.playerID === "0"
    ? "northDealer"
    : "southDealer";
  ctx.events.endStage();
};
const endTurn = (_: any, ctx: Ctx) => {
  console.log(ctx.playOrderPos);
  ctx.events.endTurn();
};
const benign = (_: any, ctx: Ctx) => {
  console.log(ctx.playerID);
  console.log("just visiting");
};

const moves = { endStage, endTurn, benign };

const MySimpleControl = (props) => {
  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Button onClick={props.stageEnd}>End Stage</Button>
      </Grid>
      <Grid item xs={12}>
        <Button onClick={props.turnEnd}>End Turn</Button>
      </Grid>
      <Grid item xs={12}>
        <Button onClick={props.benign}>I'm Benign</Button>
      </Grid>
    </React.Fragment>
  );
};

const Board = Client({
  multiplayer: Local(),
  game: {
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
        endIf: (_, ctx) => {
          console.log(
            `inside Pregame endIf with activePlayers`,
            ctx.activePlayers,
            `and dealerChoice: `,
            _.dealerChoice
          );
          return ctx.activePlayers === null && _.dealerChoice
            ? {
                next:
                  ctx.activePlayers === null && _.dealerChoice
                    ? _.dealerChoice
                    : "preGame"
              }
            : false;
        },
        onBegin(_, ctx) {
          _.dealerChoice = null;
        },
        onEnd(_, ctx) {
          _.dealerChoice = null;
        }
      },
      northDealer: {
        moves,
        turn: {
          order: {
            first: (_, ctx) => 0,
            next: (_, ctx) => (ctx.playOrderPos === 1 ? 0 : 1)
          },
          activePlayers: { all: Stage.NULL }
        },
        endIf: (_, ctx) =>
          ctx.playOrderPos !== 0 && ctx.phase === "northDealer"
            ? {
                next: "southDealer"
              }
            : false
      },
      southDealer: {
        moves,
        turn: {
          order: {
            first: (_, ctx) => 1,
            next: (_, ctx) => (ctx.playOrderPos === 1 ? 0 : 1)
          },
          activePlayers: { all: Stage.NULL }
        },
        endIf: (_, ctx) =>
          ctx.playOrderPos !== 1 && ctx.phase === "southDealer"
            ? {
                next: "northDealer"
              }
            : false
      }
    }
  },

  board: (_: any) => {
    let { ctx, moves, playerID } = _;
    let playersList = ctx.activePlayers || {};
    let hasPlayersActive = Object.entries(playersList).length > 0;
    return (
      <div>
        <MySimpleControl
          turnEnd={() => moves.endTurn(_, ctx)}
          stageEnd={() => moves.endStage(_, ctx)}
          benign={() => moves.benign(_, ctx)}
        />
        <React.Fragment>
          <Grid>
            <Card>
              <CardContent>
                <Typography
                  className={css.title}
                  color="textSecondary"
                  gutterBottom
                >{`player: ${
                  playerID === "0" ? "North" : "South"
                }`}</Typography>
                <Typography
                  className={css.title}
                  color="textSecondary"
                  gutterBottom
                >
                  {`phase: ${ctx.phase}`}
                </Typography>
                <Typography
                  className={css.title}
                  color="textSecondary"
                  gutterBottom
                >
                  {`current turn: ${ctx.turn}`}
                </Typography>
                <Typography
                  className={css.title}
                  color="textSecondary"
                  gutterBottom
                >
                  {`dealer: ${
                    ctx.phase !== "preGame"
                      ? ctx.currentPlayer === "0"
                        ? "North"
                        : "South"
                      : null
                  }`}
                </Typography>
                <Typography
                  className={css.title}
                  color="textSecondary"
                  gutterBottom
                >
                  {`active players: ${Object.entries(playersList).length}`}
                </Typography>
                {hasPlayersActive && (
                  <List>
                    {Object.entries(ctx.activePlayers).map(([id, stage]) => (
                      <ListItem key={id}>
                        <ListItemText primary={`${id} : ${stage}`} />
                      </ListItem>
                    ))}
                  </List>
                )}{" "}
                {!hasPlayersActive && (
                  <List>
                    <ListItem key="boof" hidden={hasPlayersActive}>
                      <ListItemText primary="undefined" />
                    </ListItem>
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </React.Fragment>
      </div>
    );
  }
});

export default () => {
  return (
    <div style={{ display: "flex", gap: "2em" }}>
      <Board playerID="0" />
      <Board playerID="1" />
    </div>
  );
};
