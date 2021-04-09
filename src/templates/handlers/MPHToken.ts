import { BigDecimal, Address, ethereum } from "@graphprotocol/graph-ts";

import {MPHToken} from '../generated/contracts/MPHToken' 

import { DPoolList, DPool, User, UserTotalDeposit, Deposit, Funder, FunderTotalInterest, Funding, MPHHolder, MPH } from '../generated/models/models'
type Approval = any;
export function ApprovalHandler(event: Approval): void {
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
type Transfer = any;
export function TransferHandler(event: Transfer): void {
  //test template (importing into the handler files)
console.log(event);

}

//attaching multiple handler at the same time
