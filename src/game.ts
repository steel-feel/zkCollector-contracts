import {
    SmartContract,
    Poseidon,
    Field,
    State,
    state,
    PublicKey,
    method,
    Struct,
    MerkleMapWitness,
    Reducer,
    Bool,
} from 'o1js';

// we need the initiate tree root in order to tell the contract about our off-chain storage
import { initialCommitment } from "./constants.js"


class UserTreasure extends Struct({ user: PublicKey, x: Field, y: Field }) { }

export class Game extends SmartContract {
    // a commitment is a cryptographic primitive that allows us to commit to data, with the ability to "reveal" it later
    @state(Field) commitment = State<Field>();

    //Map for storing user enrollment
    reducer = Reducer({
        actionType: UserTreasure,
    });

    init() {
        super.init();
        this.commitment.set(initialCommitment);
    }

    @method foundTreasure(x: Field, y: Field, path: MerkleMapWitness) {
        let commitment = this.commitment.get();
        this.commitment.requireEquals(commitment);

        const cordinateHash = Poseidon.hash([x, y])

        // we check that the cordinates is within the committed Merkle Tree
        const [rootBefore,] = path.computeRootAndKey(cordinateHash)
        this.commitment.requireEquals(rootBefore);

        //check if previously commited
        // past actions 
        let pendingActions = this.reducer.getActions({ fromActionState: Reducer.initialActionState })

        // initial state of reducer
        let initial = {
            state: Bool(false),
            actionState: Reducer.initialActionState,
        };

        // checking if the user already exists within the actions
        let { state: exists } = this.reducer.reduce(
            pendingActions,
            Bool,
            (state: Bool, action: UserTreasure) => {

                const cond1 = action.user.equals(this.sender)
                    .and(action.x.equals(x))
                    .and(action.y.equals(y));

                return cond1.or(state);
            },
            // initial state
            initial
        );

        exists.assertFalse()

        const toEmit = new UserTreasure({
            x,y,user:this.sender
        })

        this.reducer.dispatch(toEmit);
    }

}