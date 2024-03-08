import {
    PublicKey,
    Field,
    Struct,
    ZkProgram,
    SelfProof,
    Poseidon,
    Signature,
} from 'o1js';

export class GameInput extends Struct({
    user: PublicKey,
    onChainHash: Field,
    newItemsHash: Field
}) { }

export class Item extends Struct({
    x: Field,
    y: Field,
}) {

}

export const GameEngine = ZkProgram({
    name: "gameengine",
    publicInput: GameInput,

    methods: {

        baseCase: {
            privateInputs: [Signature, Field],
            method(newState: GameInput, signature: Signature, nonce: Field ) {
                signature.verify(newState.user, [nonce]).assertTrue()
                newState.newItemsHash.assertEquals( Poseidon.hash([]) )
            }
        },


        addItem: {
            privateInputs: [SelfProof, Item],
            method(newState: GameInput, earlierProof: SelfProof<GameInput, void>, item: Item) {
                earlierProof.verify()

                newState.newItemsHash.assertEquals(Poseidon.hash( [  earlierProof.publicInput.newItemsHash, Poseidon.hash([  item.x,item.y ])   ]  ) )
            }
        }



    }


})


