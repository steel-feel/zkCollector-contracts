/**
 * ZK Program to prove that particular account has 
 * balance in the tree
 */
import {
    Field,
    ZkProgram,
    Struct,
    MerkleMapWitness
} from 'o1js';

export class ScoreInput extends Struct({
    userId: Field,
    score: Field,
    root: Field
}) { }

export const scoreEngine = ZkProgram({
    name: "scoreEngine",
    //tree root
    publicInput: ScoreInput,
    methods: {
        checkScore: {
            privateInputs: [MerkleMapWitness],
            method: (state: ScoreInput, witness: MerkleMapWitness) => {
                const [ root, key ] = witness.computeRootAndKey( state.score )
                state.root.assertEquals(root)
                state.userId.assertEquals(key)
            }
        }

    }

})