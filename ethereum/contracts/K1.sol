pragma solidity ^0.4.0;

import "./Owned.sol";
import "./IHasSubcontracts.sol";
import "./CommonStateNames.sol";
import "./ICommonState.sol";

contract K1 is ICommonState, IHasSubcontracts, CommonStateNames, Owned {

    uint public state = DRAFT; // defaults to draft

    // 32 bytes hash of an external document
    bytes32 public documentChecksum;

    // the price
    uint public constant totalPrice = 60000 ether;

    // the address where the price payments goes to
    address public serviceProvider;

    // address of the sub contract
    ICommonState public subcontract;
    // count number of sub contracts (here we only have 1, see also the `add` method)
    uint public numSubcontracts;

    modifier serviceProviderOnly {
        require(msg.sender == serviceProvider);
        _;
    }

    constructor(address _owner, address _serviceProvider)
        Owned(_owner) public {
        serviceProvider = _serviceProvider;
    }

    // IHasSubcontracts

    function add(ICommonState _subcontract) serviceProviderOnly external {
        require(state != TERMINATED, "state must not be TERMINATED when adding subcontract");
        numSubcontracts = 1;
        subcontract = ICommonState(_subcontract);
        require(subcontract.getState() != TERMINATED, "Cant add a TERMINATED subcontract");
    }

    // state

    function activate() external ownerOnly {
        require(state == DRAFT, "current state was not DRAFT");
        state = ACTIVE;
    }

    function terminate() external ownerOnly {
        require(state == ACTIVE, "current state was not DRAFT");
        state = TERMINATED;
    }

    function setDocumentChecksum(bytes32 _checksum) public serviceProviderOnly {
        documentChecksum = _checksum;
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
