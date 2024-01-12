import {
    SmartContract,
    Poseidon,
    Field,
    State,
    state,
    PublicKey,
    Mina,
    method,
    UInt32,
    PrivateKey,
    AccountUpdate,
    MerkleTree,
    MerkleWitness,
    Struct,
    MerkleMapWitness,
} from 'o1js';

// we need the initiate tree root in order to tell the contract about our off-chain storage
import { initialCommitment } from "./constants"

export class Game extends SmartContract {
    // a commitment is a cryptographic primitive that allows us to commit to data, with the ability to "reveal" it later
    @state(Field) commitment = State<Field>();

    events = {
        "user-found-treasure": PublicKey
    }

    init() {
        super.init();
        this.commitment.set(initialCommitment);
    }

    @method foundTreasure(x: Field, y: Field, path: MerkleMapWitness) {
        let commitment = this.commitment.get();
        this.commitment.requireEquals(commitment);

        const cordinateHash = Poseidon.hash([x, y])

        // we check that the cordinates is within the committed Merkle Tree

        // path.calculateRoot(cordinateHash).assertEquals(commitment);

        const [rootBefore,] = path.computeRootAndKey(cordinateHash)
        this.commitment.requireEquals(rootBefore);

        this.emitEvent("user-found-treasure", this.sender);
    }

}