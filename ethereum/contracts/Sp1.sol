pragma solidity ^0.4.0;

import './owned.sol';
import "./ICommonState.sol";

contract Sp1 is ICommonState, Owned {

    // states: 1 = draft
    //         2 = active
    //         3 = terminated
    uint public state = 1; // defaults to draft

    // 32 bytes hash of an external document
    bytes32 public constant terms = 0x123;

    // the price
    uint public constant totalPrice = 60000 wei;

    // the address where the price payments goes to
    address public serviceProvider;

    // address of the sub contract
    ICommonState public subcontract;
    // count number of sub contracts (here we only have 1, see also the `add` method)
    uint public numSubcontracts;


    constructor(address _owner, address _serviceProvider)
        Owned(_owner) public {
        serviceProvider = _serviceProvider;
    }

    // sub contracts

    function add(ICommonState _subcontract) public {
        require(msg.sender == serviceProvider);
        numSubcontracts = 1;
        subcontract = ICommonState(_subcontract);
    }

    // state

    function activate() external ownerOnly {
        require(state == 1, "current state was not 1");
        state = 2;
    }

    function terminate() external ownerOnly {
        require(state == 2, "current state was not 2");

        require(serviceProvider.balance >= totalPrice, "payment address did not hold enough ether to enter state 3");

        require(subcontract.getState() == 3, "subcontract state was not 3");

        state = 3;
    }

    // implementation of ICommonState
    function getState() external constant returns(uint) {
        return state;
    }
    function countSubcontracts() external constant returns(uint) {
        return numSubcontracts;
    }
    function getSubcontract(uint _index) external constant returns(address) {
        return subcontract;
    }
}
