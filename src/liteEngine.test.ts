import { Field, verify, Mina, VerificationKey,MerkleWitness ,Poseidon, Signature, Cache, Circuit, CircuitString, MerkleTree } from "o1js"
import {liteEngine,MerkleWitness20} from './liteEngine'

import {chectLocs as chests} from './constants'


describe.only('Lite Engine', () => {

    let verificationKey: VerificationKey,
        tree:MerkleTree

    beforeAll(async () => {
        const result = await liteEngine.compile()
        verificationKey = result.verificationKey

        const leaves = chests.map(( item ) => {
            return Poseidon.hash([ Field(item.x), Field(item.y) ])
        })

        tree = new MerkleTree(20)
        tree.fill(leaves)
    })


    test("check if point is in tree", async () => {
        //calculate item witness
        // const witness = tree.getWitness(1n)
        const index = 1n
        const witness = new MerkleWitness20(tree.getWitness(index));

        const proof0 = await liteEngine.addItem(tree.getRoot(),  Field(chests[1].x), Field(chests[1].y)   ,witness )
        expect(await verify( proof0, verificationKey )).toEqual(true)
    })

})