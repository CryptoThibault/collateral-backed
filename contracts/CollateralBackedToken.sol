//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.5;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CollateralBackedToken is ERC20 {
  IERC20 private _ct;
  uint256 private _rate;


  constructor(address tokenAddress, uint256 rate_) ERC20("Collateral Backed Token", "CBT") {
    _ct = IERC20(tokenAddress);
    _rate = rate_;
  }

  function balanceLocked() public view returns (uint256) {
    return balanceOf(msg.sender) * _rate;
  } 
  
  function deposit(uint256 amount) public {
    _ct.transferFrom(msg.sender, address(this), amount);
    _mint(msg.sender, amount /_rate);
  }
  
  function withdraw(uint256 amount) public {
    _burn(msg.sender, amount / _rate);
    _ct.transfer(msg.sender, amount);
  }
}