import {  Field, verify, Mina, VerificationKey, Poseidon, Signature, Cache } from "o1js"
import { FrontEngine, GameInput,Item } from './front_engine';

describe('Front Engine', () => {

    let verificationKey: VerificationKey,
        Local: any;

    beforeAll(async () => {
        /// Suggestion: Maintain a game version locally and use it set `forceRecompile`
        const result = await FrontEngine.compile({ forceRecompile: true });
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
        
        const nonce = Field(0)
        const nonceSign = Signature.create(account1.privateKey, [nonce]  )

        const proof0 = await FrontEngine.baseCase(initGI,nonceSign,nonce )

        expect(await verify(proof0.toJSON(), verificationKey)).toEqual(true)
    } )
  
    test("Generate proof with new items", async () => {
        const account1 = Local.testAccounts[0];

        const initGI = new GameInput({
            user: account1.publicKey,
            newItemsHash : Poseidon.hash([]),
            onChainHash : Poseidon.hash([]),
        })

        const nonce = Field(0)
        const nonceSign = Signature.create(account1.privateKey, [nonce]  )
        const proof0 = await FrontEngine.baseCase(initGI,nonceSign,nonce )

        const newItem = new Item({
            x : Field(100), 
            y : Field(50)
        })

        const gameInput1 = new GameInput({
           ...proof0.publicInput,
           newItemsHash : Poseidon.hash( [proof0.publicInput.newItemsHash, Poseidon.hash([  newItem.x,newItem.y ])   ]  )
        })

        const proof1 = await FrontEngine.addItem(  gameInput1, proof0, newItem  )

        expect(await verify(proof1.toJSON(), verificationKey)).toEqual(true)
    })

    ///TODO: Add negative testcases

})