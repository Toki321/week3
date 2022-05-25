//[assignment] write your own unit test to show that your Mastermind variation circuit is working as expected
const buildPoseidon = require("circomlibjs").buildPoseidon;


const chai = require("chai");
const path = require("path");

const wasm_tester = require("circom_tester").wasm;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const assert = chai.assert;

describe("MastermindVariation.circom", function () {
    this.timeout(100000000);

    it("Mastermind variation", async () => {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
        //await circuit.loadConstraints();
        const salt = ethers.BigNumber.from(ethers.utils.randomBytes(32));
        poseidonJs = await buildPoseidon();
        const posPub = ethers.BigNumber.from(poseidonJs.F.toObject(poseidonJs([salt, 2, 5, 3, 1])));

        const INPUT = {
            "pubGuessA": "2",
            "pubGuessB": "5",
            "pubGuessC": "3",
            "pubGuessD": "1",

            "pubNumHit": "4",
            "pubNumBlow": "0",

            "pubSolnHash": posPub,
            "privSalt": salt,
            "privSolnA": "2",
            "privSolnB": "5",
            "privSolnC": "3",
            "privSolnD": "1"
        }

        const witness = await circuit.calculateWitness(INPUT, true);

        //console.log(witness);

        //assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[2]),Fr.e(posPub)));
    });
});