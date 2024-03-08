import {  Field, verify, Mina, VerificationKey, Poseidon } from "o1js"
import { GameEngine, GameInput,Item } from './game_engine';

describe('checkpoint 2', () => {

    let verificationKey: VerificationKey,
        Local: any;

    beforeAll(async () => {

        //for ZK Program  
        const result = await GameEngine.compile({ forceRecompile: true });
        verificationKey = result.verificationKey;

        const useProof = false;
        Local = Mina.LocalBlockchain({ proofsEnabled: useProof });
        Mina.setActiveInstance(Local);



    })

    test("First proof with empty items" , async () => {
        const account1 = Local.testAccounts[0];

        const initGI = new GameInput({
            user: account1.publicKey,
            newItemsHash : Poseidon.hash([]),
            onChainHash : Poseidon.hash([]),
        })
    
        const proof0 = await GameEngine.baseCase(initGI)

        expect(await verify(proof0.toJSON(), verificationKey)).toEqual(true)
    } )
  
    test("generate proof with new items", async () => {
        const account1 = Local.testAccounts[0];

        const initGI = new GameInput({
            user: account1.publicKey,
            newItemsHash : Poseidon.hash([]),
            onChainHash : Poseidon.hash([]),
        })

        const proof0 = await GameEngine.baseCase(initGI)

        const newItem = new Item({
            x : Field(100), 
            y : Field(50)
        })

        const gameInput1 = new GameInput({
           ...proof0.publicInput,
           newItemsHash : Poseidon.hash( [proof0.publicInput.newItemsHash, Poseidon.hash([  newItem.x,newItem.y ])   ]  )
        })

        const proof1 = await GameEngine.addItem(  gameInput1, proof0, newItem  )

        expect(await verify(proof1.toJSON(), verificationKey)).toEqual(true)
    } )


})