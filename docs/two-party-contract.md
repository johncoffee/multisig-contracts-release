
 
# General work flow

Here is the most objective, minimal workflow possible.

We demonstrate how two parties sign a business contract together, using the generic multisig contract. Please start by 
reading the general [readme file](../README.md).

We'll switch between the 1st and 2nd party of the contract during the steps. The wallets if these two would in reality 
be on two physically separated machines, but it's easy to try out this work flow on one machine, using 
multiple terminal windows.

In this example the 1st party owns the contract and is responsible for broadcasting the transaction to the 
Ethereum network.

     
 1.  #### 2nd party
     Create a new wallet `node cli.js register`
     
     gives
          
     ```bash           
     Address: 0x2254c2528e851fcb31a8f73731ae8a23f800e9dd
     Seed:    envelope bullet ball øl appear tongue muffin excuse borrow seven flee pair
     ```
     Note down the 12 word mnemonic and Ethereum address. Give this address to the 1st party,
     it is the _signing address_ used with the multisig contract. 
     
 2.  #### 1st party, the owner 
     Obtain the _signing address_ of the 2nd party, this is needed **before**
     deployment.
     
 3.  Write the new smart contract  
     1. Save the solidity code under `contracts`
     2. Use `truffle compile` to compile Solidity
     3. The artifact will be written to `build/contracts` - be sure to commit the new artifact. 
     
 4.  Notify the 2nd party that you're ready to do a multisig transaction. 
     They will need the addresses of the business contract, and the generic multisig contract

     #### 2nd party

 5.  Use the CLI to make a JSON serialized, partial transaction
     `node cli.js sign --seed "mnemonic words" --dest 0x654 --method activate --multisig 0x231 --from 0x890`
    
     Gives `{"sigV": 28, "sigR": "0x789", "sigS": "0x456"}`
    
 6. Give the partial transaction back to the 1st party, as they will broadcast the complete 
    transaction when ready.
    
 7. #### 1st party
    Broadcast the transaction using `send` 
    
    `node cli.js send '{"sigV":28,"sigR":"0x84b","sigS":"0x6a"}' '{"sigV":28,"sigR":"0xaca","sigS":"0x6b0"}' --from 0x123 --dest 0x345 --multisig 0x678`
    
    Node the `--from` argument, which must be an account paying for the transaction gas. 
