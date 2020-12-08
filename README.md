# burgundy-cherry
Created with CodeSandbox

This is a simple state machine which models a default voting phase "preGame"  

players who are active may press any of (Vote4Me, FlipDeal, Benign)

players who have already voted are removed from the context.activePlayers and are allowed to press buttons, but the game engine intercepts moves played out-of-turn.

The player listed as dealer, has moves available from his turn context, and presses in Stage.NULL are allowed, but once she is out of ctx.activePlayers there should be no side-effect to endStage invocation.  FlipDealer invokes ctx.endTurn and should transition to the first voted context "dealerNorth" | "dealerSouth" if invoked from the phase:"preGame" the turn will flip, but player will stay in current phase.


