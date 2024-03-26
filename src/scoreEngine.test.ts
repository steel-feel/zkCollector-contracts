import { Field, MerkleMap, VerificationKey, verify } from 'o1js';
import { ScoreInput, scoreEngine } from './scoreEngine';

describe('Score Engine', () => {
  let verificationKey: VerificationKey
  beforeAll(async () => {
    const result = await scoreEngine.compile()
    verificationKey = result.verificationKey
  })

  test("should generate proof", async () => {
    const map = new MerkleMap()
    const user1 = Field.random()
    const score1 = Field(100)
    const user2 = Field.random()
    const score2 = Field(200)
    const user3 = Field.random()
    const score3 = Field(300)

    map.set(user1, score1)
    map.set(user2, score2)
    map.set(user3, score3)

    const sInput = new ScoreInput({
      userId: user1,
      score: score1,
      root: map.getRoot()
    })

    const proof = await scoreEngine.checkScore(sInput, map.getWitness(user1))
    expect(await verify(proof, verificationKey)).toEqual(true)

  })


});
