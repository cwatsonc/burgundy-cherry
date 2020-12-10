import { Client } from 'boardgame.io/client';
import { Ctx } from "boardgame.io";
import { game, IGameState } from './App';

test('multiplayer test', () => {
    const spec = {
        game,
    };

    const p0 = Client({ ...spec, playerID: '0' });
    const p1 = Client({ ...spec, playerID: '1' });

    p0.start();
    p1.start();

    p0.moves.endStage();
    //p1.moves.endStage();

    //let G0: IGameState, G1: IGameState;
    //let c0: Ctx, c1: Ctx;


    const { G: G0, ctx: c0 } = p0.getState();
    const { G: G1, ctx: c1 } = p1.getState();


    expect(c0.activePlayers).toEqual({ 1: 'cutForDeal' })
    expect(c1.activePlayers).toEqual({ 1: 'cutForDeal' })
    expect(c0.phase).toEqual("preGame");
    expect(c1.phase).toEqual("preGame");
    expect(G0.dealerChoice).toBeFalsy();
    expect(G1.dealerChoice).toBeFalsy();




});