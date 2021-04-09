import { BigDecimal, Address, ethereum } from "@graphprotocol/graph-ts";

import {Rewards} from '../generated/contracts/Rewards' 

import { DPoolList, DPool, User, UserTotalDeposit, Deposit, Funder, FunderTotalInterest, Funding, MPHHolder, MPH } from '../generated/models/models'
type OwnershipTransferred = any;
export function OwnershipTransferredHandler(event: OwnershipTransferred): void {
  //test template (importing into the handler files)
console.log(event);

}

//attaching multiple handler at the same time
type RewardAdded = any;
export function RewardAddedHandler(event: RewardAdded): void {
  //test template (importing into the handler files)
console.log(event);

}

//attaching multiple handler at the same time
type RewardPaid = any;
export function RewardPaidHandler(event: RewardPaid): void {
  //test template (importing into the handler files)
console.log(event);

}

//attaching multiple handler at the same time
type Staked = any;
export function StakedHandler(event: Staked): void {
  //test template (importing into the handler files)
console.log(event);

}

//attaching multiple handler at the same time
type Withdrawn = any;
export function WithdrawnHandler(event: Withdrawn): void {
  //test template (importing into the handler files)
console.log(event);

}

//attaching multiple handler at the same time
