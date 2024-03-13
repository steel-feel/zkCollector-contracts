import {
    PublicKey,
    Field,
    Struct,
    ZkProgram,
    SelfProof,
    Poseidon,
    Signature,
    CircuitString,
} from 'o1js';

export class GameInput extends Struct({
    user: PublicKey,
    onChainHash: Field,
    newItemsHash: Field
}) { }

export class Item extends Struct({
    x: Field,
    y: Field,
    key: Field
}) {

}

export const FrontEngine = ZkProgram({
    name: "frontengine",
    publicInput: GameInput,

    methods: {
        baseCase: {
            privateInputs: [],
            method(newState: GameInput) {
                /**  TODO: signature verificaiton using mina-signer
                /// NEW FLOW ??: let verifying server overload this public input `user` parameter with loggedin user
                **/
                // signature.verify(newState.user, [nonce]).assertTrue()
                newState.newItemsHash.assertEquals(Poseidon.hash([]))
            }
        },

        addItem: {
            privateInputs: [SelfProof, Item],
            method(newState: GameInput, earlierProof: SelfProof<GameInput, void>, item: Item) {
                earlierProof.verify()
                /** 
                 * NOTE: 
                 * TODO: check if user have not updated the its address and onChainHash value
                 * For better UX/UI trust the user with the inputs, 
                */
                // newState.user.assertEquals(earlierProof.publicInput.user)
                // newState.onChainHash.assertEquals(earlierProof.publicInput.onChainHash)
                // newState.newItemIds.assertEquals(CircuitString.fromString( `${earlierProof.publicInput.newItemIds.toString()}${earlierProof.publicInput.newItemIds.toString().length == 0 ? "" : "," }${item.key.toString()}`))
              
                /** 
                 * NOTE:  
                 * Server can recursivley generate and verify the final `ItemHash`
                 * from list of items
                 */
                newState.newItemsHash.assertEquals(Poseidon.hash([earlierProof.publicInput.newItemsHash, Poseidon.hash([item.x, item.y])]))

            }
        }
    }


})


