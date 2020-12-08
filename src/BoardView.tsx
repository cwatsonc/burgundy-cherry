import React, { FunctionComponent } from "react";
import { Grid, Button, List, ListItem, ListItemText } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    paper: {
      padding: theme.spacing(2),
      margin: "auto",
      maxWidth: 500
    },
    image: {
      width: 128,
      height: 128
    },
    img: {
      margin: "auto",
      display: "block",
      maxWidth: "100%",
      maxHeight: "100%"
    },

    bullet: {
      display: "inline-block",
      margin: "0 2px",
      transform: "scale(0.8)"
    },
    title: {
      fontSize: 14
    },
    pos: {
      marginBottom: 12
    }
  })
);

interface MySimpleControlProps {
  stageEnd: () => void;
  turnEnd: () => void;
  benign: () => void;
  children?: React.ReactNode;
}

const MySimpleControl: React.FunctionComponent<MySimpleControlProps> = (
  props: MySimpleControlProps
) => {
  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Button onClick={props.stageEnd}>Vote4Me</Button>
      </Grid>
      <Grid item xs={12}>
        <Button onClick={props.turnEnd}>Flip Dealer</Button>
      </Grid>
      <Grid item xs={12}>
        <Button onClick={props.benign}>I'm Benign</Button>
      </Grid>
    </React.Fragment>
  );
};

const BoardView: FunctionComponent = (_: any) => {
  const css = useStyles();

  let { ctx, moves, playerID } = _;
  let playersList = ctx.activePlayers || {};
  let hasPlayersActive = Object.entries(playersList).length > 0;

  return (
    <React.Fragment>
      <MySimpleControl
        turnEnd={() => moves.endTurn(_, ctx)}
        stageEnd={() => moves.endStage(_, ctx)}
        benign={() => moves.benign(_, ctx)}
      />
      <Grid>
        <Card>
          <CardContent>
            <Typography
              className={css.title}
              color="textSecondary"
              gutterBottom
            >{`player: ${playerID === "0" ? "North" : "South"}`}</Typography>
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
  );
};

export default BoardView;
