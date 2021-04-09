import { BigDecimal, Address, ethereum } from "@graphprotocol/graph-ts";

import {DInterest} from '../generated/contracts/DInterest' 
import {IInterestOracle} from '../generated/contracts/IInterestOracle' 
import {ERC20} from '../generated/contracts/ERC20' 
import {MPHMinter} from '../generated/contracts/MPHMinter' 

import { DPoolList, DPool, User, UserTotalDeposit, Deposit, Funder, FunderTotalInterest, Funding, MPHHolder, MPH } from '../generated/models/models'
type EDeposit = any;
export function EDepositHandler(event: EDeposit): void {
  //test template (importing into the handler files)
console.log(event);

}

//attaching multiple handler at the same time
type EFund = any;
export function EFundHandler(event: EFund): void {
  //test template (importing into the handler files)
console.log(event);

}

//attaching multiple handler at the same time
type ESetParamAddress = any;
export function ESetParamAddressHandler(event: ESetParamAddress): void {
  //test template (importing into the handler files)
console.log(event);

}

//attaching multiple handler at the same time
type ESetParamUint = any;
export function ESetParamUintHandler(event: ESetParamUint): void {
  //test template (importing into the handler files)
console.log(event);

}

//attaching multiple handler at the same time
type EWithdraw = any;
export function EWithdrawHandler(event: EWithdraw): void {
  //test template (importing into the handler files)
console.log(event);

}

//attaching multiple handler at the same time
type OwnershipTransferred = any;
export function OwnershipTransferredHandler(event: OwnershipTransferred): void {
  //test template (importing into the handler files)
console.log(event);

}

//attaching multiple handler at the same time
