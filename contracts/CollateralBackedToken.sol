//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.5;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./CollateralToken.sol";

contract CollateralBackedToken is ERC20 {
  CollateralToken private _ct;

  constructor() ERC20("Collateral Backed Token", "CBT") {}

  function balanceLocked() public view returns (uint) {
    return balanceOf(msg.sender) * 2;
  } 
  
  function deposit(uint amount) public {
    _ct.transferFrom(msg.sender, address(this), amount);
    _mint(msg.sender, amount / 2);
  }
  
  function withdraw(uint amount) public {
    _burn(msg.sender, amount / 2);
    _ct.transfer(msg.sender, amount);
  }
}