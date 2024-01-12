import { MerkleTree, Poseidon, Field, MerkleMap } from "o1js"

/// add treasure sites
const Tree = new MerkleMap();;

Tree.set(Field.from(0), Poseidon.hash([Field.from(12), Field.from(13)]));
Tree.set(Field.from(1), Poseidon.hash([Field.from(14), Field.from(15)]));
Tree.set(Field.from(2), Poseidon.hash([Field.from(16), Field.from(17)]));
Tree.set(Field.from(3), Poseidon.hash([Field.from(18), Field.from(19)]));

const initialCommitment = Tree.getRoot();

export { initialCommitment, Tree }