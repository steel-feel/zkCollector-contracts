import {
    SmartContract,
    method,
    Permissions,
    PublicKey,
    Bool,
    state,
    State,
    Field,
    Struct,
    ZkProgram,
    SelfProof,
    Poseidon,
    CircuitString,
    MerkleMap,
    Provable,
} from 'o1js';

import { chectLocs } from "./constants.js"


export class GameInput extends Struct({
    user: PublicKey,
    onChainHash: Field,
    newItemsHash: Field
}) { }


//Create a map out of chests
/*

let ITEMMAP = new Map<Field, CircuitString>()
for(var item of chectLocs ) {
    ITEMMAP.set(  Poseidon.hash( [Field(item.x), Field(item.y)] )  , CircuitString.fromString(item.key.toString()))
}

*/

//Make merkle map instead of Map

const map = new MerkleMap();

const key = Field(100);
const value = Field(50);

map.set(Poseidon.hash([]), value);
for (var item of chectLocs) {
    map.set(Poseidon.hash([Field(item.x), Field(item.y)]), Field("1"))
}

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
            privateInputs: [],
            method(newState: GameInput) {
                //ToDo: check for correct users address, maybe by signature verification ?

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


