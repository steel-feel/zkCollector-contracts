import {
    Field,
    ZkProgram,
    MerkleWitness,
    Poseidon,
} from 'o1js';

const height = 20;
export class MerkleWitness20 extends MerkleWitness(height) { }

export const liteEngine = ZkProgram({
    name: "liteEngine",
    //tree root
    publicInput: Field,
    methods: {
        addItem: {
            privateInputs: [Field,Field,MerkleWitness20],
            method: (state: Field, x: Field, y:Field , witness: MerkleWitness20) => {
                const root = witness.calculateRoot( Poseidon.hash( [x,y]  ) )
                state.assertEquals(root)
            }
        }

    }

})