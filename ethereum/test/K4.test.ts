import { K4Instance } from '../build/contract-interfaces'
import { fundContract } from './helpers.js'

const K4 = artifacts.require("K4")

contract('K4', ([deployer, account1]) => {
  let instance:K4Instance
  let owner:string = deployer

  // beforeEach(async () => {
  //   const paymentsTo = '0xa544f13c3d3f59c01ef2a6f1c0f302fe1fc69458'
  //   instance = await ComplexContract.new(deployer, paymentsTo)
  // })

  beforeEach(async () => {
    instance = await K4.new(owner, account1)
  })

  describe('public fields ', () => {
    it("should have a state", async () => {
      const state = await instance.state()
      assert.strictEqual(state.toString(), '1', 'should start in state 1')
    })
    //
    // it("should have a start fee", async () => {
    //   const fee = await instance.startupFee()
    //   expect(fee.toNumber()).to.be.greaterThan(0, 'should start in state 1')
    // })
    //
    // it("should have price", async () => {
    //   const price = await instance.totalPrice()
    //   expect(price.toNumber()).to.be.greaterThan(0, 'should start in state 1')
    // })
    //
    // it("should have terms", async () => {
    //   const c = await instance.terms()
    //   assert.isFalse(c.toString() === '0x0000000000000000000000000000000000000000000000000000000000000000', "terms should be set to some bytes")
    // })
  })


  describe('constructor', () => {
    it("should be payable", async () => {
      await fundContract(deployer, instance.address)
    })
  })

  // describe('goToNextState()' ,() => {
  //
  //   it("should through states 2-3", async () => {
  //
  //     const state1 = await instance.state()
  //     assert.isTrue(state1.eq('1', 10), 'should start in state 1')
  //
  //     const paymentsTo = await instance.paymentsTo()
  //
  //     const startupFee = await instance.startupFee()
  //     await web3.eth.sendTransaction({
  //       from: deployer,
  //       to: paymentsTo,
  //       value: web3.toWei(startupFee.toString(), 'wei'),
  //     })
  //
  //     await instance.goToNextState({from: deployer})
  //
  //     const state2 = await instance.state()
  //     assert.isTrue(state2.eq('2'), 'should start in state 2')
  //
  //     const totalPrice = await instance.totalPrice()
  //     await web3.eth.sendTransaction({
  //       from: deployer,
  //       to: paymentsTo,
  //       value: web3.toWei(totalPrice.minus(startupFee).toString(), 'wei'),
  //     })
  //     await instance.goToNextState({from: deployer})
  //
  //     const state3 = await instance.state()
  //     assert.isTrue(state3.eq('3'), 'should start in state 3')
  //   })
  // })
})

export {}
