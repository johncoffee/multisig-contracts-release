pragma solidity ^0.4.0;

import '../Owned.sol';
import "../ICommonState.sol";

contract HasSubcontracts is ICommonState, Owned {

    // states: 1 = draft
    //         2 = active
    //         3 = terminated
    uint public state = 1; // defaults to draft

    bytes32 public constant terms = 0x111;

    address public paymentsTo;
    address public initiator;
    address public serviceProvider;

    ICommonState subcontract;

    constructor(address _owner, address _paymentsTo, address _serviceProvider)
    Owned(_owner) public {
        paymentsTo = _paymentsTo;
        serviceProvider = _serviceProvider;
        initiator = msg.sender; // note we've assumed this is msg.sender!
    }

    function add(ICommonState _add) external {
        require(msg.sender == initiator, "Sender was not initiator");
        subcontract = _add;
    }

    function goToNextState() external ownerOnly {
        uint nextState = state + 1;
        if (nextState == 3) {
            require(countState(3) == 1, "All subcontract was not terminated");
        }
        state = nextState;
    }

    function countState(uint _state) public constant returns(uint) {
        uint count = 0;
        if (subcontract.getState() == _state) {
            count++;
        }
        return count;
    }

    // implementation of ICommonState
    function getState() external constant returns(uint) {
        return state;
    }
    function countSubcontracts() external constant returns(uint) {
        return 1;
    }
    function getSubcontract(uint _index) external constant returns(address) {
        return subcontract;
    }
}
