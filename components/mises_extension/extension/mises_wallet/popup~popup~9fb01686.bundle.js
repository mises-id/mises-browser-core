(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[16],{

/***/ 1014:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HasMapStore = void 0;
const mobx_1 = __webpack_require__(5);
class HasMapStore {
    constructor(creater) {
        this.creater = creater;
        this.map = new Map();
        mobx_1.makeObservable(this);
    }
    get(key) {
        if (!this.map.has(key)) {
            const query = this.creater(key);
            mobx_1.runInAction(() => {
                this.map.set(key, query);
            });
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.map.get(key);
    }
    has(key) {
        return this.map.has(key);
    }
}
__decorate([
    mobx_1.observable.shallow
], HasMapStore.prototype, "map", void 0);
exports.HasMapStore = HasMapStore;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 119:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(1014), exports);
__exportStar(__webpack_require__(1233), exports);
__exportStar(__webpack_require__(1423), exports);
__exportStar(__webpack_require__(1424), exports);
__exportStar(__webpack_require__(1425), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1233:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(1421), exports);
__exportStar(__webpack_require__(1422), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1235:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(1431), exports);
__exportStar(__webpack_require__(1237), exports);
__exportStar(__webpack_require__(1236), exports);
__exportStar(__webpack_require__(1432), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1236:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryGovParamDeposit = exports.ObservableQueryGovParamVoting = exports.ObservableQueryGovParamTally = void 0;
const chain_query_1 = __webpack_require__(59);
class ObservableQueryGovParamTally extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter) {
        super(kvStore, chainId, chainGetter, `/cosmos/gov/v1beta1/params/tallying`);
    }
}
exports.ObservableQueryGovParamTally = ObservableQueryGovParamTally;
class ObservableQueryGovParamVoting extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter) {
        super(kvStore, chainId, chainGetter, `/cosmos/gov/v1beta1/params/voting`);
    }
}
exports.ObservableQueryGovParamVoting = ObservableQueryGovParamVoting;
class ObservableQueryGovParamDeposit extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter) {
        super(kvStore, chainId, chainGetter, `/cosmos/gov/v1beta1/params/deposit`);
    }
}
exports.ObservableQueryGovParamDeposit = ObservableQueryGovParamDeposit;
//# sourceMappingURL=params.js.map

/***/ }),

/***/ 1237:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryProposal = void 0;
const chain_query_1 = __webpack_require__(59);
const types_1 = __webpack_require__(1238);
const mobx_1 = __webpack_require__(5);
const unit_1 = __webpack_require__(26);
class ObservableQueryProposal extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter, _raw, governance) {
        super(kvStore, chainId, chainGetter, `/cosmos/gov/v1beta1/proposals/${_raw.proposal_id}/tally`);
        this._raw = _raw;
        this.governance = governance;
        mobx_1.makeObservable(this);
    }
    canFetch() {
        return this.proposalStatus === types_1.ProposalStatus.VOTING_PERIOD;
    }
    get raw() {
        return this._raw;
    }
    get proposalStatus() {
        switch (this.raw.status) {
            case "PROPOSAL_STATUS_DEPOSIT_PERIOD":
                return types_1.ProposalStatus.DEPOSIT_PERIOD;
            case "PROPOSAL_STATUS_VOTING_PERIOD":
                return types_1.ProposalStatus.VOTING_PERIOD;
            case "PROPOSAL_STATUS_PASSED":
                return types_1.ProposalStatus.PASSED;
            case "PROPOSAL_STATUS_REJECTED":
                return types_1.ProposalStatus.REJECTED;
            case "PROPOSAL_STATUS_FAILED":
                return types_1.ProposalStatus.FAILED;
            default:
                return types_1.ProposalStatus.UNSPECIFIED;
        }
    }
    get id() {
        return this.raw.proposal_id;
    }
    get title() {
        return this.raw.content.title;
    }
    get description() {
        return this.raw.content.description;
    }
    get turnout() {
        const pool = this.governance.getQueryPool();
        const bondedTokenDec = pool.bondedTokens.toDec();
        if (!pool.response || bondedTokenDec.equals(new unit_1.Dec(0))) {
            return new unit_1.IntPretty(new unit_1.Dec(0)).ready(false);
        }
        const tally = this.tally;
        const tallySum = tally.yes
            .add(tally.no)
            .add(tally.abstain)
            .add(tally.noWithVeto);
        // TODO: Use `RatePretty`
        return new unit_1.IntPretty(tallySum
            .toDec()
            .quoTruncate(bondedTokenDec)
            .mulTruncate(unit_1.DecUtils.getPrecisionDec(2))).ready(tally.yes.isReady);
    }
    /**
     * Return the voting tally.
     * If the proposal status is passed or rejected, it returns the final tally of the proposal.
     * If the proposal status is in voting period, it queries the tally to the rest endpoint.
     * If the querying of tally is not completed, it return the tally with all 0 with not ready option.
     */
    get tally() {
        const stakeCurrency = this.chainGetter.getChain(this.chainId).stakeCurrency;
        if (this.proposalStatus !== types_1.ProposalStatus.VOTING_PERIOD) {
            return {
                yes: new unit_1.IntPretty(new unit_1.Int(this.raw.final_tally_result.yes))
                    .moveDecimalPointLeft(stakeCurrency.coinDecimals)
                    .maxDecimals(stakeCurrency.coinDecimals),
                no: new unit_1.IntPretty(new unit_1.Int(this.raw.final_tally_result.no))
                    .moveDecimalPointLeft(stakeCurrency.coinDecimals)
                    .maxDecimals(stakeCurrency.coinDecimals),
                abstain: new unit_1.IntPretty(new unit_1.Int(this.raw.final_tally_result.abstain))
                    .moveDecimalPointLeft(stakeCurrency.coinDecimals)
                    .maxDecimals(stakeCurrency.coinDecimals),
                noWithVeto: new unit_1.IntPretty(new unit_1.Int(this.raw.final_tally_result.no_with_veto))
                    .moveDecimalPointLeft(stakeCurrency.coinDecimals)
                    .maxDecimals(stakeCurrency.coinDecimals),
            };
        }
        if (!this.response) {
            return {
                yes: new unit_1.IntPretty(new unit_1.Int(0))
                    .ready(false)
                    .moveDecimalPointLeft(stakeCurrency.coinDecimals)
                    .maxDecimals(stakeCurrency.coinDecimals),
                no: new unit_1.IntPretty(new unit_1.Int(0))
                    .ready(false)
                    .moveDecimalPointLeft(stakeCurrency.coinDecimals)
                    .maxDecimals(stakeCurrency.coinDecimals),
                abstain: new unit_1.IntPretty(new unit_1.Int(0))
                    .ready(false)
                    .moveDecimalPointLeft(stakeCurrency.coinDecimals)
                    .maxDecimals(stakeCurrency.coinDecimals),
                noWithVeto: new unit_1.IntPretty(new unit_1.Int(0))
                    .ready(false)
                    .moveDecimalPointLeft(stakeCurrency.coinDecimals)
                    .maxDecimals(stakeCurrency.coinDecimals),
            };
        }
        return {
            yes: new unit_1.IntPretty(new unit_1.Int(this.response.data.tally.yes))
                .moveDecimalPointLeft(stakeCurrency.coinDecimals)
                .maxDecimals(stakeCurrency.coinDecimals),
            no: new unit_1.IntPretty(new unit_1.Int(this.response.data.tally.no))
                .moveDecimalPointLeft(stakeCurrency.coinDecimals)
                .maxDecimals(stakeCurrency.coinDecimals),
            abstain: new unit_1.IntPretty(new unit_1.Int(this.response.data.tally.abstain))
                .moveDecimalPointLeft(stakeCurrency.coinDecimals)
                .maxDecimals(stakeCurrency.coinDecimals),
            noWithVeto: new unit_1.IntPretty(new unit_1.Int(this.response.data.tally.no_with_veto))
                .moveDecimalPointLeft(stakeCurrency.coinDecimals)
                .maxDecimals(stakeCurrency.coinDecimals),
        };
    }
    get total() {
        const tally = this.tally;
        const tallySum = tally.yes
            .add(tally.no)
            .add(tally.abstain)
            .add(tally.noWithVeto);
        const stakeCurrency = this.chainGetter.getChain(this.chainId).stakeCurrency;
        return new unit_1.CoinPretty(stakeCurrency, tallySum);
    }
    get tallyRatio() {
        const tally = this.tally;
        const tallySum = tally.yes
            .add(tally.no)
            .add(tally.abstain)
            .add(tally.noWithVeto);
        if (tallySum.toDec().equals(new unit_1.Dec(0))) {
            return {
                yes: new unit_1.IntPretty(new unit_1.Int(0)).ready(false),
                no: new unit_1.IntPretty(new unit_1.Int(0)).ready(false),
                abstain: new unit_1.IntPretty(new unit_1.Int(0)).ready(false),
                noWithVeto: new unit_1.IntPretty(new unit_1.Int(0)).ready(false),
            };
        }
        // TODO: Use `RatePretty`
        return {
            yes: new unit_1.IntPretty(tally.yes
                .toDec()
                .quoTruncate(tallySum.toDec())
                .mulTruncate(unit_1.DecUtils.getPrecisionDec(2))).ready(tally.yes.isReady),
            no: new unit_1.IntPretty(tally.no
                .toDec()
                .quoTruncate(tallySum.toDec())
                .mulTruncate(unit_1.DecUtils.getPrecisionDec(2))).ready(tally.no.isReady),
            abstain: new unit_1.IntPretty(tally.abstain
                .toDec()
                .quoTruncate(tallySum.toDec())
                .mulTruncate(unit_1.DecUtils.getPrecisionDec(2))).ready(tally.abstain.isReady),
            noWithVeto: new unit_1.IntPretty(tally.noWithVeto
                .toDec()
                .quoTruncate(tallySum.toDec())
                .mulTruncate(unit_1.DecUtils.getPrecisionDec(2))).ready(tally.noWithVeto.isReady),
        };
    }
}
__decorate([
    mobx_1.computed
], ObservableQueryProposal.prototype, "turnout", null);
__decorate([
    mobx_1.computed
], ObservableQueryProposal.prototype, "tally", null);
__decorate([
    mobx_1.computed
], ObservableQueryProposal.prototype, "total", null);
__decorate([
    mobx_1.computed
], ObservableQueryProposal.prototype, "tallyRatio", null);
exports.ObservableQueryProposal = ObservableQueryProposal;
//# sourceMappingURL=proposal.js.map

/***/ }),

/***/ 1238:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalStatus = void 0;
// This is not the type for result of query.
var ProposalStatus;
(function (ProposalStatus) {
    ProposalStatus[ProposalStatus["UNSPECIFIED"] = 0] = "UNSPECIFIED";
    ProposalStatus[ProposalStatus["DEPOSIT_PERIOD"] = 1] = "DEPOSIT_PERIOD";
    ProposalStatus[ProposalStatus["VOTING_PERIOD"] = 2] = "VOTING_PERIOD";
    ProposalStatus[ProposalStatus["PASSED"] = 3] = "PASSED";
    ProposalStatus[ProposalStatus["REJECTED"] = 4] = "REJECTED";
    ProposalStatus[ProposalStatus["FAILED"] = 5] = "FAILED";
})(ProposalStatus = exports.ProposalStatus || (exports.ProposalStatus = {}));
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 1239:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(1433), exports);
__exportStar(__webpack_require__(1434), exports);
__exportStar(__webpack_require__(1435), exports);
__exportStar(__webpack_require__(1436), exports);
__exportStar(__webpack_require__(1442), exports);
__exportStar(__webpack_require__(1443), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1240:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(1444), exports);
__exportStar(__webpack_require__(1445), exports);
__exportStar(__webpack_require__(1446), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1241:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryAccount = exports.ObservableQueryAccountInner = void 0;
const chain_query_1 = __webpack_require__(59);
const mobx_1 = __webpack_require__(5);
const cosmos_1 = __webpack_require__(16);
class ObservableQueryAccountInner extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter, bech32Address) {
        super(kvStore, chainId, chainGetter, `/cosmos/auth/v1beta1/accounts/${bech32Address}`);
        this.bech32Address = bech32Address;
        mobx_1.makeObservable(this);
    }
    canFetch() {
        // If bech32 address is empty, it will always fail, so don't need to fetch it.
        return this.bech32Address.length > 0;
    }
    get sequence() {
        if (!this.response) {
            return "0";
        }
        // XXX: In launchpad, the status was 200 even if the account not exist.
        //      However, from stargate, the status becomes 404 if the account not exist.
        //      This case has not been dealt with yet.
        //      However, in the case of 404, it will be treated as an error, and in this case the sequence should be 0.
        try {
            const account = cosmos_1.BaseAccount.fromProtoJSON(this.response.data, this.bech32Address);
            return account.getSequence().toString();
        }
        catch (_a) {
            return "0";
        }
    }
    get isVestingAccount() {
        var _a;
        if (!this.response) {
            return false;
        }
        return !!((_a = this.response.data) === null || _a === void 0 ? void 0 : _a.account.base_vesting_account);
    }
}
__decorate([
    mobx_1.computed
], ObservableQueryAccountInner.prototype, "sequence", null);
__decorate([
    mobx_1.computed
], ObservableQueryAccountInner.prototype, "isVestingAccount", null);
exports.ObservableQueryAccountInner = ObservableQueryAccountInner;
class ObservableQueryAccount extends chain_query_1.ObservableChainQueryMap {
    constructor(kvStore, chainId, chainGetter) {
        super(kvStore, chainId, chainGetter, (bech32Address) => {
            return new ObservableQueryAccountInner(this.kvStore, this.chainId, this.chainGetter, bech32Address);
        });
        this.kvStore = kvStore;
        this.chainId = chainId;
        this.chainGetter = chainGetter;
    }
    getQueryBech32Address(bech32Address) {
        return this.get(bech32Address);
    }
}
exports.ObservableQueryAccount = ObservableQueryAccount;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1242:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(1447), exports);
__exportStar(__webpack_require__(1448), exports);
__exportStar(__webpack_require__(1449), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1243:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(1450), exports);
__exportStar(__webpack_require__(1451), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1244:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryCw20BalanceRegistry = exports.ObservableQueryCw20BalanceInner = exports.ObservableQueryCw20Balance = void 0;
const mobx_1 = __webpack_require__(5);
const common_1 = __webpack_require__(27);
const unit_1 = __webpack_require__(26);
const balances_1 = __webpack_require__(509);
const contract_query_1 = __webpack_require__(1245);
class ObservableQueryCw20Balance extends contract_query_1.ObservableCosmwasmContractChainQuery {
    constructor(kvStore, chainId, chainGetter, contractAddress, bech32Address) {
        super(kvStore, chainId, chainGetter, contractAddress, {
            balance: { address: bech32Address },
        });
        this.contractAddress = contractAddress;
        this.bech32Address = bech32Address;
    }
    canFetch() {
        return super.canFetch() && this.bech32Address !== "";
    }
}
exports.ObservableQueryCw20Balance = ObservableQueryCw20Balance;
class ObservableQueryCw20BalanceInner extends balances_1.ObservableQueryBalanceInner {
    constructor(kvStore, chainId, chainGetter, denomHelper, bech32Address) {
        super(kvStore, chainId, chainGetter, 
        // No need to set the url at initial.
        "", denomHelper);
        this.bech32Address = bech32Address;
        mobx_1.makeObservable(this);
        this.queryCw20Balance = new ObservableQueryCw20Balance(kvStore, chainId, chainGetter, denomHelper.contractAddress, bech32Address);
    }
    // This method doesn't have the role because the fetching is actually exeucnted in the `ObservableQueryCw20Balance`.
    canFetch() {
        return false;
    }
    *fetch() {
        yield this.queryCw20Balance.fetch();
    }
    get balance() {
        const denom = this.denomHelper.denom;
        const chainInfo = this.chainGetter.getChain(this.chainId);
        const currency = chainInfo.currencies.find((cur) => cur.coinMinimalDenom === denom);
        // TODO: Infer the currency according to its denom (such if denom is `uatom` -> `Atom` with decimal 6)?
        if (!currency) {
            throw new Error(`Unknown currency: ${denom}`);
        }
        if (!this.queryCw20Balance.response ||
            !this.queryCw20Balance.response.data.balance) {
            return new unit_1.CoinPretty(currency, new unit_1.Int(0)).ready(false);
        }
        return new unit_1.CoinPretty(currency, new unit_1.Int(this.queryCw20Balance.response.data.balance));
    }
}
__decorate([
    mobx_1.override
], ObservableQueryCw20BalanceInner.prototype, "fetch", null);
__decorate([
    mobx_1.computed
], ObservableQueryCw20BalanceInner.prototype, "balance", null);
exports.ObservableQueryCw20BalanceInner = ObservableQueryCw20BalanceInner;
class ObservableQueryCw20BalanceRegistry {
    constructor(kvStore) {
        this.kvStore = kvStore;
    }
    getBalanceInner(chainId, chainGetter, bech32Address, minimalDenom) {
        const denomHelper = new common_1.DenomHelper(minimalDenom);
        if (denomHelper.type === "cw20") {
            return new ObservableQueryCw20BalanceInner(this.kvStore, chainId, chainGetter, denomHelper, bech32Address);
        }
    }
}
exports.ObservableQueryCw20BalanceRegistry = ObservableQueryCw20BalanceRegistry;
//# sourceMappingURL=cw20-balance.js.map

/***/ }),

/***/ 1245:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableCosmwasmContractChainQuery = void 0;
const chain_query_1 = __webpack_require__(59);
const buffer_1 = __webpack_require__(4);
const mobx_1 = __webpack_require__(5);
class ObservableCosmwasmContractChainQuery extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter, contractAddress, 
    // eslint-disable-next-line @typescript-eslint/ban-types
    obj) {
        super(kvStore, chainId, chainGetter, ObservableCosmwasmContractChainQuery.getUrlFromObj(contractAddress, obj));
        this.contractAddress = contractAddress;
        this.obj = obj;
    }
    onStart() {
        super.onStart();
        return new Promise((resolve) => {
            this.disposer = mobx_1.autorun(() => {
                const chainInfo = this.chainGetter.getChain(this.chainId);
                if (chainInfo.features && chainInfo.features.includes("wasmd_0.24+")) {
                    if (this.url.startsWith("/wasm/v1/")) {
                        this.setUrl(`/cosmwasm${this.url}`);
                    }
                }
                else {
                    if (this.url.startsWith("/cosmwasm/")) {
                        this.setUrl(`${this.url.replace("/cosmwasm", "")}`);
                    }
                }
                resolve();
            });
        });
    }
    onStop() {
        if (this.disposer) {
            this.disposer();
            this.disposer = undefined;
        }
        super.onStop();
    }
    // eslint-disable-next-line @typescript-eslint/ban-types
    static getUrlFromObj(contractAddress, obj) {
        const msg = JSON.stringify(obj);
        const query = buffer_1.Buffer.from(msg).toString("base64");
        return `/wasm/v1/contract/${contractAddress}/smart/${query}`;
    }
    canFetch() {
        return this.contractAddress.length !== 0;
    }
    fetchResponse(abortController) {
        const _super = Object.create(null, {
            fetchResponse: { get: () => super.fetchResponse }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const { response, headers } = yield _super.fetchResponse.call(this, abortController);
            const wasmResult = response.data;
            if (!wasmResult) {
                throw new Error("Failed to get the response from the contract");
            }
            return {
                headers,
                response: {
                    data: wasmResult.data,
                    status: response.status,
                    staled: false,
                    timestamp: Date.now(),
                },
            };
        });
    }
}
exports.ObservableCosmwasmContractChainQuery = ObservableCosmwasmContractChainQuery;
//# sourceMappingURL=contract-query.js.map

/***/ }),

/***/ 1246:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQuerySecretContractCodeHash = exports.ObservableQuerySecretContractCodeHashInner = void 0;
const chain_query_1 = __webpack_require__(59);
class ObservableQuerySecretContractCodeHashInner extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter, contractAddress) {
        super(kvStore, chainId, chainGetter, `/wasm/contract/${contractAddress}/code-hash`);
        this.contractAddress = contractAddress;
    }
    canFetch() {
        return this.contractAddress.length > 0;
    }
}
exports.ObservableQuerySecretContractCodeHashInner = ObservableQuerySecretContractCodeHashInner;
class ObservableQuerySecretContractCodeHash extends chain_query_1.ObservableChainQueryMap {
    constructor(kvStore, chainId, chainGetter) {
        super(kvStore, chainId, chainGetter, (contractAddress) => {
            return new ObservableQuerySecretContractCodeHashInner(this.kvStore, this.chainId, this.chainGetter, contractAddress);
        });
        this.kvStore = kvStore;
        this.chainId = chainId;
        this.chainGetter = chainGetter;
    }
    getQueryContract(contractAddress) {
        return this.get(contractAddress);
    }
}
exports.ObservableQuerySecretContractCodeHash = ObservableQuerySecretContractCodeHash;
//# sourceMappingURL=contract-hash.js.map

/***/ }),

/***/ 1247:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQuerySecret20BalanceRegistry = exports.ObservableQuerySecret20BalanceInner = exports.ObservableQuerySecret20Balance = void 0;
const mobx_1 = __webpack_require__(5);
const common_1 = __webpack_require__(27);
const unit_1 = __webpack_require__(26);
const balances_1 = __webpack_require__(509);
const contract_query_1 = __webpack_require__(1248);
const errors_1 = __webpack_require__(1249);
class ObservableQuerySecret20Balance extends contract_query_1.ObservableSecretContractChainQuery {
    constructor(kvStore, chainId, chainGetter, apiGetter, contractAddress, bech32Address, viewingKey, querySecretContractCodeHash) {
        super(kvStore, chainId, chainGetter, apiGetter, contractAddress, {
            balance: { address: bech32Address, key: viewingKey },
        }, querySecretContractCodeHash);
        this.apiGetter = apiGetter;
        this.contractAddress = contractAddress;
        this.bech32Address = bech32Address;
        this.viewingKey = viewingKey;
        this.querySecretContractCodeHash = querySecretContractCodeHash;
        mobx_1.makeObservable(this);
        if (!this.viewingKey) {
            this.setError({
                status: 0,
                statusText: "Viewing key is empty",
                message: "Viewing key is empty",
            });
        }
    }
    canFetch() {
        return (super.canFetch() && this.bech32Address !== "" && this.viewingKey !== "");
    }
    fetchResponse(abortController) {
        const _super = Object.create(null, {
            fetchResponse: { get: () => super.fetchResponse }
        });
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { response, headers } = yield _super.fetchResponse.call(this, abortController);
            if (response.data["viewing_key_error"]) {
                throw new errors_1.WrongViewingKeyError((_a = response.data["viewing_key_error"]) === null || _a === void 0 ? void 0 : _a.msg);
            }
            return {
                headers,
                response,
            };
        });
    }
}
exports.ObservableQuerySecret20Balance = ObservableQuerySecret20Balance;
class ObservableQuerySecret20BalanceInner extends balances_1.ObservableQueryBalanceInner {
    constructor(kvStore, chainId, chainGetter, apiGetter, denomHelper, bech32Address, querySecretContractCodeHash) {
        super(kvStore, chainId, chainGetter, 
        // No need to set the url at initial.
        "", denomHelper);
        this.apiGetter = apiGetter;
        this.bech32Address = bech32Address;
        this.querySecretContractCodeHash = querySecretContractCodeHash;
        mobx_1.makeObservable(this);
        const viewingKey = (() => {
            const currency = this.currency;
            if ("type" in currency && currency.type === "secret20") {
                return currency.viewingKey;
            }
            return "";
        })();
        this.querySecret20Balance = new ObservableQuerySecret20Balance(kvStore, chainId, chainGetter, this.apiGetter, denomHelper.contractAddress, bech32Address, viewingKey, this.querySecretContractCodeHash);
    }
    // This method doesn't have the role because the fetching is actually exeucnted in the `ObservableQuerySecret20Balance`.
    canFetch() {
        return false;
    }
    *fetch() {
        yield this.querySecret20Balance.fetch();
    }
    get isFetching() {
        return (this.querySecretContractCodeHash.getQueryContract(this.denomHelper.contractAddress).isFetching || this.querySecret20Balance.isFetching);
    }
    get error() {
        return (this.querySecretContractCodeHash.getQueryContract(this.denomHelper.contractAddress).error || this.querySecret20Balance.error);
    }
    get balance() {
        const denom = this.denomHelper.denom;
        const chainInfo = this.chainGetter.getChain(this.chainId);
        const currency = chainInfo.findCurrency(denom);
        // TODO: Infer the currency according to its denom (such if denom is `uatom` -> `Atom` with decimal 6)?
        if (!currency) {
            throw new Error(`Unknown currency: ${denom}`);
        }
        if (!this.querySecret20Balance.response ||
            !this.querySecret20Balance.response.data.balance) {
            return new unit_1.CoinPretty(currency, new unit_1.Int(0)).ready(false);
        }
        return new unit_1.CoinPretty(currency, new unit_1.Int(this.querySecret20Balance.response.data.balance.amount));
    }
}
__decorate([
    mobx_1.override
], ObservableQuerySecret20BalanceInner.prototype, "fetch", null);
__decorate([
    mobx_1.computed
], ObservableQuerySecret20BalanceInner.prototype, "balance", null);
exports.ObservableQuerySecret20BalanceInner = ObservableQuerySecret20BalanceInner;
class ObservableQuerySecret20BalanceRegistry {
    constructor(kvStore, apiGetter, querySecretContractCodeHash) {
        this.kvStore = kvStore;
        this.apiGetter = apiGetter;
        this.querySecretContractCodeHash = querySecretContractCodeHash;
    }
    getBalanceInner(chainId, chainGetter, bech32Address, minimalDenom) {
        const denomHelper = new common_1.DenomHelper(minimalDenom);
        if (denomHelper.type === "secret20") {
            return new ObservableQuerySecret20BalanceInner(this.kvStore, chainId, chainGetter, this.apiGetter, denomHelper, bech32Address, this.querySecretContractCodeHash);
        }
    }
}
exports.ObservableQuerySecret20BalanceRegistry = ObservableQuerySecret20BalanceRegistry;
//# sourceMappingURL=secret20-balance.js.map

/***/ }),

/***/ 1248:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableSecretContractChainQuery = void 0;
const chain_query_1 = __webpack_require__(59);
const common_1 = __webpack_require__(27);
const mobx_1 = __webpack_require__(5);
const buffer_1 = __webpack_require__(4);
class ObservableSecretContractChainQuery extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter, apiGetter, contractAddress, 
    // eslint-disable-next-line @typescript-eslint/ban-types
    obj, querySecretContractCodeHash) {
        // Don't need to set the url initially because it can't request without encyption.
        super(kvStore, chainId, chainGetter, ``);
        this.apiGetter = apiGetter;
        this.contractAddress = contractAddress;
        this.obj = obj;
        this.querySecretContractCodeHash = querySecretContractCodeHash;
        this.keplr = undefined;
        this._isIniting = false;
        mobx_1.makeObservable(this);
    }
    onStart() {
        const _super = Object.create(null, {
            onStart: { get: () => super.onStart }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.onStart.call(this);
            if (!this.keplr) {
                yield this.initKeplr();
            }
            if (!this.keplr) {
                throw new Error("Failed to get keplr");
            }
            yield this.querySecretContractCodeHash
                .getQueryContract(this.contractAddress)
                .waitResponse();
            yield this.init();
        });
    }
    get isFetching() {
        return (this.querySecretContractCodeHash.getQueryContract(this.contractAddress)
            .isFetching ||
            this.keplr == null ||
            this._isIniting ||
            super.isFetching);
    }
    canFetch() {
        if (!this.querySecretContractCodeHash.getQueryContract(this.contractAddress)
            .response) {
            return false;
        }
        return this.contractAddress.length !== 0 && this.nonce != null;
    }
    *initKeplr() {
        this.keplr = yield* common_1.toGenerator(this.apiGetter());
    }
    *init() {
        this._isIniting = true;
        if (this.keplr && this.contractCodeHash) {
            const enigmaUtils = this.keplr.getEnigmaUtils(this.chainId);
            const encrypted = yield* common_1.toGenerator(enigmaUtils.encrypt(this.contractCodeHash, this.obj));
            this.nonce = encrypted.slice(0, 32);
            const encoded = buffer_1.Buffer.from(buffer_1.Buffer.from(encrypted).toString("base64")).toString("hex");
            this.setUrl(`/wasm/contract/${this.contractAddress}/query/${encoded}?encoding=hex`);
        }
        this._isIniting = false;
    }
    fetchResponse(abortController) {
        const _super = Object.create(null, {
            fetchResponse: { get: () => super.fetchResponse }
        });
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            let headers;
            try {
                const fetched = yield _super.fetchResponse.call(this, abortController);
                response = fetched.response;
                headers = fetched.headers;
            }
            catch (e) {
                if ((_b = (_a = e.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) {
                    const encryptedError = e.response.data.error;
                    const errorMessageRgx = /rpc error: code = (.+) = encrypted: (.+): (.+)/g;
                    const rgxMatches = errorMessageRgx.exec(encryptedError);
                    if (rgxMatches != null && rgxMatches.length === 4) {
                        const errorCipherB64 = rgxMatches[2];
                        const errorCipherBz = buffer_1.Buffer.from(errorCipherB64, "base64");
                        if (this.keplr && this.nonce) {
                            const decrypted = yield this.keplr
                                .getEnigmaUtils(this.chainId)
                                .decrypt(errorCipherBz, this.nonce);
                            const errorStr = buffer_1.Buffer.from(decrypted).toString();
                            // If error is from secret wasm chain itself, decrypt the error message and throw it.
                            throw new Error(errorStr);
                        }
                    }
                }
                throw e;
            }
            const encResult = response.data;
            if (!this.keplr) {
                throw new Error("Keplr API not initialized");
            }
            if (!this.nonce) {
                throw new Error("Nonce is unknown");
            }
            if (!encResult) {
                throw new Error("Failed to get the response from the contract");
            }
            const decrypted = yield this.keplr
                .getEnigmaUtils(this.chainId)
                .decrypt(buffer_1.Buffer.from(encResult.result.smart, "base64"), this.nonce);
            const message = buffer_1.Buffer.from(buffer_1.Buffer.from(decrypted).toString(), "base64").toString();
            const obj = JSON.parse(message);
            return {
                headers,
                response: {
                    data: obj,
                    status: response.status,
                    staled: false,
                    timestamp: Date.now(),
                },
            };
        });
    }
    // Actually, the url of fetching the secret20 balance will be changed every time.
    // So, we should save it with deterministic key.
    getCacheKey() {
        return `${this.instance.name}-${this.instance.defaults.baseURL}${this.instance.getUri({
            url: `/wasm/contract/${this.contractAddress}/query/${JSON.stringify(this.obj)}?encoding=json`,
        })}`;
    }
    get contractCodeHash() {
        const queryCodeHash = this.querySecretContractCodeHash.getQueryContract(this.contractAddress);
        if (!queryCodeHash.response) {
            return undefined;
        }
        // Code hash is persistent, so it is safe not to consider that the response is from cache or network.
        // TODO: Handle the error case.
        return queryCodeHash.response.data.result;
    }
}
__decorate([
    mobx_1.observable.ref
], ObservableSecretContractChainQuery.prototype, "keplr", void 0);
__decorate([
    mobx_1.observable
], ObservableSecretContractChainQuery.prototype, "_isIniting", void 0);
__decorate([
    mobx_1.flow
], ObservableSecretContractChainQuery.prototype, "initKeplr", null);
__decorate([
    mobx_1.flow
], ObservableSecretContractChainQuery.prototype, "init", null);
__decorate([
    mobx_1.computed
], ObservableSecretContractChainQuery.prototype, "contractCodeHash", null);
exports.ObservableSecretContractChainQuery = ObservableSecretContractChainQuery;
//# sourceMappingURL=contract-query.js.map

/***/ }),

/***/ 1249:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.WrongViewingKeyError = void 0;
class WrongViewingKeyError extends Error {
    constructor(m) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, WrongViewingKeyError.prototype);
    }
}
exports.WrongViewingKeyError = WrongViewingKeyError;
//# sourceMappingURL=errors.js.map

/***/ }),

/***/ 1250:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryTxFeesFeeTokens = void 0;
const chain_query_1 = __webpack_require__(59);
const mobx_1 = __webpack_require__(5);
const mobx_utils_1 = __webpack_require__(201);
class ObservableQueryTxFeesFeeTokens extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter) {
        super(kvStore, chainId, chainGetter, "/osmosis/txfees/v1beta1/fee_tokens");
        this.isTxFeeToken = mobx_utils_1.computedFn((coinMinimalDnom) => {
            if (!this.response) {
                return false;
            }
            return this.feeCurrenciesDenomMap.get(coinMinimalDnom) === true;
        });
        mobx_1.makeObservable(this);
    }
    setResponse(response) {
        super.setResponse(response);
        const chainInfo = this.chainGetter.getChain(this.chainId);
        const denoms = response.data.fee_tokens.map((token) => token.denom);
        chainInfo.addUnknownCurrencies(...denoms);
    }
    get feeCurrenciesDenomMap() {
        const map = new Map();
        if (!this.response) {
            return map;
        }
        for (const token of this.response.data.fee_tokens) {
            map.set(token.denom, true);
        }
        return map;
    }
    get feeCurrencies() {
        if (!this.response) {
            return [];
        }
        const res = [];
        const chainInfo = this.chainGetter.getChain(this.chainId);
        for (const token of this.response.data.fee_tokens) {
            const currency = chainInfo.findCurrency(token.denom);
            if (currency) {
                res.push(currency);
            }
        }
        return res;
    }
}
__decorate([
    mobx_1.computed
], ObservableQueryTxFeesFeeTokens.prototype, "feeCurrenciesDenomMap", null);
__decorate([
    mobx_1.computed
], ObservableQueryTxFeesFeeTokens.prototype, "feeCurrencies", null);
exports.ObservableQueryTxFeesFeeTokens = ObservableQueryTxFeesFeeTokens;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1251:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryTxFeesSpotPriceByDenom = exports.ObservableQueryTxFeesSpotPriceByDenomInner = void 0;
const chain_query_1 = __webpack_require__(59);
const mobx_1 = __webpack_require__(5);
const unit_1 = __webpack_require__(26);
class ObservableQueryTxFeesSpotPriceByDenomInner extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter, denom) {
        super(kvStore, chainId, chainGetter, `osmosis/txfees/v1beta1/spot_price_by_denom?denom=${denom}`);
        mobx_1.makeObservable(this);
    }
    get poolId() {
        if (!this.response) {
            return "";
        }
        return this.response.data.poolID;
    }
    get spotPriceDec() {
        if (!this.response) {
            return new unit_1.Dec(0);
        }
        return new unit_1.Dec(this.response.data.spot_price);
    }
}
__decorate([
    mobx_1.computed
], ObservableQueryTxFeesSpotPriceByDenomInner.prototype, "spotPriceDec", null);
exports.ObservableQueryTxFeesSpotPriceByDenomInner = ObservableQueryTxFeesSpotPriceByDenomInner;
class ObservableQueryTxFeesSpotPriceByDenom extends chain_query_1.ObservableChainQueryMap {
    constructor(kvStore, chainId, chainGetter) {
        super(kvStore, chainId, chainGetter, (denom) => {
            return new ObservableQueryTxFeesSpotPriceByDenomInner(this.kvStore, this.chainId, this.chainGetter, denom);
        });
        this.kvStore = kvStore;
        this.chainId = chainId;
        this.chainGetter = chainGetter;
    }
    getQueryDenom(denom) {
        return this.get(denom);
    }
}
exports.ObservableQueryTxFeesSpotPriceByDenom = ObservableQueryTxFeesSpotPriceByDenom;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1252:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryTxFeesBaseDenom = void 0;
const chain_query_1 = __webpack_require__(59);
const mobx_1 = __webpack_require__(5);
class ObservableQueryTxFeesBaseDenom extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter) {
        super(kvStore, chainId, chainGetter, "/osmosis/txfees/v1beta1/base_denom");
        mobx_1.makeObservable(this);
    }
    get baseDenom() {
        var _a, _b;
        return (_b = (_a = this.response) === null || _a === void 0 ? void 0 : _a.data.base_denom) !== null && _b !== void 0 ? _b : "";
    }
}
exports.ObservableQueryTxFeesBaseDenom = ObservableQueryTxFeesBaseDenom;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1257:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(1505), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1258:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(1506), exports);
__exportStar(__webpack_require__(1507), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1412:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(1413), exports);
__exportStar(__webpack_require__(862), exports);
__exportStar(__webpack_require__(1414), exports);
__exportStar(__webpack_require__(1417), exports);
__exportStar(__webpack_require__(1418), exports);
__exportStar(__webpack_require__(1420), exports);
__exportStar(__webpack_require__(1426), exports);
__exportStar(__webpack_require__(628), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1413:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 1414:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CosmosAccountImpl = exports.defaultCosmosMsgOpts = exports.CosmosAccount = void 0;
const base_1 = __webpack_require__(862);
const common_1 = __webpack_require__(27);
const unit_1 = __webpack_require__(26);
const tx_1 = __webpack_require__(100);
const signing_1 = __webpack_require__(626);
const keys_1 = __webpack_require__(1415);
const tx_2 = __webpack_require__(619);
const tx_3 = __webpack_require__(625);
const tx_4 = __webpack_require__(620);
const tx_5 = __webpack_require__(623);
const tx_6 = __webpack_require__(621);
const gov_1 = __webpack_require__(622);
const cosmos_1 = __webpack_require__(16);
const types_1 = __webpack_require__(863);
const axios_1 = __importDefault(__webpack_require__(60));
const deepmerge_1 = __importDefault(__webpack_require__(167));
const buffer_1 = __webpack_require__(4);
const utils_1 = __webpack_require__(628);
const web3_1 = __webpack_require__(1416);
const stargate_1 = __webpack_require__(266);
exports.CosmosAccount = {
    use(options) {
        return (base, chainGetter, chainId) => {
            const msgOptsFromCreator = options.msgOptsCreator
                ? options.msgOptsCreator(chainId)
                : undefined;
            return {
                cosmos: new CosmosAccountImpl(base, chainGetter, chainId, options.queriesStore, deepmerge_1.default(exports.defaultCosmosMsgOpts, msgOptsFromCreator ? msgOptsFromCreator : {}), options),
            };
        };
    },
};
/**
 * @deprecated Predict gas through simulation rather than using a fixed gas.
 */
exports.defaultCosmosMsgOpts = {
    send: {
        native: {
            type: "cosmos-sdk/MsgSend",
            gas: 80000,
        },
    },
    ibcTransfer: {
        type: "cosmos-sdk/MsgTransfer",
        gas: 450000,
    },
    delegate: {
        type: "cosmos-sdk/MsgDelegate",
        gas: 250000,
    },
    undelegate: {
        type: "cosmos-sdk/MsgUndelegate",
        gas: 250000,
    },
    redelegate: {
        type: "cosmos-sdk/MsgBeginRedelegate",
        gas: 250000,
    },
    // The gas multiplication per rewards.
    withdrawRewards: {
        type: "cosmos-sdk/MsgWithdrawDelegationReward",
        gas: 140000,
    },
    govVote: {
        type: "cosmos-sdk/MsgVote",
        gas: 250000,
    },
};
class CosmosAccountImpl {
    constructor(base, chainGetter, chainId, queriesStore, _msgOpts, txOpts) {
        this.base = base;
        this.chainGetter = chainGetter;
        this.chainId = chainId;
        this.queriesStore = queriesStore;
        this._msgOpts = _msgOpts;
        this.txOpts = txOpts;
        this.broadcastMode = "sync";
        this.base.registerMakeSendTokenFn(this.processMakeSendTokenTx.bind(this));
        this.base.registerSendTokenFn(this.processSendToken.bind(this));
    }
    /**
     * @deprecated Predict gas through simulation rather than using a fixed gas.
     */
    get msgOpts() {
        return this._msgOpts;
    }
    processMakeSendTokenTx(amount, currency, recipient) {
        const denomHelper = new common_1.DenomHelper(currency.coinMinimalDenom);
        if (denomHelper.type === "native") {
            const actualAmount = (() => {
                let dec = new unit_1.Dec(amount);
                dec = dec.mul(unit_1.DecUtils.getPrecisionDec(currency.coinDecimals));
                return dec.truncate().toString();
            })();
            cosmos_1.Bech32Address.validate(recipient, this.chainGetter.getChain(this.chainId).bech32Config.bech32PrefixAccAddr);
            const msg = {
                type: this.msgOpts.send.native.type,
                value: {
                    from_address: this.base.bech32Address,
                    to_address: recipient,
                    amount: [
                        {
                            denom: currency.coinMinimalDenom,
                            amount: actualAmount,
                        },
                    ],
                },
            };
            return this.makeTx("send", {
                aminoMsgs: [msg],
                protoMsgs: [
                    {
                        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
                        value: tx_2.MsgSend.encode({
                            fromAddress: msg.value.from_address,
                            toAddress: msg.value.to_address,
                            amount: msg.value.amount,
                        }).finish(),
                    },
                ],
                rlpTypes: {
                    MsgValue: [
                        { name: "from_address", type: "string" },
                        { name: "to_address", type: "string" },
                        { name: "amount", type: "TypeAmount[]" },
                    ],
                    TypeAmount: [
                        { name: "denom", type: "string" },
                        { name: "amount", type: "string" },
                    ],
                },
            }, (tx) => {
                if (tx.code == null || tx.code === 0) {
                    // After succeeding to send token, refresh the balance.
                    const queryBalance = this.queries.queryBalances
                        .getQueryBech32Address(this.base.bech32Address)
                        .balances.find((bal) => {
                        return (bal.currency.coinMinimalDenom === currency.coinMinimalDenom);
                    });
                    if (queryBalance) {
                        queryBalance.fetch();
                    }
                }
            });
        }
    }
    /**
     * @deprecated
     */
    processSendToken(amount, currency, recipient, memo, stdFee, signOptions, onTxEvents) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const denomHelper = new common_1.DenomHelper(currency.coinMinimalDenom);
            switch (denomHelper.type) {
                case "native":
                    const actualAmount = (() => {
                        let dec = new unit_1.Dec(amount);
                        dec = dec.mul(unit_1.DecUtils.getPrecisionDec(currency.coinDecimals));
                        return dec.truncate().toString();
                    })();
                    const msg = {
                        type: this.msgOpts.send.native.type,
                        value: {
                            from_address: this.base.bech32Address,
                            to_address: recipient,
                            amount: [
                                {
                                    denom: currency.coinMinimalDenom,
                                    amount: actualAmount,
                                },
                            ],
                        },
                    };
                    yield this.sendMsgs("send", {
                        aminoMsgs: [msg],
                        protoMsgs: [
                            {
                                typeUrl: "/cosmos.bank.v1beta1.MsgSend",
                                value: tx_2.MsgSend.encode({
                                    fromAddress: msg.value.from_address,
                                    toAddress: msg.value.to_address,
                                    amount: msg.value.amount,
                                }).finish(),
                            },
                        ],
                    }, memo, {
                        amount: (_a = stdFee.amount) !== null && _a !== void 0 ? _a : [],
                        gas: (_b = stdFee.gas) !== null && _b !== void 0 ? _b : this.msgOpts.send.native.gas.toString(),
                    }, signOptions, utils_1.txEventsWithPreOnFulfill(onTxEvents, (tx) => {
                        if (tx.code == null || tx.code === 0) {
                            // After succeeding to send token, refresh the balance.
                            const queryBalance = this.queries.queryBalances
                                .getQueryBech32Address(this.base.bech32Address)
                                .balances.find((bal) => {
                                return (bal.currency.coinMinimalDenom === currency.coinMinimalDenom);
                            });
                            if (queryBalance) {
                                queryBalance.fetch();
                            }
                        }
                    }));
                    return true;
            }
            return false;
        });
    }
    sendMsgs(type, msgs, memo = "", fee, signOptions, onTxEvents) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this.base.setTxNotification("");
            this.base.setTxTypeInProgress(type);
            let txHash;
            let signDoc;
            try {
                if (typeof msgs === "function") {
                    msgs = yield msgs();
                }
                const result = yield this.broadcastMsgs(msgs, fee, memo, signOptions, this.broadcastMode);
                txHash = result.txHash;
                signDoc = result.signDoc;
            }
            catch (e) {
                this.base.setTxTypeInProgress("");
                if ((_a = this.txOpts.preTxEvents) === null || _a === void 0 ? void 0 : _a.onBroadcastFailed) {
                    this.txOpts.preTxEvents.onBroadcastFailed(this.chainId, e);
                }
                if (onTxEvents &&
                    "onBroadcastFailed" in onTxEvents &&
                    onTxEvents.onBroadcastFailed) {
                    onTxEvents.onBroadcastFailed(e);
                }
                throw e;
            }
            let onBroadcasted;
            let onFulfill;
            if (onTxEvents) {
                if (typeof onTxEvents === "function") {
                    onFulfill = onTxEvents;
                }
                else {
                    onBroadcasted = onTxEvents.onBroadcasted;
                    onFulfill = onTxEvents.onFulfill;
                }
            }
            if ((_b = this.txOpts.preTxEvents) === null || _b === void 0 ? void 0 : _b.onBroadcasted) {
                this.txOpts.preTxEvents.onBroadcasted(this.chainId, txHash);
            }
            if (onBroadcasted) {
                onBroadcasted(txHash);
            }
            this.txOpts.misesStore
                .portForTx(txHash)
                .then((tx) => {
                var _a;
                this.base.setTxTypeInProgress("");
                this.base.setTxNotification("success");
                setTimeout(() => {
                    this.base.setTxNotification("");
                }, 2000);
                // After sending tx, the balances is probably changed due to the fee.
                for (const feeAmount of signDoc.fee.amount) {
                    const bal = this.queries.queryBalances
                        .getQueryBech32Address(this.base.bech32Address)
                        .balances.find((bal) => bal.currency.coinMinimalDenom === feeAmount.denom);
                    if (bal) {
                        bal.fetch();
                    }
                }
                // Always add the tx hash data.
                if (tx && !tx.hash) {
                    tx.hash = buffer_1.Buffer.from(txHash).toString("hex");
                }
                if ((_a = this.txOpts.preTxEvents) === null || _a === void 0 ? void 0 : _a.onFulfill) {
                    this.txOpts.preTxEvents.onFulfill(this.chainId, tx);
                }
                if (onFulfill) {
                    onFulfill(tx);
                }
            })
                .catch((err) => {
                console.log(err);
            });
        });
    }
    // Return the tx hash.
    broadcastMsgs(msgs, fee, memo = "", signOptions, mode = "async") {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.base.walletStatus !== base_1.WalletStatus.Loaded) {
                throw new Error(`Wallet is not loaded: ${this.base.walletStatus}`);
            }
            const aminoMsgs = msgs.aminoMsgs;
            const protoMsgs = msgs.protoMsgs;
            // TODO: Make proto sign doc if `aminoMsgs` is empty or null
            if (aminoMsgs.length === 0 || protoMsgs.length === 0) {
                throw new Error("There is no msg to send");
            }
            if (aminoMsgs.length !== protoMsgs.length) {
                throw new Error("The length of aminoMsgs and protoMsgs are different");
            }
            const result = yield this.txOpts.misesStore.authAccounts(this.base.bech32Address);
            if (!result) {
                throw new Error("not found account");
            }
            const account = stargate_1.accountFromAny(result);
            const useEthereumSign = ((_a = this.chainGetter
                .getChain(this.chainId)
                .features) === null || _a === void 0 ? void 0 : _a.includes("eth-key-sign")) === true;
            const eip712Signing = useEthereumSign && this.base.isNanoLedger;
            if (eip712Signing && !msgs.rlpTypes) {
                throw new Error("RLP types information is needed for signing tx for ethermint chain with ledger");
            }
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const keplr = (yield this.base.getKeplr());
            const signDocRaw = {
                chain_id: this.chainId,
                account_number: account.accountNumber.toString(),
                sequence: account.sequence.toString(),
                fee: fee,
                msgs: aminoMsgs,
                memo: common_1.escapeHTML(memo),
            };
            const signDoc = common_1.sortObjectByKey(signDocRaw);
            const signResponse = yield (() => __awaiter(this, void 0, void 0, function* () {
                if (!eip712Signing) {
                    return yield keplr.signAmino(this.chainId, this.base.bech32Address, signDoc, signOptions);
                }
                else {
                    const altSignDoc = Object.assign({}, signDoc);
                    // XXX: "feePayer" should be "payer". But, it maybe from ethermint team's mistake.
                    //      That means this part is not standard.
                    altSignDoc.fee["feePayer"] = this.base.bech32Address;
                    return yield keplr.experimentalSignEIP712CosmosTx_v0(this.chainId, this.base.bech32Address, {
                        types: Object.assign({ EIP712Domain: [
                                { name: "name", type: "string" },
                                { name: "version", type: "string" },
                                { name: "chainId", type: "uint256" },
                                // XXX: Maybe, non-standard format?
                                { name: "verifyingContract", type: "string" },
                                // XXX: Maybe, non-standard format?
                                { name: "salt", type: "string" },
                            ], Tx: [
                                { name: "account_number", type: "string" },
                                { name: "chain_id", type: "string" },
                                { name: "fee", type: "Fee" },
                                { name: "memo", type: "string" },
                                { name: "msgs", type: "Msg[]" },
                                { name: "sequence", type: "string" },
                            ], Fee: [
                                { name: "feePayer", type: "string" },
                                { name: "amount", type: "Coin[]" },
                                { name: "gas", type: "string" },
                            ], Coin: [
                                { name: "denom", type: "string" },
                                { name: "amount", type: "string" },
                            ], Msg: [
                                { name: "type", type: "string" },
                                { name: "value", type: "MsgValue" },
                            ] }, msgs.rlpTypes),
                        domain: {
                            name: "Cosmos Web3",
                            version: "1.0.0",
                            chainId: cosmos_1.EthermintChainIdHelper.parse(this.chainId).ethChainId.toString(),
                            verifyingContract: "cosmos",
                            salt: "0",
                        },
                        primaryType: "Tx",
                    }, altSignDoc, signOptions);
                }
            }))();
            const signedTx = tx_1.TxRaw.encode({
                bodyBytes: tx_1.TxBody.encode(tx_1.TxBody.fromPartial({
                    messages: protoMsgs,
                    memo: signResponse.signed.memo,
                    extensionOptions: eip712Signing
                        ? [
                            {
                                typeUrl: "/ethermint.types.v1.ExtensionOptionsWeb3Tx",
                                value: web3_1.ExtensionOptionsWeb3Tx.encode(web3_1.ExtensionOptionsWeb3Tx.fromPartial({
                                    typedDataChainId: cosmos_1.EthermintChainIdHelper.parse(this.chainId).ethChainId.toString(),
                                    feePayer: this.base.bech32Address,
                                    feePayerSig: buffer_1.Buffer.from(signResponse.signature.signature, "base64"),
                                })).finish(),
                            },
                        ]
                        : undefined,
                })).finish(),
                authInfoBytes: tx_1.AuthInfo.encode({
                    signerInfos: [
                        {
                            publicKey: {
                                typeUrl: (() => {
                                    if (!useEthereumSign) {
                                        return "/cosmos.crypto.secp256k1.PubKey";
                                    }
                                    if (this.chainId.startsWith("injective")) {
                                        return "/injective.crypto.v1beta1.ethsecp256k1.PubKey";
                                    }
                                    return "/ethermint.crypto.v1.ethsecp256k1.PubKey";
                                })(),
                                value: keys_1.PubKey.encode({
                                    key: buffer_1.Buffer.from(signResponse.signature.pub_key.value, "base64"),
                                }).finish(),
                            },
                            modeInfo: {
                                single: {
                                    mode: signing_1.SignMode.SIGN_MODE_LEGACY_AMINO_JSON,
                                },
                                multi: undefined,
                            },
                            sequence: signResponse.signed.sequence,
                        },
                    ],
                    fee: tx_1.Fee.fromPartial({
                        amount: signResponse.signed.fee.amount,
                        gasLimit: signResponse.signed.fee.gas,
                        payer: eip712Signing
                            ? // Fee delegation feature not yet supported. But, for eip712 ethermint signing, we must set fee payer.
                                signResponse.signed.fee["feePayer"]
                            : undefined,
                    }),
                }).finish(),
                signatures: !eip712Signing
                    ? [buffer_1.Buffer.from(signResponse.signature.signature, "base64")]
                    : [new Uint8Array(0)],
            }).finish();
            return {
                txHash: yield keplr.sendTx(this.chainId, signedTx, mode),
                signDoc: signResponse.signed,
            };
        });
    }
    /**
     * Simulate tx without making state transition on chain or not waiting the tx committed.
     * Mainly used to estimate the gas needed to process tx.
     * You should multiply arbitrary number (gas adjustment) for gas before sending tx.
     *
     * NOTE: "/cosmos/tx/v1beta1/simulate" returns 400, 500 or (more?) status and error code as a response when tx fails on stimulate.
     *       Currently, non 200~300 status is handled as error, thus error would be thrown.
     *
     * XXX: Uses the simulate request format for cosmos-sdk@0.43+
     *      Thus, may throw an error if the chain is below cosmos-sdk@0.43
     *      And, for simplicity, doesn't set the public key to tx bytes.
     *      Thus, the gas estimated doesn't include the tx bytes size of public key.
     *
     * @param msgs
     * @param fee
     * @param memo
     */
    simulateTx(msgs, _fee, memo = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.txOpts.misesStore.authAccounts(this.base.bech32Address);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const account = stargate_1.accountFromAny(result);
            const txResult = yield this.txOpts.misesStore.simulate(msgs, memo, 
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            account.pubkey, account.sequence);
            const gasUsed = txResult.gasUsed.low;
            if (Number.isNaN(gasUsed)) {
                throw new Error(`Invalid integer gas: ${txResult.gasUsed}`);
            }
            return {
                gasUsed,
            };
        });
    }
    makeTx(type, msgs, preOnTxEvents) {
        const simulate = (fee = {}, memo = "") => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (typeof msgs === "function") {
                msgs = yield msgs();
            }
            return this.simulateTx(msgs.protoMsgs, {
                amount: (_a = fee.amount) !== null && _a !== void 0 ? _a : [],
            }, memo);
        });
        const sendWithGasPrice = (gasInfo, memo = "", signOptions, onTxEvents) => __awaiter(this, void 0, void 0, function* () {
            if (gasInfo.gas < 0) {
                throw new Error("Gas is zero or negative");
            }
            const fee = {
                gas: gasInfo.gas.toString(),
                amount: gasInfo.gasPrice
                    ? [
                        {
                            denom: gasInfo.gasPrice.denom,
                            amount: gasInfo.gasPrice.amount
                                .mul(new unit_1.Dec(gasInfo.gas))
                                .truncate()
                                .toString(),
                        },
                    ]
                    : [],
            };
            return this.sendMsgs(type, msgs, memo, fee, signOptions, utils_1.txEventsWithPreOnFulfill(onTxEvents, preOnTxEvents));
        });
        return {
            msgs: () => __awaiter(this, void 0, void 0, function* () {
                if (typeof msgs === "function") {
                    msgs = yield msgs();
                }
                return msgs;
            }),
            simulate,
            simulateAndSend: (feeOptions, memo = "", signOptions, onTxEvents) => __awaiter(this, void 0, void 0, function* () {
                this.base.setTxTypeInProgress(type);
                try {
                    const { gasUsed } = yield simulate({}, memo);
                    if (gasUsed < 0) {
                        throw new Error("Gas estimated is zero or negative");
                    }
                    const gasAdjusted = Math.floor(feeOptions.gasAdjustment * gasUsed);
                    return sendWithGasPrice({
                        gas: gasAdjusted,
                        gasPrice: feeOptions.gasPrice,
                    }, memo, signOptions, onTxEvents);
                }
                catch (e) {
                    this.base.setTxTypeInProgress("");
                    throw e;
                }
            }),
            send: (fee, memo = "", signOptions, onTxEvents) => __awaiter(this, void 0, void 0, function* () {
                return this.sendMsgs(type, msgs, memo, fee, signOptions, utils_1.txEventsWithPreOnFulfill(onTxEvents, preOnTxEvents));
            }),
            sendWithGasPrice,
        };
    }
    get instance() {
        const chainInfo = this.chainGetter.getChain(this.chainId);
        return axios_1.default.create(Object.assign({
            baseURL: chainInfo.rest,
        }, chainInfo.restConfig));
    }
    makeIBCTransferTx(channel, amount, currency, recipient) {
        if (new common_1.DenomHelper(currency.coinMinimalDenom).type !== "native") {
            throw new Error("Only native token can be sent via IBC");
        }
        const actualAmount = (() => {
            let dec = new unit_1.Dec(amount);
            dec = dec.mul(unit_1.DecUtils.getPrecisionDec(currency.coinDecimals));
            return dec.truncate().toString();
        })();
        const destinationInfo = this.queriesStore.get(channel.counterpartyChainId)
            .cosmos.queryRPCStatus;
        return this.makeTx("ibcTransfer", () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Wait until fetching complete.
            yield destinationInfo.waitFreshResponse();
            if (!destinationInfo.network) {
                throw new Error(`Failed to fetch the network chain id of ${channel.counterpartyChainId}`);
            }
            if (cosmos_1.ChainIdHelper.parse(destinationInfo.network).identifier !==
                cosmos_1.ChainIdHelper.parse(channel.counterpartyChainId).identifier) {
                throw new Error(`Fetched the network chain id is different with counterparty chain id (${destinationInfo.network}, ${channel.counterpartyChainId})`);
            }
            if (!destinationInfo.latestBlockHeight ||
                destinationInfo.latestBlockHeight.equals(new unit_1.Int("0"))) {
                throw new Error(`Failed to fetch the latest block of ${channel.counterpartyChainId}`);
            }
            const useEthereumSign = ((_a = this.chainGetter
                .getChain(this.chainId)
                .features) === null || _a === void 0 ? void 0 : _a.includes("eth-key-sign")) === true;
            const eip712Signing = useEthereumSign && this.base.isNanoLedger;
            // On ledger with ethermint, eip712 types are required and we can't omit `timeoutTimestamp`.
            // Although we are not using `timeoutTimestamp` at present, just set it as mas uint64 only for eip712 cosmos tx.
            const timeoutTimestamp = eip712Signing ? "18446744073709551615" : "0";
            const msg = {
                type: this.msgOpts.ibcTransfer.type,
                value: {
                    source_port: channel.portId,
                    source_channel: channel.channelId,
                    token: {
                        denom: currency.coinMinimalDenom,
                        amount: actualAmount,
                    },
                    sender: this.base.bech32Address,
                    receiver: recipient,
                    timeout_height: {
                        revision_number: cosmos_1.ChainIdHelper.parse(destinationInfo.network).version.toString(),
                        // Set the timeout height as the current height + 150.
                        revision_height: destinationInfo.latestBlockHeight
                            .add(new unit_1.Int("150"))
                            .toString(),
                    },
                    timeout_timestamp: timeoutTimestamp,
                },
            };
            if (msg.value.timeout_height.revision_number === "0") {
                delete msg.value.timeout_height.revision_number;
            }
            if (msg.value.timeout_timestamp === "0") {
                delete msg.value.timeout_timestamp;
            }
            return {
                aminoMsgs: [msg],
                protoMsgs: [
                    {
                        typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
                        value: tx_3.MsgTransfer.encode(tx_3.MsgTransfer.fromPartial({
                            sourcePort: msg.value.source_port,
                            sourceChannel: msg.value.source_channel,
                            token: msg.value.token,
                            sender: msg.value.sender,
                            receiver: msg.value.receiver,
                            timeoutHeight: {
                                revisionNumber: msg.value.timeout_height.revision_number
                                    ? msg.value.timeout_height.revision_number
                                    : "0",
                                revisionHeight: msg.value.timeout_height.revision_height,
                            },
                            timeoutTimestamp: msg.value.timeout_timestamp,
                        })).finish(),
                    },
                ],
                rlpTypes: {
                    MsgValue: [
                        { name: "source_port", type: "string" },
                        { name: "source_channel", type: "string" },
                        { name: "token", type: "TypeToken" },
                        { name: "sender", type: "string" },
                        { name: "receiver", type: "string" },
                        { name: "timeout_height", type: "TypeTimeoutHeight" },
                        { name: "timeout_timestamp", type: "uint64" },
                    ],
                    TypeToken: [
                        { name: "denom", type: "string" },
                        { name: "amount", type: "string" },
                    ],
                    TypeTimeoutHeight: [
                        { name: "revision_number", type: "uint64" },
                        { name: "revision_height", type: "uint64" },
                    ],
                },
            };
        }), (tx) => {
            if (tx.code == null || tx.code === 0) {
                // After succeeding to send token, refresh the balance.
                const queryBalance = this.queries.queryBalances
                    .getQueryBech32Address(this.base.bech32Address)
                    .balances.find((bal) => {
                    return (bal.currency.coinMinimalDenom === currency.coinMinimalDenom);
                });
                if (queryBalance) {
                    queryBalance.fetch();
                }
            }
        });
    }
    sendIBCTransferMsg(channel, amount, currency, recipient, memo = "", stdFee = {}, signOptions, onTxEvents) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (new common_1.DenomHelper(currency.coinMinimalDenom).type !== "native") {
                throw new Error("Only native token can be sent via IBC");
            }
            const actualAmount = (() => {
                let dec = new unit_1.Dec(amount);
                dec = dec.mul(unit_1.DecUtils.getPrecisionDec(currency.coinDecimals));
                return dec.truncate().toString();
            })();
            const destinationInfo = this.queriesStore.get(channel.counterpartyChainId)
                .cosmos.queryRPCStatus;
            yield this.sendMsgs("ibcTransfer", () => __awaiter(this, void 0, void 0, function* () {
                // Wait until fetching complete.
                yield destinationInfo.waitFreshResponse();
                if (!destinationInfo.network) {
                    throw new Error(`Failed to fetch the network chain id of ${channel.counterpartyChainId}`);
                }
                if (cosmos_1.ChainIdHelper.parse(destinationInfo.network).identifier !==
                    cosmos_1.ChainIdHelper.parse(channel.counterpartyChainId).identifier) {
                    throw new Error(`Fetched the network chain id is different with counterparty chain id (${destinationInfo.network}, ${channel.counterpartyChainId})`);
                }
                if (!destinationInfo.latestBlockHeight ||
                    destinationInfo.latestBlockHeight.equals(new unit_1.Int("0"))) {
                    throw new Error(`Failed to fetch the latest block of ${channel.counterpartyChainId}`);
                }
                const msg = {
                    type: this.msgOpts.ibcTransfer.type,
                    value: {
                        source_port: channel.portId,
                        source_channel: channel.channelId,
                        token: {
                            denom: currency.coinMinimalDenom,
                            amount: actualAmount,
                        },
                        sender: this.base.bech32Address,
                        receiver: recipient,
                        timeout_height: {
                            revision_number: cosmos_1.ChainIdHelper.parse(destinationInfo.network).version.toString(),
                            // Set the timeout height as the current height + 150.
                            revision_height: destinationInfo.latestBlockHeight
                                .add(new unit_1.Int("150"))
                                .toString(),
                        },
                    },
                };
                if (msg.value.timeout_height.revision_number === "0") {
                    delete msg.value.timeout_height.revision_number;
                }
                return {
                    aminoMsgs: [msg],
                    protoMsgs: [
                        {
                            typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
                            value: tx_3.MsgTransfer.encode(tx_3.MsgTransfer.fromPartial({
                                sourcePort: msg.value.source_port,
                                sourceChannel: msg.value.source_channel,
                                token: msg.value.token,
                                sender: msg.value.sender,
                                receiver: msg.value.receiver,
                                timeoutHeight: {
                                    revisionNumber: msg.value.timeout_height.revision_number
                                        ? msg.value.timeout_height.revision_number
                                        : "0",
                                    revisionHeight: msg.value.timeout_height.revision_height,
                                },
                            })).finish(),
                        },
                    ],
                };
            }), memo, {
                amount: (_a = stdFee.amount) !== null && _a !== void 0 ? _a : [],
                gas: (_b = stdFee.gas) !== null && _b !== void 0 ? _b : this.msgOpts.ibcTransfer.gas.toString(),
            }, signOptions, utils_1.txEventsWithPreOnFulfill(onTxEvents, (tx) => {
                if (tx.code == null || tx.code === 0) {
                    // After succeeding to send token, refresh the balance.
                    const queryBalance = this.queries.queryBalances
                        .getQueryBech32Address(this.base.bech32Address)
                        .balances.find((bal) => {
                        return (bal.currency.coinMinimalDenom === currency.coinMinimalDenom);
                    });
                    if (queryBalance) {
                        queryBalance.fetch();
                    }
                }
            }));
        });
    }
    makeDelegateTx(amount, validatorAddress) {
        cosmos_1.Bech32Address.validate(validatorAddress, this.chainGetter.getChain(this.chainId).bech32Config.bech32PrefixValAddr);
        const currency = this.chainGetter.getChain(this.chainId).stakeCurrency;
        let dec = new unit_1.Dec(amount);
        dec = dec.mulTruncate(unit_1.DecUtils.getPrecisionDec(currency.coinDecimals));
        const msg = {
            type: this.msgOpts.delegate.type,
            value: {
                delegator_address: this.base.bech32Address,
                validator_address: validatorAddress,
                amount: {
                    denom: currency.coinMinimalDenom,
                    amount: dec.truncate().toString(),
                },
            },
        };
        return this.makeTx("delegate", {
            aminoMsgs: [msg],
            protoMsgs: [
                {
                    typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
                    value: tx_4.MsgDelegate.encode({
                        delegatorAddress: msg.value.delegator_address,
                        validatorAddress: msg.value.validator_address,
                        amount: msg.value.amount,
                    }).finish(),
                },
            ],
            rlpTypes: {
                MsgValue: [
                    { name: "delegator_address", type: "string" },
                    { name: "validator_address", type: "string" },
                    { name: "amount", type: "TypeAmount" },
                ],
                TypeAmount: [
                    { name: "denom", type: "string" },
                    { name: "amount", type: "string" },
                ],
            },
        }, (tx) => {
            if (tx.code == null || tx.code === 0) {
                // After succeeding to delegate, refresh the validators and delegations, rewards.
                this.queries.cosmos.queryValidators
                    .getQueryStatus(types_1.BondStatus.Bonded)
                    .fetch();
                this.queries.cosmos.queryDelegations
                    .getQueryBech32Address(this.base.bech32Address)
                    .fetch();
                this.queries.cosmos.queryRewards
                    .getQueryBech32Address(this.base.bech32Address)
                    .fetch();
            }
        });
    }
    /**
     * Send `MsgDelegate` msg to the chain.
     * @param amount Decimal number used by humans.
     *               If amount is 0.1 and the stake currenct is uatom, actual amount will be changed to the 100000uatom.
     * @param validatorAddress
     * @param memo
     * @param onFulfill
     */
    sendDelegateMsg(amount, validatorAddress, memo = "", stdFee = {}, signOptions, onTxEvents) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const currency = this.chainGetter.getChain(this.chainId).stakeCurrency;
            let dec = new unit_1.Dec(amount);
            dec = dec.mulTruncate(unit_1.DecUtils.getPrecisionDec(currency.coinDecimals));
            const msg = {
                type: this.msgOpts.delegate.type,
                value: {
                    delegator_address: this.base.bech32Address,
                    validator_address: validatorAddress,
                    amount: {
                        denom: currency.coinMinimalDenom,
                        amount: dec.truncate().toString(),
                    },
                },
            };
            yield this.sendMsgs("delegate", {
                aminoMsgs: [msg],
                protoMsgs: [
                    {
                        typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
                        value: tx_4.MsgDelegate.encode({
                            delegatorAddress: msg.value.delegator_address,
                            validatorAddress: msg.value.validator_address,
                            amount: msg.value.amount,
                        }).finish(),
                    },
                ],
            }, memo, {
                amount: (_a = stdFee.amount) !== null && _a !== void 0 ? _a : [],
                gas: (_b = stdFee.gas) !== null && _b !== void 0 ? _b : this.msgOpts.delegate.gas.toString(),
            }, signOptions, utils_1.txEventsWithPreOnFulfill(onTxEvents, (tx) => {
                if (tx.code == null || tx.code === 0) {
                    // After succeeding to delegate, refresh the validators and delegations, rewards.
                    this.queries.cosmos.queryValidators
                        .getQueryStatus(types_1.BondStatus.Bonded)
                        .fetch();
                    this.queries.cosmos.queryDelegations
                        .getQueryBech32Address(this.base.bech32Address)
                        .fetch();
                    this.queries.cosmos.queryRewards
                        .getQueryBech32Address(this.base.bech32Address)
                        .fetch();
                }
            }));
        });
    }
    makeUndelegateTx(amount, validatorAddress) {
        cosmos_1.Bech32Address.validate(validatorAddress, this.chainGetter.getChain(this.chainId).bech32Config.bech32PrefixValAddr);
        const currency = this.chainGetter.getChain(this.chainId).stakeCurrency;
        let dec = new unit_1.Dec(amount);
        dec = dec.mulTruncate(unit_1.DecUtils.getPrecisionDec(currency.coinDecimals));
        const msg = {
            type: this.msgOpts.undelegate.type,
            value: {
                delegator_address: this.base.bech32Address,
                validator_address: validatorAddress,
                amount: {
                    denom: currency.coinMinimalDenom,
                    amount: dec.truncate().toString(),
                },
            },
        };
        return this.makeTx("undelegate", {
            aminoMsgs: [msg],
            protoMsgs: [
                {
                    typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate",
                    value: tx_4.MsgUndelegate.encode({
                        delegatorAddress: msg.value.delegator_address,
                        validatorAddress: msg.value.validator_address,
                        amount: msg.value.amount,
                    }).finish(),
                },
            ],
            rlpTypes: {
                MsgValue: [
                    { name: "delegator_address", type: "string" },
                    { name: "validator_address", type: "string" },
                    { name: "amount", type: "TypeAmount" },
                ],
                TypeAmount: [
                    { name: "denom", type: "string" },
                    { name: "amount", type: "string" },
                ],
            },
        }, (tx) => {
            if (tx.code == null || tx.code === 0) {
                // After succeeding to unbond, refresh the validators and delegations, unbonding delegations, rewards.
                this.queries.cosmos.queryValidators
                    .getQueryStatus(types_1.BondStatus.Bonded)
                    .fetch();
                this.queries.cosmos.queryDelegations
                    .getQueryBech32Address(this.base.bech32Address)
                    .fetch();
                this.queries.cosmos.queryUnbondingDelegations
                    .getQueryBech32Address(this.base.bech32Address)
                    .fetch();
                this.queries.cosmos.queryRewards
                    .getQueryBech32Address(this.base.bech32Address)
                    .fetch();
            }
        });
    }
    /**
     * @deprecated
     * Send `MsgUndelegate` msg to the chain.
     * @param amount Decimal number used by humans.
     *               If amount is 0.1 and the stake currenct is uatom, actual amount will be changed to the 100000uatom.
     * @param validatorAddress
     * @param memo
     * @param onFulfill
     */
    sendUndelegateMsg(amount, validatorAddress, memo = "", stdFee = {}, signOptions, onTxEvents) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const currency = this.chainGetter.getChain(this.chainId).stakeCurrency;
            let dec = new unit_1.Dec(amount);
            dec = dec.mulTruncate(unit_1.DecUtils.getPrecisionDec(currency.coinDecimals));
            const msg = {
                type: this.msgOpts.undelegate.type,
                value: {
                    delegator_address: this.base.bech32Address,
                    validator_address: validatorAddress,
                    amount: {
                        denom: currency.coinMinimalDenom,
                        amount: dec.truncate().toString(),
                    },
                },
            };
            yield this.sendMsgs("undelegate", {
                aminoMsgs: [msg],
                protoMsgs: [
                    {
                        typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate",
                        value: tx_4.MsgUndelegate.encode({
                            delegatorAddress: msg.value.delegator_address,
                            validatorAddress: msg.value.validator_address,
                            amount: msg.value.amount,
                        }).finish(),
                    },
                ],
            }, memo, {
                amount: (_a = stdFee.amount) !== null && _a !== void 0 ? _a : [],
                gas: (_b = stdFee.gas) !== null && _b !== void 0 ? _b : this.msgOpts.undelegate.gas.toString(),
            }, signOptions, utils_1.txEventsWithPreOnFulfill(onTxEvents, (tx) => {
                if (tx.code == null || tx.code === 0) {
                    // After succeeding to unbond, refresh the validators and delegations, unbonding delegations, rewards.
                    this.queries.cosmos.queryValidators
                        .getQueryStatus(types_1.BondStatus.Bonded)
                        .fetch();
                    this.queries.cosmos.queryDelegations
                        .getQueryBech32Address(this.base.bech32Address)
                        .fetch();
                    this.queries.cosmos.queryUnbondingDelegations
                        .getQueryBech32Address(this.base.bech32Address)
                        .fetch();
                    this.queries.cosmos.queryRewards
                        .getQueryBech32Address(this.base.bech32Address)
                        .fetch();
                }
            }));
        });
    }
    makeBeginRedelegateTx(amount, srcValidatorAddress, dstValidatorAddress) {
        cosmos_1.Bech32Address.validate(srcValidatorAddress, this.chainGetter.getChain(this.chainId).bech32Config.bech32PrefixValAddr);
        cosmos_1.Bech32Address.validate(dstValidatorAddress, this.chainGetter.getChain(this.chainId).bech32Config.bech32PrefixValAddr);
        const currency = this.chainGetter.getChain(this.chainId).stakeCurrency;
        let dec = new unit_1.Dec(amount);
        dec = dec.mulTruncate(unit_1.DecUtils.getPrecisionDec(currency.coinDecimals));
        const msg = {
            type: this.msgOpts.redelegate.type,
            value: {
                delegator_address: this.base.bech32Address,
                validator_src_address: srcValidatorAddress,
                validator_dst_address: dstValidatorAddress,
                amount: {
                    denom: currency.coinMinimalDenom,
                    amount: dec.truncate().toString(),
                },
            },
        };
        return this.makeTx("redelegate", {
            aminoMsgs: [msg],
            protoMsgs: [
                {
                    typeUrl: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
                    value: tx_4.MsgBeginRedelegate.encode({
                        delegatorAddress: msg.value.delegator_address,
                        validatorSrcAddress: msg.value.validator_src_address,
                        validatorDstAddress: msg.value.validator_dst_address,
                        amount: msg.value.amount,
                    }).finish(),
                },
            ],
            rlpTypes: {
                MsgValue: [
                    { name: "delegator_address", type: "string" },
                    { name: "validator_src_address", type: "string" },
                    { name: "validator_dst_address", type: "string" },
                    { name: "amount", type: "TypeAmount" },
                ],
                TypeAmount: [
                    { name: "denom", type: "string" },
                    { name: "amount", type: "string" },
                ],
            },
        }, (tx) => {
            if (tx.code == null || tx.code === 0) {
                // After succeeding to redelegate, refresh the validators and delegations, rewards.
                this.queries.cosmos.queryValidators
                    .getQueryStatus(types_1.BondStatus.Bonded)
                    .fetch();
                this.queries.cosmos.queryDelegations
                    .getQueryBech32Address(this.base.bech32Address)
                    .fetch();
                this.queries.cosmos.queryRewards
                    .getQueryBech32Address(this.base.bech32Address)
                    .fetch();
            }
        });
    }
    /**
     * @deprecated
     * Send `MsgBeginRedelegate` msg to the chain.
     * @param amount Decimal number used by humans.
     *               If amount is 0.1 and the stake currenct is uatom, actual amount will be changed to the 100000uatom.
     * @param srcValidatorAddress
     * @param dstValidatorAddress
     * @param memo
     * @param onFulfill
     */
    sendBeginRedelegateMsg(amount, srcValidatorAddress, dstValidatorAddress, memo = "", stdFee = {}, signOptions, onTxEvents) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const currency = this.chainGetter.getChain(this.chainId).stakeCurrency;
            let dec = new unit_1.Dec(amount);
            dec = dec.mulTruncate(unit_1.DecUtils.getPrecisionDec(currency.coinDecimals));
            const msg = {
                type: this.msgOpts.redelegate.type,
                value: {
                    delegator_address: this.base.bech32Address,
                    validator_src_address: srcValidatorAddress,
                    validator_dst_address: dstValidatorAddress,
                    amount: {
                        denom: currency.coinMinimalDenom,
                        amount: dec.truncate().toString(),
                    },
                },
            };
            yield this.sendMsgs("redelegate", {
                aminoMsgs: [msg],
                protoMsgs: [
                    {
                        typeUrl: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
                        value: tx_4.MsgBeginRedelegate.encode({
                            delegatorAddress: msg.value.delegator_address,
                            validatorSrcAddress: msg.value.validator_src_address,
                            validatorDstAddress: msg.value.validator_dst_address,
                            amount: msg.value.amount,
                        }).finish(),
                    },
                ],
            }, memo, {
                amount: (_a = stdFee.amount) !== null && _a !== void 0 ? _a : [],
                gas: (_b = stdFee.gas) !== null && _b !== void 0 ? _b : this.msgOpts.redelegate.gas.toString(),
            }, signOptions, utils_1.txEventsWithPreOnFulfill(onTxEvents, (tx) => {
                if (tx.code == null || tx.code === 0) {
                    // After succeeding to redelegate, refresh the validators and delegations, rewards.
                    this.queries.cosmos.queryValidators
                        .getQueryStatus(types_1.BondStatus.Bonded)
                        .fetch();
                    this.queries.cosmos.queryDelegations
                        .getQueryBech32Address(this.base.bech32Address)
                        .fetch();
                    this.queries.cosmos.queryRewards
                        .getQueryBech32Address(this.base.bech32Address)
                        .fetch();
                }
            }));
        });
    }
    makeWithdrawDelegationRewardTx(validatorAddresses) {
        for (const validatorAddress of validatorAddresses) {
            cosmos_1.Bech32Address.validate(validatorAddress, this.chainGetter.getChain(this.chainId).bech32Config.bech32PrefixValAddr);
        }
        const msgs = validatorAddresses.map((validatorAddress) => {
            return {
                type: this.msgOpts.withdrawRewards.type,
                value: {
                    delegator_address: this.base.bech32Address,
                    validator_address: validatorAddress,
                },
            };
        });
        return this.makeTx("withdrawRewards", {
            aminoMsgs: msgs,
            protoMsgs: msgs.map((msg) => {
                return {
                    typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
                    value: tx_5.MsgWithdrawDelegatorReward.encode({
                        delegatorAddress: msg.value.delegator_address,
                        validatorAddress: msg.value.validator_address,
                    }).finish(),
                };
            }),
            rlpTypes: {
                MsgValue: [
                    { name: "delegator_address", type: "string" },
                    { name: "validator_address", type: "string" },
                ],
            },
        }, (tx) => {
            if (tx.code == null || tx.code === 0) {
                // After succeeding to withdraw rewards, refresh rewards.
                this.queries.cosmos.queryRewards
                    .getQueryBech32Address(this.base.bech32Address)
                    .fetch();
            }
        });
    }
    /**
     * @deprecated
     */
    sendWithdrawDelegationRewardMsgs(validatorAddresses, memo = "", stdFee = {}, signOptions, onTxEvents) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const msgs = validatorAddresses.map((validatorAddress) => {
                return {
                    type: this.msgOpts.withdrawRewards.type,
                    value: {
                        delegator_address: this.base.bech32Address,
                        validator_address: validatorAddress,
                    },
                };
            });
            yield this.sendMsgs("withdrawRewards", {
                aminoMsgs: msgs,
                protoMsgs: msgs.map((msg) => {
                    return {
                        typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
                        value: tx_5.MsgWithdrawDelegatorReward.encode({
                            delegatorAddress: msg.value.delegator_address,
                            validatorAddress: msg.value.validator_address,
                        }).finish(),
                    };
                }),
            }, memo, {
                amount: (_a = stdFee.amount) !== null && _a !== void 0 ? _a : [],
                gas: (_b = stdFee.gas) !== null && _b !== void 0 ? _b : (this.msgOpts.withdrawRewards.gas * validatorAddresses.length).toString(),
            }, signOptions, utils_1.txEventsWithPreOnFulfill(onTxEvents, (tx) => {
                if (tx.code == null || tx.code === 0) {
                    // After succeeding to withdraw rewards, refresh rewards.
                    this.queries.cosmos.queryRewards
                        .getQueryBech32Address(this.base.bech32Address)
                        .fetch();
                }
            }));
        });
    }
    makeGovVoteTx(proposalId, option) {
        const voteOption = (() => {
            switch (option) {
                case "Yes":
                    return 1;
                case "Abstain":
                    return 2;
                case "No":
                    return 3;
                case "NoWithVeto":
                    return 4;
            }
        })();
        const msg = {
            type: this.msgOpts.govVote.type,
            value: {
                option: voteOption,
                proposal_id: proposalId,
                voter: this.base.bech32Address,
            },
        };
        return this.makeTx("govVote", {
            aminoMsgs: [msg],
            protoMsgs: [
                {
                    typeUrl: "/cosmos.gov.v1beta1.MsgVote",
                    value: tx_6.MsgVote.encode({
                        proposalId: msg.value.proposal_id,
                        voter: msg.value.voter,
                        option: (() => {
                            switch (msg.value.option) {
                                case 1:
                                    return gov_1.VoteOption.VOTE_OPTION_YES;
                                case 2:
                                    return gov_1.VoteOption.VOTE_OPTION_ABSTAIN;
                                case 3:
                                    return gov_1.VoteOption.VOTE_OPTION_NO;
                                case 4:
                                    return gov_1.VoteOption.VOTE_OPTION_NO_WITH_VETO;
                                default:
                                    return gov_1.VoteOption.VOTE_OPTION_UNSPECIFIED;
                            }
                        })(),
                    }).finish(),
                },
            ],
            rlpTypes: {
                MsgValue: [
                    { name: "proposal_id", type: "uint64" },
                    { name: "voter", type: "string" },
                    { name: "option", type: "int32" },
                ],
            },
        }, (tx) => {
            if (tx.code == null || tx.code === 0) {
                // After succeeding to vote, refresh the proposal.
                const proposal = this.queries.cosmos.queryGovernance.proposals.find((proposal) => proposal.id === proposalId);
                if (proposal) {
                    proposal.fetch();
                }
                const vote = this.queries.cosmos.queryProposalVote.getVote(proposalId, this.base.bech32Address);
                vote.fetch();
            }
        });
    }
    /**
     * @deprecated
     */
    sendGovVoteMsg(proposalId, option, memo = "", stdFee = {}, signOptions, onTxEvents) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const voteOption = (() => {
                switch (option) {
                    case "Yes":
                        return 1;
                    case "Abstain":
                        return 2;
                    case "No":
                        return 3;
                    case "NoWithVeto":
                        return 4;
                }
            })();
            const msg = {
                type: this.msgOpts.govVote.type,
                value: {
                    option: voteOption,
                    proposal_id: proposalId,
                    voter: this.base.bech32Address,
                },
            };
            yield this.sendMsgs("govVote", {
                aminoMsgs: [msg],
                protoMsgs: [
                    {
                        typeUrl: "/cosmos.gov.v1beta1.MsgVote",
                        value: tx_6.MsgVote.encode({
                            proposalId: msg.value.proposal_id,
                            voter: msg.value.voter,
                            option: (() => {
                                switch (msg.value.option) {
                                    case 1:
                                        return gov_1.VoteOption.VOTE_OPTION_YES;
                                    case 2:
                                        return gov_1.VoteOption.VOTE_OPTION_ABSTAIN;
                                    case 3:
                                        return gov_1.VoteOption.VOTE_OPTION_NO;
                                    case 4:
                                        return gov_1.VoteOption.VOTE_OPTION_NO_WITH_VETO;
                                    default:
                                        return gov_1.VoteOption.VOTE_OPTION_UNSPECIFIED;
                                }
                            })(),
                        }).finish(),
                    },
                ],
            }, memo, {
                amount: (_a = stdFee.amount) !== null && _a !== void 0 ? _a : [],
                gas: (_b = stdFee.gas) !== null && _b !== void 0 ? _b : this.msgOpts.govVote.gas.toString(),
            }, signOptions, utils_1.txEventsWithPreOnFulfill(onTxEvents, (tx) => {
                if (tx.code == null || tx.code === 0) {
                    // After succeeding to vote, refresh the proposal.
                    const proposal = this.queries.cosmos.queryGovernance.proposals.find((proposal) => proposal.id === proposalId);
                    if (proposal) {
                        proposal.fetch();
                    }
                    const vote = this.queries.cosmos.queryProposalVote.getVote(proposalId, this.base.bech32Address);
                    vote.fetch();
                }
            }));
        });
    }
    get queries() {
        return this.queriesStore.get(this.chainId);
    }
}
exports.CosmosAccountImpl = CosmosAccountImpl;
//# sourceMappingURL=cosmos.js.map

/***/ }),

/***/ 1417:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeplrFromWindow = void 0;
const getKeplrFromWindow = () => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof window === "undefined") {
        return undefined;
    }
    if (window.misesWallet) {
        return window.misesWallet;
    }
    if (document.readyState === "complete") {
        return window.misesWallet;
    }
    return new Promise((resolve) => {
        const documentStateChange = (event) => {
            if (event.target &&
                event.target.readyState === "complete") {
                resolve(window.misesWallet);
                document.removeEventListener("readystatechange", documentStateChange);
            }
        };
        document.addEventListener("readystatechange", documentStateChange);
    });
});
exports.getKeplrFromWindow = getKeplrFromWindow;
//# sourceMappingURL=get-keplr.js.map

/***/ }),

/***/ 1418:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretAccountImpl = exports.defaultSecretMsgOpts = exports.SecretAccount = void 0;
const buffer_1 = __webpack_require__(4);
const common_1 = __webpack_require__(27);
const msg_1 = __webpack_require__(1419);
const cosmos_1 = __webpack_require__(16);
const unit_1 = __webpack_require__(26);
const deepmerge_1 = __importDefault(__webpack_require__(167));
const utils_1 = __webpack_require__(628);
exports.SecretAccount = {
    use(options) {
        return (base, chainGetter, chainId) => {
            const msgOptsFromCreator = options.msgOptsCreator
                ? options.msgOptsCreator(chainId)
                : undefined;
            return {
                secret: new SecretAccountImpl(base, chainGetter, chainId, options.queriesStore, deepmerge_1.default(exports.defaultSecretMsgOpts, msgOptsFromCreator ? msgOptsFromCreator : {})),
            };
        };
    },
};
/**
 * @deprecated Predict gas through simulation rather than using a fixed gas.
 */
exports.defaultSecretMsgOpts = {
    send: {
        secret20: {
            gas: 250000,
        },
    },
    createSecret20ViewingKey: {
        gas: 150000,
    },
    executeSecretWasm: {
        type: "wasm/MsgExecuteContract",
    },
};
class SecretAccountImpl {
    constructor(base, chainGetter, chainId, queriesStore, _msgOpts) {
        this.base = base;
        this.chainGetter = chainGetter;
        this.chainId = chainId;
        this.queriesStore = queriesStore;
        this._msgOpts = _msgOpts;
        this.base.registerMakeSendTokenFn(this.processMakeSendTokenTx.bind(this));
        this.base.registerSendTokenFn(this.processSendToken.bind(this));
    }
    /**
     * @deprecated Predict gas through simulation rather than using a fixed gas.
     */
    get msgOpts() {
        return this._msgOpts;
    }
    processMakeSendTokenTx(amount, currency, recipient) {
        const denomHelper = new common_1.DenomHelper(currency.coinMinimalDenom);
        if (denomHelper.type === "secret20") {
            const actualAmount = (() => {
                let dec = new unit_1.Dec(amount);
                dec = dec.mul(unit_1.DecUtils.getPrecisionDec(currency.coinDecimals));
                return dec.truncate().toString();
            })();
            if (!("type" in currency) || currency.type !== "secret20") {
                throw new Error("Currency is not secret20");
            }
            cosmos_1.Bech32Address.validate(recipient, this.chainGetter.getChain(this.chainId).bech32Config.bech32PrefixAccAddr);
            return this.makeExecuteSecretContractTx("send", currency.contractAddress, {
                transfer: {
                    recipient: recipient,
                    amount: actualAmount,
                },
            }, [], (tx) => {
                if (tx.code == null || tx.code === 0) {
                    // After succeeding to send token, refresh the balance.
                    const queryBalance = this.queries.queryBalances
                        .getQueryBech32Address(this.base.bech32Address)
                        .balances.find((bal) => {
                        return (bal.currency.coinMinimalDenom === currency.coinMinimalDenom);
                    });
                    if (queryBalance) {
                        queryBalance.fetch();
                    }
                }
            });
        }
    }
    /**
     * @deprecated
     */
    processSendToken(amount, currency, recipient, memo, stdFee, signOptions, onTxEvents) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const denomHelper = new common_1.DenomHelper(currency.coinMinimalDenom);
            switch (denomHelper.type) {
                case "secret20":
                    const actualAmount = (() => {
                        let dec = new unit_1.Dec(amount);
                        dec = dec.mul(unit_1.DecUtils.getPrecisionDec(currency.coinDecimals));
                        return dec.truncate().toString();
                    })();
                    if (!("type" in currency) || currency.type !== "secret20") {
                        throw new Error("Currency is not secret20");
                    }
                    yield this.sendExecuteSecretContractMsg("send", currency.contractAddress, {
                        transfer: {
                            recipient: recipient,
                            amount: actualAmount,
                        },
                    }, [], memo, {
                        amount: (_a = stdFee.amount) !== null && _a !== void 0 ? _a : [],
                        gas: (_b = stdFee.gas) !== null && _b !== void 0 ? _b : this.msgOpts.send.secret20.gas.toString(),
                    }, signOptions, utils_1.txEventsWithPreOnFulfill(onTxEvents, (tx) => {
                        if (tx.code == null || tx.code === 0) {
                            // After succeeding to send token, refresh the balance.
                            const queryBalance = this.queries.queryBalances
                                .getQueryBech32Address(this.base.bech32Address)
                                .balances.find((bal) => {
                                return (bal.currency.coinMinimalDenom === currency.coinMinimalDenom);
                            });
                            if (queryBalance) {
                                queryBalance.fetch();
                            }
                        }
                    }));
                    return true;
            }
            return false;
        });
    }
    createSecret20ViewingKey(contractAddress, memo = "", stdFee = {}, signOptions, onFulfill) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const random = new Uint8Array(32);
            crypto.getRandomValues(random);
            const key = buffer_1.Buffer.from(random).toString("hex");
            yield this.makeExecuteSecretContractTx("createSecret20ViewingKey", contractAddress, {
                set_viewing_key: { key },
            }, []).send({
                amount: (_a = stdFee.amount) !== null && _a !== void 0 ? _a : [],
                gas: (_b = stdFee.gas) !== null && _b !== void 0 ? _b : this.msgOpts.createSecret20ViewingKey.gas.toString(),
            }, memo, signOptions, (tx) => {
                let viewingKey = "";
                if (tx.code == null || tx.code === 0) {
                    viewingKey = key;
                }
                if (onFulfill) {
                    onFulfill(tx, viewingKey);
                }
            });
            return;
        });
    }
    makeExecuteSecretContractTx(
    // This arg can be used to override the type of sending tx if needed.
    type = "executeSecretWasm", contractAddress, 
    // eslint-disable-next-line @typescript-eslint/ban-types
    obj, sentFunds, preOnTxEvents) {
        cosmos_1.Bech32Address.validate(contractAddress, this.chainGetter.getChain(this.chainId).bech32Config.bech32PrefixAccAddr);
        let encryptedMsg;
        return this.base.cosmos.makeTx(type, () => __awaiter(this, void 0, void 0, function* () {
            encryptedMsg = yield this.encryptSecretContractMsg(contractAddress, obj);
            const msg = {
                type: this.msgOpts.executeSecretWasm.type,
                value: {
                    sender: this.base.bech32Address,
                    contract: contractAddress,
                    // callback_code_hash: "",
                    msg: buffer_1.Buffer.from(encryptedMsg).toString("base64"),
                    sent_funds: sentFunds,
                },
            };
            return {
                aminoMsgs: [msg],
                protoMsgs: [
                    {
                        typeUrl: "/secret.compute.v1beta1.MsgExecuteContract",
                        value: msg_1.MsgExecuteContract.encode(msg_1.MsgExecuteContract.fromPartial({
                            sender: cosmos_1.Bech32Address.fromBech32(msg.value.sender).address,
                            contract: cosmos_1.Bech32Address.fromBech32(msg.value.contract)
                                .address,
                            msg: buffer_1.Buffer.from(msg.value.msg, "base64"),
                            sentFunds: msg.value.sent_funds,
                        })).finish(),
                    },
                ],
            };
        }), preOnTxEvents);
    }
    /**
     * @deprecated
     */
    sendExecuteSecretContractMsg(
    // This arg can be used to override the type of sending tx if needed.
    type = "executeSecretWasm", contractAddress, 
    // eslint-disable-next-line @typescript-eslint/ban-types
    obj, sentFunds, memo = "", stdFee, signOptions, onTxEvents) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let encryptedMsg;
            yield this.base.cosmos.sendMsgs(type, () => __awaiter(this, void 0, void 0, function* () {
                encryptedMsg = yield this.encryptSecretContractMsg(contractAddress, obj);
                const msg = {
                    type: this.msgOpts.executeSecretWasm.type,
                    value: {
                        sender: this.base.bech32Address,
                        contract: contractAddress,
                        // callback_code_hash: "",
                        msg: buffer_1.Buffer.from(encryptedMsg).toString("base64"),
                        sent_funds: sentFunds,
                    },
                };
                return {
                    aminoMsgs: [msg],
                    protoMsgs: [
                        {
                            typeUrl: "/secret.compute.v1beta1.MsgExecuteContract",
                            value: msg_1.MsgExecuteContract.encode(msg_1.MsgExecuteContract.fromPartial({
                                sender: cosmos_1.Bech32Address.fromBech32(msg.value.sender).address,
                                contract: cosmos_1.Bech32Address.fromBech32(msg.value.contract)
                                    .address,
                                msg: buffer_1.Buffer.from(msg.value.msg, "base64"),
                                sentFunds: msg.value.sent_funds,
                            })).finish(),
                        },
                    ],
                };
            }), memo, {
                amount: (_a = stdFee.amount) !== null && _a !== void 0 ? _a : [],
                gas: stdFee.gas,
            }, signOptions, onTxEvents);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return encryptedMsg;
        });
    }
    encryptSecretContractMsg(contractAddress, 
    // eslint-disable-next-line @typescript-eslint/ban-types
    obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryContractCodeHashResponse = yield this.queries.secret.querySecretContractCodeHash
                .getQueryContract(contractAddress)
                .waitResponse();
            if (!queryContractCodeHashResponse) {
                throw new Error(`Can't get the code hash of the contract (${contractAddress})`);
            }
            const contractCodeHash = queryContractCodeHashResponse.data.result;
            const keplr = yield this.base.getKeplr();
            if (!keplr) {
                throw new Error("Can't get the Keplr API");
            }
            const enigmaUtils = keplr.getEnigmaUtils(this.chainId);
            return yield enigmaUtils.encrypt(contractCodeHash, obj);
        });
    }
    get queries() {
        return this.queriesStore.get(this.chainId);
    }
}
exports.SecretAccountImpl = SecretAccountImpl;
//# sourceMappingURL=secret.js.map

/***/ }),

/***/ 1420:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountStore = void 0;
const common_1 = __webpack_require__(119);
const base_1 = __webpack_require__(862);
class AccountStore extends common_1.HasMapStore {
    constructor(eventListener, chainGetter, storeOptsCreator, ...accountSetCreators) {
        super((chainId) => {
            const accountSetBase = new base_1.AccountSetBaseSuper(eventListener, chainGetter, chainId, storeOptsCreator(chainId));
            return common_1.mergeStores(accountSetBase, [this.chainGetter, chainId], ...this.accountSetCreators);
        });
        this.eventListener = eventListener;
        this.chainGetter = chainGetter;
        this.storeOptsCreator = storeOptsCreator;
        this.accountSetCreators = accountSetCreators;
    }
    getAccount(chainId) {
        return this.get(chainId);
    }
    hasAccount(chainId) {
        return this.has(chainId);
    }
}
exports.AccountStore = AccountStore;
//# sourceMappingURL=store.js.map

/***/ }),

/***/ 1421:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryMap = exports.ObservableQuery = exports.ObservableQueryBase = exports.DeferInitialQueryController = exports.defaultOptions = void 0;
const mobx_1 = __webpack_require__(5);
const axios_1 = __importDefault(__webpack_require__(60));
const common_1 = __webpack_require__(27);
const map_1 = __webpack_require__(1014);
const eventemitter3_1 = __importDefault(__webpack_require__(1234));
exports.defaultOptions = {
    cacheMaxAge: 0,
    fetchingInterval: 0,
};
class FlowCancelerError extends Error {
    constructor(m) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, FlowCancelerError.prototype);
    }
}
class FlowCanceler {
    constructor() {
        this.rejectors = [];
    }
    get hasCancelable() {
        return this.rejectors.length > 0;
    }
    cancel(message) {
        while (this.rejectors.length > 0) {
            const rejector = this.rejectors.shift();
            if (rejector) {
                rejector.reject(new FlowCancelerError(message));
                if (rejector.onCancel) {
                    rejector.onCancel();
                }
            }
        }
    }
    callOrCanceledWithPromise(promise, onCancel) {
        return new Promise((resolve, reject) => {
            this.rejectors.push({
                reject,
                onCancel,
            });
            promise.then((r) => {
                const i = this.rejectors.findIndex((r) => r.reject === reject);
                if (i >= 0) {
                    this.rejectors.splice(i, 1);
                }
                resolve(r);
            }, (e) => {
                const i = this.rejectors.findIndex((r) => r.reject === reject);
                if (i >= 0) {
                    this.rejectors.splice(i, 1);
                }
                reject(e);
            });
        });
    }
    callOrCanceled(fn, onCancel) {
        return new Promise((resolve, reject) => {
            this.rejectors.push({
                reject,
                onCancel,
            });
            Promise.resolve().then(() => {
                if (!this.rejectors.find((r) => r.reject === reject)) {
                    return;
                }
                fn().then((r) => {
                    const i = this.rejectors.findIndex((r) => r.reject === reject);
                    if (i >= 0) {
                        this.rejectors.splice(i, 1);
                    }
                    resolve(r);
                }, (e) => {
                    const i = this.rejectors.findIndex((r) => r.reject === reject);
                    if (i >= 0) {
                        this.rejectors.splice(i, 1);
                    }
                    reject(e);
                });
            });
        });
    }
}
class DeferInitialQueryController {
    constructor() {
        this._isReady = false;
        mobx_1.makeObservable(this);
    }
    ready() {
        this._isReady = true;
    }
    wait() {
        if (this.isReady) {
            return Promise.resolve();
        }
        return new Promise((resolve) => {
            const disposer = mobx_1.autorun(() => {
                if (this.isReady) {
                    resolve();
                    if (disposer) {
                        disposer();
                    }
                }
            });
        });
    }
    get isReady() {
        return this._isReady;
    }
}
__decorate([
    mobx_1.observable
], DeferInitialQueryController.prototype, "_isReady", void 0);
__decorate([
    mobx_1.action
], DeferInitialQueryController.prototype, "ready", null);
exports.DeferInitialQueryController = DeferInitialQueryController;
/**
 * Base of the observable query classes.
 * This recommends to use the Axios to query the response.
 */
class ObservableQueryBase {
    constructor(instance, options) {
        // Just use the oberable ref because the response is immutable and not directly adjusted.
        this._response = undefined;
        this._isFetching = false;
        this._error = undefined;
        this._isStarted = false;
        this._pendingOnStart = false;
        this.observedCount = 0;
        // intervalId can be number or NodeJS's Timout object according to the environment.
        // If environment is browser, intervalId should be number.
        // If environment is NodeJS, intervalId should be NodeJS.Timeout.
        this.intervalId = undefined;
        this.becomeObserved = () => {
            if (this.observedCount === 0) {
                this.start();
            }
            this.observedCount++;
        };
        this.becomeUnobserved = () => {
            this.observedCount--;
            if (this.observedCount === 0) {
                this.stop();
            }
        };
        this.intervalFetch = () => {
            if (!this.isFetching) {
                this.fetch();
            }
        };
        this.options = Object.assign(Object.assign({}, exports.defaultOptions), options);
        this._instance = instance;
        this.queryCanceler = new FlowCanceler();
        this.onStartCanceler = new FlowCanceler();
        this.queryControllerConceler = new FlowCanceler();
        mobx_1.makeObservable(this);
        mobx_1.onBecomeObserved(this, "_response", this.becomeObserved);
        mobx_1.onBecomeObserved(this, "_isFetching", this.becomeObserved);
        mobx_1.onBecomeObserved(this, "_error", this.becomeObserved);
        mobx_1.onBecomeUnobserved(this, "_response", this.becomeUnobserved);
        mobx_1.onBecomeUnobserved(this, "_isFetching", this.becomeUnobserved);
        mobx_1.onBecomeUnobserved(this, "_error", this.becomeUnobserved);
    }
    static guessResponseTruncated(headers, data) {
        return (headers &&
            typeof headers["content-type"] === "string" &&
            headers["content-type"].startsWith("application/json") &&
            data.startsWith("{"));
    }
    get isObserved() {
        return this.observedCount > 0;
    }
    start() {
        if (!this._isStarted) {
            this._isStarted = true;
            const promise = this.onStart();
            if (promise) {
                this.handleAsyncOnStart(promise);
            }
            else {
                this.postStart();
            }
        }
    }
    *handleAsyncOnStart(promise) {
        this._pendingOnStart = true;
        this._isFetching = true;
        try {
            yield this.onStartCanceler.callOrCanceledWithPromise(promise);
            if (this._isStarted) {
                this._pendingOnStart = false;
                this.postStart();
            }
        }
        catch (e) {
            if (e instanceof FlowCancelerError) {
                return;
            }
            throw e;
        }
    }
    stop() {
        if (this._isStarted) {
            if (this.onStartCanceler.hasCancelable) {
                this.onStartCanceler.cancel();
            }
            if (this.isFetching && this.queryCanceler.hasCancelable) {
                this.cancel();
            }
            this._pendingOnStart = false;
            this._isFetching = false;
            if (this.intervalId != null) {
                clearInterval(this.intervalId);
            }
            this.intervalId = undefined;
            this.onStop();
            this._isStarted = false;
        }
    }
    get isStarted() {
        return this._isStarted;
    }
    postStart() {
        this.fetch();
        if (this.options.fetchingInterval > 0) {
            this.intervalId = setInterval(this.intervalFetch, this.options.fetchingInterval);
        }
    }
    onStart() {
        // noop yet.
        // Override this if you need something to do whenever starting.
    }
    onStop() {
        // noop yet.
        // Override this if you need something to do whenever starting.
    }
    canFetch() {
        return true;
    }
    get isFetching() {
        return this._isFetching;
    }
    // Return the instance.
    // You can memorize this by using @computed if you need to override this.
    // NOTE: If this getter returns the different instance with previous instance.
    // It will be used in the latter fetching.
    get instance() {
        return this._instance;
    }
    *fetch() {
        var _a, _b, _c;
        // If not started, do nothing.
        if (!this.isStarted || this._pendingOnStart) {
            return;
        }
        if (ObservableQueryBase.experimentalDeferInitialQueryController &&
            !ObservableQueryBase.experimentalDeferInitialQueryController.isReady) {
            this._isFetching = true;
            if (this.queryControllerConceler.hasCancelable) {
                this.queryControllerConceler.cancel();
            }
            try {
                yield this.queryControllerConceler.callOrCanceled(() => { var _a, _b; return (_b = (_a = ObservableQueryBase.experimentalDeferInitialQueryController) === null || _a === void 0 ? void 0 : _a.wait()) !== null && _b !== void 0 ? _b : Promise.resolve(); });
            }
            catch (e) {
                if (e instanceof FlowCancelerError) {
                    return;
                }
                throw e;
            }
            // Recheck
            if (!this.isStarted) {
                return;
            }
        }
        if (!this.canFetch()) {
            return;
        }
        // If response is fetching, cancel the previous query.
        if (this.isFetching && this.queryCanceler.hasCancelable) {
            // When cancel for the next fetching, it behaves differently from other explicit cancels because fetching continues. Use an error message to identify this.
            this.cancel("__fetching__proceed__next__");
        }
        // If there is no existing response, try to load saved reponse.
        if (!this._response) {
            this._isFetching = true;
            const promise = this.loadStaledResponse();
            const handleStaledResponse = (staledResponse) => {
                if (staledResponse && !this._response) {
                    if (this.options.cacheMaxAge <= 0 ||
                        staledResponse.timestamp > Date.now() - this.options.cacheMaxAge) {
                        this.setResponse(staledResponse);
                        return true;
                    }
                }
                return false;
            };
            // When first load, try to load the last response from disk.
            // Use the last saved response if the last saved response exists and the current response hasn't been set yet.
            if (this.options.cacheMaxAge <= 0) {
                // To improve performance, don't wait the loading to proceed if cache age not set.
                promise.then((staledResponse) => {
                    handleStaledResponse(staledResponse);
                });
            }
            else {
                const staledResponse = yield* common_1.toGenerator(promise);
                if (handleStaledResponse(staledResponse)) {
                    this._isFetching = false;
                    return;
                }
            }
        }
        else {
            if (this.options.cacheMaxAge > 0) {
                if (this._response.timestamp > Date.now() - this.options.cacheMaxAge) {
                    this._isFetching = false;
                    return;
                }
            }
            this._isFetching = true;
            // Make the existing response as staled.
            this.setResponse(Object.assign(Object.assign({}, this._response), { staled: true }));
        }
        const abortController = new AbortController();
        let fetchingProceedNext = false;
        let skipAxiosCancelError = false;
        try {
            let hasStarted = false;
            let { response, headers } = yield* common_1.toGenerator(this.queryCanceler.callOrCanceled(() => {
                hasStarted = true;
                return this.fetchResponse(abortController);
            }, () => {
                if (hasStarted) {
                    abortController.abort();
                }
            }));
            if (response.data &&
                typeof response.data === "string" &&
                (response.data.startsWith("stream was reset:") ||
                    ObservableQuery.suspectedResponseDatasWithInvalidValue.includes(response.data) ||
                    ObservableQuery.guessResponseTruncated(headers, response.data))) {
                // In some devices, it is a http ok code, but a strange response is sometimes returned.
                // It's not that they can't query at all, it seems that they get weird response from time to time.
                // These causes are not clear.
                // To solve this problem, if this problem occurs, try the query again, and if that fails, an error is raised.
                // https://github.com/chainapsis/keplr-wallet/issues/275
                // https://github.com/chainapsis/keplr-wallet/issues/278
                // https://github.com/chainapsis/keplr-wallet/issues/318
                if (abortController.signal.aborted) {
                    // In this case, it is assumed that it is caused by cancel() and do nothing.
                    return;
                }
                console.log("There is an unknown problem to the response. Request one more time.");
                // Try to query again.
                let hasStarted = false;
                const refetched = yield* common_1.toGenerator(this.queryCanceler.callOrCanceled(() => {
                    hasStarted = true;
                    return this.fetchResponse(abortController);
                }, () => {
                    if (hasStarted) {
                        abortController.abort();
                    }
                }));
                response = refetched.response;
                headers = refetched.headers;
                if (response.data && typeof response.data === "string") {
                    if (response.data.startsWith("stream was reset:") ||
                        ObservableQuery.suspectedResponseDatasWithInvalidValue.includes(response.data)) {
                        throw new Error(response.data);
                    }
                    if (ObservableQuery.guessResponseTruncated(headers, response.data)) {
                        throw new Error("The response data seems to be truncated");
                    }
                }
            }
            this.setResponse(response);
            // Clear the error if fetching succeeds.
            this.setError(undefined);
            // Should not wait.
            this.saveResponse(response);
        }
        catch (e) {
            // If axios canceled, do nothing.
            if (axios_1.default.isCancel(e)) {
                skipAxiosCancelError = true;
                return;
            }
            if (e instanceof FlowCancelerError) {
                // When cancel for the next fetching, it behaves differently from other explicit cancels because fetching continues.
                if (e.message === "__fetching__proceed__next__") {
                    fetchingProceedNext = true;
                }
                return;
            }
            // If error is from Axios, and get response.
            if (e.response) {
                // Default is status text
                let message = e.response.statusText;
                const contentType = typeof ((_a = e.response.headers) === null || _a === void 0 ? void 0 : _a["content-type"]) === "string"
                    ? e.response.headers["content-type"]
                    : "";
                // Try to figure out the message from the response.
                // If the contentType in the header is specified, try to use the message from the response.
                if (contentType.startsWith("text/plain") &&
                    typeof e.response.data === "string") {
                    message = e.response.data;
                }
                // If the response is an object and "message" field exists, it is used as a message.
                if (contentType.startsWith("application/json") && ((_b = e.response.data) === null || _b === void 0 ? void 0 : _b.message) &&
                    typeof ((_c = e.response.data) === null || _c === void 0 ? void 0 : _c.message) === "string") {
                    message = e.response.data.message;
                }
                const error = {
                    status: e.response.status,
                    statusText: e.response.statusText,
                    message,
                    data: e.response.data,
                };
                this.setError(error);
            }
            else if (e.request) {
                // if can't get the response.
                const error = {
                    status: 0,
                    statusText: "Failed to get response",
                    message: "Failed to get response",
                };
                this.setError(error);
            }
            else {
                const error = {
                    status: 0,
                    statusText: e.message,
                    message: e.message,
                    data: e,
                };
                this.setError(error);
            }
        }
        finally {
            if (!skipAxiosCancelError) {
                if (!fetchingProceedNext) {
                    this._isFetching = false;
                }
            }
        }
    }
    get response() {
        return this._response;
    }
    get error() {
        return this._error;
    }
    setResponse(response) {
        this._response = response;
    }
    setError(error) {
        this._error = error;
    }
    cancel(message) {
        this.queryCanceler.cancel(message);
    }
    /**
     * Wait the response and return the response without considering it is staled or fresh.
     */
    waitResponse() {
        if (this.response) {
            return Promise.resolve(this.response);
        }
        const disposers = [];
        let onceCoerce = false;
        // Make sure that the fetching is tracked to force to be fetched.
        disposers.push(mobx_1.reaction(() => this.isFetching, () => {
            if (!onceCoerce) {
                if (!this.isFetching) {
                    this.fetch();
                }
                onceCoerce = true;
            }
        }, {
            fireImmediately: true,
        }));
        return new Promise((resolve) => {
            const disposer = mobx_1.autorun(() => {
                if (!this.isFetching) {
                    resolve(this.response);
                }
            });
            disposers.push(disposer);
        }).finally(() => {
            for (const disposer of disposers) {
                disposer();
            }
        });
    }
    /**
     * Wait the response and return the response until it is fetched.
     */
    waitFreshResponse() {
        const disposers = [];
        let onceCoerce = false;
        // Make sure that the fetching is tracked to force to be fetched.
        disposers.push(mobx_1.reaction(() => this.isFetching, () => {
            if (!onceCoerce) {
                if (!this.isFetching) {
                    this.fetch();
                }
                onceCoerce = true;
            }
        }, {
            fireImmediately: true,
        }));
        return new Promise((resolve) => {
            const disposer = mobx_1.autorun(() => {
                if (!this.isFetching) {
                    resolve(this.response);
                }
            });
            disposers.push(disposer);
        }).finally(() => {
            for (const disposer of disposers) {
                disposer();
            }
        });
    }
}
/**
 * Allows to decide when to start the first query.
 *
 * This is a temporarily added feature to implement custom rpc/lcd feature in keplr extension or mobile.
 * Because custom rpc/lcd are handled in the background process and the front-end cannot synchronously get those values,
 * Rather than not showing the UI to the user during the delay, the UI is shown and the start of the query is delayed immediately after getting those values.
 *
 * XXX: Having a global field for this feature doesn't seem desirable in the long run.
 *      Unless it's a keplr extension or mobile, you don't need to care about this field.
 *      This field will soon be removed and can be replaced by other implementation.
 *
 */
ObservableQueryBase.experimentalDeferInitialQueryController = undefined;
ObservableQueryBase.suspectedResponseDatasWithInvalidValue = [
    "The network connection was lost.",
    "The request timed out.",
];
__decorate([
    mobx_1.observable.ref
], ObservableQueryBase.prototype, "_response", void 0);
__decorate([
    mobx_1.observable
], ObservableQueryBase.prototype, "_isFetching", void 0);
__decorate([
    mobx_1.observable.ref
], ObservableQueryBase.prototype, "_error", void 0);
__decorate([
    mobx_1.observable
], ObservableQueryBase.prototype, "_isStarted", void 0);
__decorate([
    mobx_1.observable.ref
], ObservableQueryBase.prototype, "_instance", void 0);
__decorate([
    mobx_1.action
], ObservableQueryBase.prototype, "start", null);
__decorate([
    mobx_1.flow
], ObservableQueryBase.prototype, "handleAsyncOnStart", null);
__decorate([
    mobx_1.action
], ObservableQueryBase.prototype, "stop", null);
__decorate([
    mobx_1.computed
], ObservableQueryBase.prototype, "instance", null);
__decorate([
    mobx_1.flow
], ObservableQueryBase.prototype, "fetch", null);
__decorate([
    mobx_1.action
], ObservableQueryBase.prototype, "setResponse", null);
__decorate([
    mobx_1.action
], ObservableQueryBase.prototype, "setError", null);
exports.ObservableQueryBase = ObservableQueryBase;
/**
 * ObservableQuery defines the event class to query the result from endpoint.
 * This supports the stale state if previous query exists.
 */
class ObservableQuery extends ObservableQueryBase {
    constructor(kvStore, instance, url, options = {}) {
        super(instance, options);
        this.kvStore = kvStore;
        this._url = "";
        this.refreshHandler = (data) => {
            const ifError = data === null || data === void 0 ? void 0 : data.ifError;
            if (ifError) {
                if (this.error) {
                    this.fetch();
                }
            }
            else {
                this.fetch();
            }
        };
        mobx_1.makeObservable(this);
        this.setUrl(url);
    }
    static refreshAllObserved() {
        ObservableQuery.eventListener.emit("refresh");
    }
    static refreshAllObservedIfError() {
        ObservableQuery.eventListener.emit("refresh", {
            ifError: true,
        });
    }
    onStart() {
        super.onStart();
        ObservableQuery.eventListener.addListener("refresh", this.refreshHandler);
    }
    onStop() {
        super.onStop();
        ObservableQuery.eventListener.addListener("refresh", this.refreshHandler);
    }
    get url() {
        return this._url;
    }
    setUrl(url) {
        if (this._url !== url) {
            this._url = url;
            this.fetch();
        }
    }
    fetchResponse(abortController) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.instance.get(this.url, {
                signal: abortController.signal,
            });
            return {
                headers: result.headers,
                response: {
                    data: result.data,
                    status: result.status,
                    staled: false,
                    timestamp: Date.now(),
                },
            };
        });
    }
    getCacheKey() {
        return `${this.instance.name}-${this.instance.defaults.baseURL}${this.instance.getUri({
            url: this.url,
        })}`;
    }
    saveResponse(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this.getCacheKey();
            yield this.kvStore.set(key, response);
        });
    }
    loadStaledResponse() {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this.getCacheKey();
            const response = yield this.kvStore.get(key);
            if (response) {
                return Object.assign(Object.assign({}, response), { staled: true });
            }
            return undefined;
        });
    }
}
ObservableQuery.eventListener = new eventemitter3_1.default();
__decorate([
    mobx_1.observable
], ObservableQuery.prototype, "_url", void 0);
__decorate([
    mobx_1.action
], ObservableQuery.prototype, "setUrl", null);
exports.ObservableQuery = ObservableQuery;
class ObservableQueryMap extends map_1.HasMapStore {
    constructor(creater) {
        super(creater);
    }
}
exports.ObservableQueryMap = ObservableQueryMap;
//# sourceMappingURL=query.js.map

/***/ }),

/***/ 1422:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableJsonRPCQueryMap = exports.ObservableJsonRPCQuery = void 0;
const index_1 = __webpack_require__(1233);
const mobx_1 = __webpack_require__(5);
const crypto_1 = __webpack_require__(51);
const buffer_1 = __webpack_require__(4);
const map_1 = __webpack_require__(1014);
/**
 * Experimental implementation for json rpc.
 */
class ObservableJsonRPCQuery extends index_1.ObservableQuery {
    constructor(kvStore, instance, url, method, params, options = {}) {
        super(kvStore, instance, url, options);
        this.method = method;
        this._params = params;
        mobx_1.makeObservable(this);
    }
    get params() {
        return this._params;
    }
    setParams(params) {
        this._params = params;
        this.fetch();
    }
    fetchResponse(abortController) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.instance.post(this.url, {
                jsonrpc: "2.0",
                id: "1",
                method: this.method,
                params: this.params,
            }, {
                signal: abortController.signal,
            });
            if (result.data.error && result.data.error.message) {
                throw new Error(result.data.error.message);
            }
            if (!result.data.result) {
                throw new Error("Unknown error");
            }
            return {
                headers: result.headers,
                response: {
                    data: result.data.result,
                    status: result.status,
                    staled: false,
                    timestamp: Date.now(),
                },
            };
        });
    }
    getCacheKey() {
        const paramsHash = buffer_1.Buffer.from(crypto_1.Hash.sha256(buffer_1.Buffer.from(JSON.stringify(this.params))).slice(0, 8)).toString("hex");
        return `${super.getCacheKey()}-${this.method}-${paramsHash}`;
    }
}
__decorate([
    mobx_1.observable.ref
], ObservableJsonRPCQuery.prototype, "_params", void 0);
__decorate([
    mobx_1.action
], ObservableJsonRPCQuery.prototype, "setParams", null);
exports.ObservableJsonRPCQuery = ObservableJsonRPCQuery;
class ObservableJsonRPCQueryMap extends map_1.HasMapStore {
    constructor(creater) {
        super(creater);
    }
}
exports.ObservableJsonRPCQueryMap = ObservableJsonRPCQueryMap;
//# sourceMappingURL=json-rpc.js.map

/***/ }),

/***/ 1423:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreUtils = void 0;
const unit_1 = __webpack_require__(26);
class StoreUtils {
    static getBalancesFromCurrencies(currenciesMap, bals) {
        const result = [];
        for (const bal of bals) {
            const currency = currenciesMap[bal.denom];
            if (currency) {
                const amount = new unit_1.Dec(bal.amount);
                if (amount.truncate().gt(new unit_1.Int(0))) {
                    result.push(new unit_1.CoinPretty(currency, amount));
                }
            }
        }
        return result;
    }
    static getBalanceFromCurrency(currency, bals) {
        const result = StoreUtils.getBalancesFromCurrencies({
            [currency.coinMinimalDenom]: currency,
        }, bals);
        if (result.length === 1) {
            return result[0];
        }
        return new unit_1.CoinPretty(currency, new unit_1.Int(0)).ready(false);
    }
}
exports.StoreUtils = StoreUtils;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1424:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 1425:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeStores = void 0;
/**
 * The pattern of using one store with multiple sub stores is often used.
 * For example, `queries.cosmos, queries.cosmwasm` is used by putting sub-stores per module in the main store.
 * This is a function that handles this part in common way.
 * `merge` is only provided at a shallow level and can't handle properly for deep, nested objects.
 * Also, if the properties of objects overlap, it does not guarantee proper functioning.
 *
 * AFAIK, `variadic tuple types` and `recursive conditional types` features are introduced in typescript 4,
 * thus, this only works on typescript 4+.
 *
 * KR: `Base`로부터 시작해서 Injects의 값들을 강제로 주입(?)한다. 실제 구현은 구리고 단순하다.
 *      단순히 이후의 object의 field들을 강제로 이전의 결과에 같은 key로 집어넣는다.
 *      즉, nested object나 deep object는 다루지 못 한다. 또한 `Base`로 전달된 값을 mutate한다.
 *      같은 key의 field가 이미 이전 결과에 존재한다면 오류를 던진다.
 *      @keplr-wallet/stores 패키지 내에서 필요로 하는 최소한의 기능만을 한다.
 *      최소한의 case만을 다룰 수 있기 때문에 어떤 함수인지 이해한 상태로만 사용하길 바람.
 *
 * @param baseStore The base store on top.
 * @param parameters Tuple to pass to fns as parameters.
 * @param fns The functions to create the merged object.
 */
const mergeStores = (baseStore, parameters, ...fns) => {
    for (let i = 0; i < fns.length; i++) {
        const fn = fns[i];
        const r = fn(baseStore, ...parameters);
        for (const key of Object.keys(r)) {
            if (baseStore[key]) {
                throw new Error(`${key} is already merged`);
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            baseStore[key] = r[key];
        }
    }
    return baseStore;
};
exports.mergeStores = mergeStores;
//# sourceMappingURL=merge.js.map

/***/ }),

/***/ 1426:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CosmwasmAccountImpl = exports.defaultCosmwasmMsgOpts = exports.CosmwasmAccount = void 0;
const common_1 = __webpack_require__(27);
const unit_1 = __webpack_require__(26);
const tx_1 = __webpack_require__(624);
const buffer_1 = __webpack_require__(4);
const deepmerge_1 = __importDefault(__webpack_require__(167));
const utils_1 = __webpack_require__(628);
const cosmos_1 = __webpack_require__(16);
exports.CosmwasmAccount = {
    use(options) {
        return (base, chainGetter, chainId) => {
            const msgOptsFromCreator = options.msgOptsCreator
                ? options.msgOptsCreator(chainId)
                : undefined;
            return {
                cosmwasm: new CosmwasmAccountImpl(base, chainGetter, chainId, options.queriesStore, deepmerge_1.default(exports.defaultCosmwasmMsgOpts, msgOptsFromCreator ? msgOptsFromCreator : {})),
            };
        };
    },
};
/**
 * @deprecated Predict gas through simulation rather than using a fixed gas.
 */
exports.defaultCosmwasmMsgOpts = {
    send: {
        cw20: {
            gas: 150000,
        },
    },
    executeWasm: {
        type: "wasm/MsgExecuteContract",
    },
};
class CosmwasmAccountImpl {
    constructor(base, chainGetter, chainId, queriesStore, _msgOpts) {
        this.base = base;
        this.chainGetter = chainGetter;
        this.chainId = chainId;
        this.queriesStore = queriesStore;
        this._msgOpts = _msgOpts;
        this.base.registerMakeSendTokenFn(this.processMakeSendTokenTx.bind(this));
        this.base.registerSendTokenFn(this.processSendToken.bind(this));
    }
    /**
     * @deprecated Predict gas through simulation rather than using a fixed gas.
     */
    get msgOpts() {
        return this._msgOpts;
    }
    processMakeSendTokenTx(amount, currency, recipient) {
        const denomHelper = new common_1.DenomHelper(currency.coinMinimalDenom);
        if (denomHelper.type === "cw20") {
            const actualAmount = (() => {
                let dec = new unit_1.Dec(amount);
                dec = dec.mul(unit_1.DecUtils.getPrecisionDec(currency.coinDecimals));
                return dec.truncate().toString();
            })();
            if (!("type" in currency) || currency.type !== "cw20") {
                throw new Error("Currency is not cw20");
            }
            cosmos_1.Bech32Address.validate(recipient, this.chainGetter.getChain(this.chainId).bech32Config.bech32PrefixAccAddr);
            return this.makeExecuteContractTx("send", currency.contractAddress, {
                transfer: {
                    recipient: recipient,
                    amount: actualAmount,
                },
            }, [], (tx) => {
                if (tx.code == null || tx.code === 0) {
                    // After succeeding to send token, refresh the balance.
                    const queryBalance = this.queries.queryBalances
                        .getQueryBech32Address(this.base.bech32Address)
                        .balances.find((bal) => {
                        return (bal.currency.coinMinimalDenom === currency.coinMinimalDenom);
                    });
                    if (queryBalance) {
                        queryBalance.fetch();
                    }
                }
            });
        }
    }
    /**
     * @deprecated
     */
    processSendToken(amount, currency, recipient, memo, stdFee, signOptions, onTxEvents) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const denomHelper = new common_1.DenomHelper(currency.coinMinimalDenom);
            switch (denomHelper.type) {
                case "cw20":
                    const actualAmount = (() => {
                        let dec = new unit_1.Dec(amount);
                        dec = dec.mul(unit_1.DecUtils.getPrecisionDec(currency.coinDecimals));
                        return dec.truncate().toString();
                    })();
                    if (!("type" in currency) || currency.type !== "cw20") {
                        throw new Error("Currency is not cw20");
                    }
                    yield this.sendExecuteContractMsg("send", currency.contractAddress, {
                        transfer: {
                            recipient: recipient,
                            amount: actualAmount,
                        },
                    }, [], memo, {
                        amount: (_a = stdFee.amount) !== null && _a !== void 0 ? _a : [],
                        gas: (_b = stdFee.gas) !== null && _b !== void 0 ? _b : this.msgOpts.send.cw20.gas.toString(),
                    }, signOptions, utils_1.txEventsWithPreOnFulfill(onTxEvents, (tx) => {
                        if (tx.code == null || tx.code === 0) {
                            // After succeeding to send token, refresh the balance.
                            const queryBalance = this.queries.queryBalances
                                .getQueryBech32Address(this.base.bech32Address)
                                .balances.find((bal) => {
                                return (bal.currency.coinMinimalDenom === currency.coinMinimalDenom);
                            });
                            if (queryBalance) {
                                queryBalance.fetch();
                            }
                        }
                    }));
                    return true;
            }
            return false;
        });
    }
    makeExecuteContractTx(
    // This arg can be used to override the type of sending tx if needed.
    type = "executeWasm", contractAddress, 
    // eslint-disable-next-line @typescript-eslint/ban-types
    obj, funds, preOnTxEvents) {
        cosmos_1.Bech32Address.validate(contractAddress, this.chainGetter.getChain(this.chainId).bech32Config.bech32PrefixAccAddr);
        const msg = {
            type: this.msgOpts.executeWasm.type,
            value: {
                sender: this.base.bech32Address,
                contract: contractAddress,
                msg: obj,
                funds,
            },
        };
        return this.base.cosmos.makeTx(type, {
            aminoMsgs: [msg],
            protoMsgs: [
                {
                    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                    value: tx_1.MsgExecuteContract.encode({
                        sender: msg.value.sender,
                        contract: msg.value.contract,
                        msg: buffer_1.Buffer.from(JSON.stringify(msg.value.msg)),
                        funds: msg.value.funds,
                    }).finish(),
                },
            ],
        }, preOnTxEvents);
    }
    /**
     * @deprecated
     */
    sendExecuteContractMsg(
    // This arg can be used to override the type of sending tx if needed.
    type = "executeWasm", contractAddress, 
    // eslint-disable-next-line @typescript-eslint/ban-types
    obj, funds, memo = "", stdFee, signOptions, onTxEvents) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const msg = {
                type: this.msgOpts.executeWasm.type,
                value: {
                    sender: this.base.bech32Address,
                    contract: contractAddress,
                    msg: obj,
                    funds,
                },
            };
            yield this.base.cosmos.sendMsgs(type, {
                aminoMsgs: [msg],
                protoMsgs: [
                    {
                        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                        value: tx_1.MsgExecuteContract.encode({
                            sender: msg.value.sender,
                            contract: msg.value.contract,
                            msg: buffer_1.Buffer.from(JSON.stringify(msg.value.msg)),
                            funds: msg.value.funds,
                        }).finish(),
                    },
                ],
            }, memo, {
                amount: (_a = stdFee.amount) !== null && _a !== void 0 ? _a : [],
                gas: stdFee.gas,
            }, signOptions, onTxEvents);
        });
    }
    get queries() {
        return this.queriesStore.get(this.chainId);
    }
}
exports.CosmwasmAccountImpl = CosmwasmAccountImpl;
//# sourceMappingURL=cosmwasm.js.map

/***/ }),

/***/ 1427:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinGeckoPriceStore = void 0;
const common_1 = __webpack_require__(119);
const axios_1 = __importDefault(__webpack_require__(60));
const common_2 = __webpack_require__(27);
const unit_1 = __webpack_require__(26);
const deepmerge_1 = __importDefault(__webpack_require__(167));
const mobx_1 = __webpack_require__(5);
class Throttler {
    constructor(duration) {
        this.duration = duration;
        this.fns = [];
        this.callback = () => {
            if (this.timeoutId != null) {
                clearTimeout(this.timeoutId);
                this.timeoutId = undefined;
            }
            if (this.fns.length > 0) {
                const fn = this.fns[this.fns.length - 1];
                fn();
                this.fns = [];
            }
        };
    }
    call(fn) {
        if (this.duration <= 0) {
            fn();
            return;
        }
        this.fns.push(fn);
        if (this.timeoutId != null) {
            clearTimeout(this.timeoutId);
        }
        this.timeoutId = setTimeout(this.callback, this.duration);
    }
}
class SortedSetStorage {
    constructor(kvStore, storeKey, throttleDuration = 0) {
        this.array = [];
        this.map = {};
        this.restored = {};
        this.isRestored = false;
        this.storeKey = "";
        if (!storeKey) {
            throw new Error("Empty store key");
        }
        this.kvStore = kvStore;
        this.storeKey = storeKey;
        this.throttler = new Throttler(throttleDuration);
    }
    has(value) {
        return this.map[value] === true;
    }
    add(...values) {
        let forceSave = false;
        let unknowns = [];
        for (const value of values) {
            if (this.isRestored) {
                if (this.restored[value]) {
                    forceSave = true;
                    delete this.restored[value];
                }
            }
            if (!this.has(value)) {
                unknowns.push(value);
            }
        }
        if (unknowns.length === 0) {
            if (this.isRestored && forceSave) {
                // No need to wait
                this.throttler.call(() => this.save());
            }
            return false;
        }
        // Remove duplicated.
        unknowns = [...new Set(unknowns)];
        for (const unknown of unknowns) {
            this.map[unknown] = true;
        }
        let newArray = this.array.slice().concat(unknowns);
        newArray = newArray.sort((id1, id2) => {
            return id1 < id2 ? -1 : 1;
        });
        this.array = newArray;
        if (this.isRestored) {
            // No need to wait
            this.throttler.call(() => this.save());
        }
        return true;
    }
    get values() {
        return this.array.slice();
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.kvStore.set(this.storeKey, this.array.filter((value) => !this.restored[value]));
        });
    }
    restore() {
        return __awaiter(this, void 0, void 0, function* () {
            const saved = yield this.kvStore.get(this.storeKey);
            if (saved) {
                for (const value of saved) {
                    this.restored[value] = true;
                }
                for (const value of this.array) {
                    if (this.restored[value]) {
                        delete this.restored[value];
                    }
                }
                this.add(...saved);
            }
            this.isRestored = true;
        });
    }
}
class CoinGeckoPriceStore extends common_1.ObservableQuery {
    constructor(kvStore, supportedVsCurrencies, defaultVsCurrency, options = {}) {
        var _a;
        const instance = axios_1.default.create({
            baseURL: options.baseURL || "https://api.coingecko.com/api/v3",
        });
        super(kvStore, instance, "/simple/price");
        this.isInitialized = false;
        const throttleDuration = (_a = options.throttleDuration) !== null && _a !== void 0 ? _a : 250;
        this._coinIds = new SortedSetStorage(kvStore, "__coin_ids", throttleDuration);
        this._vsCurrencies = new SortedSetStorage(kvStore, "__vs_currencies", throttleDuration);
        this._defaultVsCurrency = defaultVsCurrency;
        this._supportedVsCurrencies = supportedVsCurrencies;
        this._throttler = new Throttler(throttleDuration);
        mobx_1.makeObservable(this);
        this.restoreDefaultVsCurrency();
    }
    onStart() {
        super.onStart();
        return this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isInitialized) {
                return;
            }
            yield Promise.all([this._coinIds.restore(), this._vsCurrencies.restore()]);
            // No need to wait
            this._coinIds.save();
            this._vsCurrencies.save();
            this.updateURL([], [], true);
            this.isInitialized = true;
        });
    }
    get defaultVsCurrency() {
        return this._defaultVsCurrency;
    }
    setDefaultVsCurrency(defaultVsCurrency) {
        this._defaultVsCurrency = defaultVsCurrency;
        this.saveDefaultVsCurrency();
    }
    *restoreDefaultVsCurrency() {
        const saved = yield* common_2.toGenerator(this.kvStore.get("__default_vs_currency"));
        if (saved) {
            this._defaultVsCurrency = saved;
        }
    }
    saveDefaultVsCurrency() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.kvStore.set("__default_vs_currency", this.defaultVsCurrency);
        });
    }
    get supportedVsCurrencies() {
        return this._supportedVsCurrencies;
    }
    getFiatCurrency(currency) {
        return this._supportedVsCurrencies[currency];
    }
    canFetch() {
        // return (
        //   this._coinIds.values.length > 0 && this._vsCurrencies.values.length > 0
        // );
        return false;
    }
    fetchResponse(abortController) {
        const _super = Object.create(null, {
            fetchResponse: { get: () => super.fetchResponse }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const { response, headers } = yield _super.fetchResponse.call(this, abortController);
            // Because this store only queries the price of the tokens that have been requested from start,
            // it will remove the prior prices that have not been requested to just return the fetching result.
            // So, to prevent this problem, merge the prior response and current response with retaining the prior response's price.
            return {
                headers,
                response: Object.assign(Object.assign({}, response), {
                    data: deepmerge_1.default(this.response ? this.response.data : {}, response.data),
                }),
            };
        });
    }
    updateURL(coinIds, vsCurrencies, forceSetUrl = false) {
        const coinIdsUpdated = this._coinIds.add(...coinIds);
        const vsCurrenciesUpdated = this._vsCurrencies.add(...vsCurrencies);
        if (coinIdsUpdated || vsCurrenciesUpdated || forceSetUrl) {
            const url = `/simple/price?ids=${this._coinIds.values.join(",")}&vs_currencies=${this._vsCurrencies.values.join(",")}`;
            if (!this.isInitialized) {
                this.setUrl(url);
            }
            else {
                this._throttler.call(() => this.setUrl(url));
            }
        }
    }
    getCacheKey() {
        // Because the uri of the coingecko would be changed according to the coin ids and vsCurrencies.
        // Therefore, just using the uri as the cache key is not useful.
        return `${this.instance.name}-${this.instance.defaults.baseURL}${this.instance.getUri({
            url: "/simple/price",
        })}`;
    }
    getPrice(coinId, vsCurrency) {
        if (!vsCurrency) {
            vsCurrency = this.defaultVsCurrency;
        }
        if (!this.supportedVsCurrencies[vsCurrency]) {
            return undefined;
        }
        this.updateURL([coinId], [vsCurrency]);
        if (!this.response) {
            return undefined;
        }
        const coinPrices = this.response.data[coinId];
        if (!coinPrices) {
            return undefined;
        }
        return coinPrices[vsCurrency];
    }
    calculatePrice(coin, vsCurrrency) {
        if (!coin.currency.coinGeckoId) {
            return undefined;
        }
        if (!vsCurrrency) {
            vsCurrrency = this.defaultVsCurrency;
        }
        const fiatCurrency = this.supportedVsCurrencies[vsCurrrency];
        if (!fiatCurrency) {
            return undefined;
        }
        const price = this.getPrice(coin.currency.coinGeckoId, vsCurrrency);
        if (price === undefined) {
            return new unit_1.PricePretty(fiatCurrency, new unit_1.Int(0)).ready(false);
        }
        const dec = coin.toDec();
        const priceDec = new unit_1.Dec(price.toString());
        return new unit_1.PricePretty(fiatCurrency, dec.mul(priceDec));
    }
}
__decorate([
    mobx_1.observable
], CoinGeckoPriceStore.prototype, "_defaultVsCurrency", void 0);
__decorate([
    mobx_1.action
], CoinGeckoPriceStore.prototype, "setDefaultVsCurrency", null);
__decorate([
    mobx_1.flow
], CoinGeckoPriceStore.prototype, "restoreDefaultVsCurrency", null);
exports.CoinGeckoPriceStore = CoinGeckoPriceStore;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1428:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(1429), exports);
__exportStar(__webpack_require__(59), exports);
__exportStar(__webpack_require__(509), exports);
__exportStar(__webpack_require__(1430), exports);
__exportStar(__webpack_require__(1469), exports);
__exportStar(__webpack_require__(1473), exports);
__exportStar(__webpack_require__(1477), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1429:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueriesStore = exports.createQueriesSetBase = void 0;
const mobx_1 = __webpack_require__(5);
const balances_1 = __webpack_require__(509);
const common_1 = __webpack_require__(119);
const createQueriesSetBase = (kvStore, chainId, chainGetter) => {
    return {
        queryBalances: new balances_1.ObservableQueryBalances(kvStore, chainId, chainGetter),
    };
};
exports.createQueriesSetBase = createQueriesSetBase;
class QueriesStore {
    constructor(kvStore, chainGetter, ...queriesCreators) {
        this.kvStore = kvStore;
        this.chainGetter = chainGetter;
        this.queriesMap = new Map();
        this.queriesCreators = queriesCreators;
        mobx_1.makeObservable(this);
    }
    get(chainId) {
        if (!this.queriesMap.has(chainId)) {
            const queriesSetBase = exports.createQueriesSetBase(this.kvStore, chainId, this.chainGetter);
            mobx_1.runInAction(() => {
                const merged = common_1.mergeStores(queriesSetBase, [this.kvStore, chainId, this.chainGetter], ...this.queriesCreators);
                this.queriesMap.set(chainId, merged);
            });
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.queriesMap.get(chainId);
    }
}
__decorate([
    mobx_1.observable.shallow
], QueriesStore.prototype, "queriesMap", void 0);
exports.QueriesStore = QueriesStore;
//# sourceMappingURL=queries.js.map

/***/ }),

/***/ 1430:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Balance = exports.IBC = exports.Account = exports.Supply = exports.Staking = exports.Governance = void 0;
__exportStar(__webpack_require__(1235), exports);
__exportStar(__webpack_require__(1239), exports);
__exportStar(__webpack_require__(1240), exports);
__exportStar(__webpack_require__(1241), exports);
__exportStar(__webpack_require__(1242), exports);
__exportStar(__webpack_require__(1243), exports);
exports.Governance = __importStar(__webpack_require__(1238));
exports.Staking = __importStar(__webpack_require__(863));
exports.Supply = __importStar(__webpack_require__(1452));
exports.Account = __importStar(__webpack_require__(1453));
exports.IBC = __importStar(__webpack_require__(1454));
exports.Balance = __importStar(__webpack_require__(1455));
__exportStar(__webpack_require__(1456), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1431:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryGovernance = void 0;
const chain_query_1 = __webpack_require__(59);
const mobx_1 = __webpack_require__(5);
const params_1 = __webpack_require__(1236);
const unit_1 = __webpack_require__(26);
const mobx_utils_1 = __webpack_require__(201);
const proposal_1 = __webpack_require__(1237);
class ObservableQueryGovernance extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter, _queryPool) {
        super(kvStore, chainId, chainGetter, 
        // TODO: Handle pagination
        "/cosmos/gov/v1beta1/proposals?pagination.limit=3000");
        this._queryPool = _queryPool;
        this.paramDeposit = undefined;
        this.paramVoting = undefined;
        this.paramTally = undefined;
        this.getProposal = mobx_utils_1.computedFn((id) => {
            return this.proposals.find((proposal) => proposal.id === id);
        });
        mobx_1.makeObservable(this);
    }
    getQueryPool() {
        return this._queryPool;
    }
    getQueryParamDeposit() {
        if (!this.paramDeposit) {
            mobx_1.runInAction(() => {
                this.paramDeposit = new params_1.ObservableQueryGovParamDeposit(this.kvStore, this.chainId, this.chainGetter);
            });
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.paramDeposit;
    }
    getQueryParamVoting() {
        if (!this.paramVoting) {
            mobx_1.runInAction(() => {
                this.paramVoting = new params_1.ObservableQueryGovParamVoting(this.kvStore, this.chainId, this.chainGetter);
            });
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.paramVoting;
    }
    getQueryParamTally() {
        if (!this.paramTally) {
            mobx_1.runInAction(() => {
                this.paramTally = new params_1.ObservableQueryGovParamTally(this.kvStore, this.chainId, this.chainGetter);
            });
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.paramTally;
    }
    get quorum() {
        const paramTally = this.getQueryParamTally();
        if (!paramTally.response) {
            return new unit_1.IntPretty(new unit_1.Int(0)).ready(false);
        }
        // TODO: Use `RatePretty`
        let quorum = new unit_1.Dec(paramTally.response.data.tally_params.quorum);
        // Multiply 100
        quorum = quorum.mulTruncate(unit_1.DecUtils.getPrecisionDec(2));
        return new unit_1.IntPretty(quorum);
    }
    get proposals() {
        if (!this.response) {
            return [];
        }
        const result = [];
        for (const raw of this.response.data.proposals) {
            result.push(new proposal_1.ObservableQueryProposal(this.kvStore, this.chainId, this.chainGetter, raw, this));
        }
        return result.reverse();
    }
}
__decorate([
    mobx_1.observable.ref
], ObservableQueryGovernance.prototype, "paramDeposit", void 0);
__decorate([
    mobx_1.observable.ref
], ObservableQueryGovernance.prototype, "paramVoting", void 0);
__decorate([
    mobx_1.observable.ref
], ObservableQueryGovernance.prototype, "paramTally", void 0);
__decorate([
    mobx_1.computed
], ObservableQueryGovernance.prototype, "quorum", null);
__decorate([
    mobx_1.computed
], ObservableQueryGovernance.prototype, "proposals", null);
exports.ObservableQueryGovernance = ObservableQueryGovernance;
//# sourceMappingURL=proposals.js.map

/***/ }),

/***/ 1432:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryProposalVote = exports.ObservableQueryProposalVoteInner = void 0;
const chain_query_1 = __webpack_require__(59);
class ObservableQueryProposalVoteInner extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter, proposalsId, bech32Address) {
        super(kvStore, chainId, chainGetter, `/cosmos/gov/v1beta1/proposals/${proposalsId}/votes/${bech32Address}`);
        this.proposalId = proposalsId;
        this.bech32Address = bech32Address;
    }
    get vote() {
        if (!this.response) {
            return "Unspecified";
        }
        switch (this.response.data.vote.option) {
            case "VOTE_OPTION_YES":
                return "Yes";
            case "VOTE_OPTION_ABSTAIN":
                return "Abstain";
            case "VOTE_OPTION_NO":
                return "No";
            case "VOTE_OPTION_NO_WITH_VETO":
                return "NoWithVeto";
            default:
                return "Unspecified";
        }
    }
    canFetch() {
        // If bech32 address is empty, it will always fail, so don't need to fetch it.
        return this.bech32Address.length > 0;
    }
}
exports.ObservableQueryProposalVoteInner = ObservableQueryProposalVoteInner;
class ObservableQueryProposalVote extends chain_query_1.ObservableChainQueryMap {
    constructor(kvStore, chainId, chainGetter) {
        super(kvStore, chainId, chainGetter, (param) => {
            const { proposalId, voter } = JSON.parse(param);
            return new ObservableQueryProposalVoteInner(this.kvStore, this.chainId, this.chainGetter, proposalId, voter);
        });
        this.kvStore = kvStore;
        this.chainId = chainId;
        this.chainGetter = chainGetter;
    }
    getVote(proposalId, voter) {
        const param = JSON.stringify({
            proposalId,
            voter,
        });
        return this.get(param);
    }
}
exports.ObservableQueryProposalVote = ObservableQueryProposalVote;
//# sourceMappingURL=vote.js.map

/***/ }),

/***/ 1433:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryDelegations = exports.ObservableQueryDelegationsInner = void 0;
const chain_query_1 = __webpack_require__(59);
const unit_1 = __webpack_require__(26);
const mobx_1 = __webpack_require__(5);
const mobx_utils_1 = __webpack_require__(201);
const react_query_1 = __webpack_require__(236);
class ObservableQueryDelegationsInner extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter, bech32Address, misesStore) {
        super(kvStore, chainId, chainGetter, `/cosmos/staking/v1beta1/delegations/${bech32Address}?pagination.limit=1000`);
        this.duplicatedFetchCheck = true;
        this.getDelegationTo = mobx_utils_1.computedFn((validatorAddress) => {
            const delegations = this.delegations;
            const stakeCurrency = this.chainGetter.getChain(this.chainId)
                .stakeCurrency;
            if (!this.response) {
                return new unit_1.CoinPretty(stakeCurrency, new unit_1.Int(0)).ready(false);
            }
            for (const delegation of delegations) {
                if (delegation.delegation.validatorAddress === validatorAddress) {
                    return new unit_1.CoinPretty(stakeCurrency, new unit_1.Int(delegation.balance.amount));
                }
            }
            return new unit_1.CoinPretty(stakeCurrency, new unit_1.Int(0));
        });
        this.QueryClient = new react_query_1.QueryClient();
        mobx_1.makeObservable(this);
        this.bech32Address = bech32Address;
        this.misesStore = misesStore;
    }
    canFetch() {
        // If bech32 address is empty, it will always fail, so don't need to fetch it.
        return this.bech32Address.length > 0;
    }
    get total() {
        const stakeCurrency = this.chainGetter.getChain(this.chainId).stakeCurrency;
        if (!this.response) {
            return new unit_1.CoinPretty(stakeCurrency, new unit_1.Int(0)).ready(false);
        }
        let totalBalance = new unit_1.Int(0);
        for (const delegation of this.delegations) {
            totalBalance = totalBalance.add(new unit_1.Int(delegation.balance.amount));
        }
        return new unit_1.CoinPretty(stakeCurrency, totalBalance);
    }
    get delegationBalances() {
        if (!this.response) {
            return [];
        }
        const stakeCurrency = this.chainGetter.getChain(this.chainId).stakeCurrency;
        const result = [];
        if (this.delegations) {
            for (const delegation of this.delegations) {
                result.push({
                    validatorAddress: delegation.delegation.validatorAddress,
                    balance: new unit_1.CoinPretty(stakeCurrency, new unit_1.Int(delegation.balance.amount)),
                });
            }
        }
        return result;
    }
    get delegations() {
        var _a, _b;
        if (!this.response) {
            return [];
        }
        return ((_b = (_a = this.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.delegationResponses) || [];
    }
    *fetch() {
        var _a;
        if (!this.bech32Address) {
            return;
        }
        this._isFetching = true;
        (_a = this.QueryClient) === null || _a === void 0 ? void 0 : _a.fetchQuery("delegations", () => this.misesStore.delegations(this.bech32Address), this.fetchConfig).then((res) => {
            this._isFetching = false;
            this.setResponse({
                data: res,
                status: 200,
                staled: true,
                timestamp: new Date().getTime(),
            });
        }).catch((err) => {
            this._isFetching = false;
            this.setError(err);
        });
    }
}
__decorate([
    mobx_1.computed
], ObservableQueryDelegationsInner.prototype, "total", null);
__decorate([
    mobx_1.computed
], ObservableQueryDelegationsInner.prototype, "delegationBalances", null);
__decorate([
    mobx_1.computed
], ObservableQueryDelegationsInner.prototype, "delegations", null);
__decorate([
    mobx_1.override
], ObservableQueryDelegationsInner.prototype, "fetch", null);
exports.ObservableQueryDelegationsInner = ObservableQueryDelegationsInner;
class ObservableQueryDelegations extends chain_query_1.ObservableChainQueryMap {
    constructor(kvStore, chainId, chainGetter, misesStore) {
        super(kvStore, chainId, chainGetter, (bech32Address) => {
            return new ObservableQueryDelegationsInner(this.kvStore, this.chainId, this.chainGetter, bech32Address, this.misesStore);
        });
        this.kvStore = kvStore;
        this.chainId = chainId;
        this.chainGetter = chainGetter;
        this.misesStore = misesStore;
    }
    getQueryBech32Address(bech32Address) {
        return this.get(bech32Address);
    }
}
exports.ObservableQueryDelegations = ObservableQueryDelegations;
//# sourceMappingURL=delegations.js.map

/***/ }),

/***/ 1434:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryRewards = exports.ObservableQueryRewardsInner = void 0;
const chain_query_1 = __webpack_require__(59);
const mobx_1 = __webpack_require__(5);
const unit_1 = __webpack_require__(26);
const common_1 = __webpack_require__(119);
const mobx_utils_1 = __webpack_require__(201);
const react_query_1 = __webpack_require__(236);
class ObservableQueryRewardsInner extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter, bech32Address, misesStore) {
        super(kvStore, chainId, chainGetter, `/cosmos/distribution/v1beta1/delegators/${bech32Address}/rewards`);
        this.duplicatedFetchCheck = true;
        this.getRewardsOf = mobx_utils_1.computedFn((validatorAddress) => {
            var _a, _b, _c;
            const chainInfo = this.chainGetter.getChain(this.chainId);
            const currenciesMap = chainInfo.currencies.reduce((obj, currency) => {
                // TODO: Handle the contract tokens.
                if (!("type" in currency)) {
                    obj[currency.coinMinimalDenom] = currency;
                }
                return obj;
            }, {});
            const reward = (_b = (_a = this.response) === null || _a === void 0 ? void 0 : _a.data.rewards) === null || _b === void 0 ? void 0 : _b.find((r) => {
                return r.validatorAddress === validatorAddress;
            });
            return common_1.StoreUtils.getBalancesFromCurrencies(currenciesMap, (_c = reward === null || reward === void 0 ? void 0 : reward.reward) !== null && _c !== void 0 ? _c : []);
        });
        this.getStakableRewardOf = mobx_utils_1.computedFn((validatorAddress) => {
            var _a, _b, _c;
            const chainInfo = this.chainGetter.getChain(this.chainId);
            const reward = (_b = (_a = this.response) === null || _a === void 0 ? void 0 : _a.data.rewards) === null || _b === void 0 ? void 0 : _b.find((r) => {
                return r.validatorAddress === validatorAddress;
            });
            return common_1.StoreUtils.getBalanceFromCurrency(chainInfo.stakeCurrency, (_c = reward === null || reward === void 0 ? void 0 : reward.reward) !== null && _c !== void 0 ? _c : []);
        });
        this.getUnstakableRewardsOf = mobx_utils_1.computedFn((validatorAddress) => {
            var _a, _b, _c;
            const chainInfo = this.chainGetter.getChain(this.chainId);
            const currenciesMap = chainInfo.currencies.reduce((obj, currency) => {
                // TODO: Handle the contract tokens.
                if (!("type" in currency) &&
                    currency.coinMinimalDenom !== chainInfo.stakeCurrency.coinMinimalDenom) {
                    obj[currency.coinMinimalDenom] = currency;
                }
                return obj;
            }, {});
            const reward = (_b = (_a = this.response) === null || _a === void 0 ? void 0 : _a.data.rewards) === null || _b === void 0 ? void 0 : _b.find((r) => {
                return r.validatorAddress === validatorAddress;
            });
            return common_1.StoreUtils.getBalancesFromCurrencies(currenciesMap, (_c = reward === null || reward === void 0 ? void 0 : reward.reward) !== null && _c !== void 0 ? _c : []);
        });
        /**
         * getDescendingPendingRewardValidatorAddresses returns the validator addresses in descending order by stakable asset.
         */
        // ComputeFn doesn't support the default argument.
        this.getDescendingPendingRewardValidatorAddresses = mobx_utils_1.computedFn((maxValiadtors) => {
            var _a, _b;
            if (!this.response) {
                return [];
            }
            const chainInfo = this.chainGetter.getChain(this.chainId);
            const rewards = (_b = (_a = this.response.data.rewards) === null || _a === void 0 ? void 0 : _a.slice()) !== null && _b !== void 0 ? _b : [];
            rewards.sort((reward1, reward2) => {
                var _a, _b;
                const amount1 = common_1.StoreUtils.getBalanceFromCurrency(chainInfo.stakeCurrency, (_a = reward1.reward) !== null && _a !== void 0 ? _a : []);
                const amount2 = common_1.StoreUtils.getBalanceFromCurrency(chainInfo.stakeCurrency, (_b = reward2.reward) !== null && _b !== void 0 ? _b : []);
                if (amount1.toDec().gt(amount2.toDec())) {
                    return -1;
                }
                else {
                    return 1;
                }
            });
            return rewards
                .filter((reward) => {
                if (reward.reward) {
                    for (const r of reward.reward) {
                        const dec = new unit_1.Dec(r.amount);
                        if (dec.truncate().gt(new unit_1.Int(0))) {
                            return true;
                        }
                    }
                }
                return false;
            })
                .slice(0, maxValiadtors)
                .map((r) => r.validatorAddress);
        });
        this.QueryClient = new react_query_1.QueryClient();
        mobx_1.makeObservable(this);
        this.bech32Address = bech32Address;
        this.misesStore = misesStore;
    }
    canFetch() {
        // If bech32 address is empty, it will always fail, so don't need to fetch it.
        return this.bech32Address.length > 0;
    }
    get rewards() {
        var _a, _b, _c;
        const chainInfo = this.chainGetter.getChain(this.chainId);
        const currenciesMap = chainInfo.currencies.reduce((obj, currency) => {
            // TODO: Handle the contract tokens.
            if (!("type" in currency)) {
                obj[currency.coinMinimalDenom] = currency;
            }
            return obj;
        }, {});
        return common_1.StoreUtils.getBalancesFromCurrencies(currenciesMap, (_c = (_b = (_a = this.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.total) !== null && _c !== void 0 ? _c : []);
    }
    get stakableReward() {
        var _a, _b, _c;
        const chainInfo = this.chainGetter.getChain(this.chainId);
        return common_1.StoreUtils.getBalanceFromCurrency(chainInfo.stakeCurrency, (_c = (_b = (_a = this.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.total) !== null && _c !== void 0 ? _c : []);
    }
    get unstakableRewards() {
        var _a, _b;
        const chainInfo = this.chainGetter.getChain(this.chainId);
        const currenciesMap = chainInfo.currencies.reduce((obj, currency) => {
            // TODO: Handle the contract tokens.
            if (!("type" in currency) &&
                currency.coinMinimalDenom !== chainInfo.stakeCurrency.coinMinimalDenom) {
                obj[currency.coinMinimalDenom] = currency;
            }
            return obj;
        }, {});
        return common_1.StoreUtils.getBalancesFromCurrencies(currenciesMap, (_b = (_a = this.response) === null || _a === void 0 ? void 0 : _a.data.total) !== null && _b !== void 0 ? _b : []);
    }
    get pendingRewardValidatorAddresses() {
        var _a;
        if (!this.response) {
            return [];
        }
        const result = [];
        for (const reward of (_a = this.response.data.rewards) !== null && _a !== void 0 ? _a : []) {
            if (reward.reward) {
                for (const r of reward.reward) {
                    const dec = new unit_1.Dec(r.amount);
                    if (dec.truncate().gt(new unit_1.Int(0))) {
                        result.push(reward.validatorAddress);
                        break;
                    }
                }
            }
        }
        return result;
    }
    *fetch() {
        var _a;
        if (!this.bech32Address) {
            return;
        }
        this._isFetching = true;
        (_a = this.QueryClient) === null || _a === void 0 ? void 0 : _a.fetchQuery("rewards", () => __awaiter(this, void 0, void 0, function* () {
            const res = yield this.misesStore.rewards(this.bech32Address);
            if (res && res.total[0])
                res.total[0].amount = Number(res.total[0].amount) / Math.pow(10, 18);
            return res;
        }), this.fetchConfig).then((res) => {
            this._isFetching = false;
            this.setResponse({
                data: res,
                status: 200,
                staled: true,
                timestamp: new Date().getTime(),
            });
        }).catch((err) => {
            this._isFetching = false;
            this.setError(err);
        });
    }
}
__decorate([
    mobx_1.computed
], ObservableQueryRewardsInner.prototype, "rewards", null);
__decorate([
    mobx_1.computed
], ObservableQueryRewardsInner.prototype, "stakableReward", null);
__decorate([
    mobx_1.computed
], ObservableQueryRewardsInner.prototype, "unstakableRewards", null);
__decorate([
    mobx_1.computed
], ObservableQueryRewardsInner.prototype, "pendingRewardValidatorAddresses", null);
__decorate([
    mobx_1.override
], ObservableQueryRewardsInner.prototype, "fetch", null);
exports.ObservableQueryRewardsInner = ObservableQueryRewardsInner;
class ObservableQueryRewards extends chain_query_1.ObservableChainQueryMap {
    constructor(kvStore, chainId, chainGetter, misesStore) {
        super(kvStore, chainId, chainGetter, (bech32Address) => {
            return new ObservableQueryRewardsInner(this.kvStore, this.chainId, this.chainGetter, bech32Address, misesStore);
        });
        this.kvStore = kvStore;
        this.chainId = chainId;
        this.chainGetter = chainGetter;
        this.misesStore = misesStore;
    }
    getQueryBech32Address(bech32Address) {
        return this.get(bech32Address);
    }
}
exports.ObservableQueryRewards = ObservableQueryRewards;
//# sourceMappingURL=rewards.js.map

/***/ }),

/***/ 1435:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryUnbondingDelegations = exports.ObservableQueryUnbondingDelegationsInner = void 0;
const chain_query_1 = __webpack_require__(59);
const unit_1 = __webpack_require__(26);
const mobx_1 = __webpack_require__(5);
const react_query_1 = __webpack_require__(236);
class ObservableQueryUnbondingDelegationsInner extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter, bech32Address, misesStore) {
        super(kvStore, chainId, chainGetter, `/cosmos/staking/v1beta1/delegators/${bech32Address}/unbonding_delegations?pagination.limit=1000`);
        this.duplicatedFetchCheck = true;
        this.QueryClient = new react_query_1.QueryClient();
        mobx_1.makeObservable(this);
        this.bech32Address = bech32Address;
        this.misesStore = misesStore;
    }
    canFetch() {
        var _a;
        // If bech32 address is empty, it will always fail, so don't need to fetch it.
        return ((_a = this.bech32Address) === null || _a === void 0 ? void 0 : _a.length) > 0;
    }
    get total() {
        const stakeCurrency = this.chainGetter.getChain(this.chainId).stakeCurrency;
        if (!this.response) {
            return new unit_1.CoinPretty(stakeCurrency, new unit_1.Int(0)).ready(false);
        }
        let totalBalance = new unit_1.Int(0);
        for (const unbondingDelegation of this.unbondings) {
            for (const entry of unbondingDelegation.entries) {
                totalBalance = totalBalance.add(new unit_1.Int(entry.balance));
            }
        }
        return new unit_1.CoinPretty(stakeCurrency, totalBalance);
    }
    get unbondingBalances() {
        const unbondings = this.unbondings;
        const stakeCurrency = this.chainGetter.getChain(this.chainId).stakeCurrency;
        const result = [];
        for (const unbonding of unbondings) {
            const entries = [];
            for (const entry of unbonding.entries) {
                entries.push({
                    creationHeight: new unit_1.Int(entry.creationHeight),
                    completionTime: entry.completionTime,
                    balance: new unit_1.CoinPretty(stakeCurrency, new unit_1.Int(entry.balance)),
                });
            }
            result.push({
                validatorAddress: unbonding.validatorAddress,
                entries,
            });
        }
        return result;
    }
    get unbondings() {
        var _a;
        if (!this.response) {
            return [];
        }
        return ((_a = this.response.data) === null || _a === void 0 ? void 0 : _a.unbondingResponses) || [];
    }
    *fetch() {
        var _a;
        if (!this.bech32Address) {
            return;
        }
        this._isFetching = true;
        (_a = this.QueryClient) === null || _a === void 0 ? void 0 : _a.fetchQuery("unbondingDelegations", () => this.misesStore.unbondingDelegations(this.bech32Address), this.fetchConfig).then((res) => {
            this._isFetching = false;
            this.setResponse({
                data: res,
                status: 200,
                staled: true,
                timestamp: new Date().getTime(),
            });
        }).catch((err) => {
            this._isFetching = false;
            this.setError(err);
        });
    }
}
__decorate([
    mobx_1.computed
], ObservableQueryUnbondingDelegationsInner.prototype, "total", null);
__decorate([
    mobx_1.computed
], ObservableQueryUnbondingDelegationsInner.prototype, "unbondingBalances", null);
__decorate([
    mobx_1.computed
], ObservableQueryUnbondingDelegationsInner.prototype, "unbondings", null);
__decorate([
    mobx_1.override
], ObservableQueryUnbondingDelegationsInner.prototype, "fetch", null);
exports.ObservableQueryUnbondingDelegationsInner = ObservableQueryUnbondingDelegationsInner;
class ObservableQueryUnbondingDelegations extends chain_query_1.ObservableChainQueryMap {
    constructor(kvStore, chainId, chainGetter, misesStore) {
        super(kvStore, chainId, chainGetter, (bech32Address) => {
            return new ObservableQueryUnbondingDelegationsInner(this.kvStore, this.chainId, this.chainGetter, bech32Address, misesStore);
        });
        this.kvStore = kvStore;
        this.chainId = chainId;
        this.chainGetter = chainGetter;
        this.misesStore = misesStore;
    }
    getQueryBech32Address(bech32Address) {
        return this.get(bech32Address);
    }
}
exports.ObservableQueryUnbondingDelegations = ObservableQueryUnbondingDelegations;
//# sourceMappingURL=unbonding-delegations.js.map

/***/ }),

/***/ 1436:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryValidators = exports.ObservableQueryValidatorsInner = exports.ObservableQueryValidatorThumbnail = void 0;
const chain_query_1 = __webpack_require__(59);
const types_1 = __webpack_require__(863);
const mobx_1 = __webpack_require__(5);
const common_1 = __webpack_require__(119);
const axios_1 = __importDefault(__webpack_require__(60));
const p_queue_1 = __importDefault(__webpack_require__(1437));
const unit_1 = __webpack_require__(26);
const mobx_utils_1 = __webpack_require__(201);
/**
 * Fetch the validator's thumbnail from keybase if the identity exists.
 */
class ObservableQueryValidatorThumbnail extends common_1.ObservableQuery {
    constructor(kvStore, validator) {
        const instance = axios_1.default.create({
            baseURL: "https://keybase.io/",
        });
        super(kvStore, instance, `_/api/1.0/user/lookup.json?fields=pictures&key_suffix=${validator.description.identity}`);
        mobx_1.makeObservable(this);
        this.validator = validator;
    }
    canFetch() {
        return this.validator.description.identity !== "";
    }
    fetchResponse(abortController) {
        const _super = Object.create(null, {
            fetchResponse: { get: () => super.fetchResponse }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield ObservableQueryValidatorThumbnail.fetchingThumbnailQueue.add(() => {
                return _super.fetchResponse.call(this, abortController);
            });
        });
    }
    get thumbnail() {
        var _a, _b, _c, _d;
        if (((_a = this.response) === null || _a === void 0 ? void 0 : _a.data.status.code) === 0) {
            if (this.response.data.them && this.response.data.them.length > 0) {
                return (_d = (_c = (_b = this.response.data.them[0].pictures) === null || _b === void 0 ? void 0 : _b.primary) === null || _c === void 0 ? void 0 : _c.url) !== null && _d !== void 0 ? _d : "";
            }
        }
        return "";
    }
}
/**
 * Throttle down fetching the thumbnail from Keybase.
 * If too many requests occurs at the same time, Keybase will reject these requests.
 * @protected
 */
ObservableQueryValidatorThumbnail.fetchingThumbnailQueue = new p_queue_1.default({
    concurrency: 3,
});
__decorate([
    mobx_1.computed
], ObservableQueryValidatorThumbnail.prototype, "thumbnail", null);
exports.ObservableQueryValidatorThumbnail = ObservableQueryValidatorThumbnail;
class ObservableQueryValidatorsInner extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter, status) {
        super(kvStore, chainId, chainGetter, `/cosmos/staking/v1beta1/validators?pagination.limit=1000&status=${(() => {
            switch (status) {
                case types_1.BondStatus.Bonded:
                    return "BOND_STATUS_BONDED";
                case types_1.BondStatus.Unbonded:
                    return "BOND_STATUS_UNBONDED";
                case types_1.BondStatus.Unbonding:
                    return "BOND_STATUS_UNBONDING";
                default:
                    return "BOND_STATUS_UNSPECIFIED";
            }
        })()}`);
        this.status = status;
        this.thumbnailMap = new Map();
        this.getValidator = mobx_utils_1.computedFn((validatorAddress) => {
            const validators = this.validators;
            return validators.find((val) => val.operator_address === validatorAddress);
        });
        this.getValidatorThumbnail = mobx_utils_1.computedFn((operatorAddress) => {
            const validators = this.validators;
            const validator = validators.find((val) => val.operator_address === operatorAddress);
            if (!validator) {
                return "";
            }
            if (!validator.description.identity) {
                return "";
            }
            const identity = validator.description.identity;
            if (!this.thumbnailMap.has(identity)) {
                mobx_1.runInAction(() => {
                    this.thumbnailMap.set(identity, new ObservableQueryValidatorThumbnail(this.kvStore, validator));
                });
            }
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return this.thumbnailMap.get(identity).thumbnail;
        });
        /**
         * Return the validator's voting power as human friendly (considering the coin decimals).
         */
        this.getValidatorShare = mobx_utils_1.computedFn((operatorAddress) => {
            const validators = this.validators;
            const validator = validators.find((val) => val.operator_address === operatorAddress);
            if (!validator) {
                return;
            }
            const chainInfo = this.chainGetter.getChain(this.chainId);
            const stakeCurrency = chainInfo.stakeCurrency;
            const power = new unit_1.Dec(validator.tokens).truncate();
            return new unit_1.CoinPretty(stakeCurrency, power);
        });
        mobx_1.makeObservable(this);
    }
    get validators() {
        if (!this.response) {
            return [];
        }
        return this.response.data.validators;
    }
    get validatorsSortedByVotingPower() {
        const validators = this.validators;
        return validators.sort((v1, v2) => {
            return new unit_1.Dec(v1.tokens).gt(new unit_1.Dec(v2.tokens)) ? -1 : 1;
        });
    }
}
__decorate([
    mobx_1.observable.shallow
], ObservableQueryValidatorsInner.prototype, "thumbnailMap", void 0);
__decorate([
    mobx_1.computed
], ObservableQueryValidatorsInner.prototype, "validators", null);
__decorate([
    mobx_1.computed
], ObservableQueryValidatorsInner.prototype, "validatorsSortedByVotingPower", null);
exports.ObservableQueryValidatorsInner = ObservableQueryValidatorsInner;
class ObservableQueryValidators extends chain_query_1.ObservableChainQueryMap {
    constructor(kvStore, chainId, chainGetter) {
        super(kvStore, chainId, chainGetter, (status) => {
            return new ObservableQueryValidatorsInner(this.kvStore, this.chainId, this.chainGetter, status);
        });
        this.kvStore = kvStore;
        this.chainId = chainId;
        this.chainGetter = chainGetter;
    }
    getQueryStatus(status = types_1.BondStatus.Bonded) {
        return this.get(status);
    }
}
exports.ObservableQueryValidators = ObservableQueryValidators;
//# sourceMappingURL=validators.js.map

/***/ }),

/***/ 1442:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryStakingPool = void 0;
const chain_query_1 = __webpack_require__(59);
const mobx_1 = __webpack_require__(5);
const unit_1 = __webpack_require__(26);
class ObservableQueryStakingPool extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter) {
        super(kvStore, chainId, chainGetter, "/cosmos/staking/v1beta1/pool");
        mobx_1.makeObservable(this);
    }
    get notBondedTokens() {
        const chainInfo = this.chainGetter.getChain(this.chainId);
        if (!this.response) {
            return new unit_1.CoinPretty(chainInfo.stakeCurrency, 0);
        }
        return new unit_1.CoinPretty(chainInfo.stakeCurrency, this.response.data.pool.not_bonded_tokens);
    }
    get bondedTokens() {
        const chainInfo = this.chainGetter.getChain(this.chainId);
        if (!this.response) {
            return new unit_1.CoinPretty(chainInfo.stakeCurrency, 0);
        }
        return new unit_1.CoinPretty(chainInfo.stakeCurrency, this.response.data.pool.bonded_tokens);
    }
}
__decorate([
    mobx_1.computed
], ObservableQueryStakingPool.prototype, "notBondedTokens", null);
__decorate([
    mobx_1.computed
], ObservableQueryStakingPool.prototype, "bondedTokens", null);
exports.ObservableQueryStakingPool = ObservableQueryStakingPool;
//# sourceMappingURL=pool.js.map

/***/ }),

/***/ 1443:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryStakingParams = void 0;
const chain_query_1 = __webpack_require__(59);
const mobx_1 = __webpack_require__(5);
class ObservableQueryStakingParams extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter) {
        super(kvStore, chainId, chainGetter, "/cosmos/staking/v1beta1/params");
        mobx_1.makeObservable(this);
    }
    get unbondingTimeSec() {
        if (!this.response) {
            return 0;
        }
        return parseInt(this.response.data.params.unbonding_time.replace("s", ""));
    }
    get maxValidators() {
        var _a, _b;
        return (_b = (_a = this.response) === null || _a === void 0 ? void 0 : _a.data.params.max_validators) !== null && _b !== void 0 ? _b : 0;
    }
    get maxEntries() {
        var _a, _b;
        return (_b = (_a = this.response) === null || _a === void 0 ? void 0 : _a.data.params.max_entries) !== null && _b !== void 0 ? _b : 0;
    }
    get historicalEntries() {
        var _a, _b;
        return (_b = (_a = this.response) === null || _a === void 0 ? void 0 : _a.data.params.historical_entries) !== null && _b !== void 0 ? _b : 0;
    }
    get bondDenom() {
        var _a, _b;
        return (_b = (_a = this.response) === null || _a === void 0 ? void 0 : _a.data.params.bond_denom) !== null && _b !== void 0 ? _b : "";
    }
}
__decorate([
    mobx_1.computed
], ObservableQueryStakingParams.prototype, "unbondingTimeSec", null);
exports.ObservableQueryStakingParams = ObservableQueryStakingParams;
//# sourceMappingURL=params.js.map

/***/ }),

/***/ 1444:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryInflation = void 0;
const mobx_1 = __webpack_require__(5);
const unit_1 = __webpack_require__(26);
class ObservableQueryInflation {
    constructor(chainId, chainGetter, _queryMint, _queryPool, _querySupplyTotal, _queryIrisMint, _querySifchainAPY, _queryOsmosisEpochs, _queryOsmosisEpochProvisions, _queryOsmosisMintParams, _queryJunoAnnualProvisions, _queryDistributionParams) {
        this.chainId = chainId;
        this.chainGetter = chainGetter;
        this._queryMint = _queryMint;
        this._queryPool = _queryPool;
        this._querySupplyTotal = _querySupplyTotal;
        this._queryIrisMint = _queryIrisMint;
        this._querySifchainAPY = _querySifchainAPY;
        this._queryOsmosisEpochs = _queryOsmosisEpochs;
        this._queryOsmosisEpochProvisions = _queryOsmosisEpochProvisions;
        this._queryOsmosisMintParams = _queryOsmosisMintParams;
        this._queryJunoAnnualProvisions = _queryJunoAnnualProvisions;
        this._queryDistributionParams = _queryDistributionParams;
        mobx_1.makeObservable(this);
    }
    get error() {
        var _a, _b;
        return ((_b = (_a = this._queryMint.error) !== null && _a !== void 0 ? _a : this._queryPool.error) !== null && _b !== void 0 ? _b : this._querySupplyTotal.getQueryStakeDenom().error);
    }
    get isFetching() {
        return (this._queryMint.isFetching ||
            this._queryPool.isFetching ||
            this._querySupplyTotal.getQueryStakeDenom().isFetching);
    }
    // Return an inflation as `IntPrety`.
    // If the staking pool info is fetched, this will consider this info for calculating the more accurate value.
    get inflation() {
        // TODO: Use `RatePretty`
        var _a, _b, _c, _d;
        try {
            let dec;
            // XXX: Hard coded part for the iris hub and sifchain.
            // TODO: Remove this part.
            const chainInfo = this.chainGetter.getChain(this.chainId);
            if (chainInfo.chainId.startsWith("irishub")) {
                dec = new unit_1.Dec((_b = (_a = this._queryIrisMint.response) === null || _a === void 0 ? void 0 : _a.data.result.inflation) !== null && _b !== void 0 ? _b : "0").mul(unit_1.DecUtils.getPrecisionDec(2));
            }
            else if (chainInfo.chainId.startsWith("sifchain")) {
                return new unit_1.IntPretty(new unit_1.Dec(this._querySifchainAPY.liquidityAPY.toString()));
            }
            else if (chainInfo.chainId.startsWith("osmosis")) {
                /*
                  XXX: Temporary and unfinished implementation for the osmosis staking APY.
                       Osmosis has different minting method.
                       It mints the fixed token per epoch with deduction feature on the range of epoch.
                       And, it actually doesn't mint the token, it has the locked token that will be inflated.
                       So, currently, using the result of `supply total` to calculate the APY is actually not valid
                       because it included the locked token that is not yet inflated.
                       So, for now, just assume that the curreny supply is 100,000,000.
                 */
                const mintParams = this._queryOsmosisMintParams;
                if (mintParams.epochIdentifier) {
                    const epochDuration = this._queryOsmosisEpochs.getEpoch(mintParams.epochIdentifier).duration;
                    if (epochDuration) {
                        const epochProvision = this._queryOsmosisEpochProvisions
                            .epochProvisions;
                        if (epochProvision &&
                            this._querySupplyTotal.getQueryStakeDenom().response) {
                            const mintingEpochProvision = new unit_1.Dec(epochProvision
                                .toDec()
                                .mul(mintParams.distributionProportions.staking)
                                .truncate()
                                .toString());
                            const yearMintingProvision = mintingEpochProvision.mul(new unit_1.Dec(((365 * 24 * 3600) / epochDuration).toString()));
                            const total = unit_1.DecUtils.getPrecisionDec(8);
                            dec = yearMintingProvision
                                .quo(total)
                                .mul(unit_1.DecUtils.getPrecisionDec(2));
                        }
                    }
                }
            }
            else if (chainInfo.chainId.startsWith("juno")) {
                // In juno, the actual supply on chain and the supply recognized by the community are different.
                // I don't know why, but it's annoying to deal with this problem.
                if (this._queryJunoAnnualProvisions.annualProvisionsRaw &&
                    this._queryPool.response) {
                    const bondedToken = new unit_1.Dec(this._queryPool.response.data.pool.bonded_tokens);
                    const dec = this._queryJunoAnnualProvisions.annualProvisionsRaw
                        .quo(bondedToken)
                        .mul(new unit_1.Dec(1).sub(this._queryDistributionParams.communityTax.toDec()))
                        .mul(unit_1.DecUtils.getTenExponentN(2));
                    return new unit_1.IntPretty(dec);
                }
            }
            else {
                dec = new unit_1.Dec((_d = (_c = this._queryMint.response) === null || _c === void 0 ? void 0 : _c.data.inflation) !== null && _d !== void 0 ? _d : "0").mul(unit_1.DecUtils.getPrecisionDec(2));
            }
            if (!dec || dec.equals(new unit_1.Dec(0))) {
                return new unit_1.IntPretty(new unit_1.Int(0)).ready(false);
            }
            if (this._queryPool.response) {
                const bondedToken = new unit_1.Dec(this._queryPool.response.data.pool.bonded_tokens);
                const totalStr = (() => {
                    if (chainInfo.chainId.startsWith("osmosis")) {
                        // For osmosis, for now, just assume that the current supply is 100,000,000 with 6 decimals.
                        return unit_1.DecUtils.getPrecisionDec(8 + 6).toString();
                    }
                    if (chainInfo.chainId.startsWith("umee")) {
                        const supplyTotalRes = this._querySupplyTotal.getQueryDenomByQueryString(chainInfo.stakeCurrency.coinMinimalDenom).response;
                        if (!supplyTotalRes) {
                            return "0";
                        }
                        else {
                            return supplyTotalRes.data.amount.amount;
                        }
                    }
                    const supplyTotalRes = this._querySupplyTotal.getQueryStakeDenom()
                        .response;
                    if (!supplyTotalRes) {
                        return "0";
                    }
                    else {
                        return supplyTotalRes.data.amount.amount;
                    }
                })();
                const total = new unit_1.Dec(totalStr);
                if (total.gt(new unit_1.Dec(0))) {
                    // staking APR is calculated as:
                    //   new_coins_per_year = inflation_pct * total_supply * (1 - community_pool_tax)
                    //   apr = new_coins_per_year / total_bonded_tokens
                    const ratio = bondedToken.quo(total);
                    dec = dec
                        .mul(new unit_1.Dec(1).sub(this._queryDistributionParams.communityTax.toDec()))
                        .quo(ratio);
                    // TODO: Rounding?
                }
            }
            return new unit_1.IntPretty(dec);
        }
        catch (e) {
            console.log(e);
            // XXX: There have been reported errors regarding Sifchain.
            // However, I wasn’t able to reproduce the error so exact cause haven’t been identified.
            // For now, use try-catch on suspect parts to resolve the issue. Will be on a lookout for a more permanent solution in the future.
            return new unit_1.IntPretty(new unit_1.Int(0)).ready(false);
        }
    }
}
__decorate([
    mobx_1.computed
], ObservableQueryInflation.prototype, "inflation", null);
exports.ObservableQueryInflation = ObservableQueryInflation;
//# sourceMappingURL=inflation.js.map

/***/ }),

/***/ 1445:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryMintingInfation = void 0;
const chain_query_1 = __webpack_require__(59);
class ObservableQueryMintingInfation extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter) {
        super(kvStore, chainId, chainGetter, "/cosmos/mint/v1beta1/inflation");
    }
    canFetch() {
        return false;
    }
}
exports.ObservableQueryMintingInfation = ObservableQueryMintingInfation;
//# sourceMappingURL=minting.js.map

/***/ }),

/***/ 1446:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQuerySupplyTotal = exports.ObservableChainQuerySupplyTotal = void 0;
const chain_query_1 = __webpack_require__(59);
class ObservableChainQuerySupplyTotal extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter, denom) {
        super(kvStore, chainId, chainGetter, `/cosmos/bank/v1beta1/supply/${denom}`);
    }
}
exports.ObservableChainQuerySupplyTotal = ObservableChainQuerySupplyTotal;
class ObservableQuerySupplyTotal extends chain_query_1.ObservableChainQueryMap {
    constructor(kvStore, chainId, chainGetter) {
        super(kvStore, chainId, chainGetter, (denom) => {
            return new ObservableChainQuerySupplyTotal(this.kvStore, this.chainId, this.chainGetter, denom);
        });
        this.kvStore = kvStore;
        this.chainId = chainId;
        this.chainGetter = chainGetter;
    }
    getQueryDenom(denom) {
        return this.get(denom);
    }
    // Somewhat strange. Only used for umee.
    getQueryDenomByQueryString(denom) {
        return this.get(`by_denom?denom=${denom}`);
    }
    getQueryStakeDenom() {
        const chainInfo = this.chainGetter.getChain(this.chainId);
        return this.get(chainInfo.stakeCurrency.coinMinimalDenom);
    }
}
exports.ObservableQuerySupplyTotal = ObservableQuerySupplyTotal;
//# sourceMappingURL=supply.js.map

/***/ }),

/***/ 1447:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryIBCChannel = exports.ObservableChainQueryIBCChannel = void 0;
const chain_query_1 = __webpack_require__(59);
const mobx_1 = __webpack_require__(5);
class ObservableChainQueryIBCChannel extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter, portId, channelId) {
        super(kvStore, chainId, chainGetter, `/ibc/core/channel/v1beta1/channels/${channelId}/ports/${portId}`);
        this.portId = portId;
        this.channelId = channelId;
    }
    onStart() {
        super.onStart();
        return new Promise((resolve) => {
            this.disposer = mobx_1.autorun(() => {
                const chainInfo = this.chainGetter.getChain(this.chainId);
                if (chainInfo.features && chainInfo.features.includes("ibc-go")) {
                    this.setUrl(`/ibc/core/channel/v1/channels/${this.channelId}/ports/${this.portId}`);
                }
                resolve();
            });
        });
    }
    onStop() {
        if (this.disposer) {
            this.disposer();
            this.disposer = undefined;
        }
        super.onStop();
    }
}
exports.ObservableChainQueryIBCChannel = ObservableChainQueryIBCChannel;
class ObservableQueryIBCChannel extends chain_query_1.ObservableChainQueryMap {
    constructor(kvStore, chainId, chainGetter) {
        super(kvStore, chainId, chainGetter, (key) => {
            const params = JSON.parse(key);
            return new ObservableChainQueryIBCChannel(this.kvStore, this.chainId, this.chainGetter, params.portId, params.channelId);
        });
        this.kvStore = kvStore;
        this.chainId = chainId;
        this.chainGetter = chainGetter;
    }
    getTransferChannel(channelId) {
        return this.getChannel("transfer", channelId);
    }
    getChannel(portId, channelId) {
        // Use key as the JSON encoded Object.
        const key = JSON.stringify({
            portId,
            channelId,
        });
        return this.get(key);
    }
}
exports.ObservableQueryIBCChannel = ObservableQueryIBCChannel;
//# sourceMappingURL=channel.js.map

/***/ }),

/***/ 1448:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryIBCClientState = exports.ObservableChainQueryClientState = void 0;
const chain_query_1 = __webpack_require__(59);
const mobx_1 = __webpack_require__(5);
class ObservableChainQueryClientState extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter, portId, channelId) {
        super(kvStore, chainId, chainGetter, `/ibc/core/channel/v1beta1/channels/${channelId}/ports/${portId}/client_state`);
        this.portId = portId;
        this.channelId = channelId;
    }
    onStart() {
        super.onStart();
        return new Promise((resolve) => {
            this.disposer = mobx_1.autorun(() => {
                const chainInfo = this.chainGetter.getChain(this.chainId);
                if (chainInfo.features && chainInfo.features.includes("ibc-go")) {
                    this.setUrl(`/ibc/core/channel/v1/channels/${this.channelId}/ports/${this.portId}/client_state`);
                }
                resolve();
            });
        });
    }
    onStop() {
        if (this.disposer) {
            this.disposer();
            this.disposer = undefined;
        }
        super.onStop();
    }
    /**
     * clientChainId returns the chain id of the client state if the client state's type is known (currently, only tendermint is supported).
     */
    get clientChainId() {
        var _a, _b;
        if (!this.response) {
            return undefined;
        }
        return (_b = (_a = this.response.data.identified_client_state) === null || _a === void 0 ? void 0 : _a.client_state) === null || _b === void 0 ? void 0 : _b.chain_id;
    }
}
__decorate([
    mobx_1.computed
], ObservableChainQueryClientState.prototype, "clientChainId", null);
exports.ObservableChainQueryClientState = ObservableChainQueryClientState;
class ObservableQueryIBCClientState extends chain_query_1.ObservableChainQueryMap {
    constructor(kvStore, chainId, chainGetter) {
        super(kvStore, chainId, chainGetter, (key) => {
            const params = JSON.parse(key);
            return new ObservableChainQueryClientState(this.kvStore, this.chainId, this.chainGetter, params.portId, params.channelId);
        });
        this.kvStore = kvStore;
        this.chainId = chainId;
        this.chainGetter = chainGetter;
    }
    getClientStateOnTransferPort(channelId) {
        return this.getClientState("transfer", channelId);
    }
    getClientState(portId, channelId) {
        // Use key as the JSON encoded Object.
        const key = JSON.stringify({
            portId,
            channelId,
        });
        return this.get(key);
    }
}
exports.ObservableQueryIBCClientState = ObservableQueryIBCClientState;
//# sourceMappingURL=client-state.js.map

/***/ }),

/***/ 1449:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryDenomTrace = exports.ObservableChainQueryDenomTrace = void 0;
const chain_query_1 = __webpack_require__(59);
const mobx_1 = __webpack_require__(5);
class ObservableChainQueryDenomTrace extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter, hash) {
        super(kvStore, chainId, chainGetter, `/ibc/applications/transfer/v1beta1/denom_traces/${hash}`);
        this.hash = hash;
    }
    onStart() {
        super.onStart();
        return new Promise((resolve) => {
            this.disposer = mobx_1.autorun(() => {
                const chainInfo = this.chainGetter.getChain(this.chainId);
                if (chainInfo.features && chainInfo.features.includes("ibc-go")) {
                    this.setUrl(`/ibc/apps/transfer/v1/denom_traces/${this.hash}`);
                }
                resolve();
            });
        });
    }
    onStop() {
        if (this.disposer) {
            this.disposer();
            this.disposer = undefined;
        }
        super.onStop();
    }
    get paths() {
        if (!this.response) {
            return [];
        }
        const rawPaths = this.response.data.denom_trace.path.split("/");
        if (rawPaths.length % 2 !== 0) {
            console.log("Failed to parse paths", rawPaths);
            return [];
        }
        const rawPathChunks = [];
        for (let i = 0; i < rawPaths.length; i += 2) {
            rawPathChunks.push(rawPaths.slice(i, i + 2));
        }
        return rawPathChunks.map((chunk) => {
            return {
                portId: chunk[0],
                channelId: chunk[1],
            };
        });
    }
    get denom() {
        if (!this.response) {
            return undefined;
        }
        return this.response.data.denom_trace.base_denom;
    }
    get denomTrace() {
        if (!this.response || !this.denom) {
            return undefined;
        }
        return {
            denom: this.denom,
            paths: this.paths,
        };
    }
}
__decorate([
    mobx_1.computed
], ObservableChainQueryDenomTrace.prototype, "paths", null);
__decorate([
    mobx_1.computed
], ObservableChainQueryDenomTrace.prototype, "denomTrace", null);
exports.ObservableChainQueryDenomTrace = ObservableChainQueryDenomTrace;
class ObservableQueryDenomTrace extends chain_query_1.ObservableChainQueryMap {
    constructor(kvStore, chainId, chainGetter) {
        super(kvStore, chainId, chainGetter, (hash) => {
            return new ObservableChainQueryDenomTrace(this.kvStore, this.chainId, this.chainGetter, hash);
        });
        this.kvStore = kvStore;
        this.chainId = chainId;
        this.chainGetter = chainGetter;
    }
    getDenomTrace(hash) {
        return this.get(hash);
    }
}
exports.ObservableQueryDenomTrace = ObservableQueryDenomTrace;
//# sourceMappingURL=denom-trace.js.map

/***/ }),

/***/ 1450:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryCosmosBalanceRegistry = exports.ObservableQueryCosmosBalances = exports.ObservableQueryBalanceNative = void 0;
const common_1 = __webpack_require__(27);
const mobx_1 = __webpack_require__(5);
const unit_1 = __webpack_require__(26);
const common_2 = __webpack_require__(119);
const balances_1 = __webpack_require__(509);
const chain_query_1 = __webpack_require__(59);
const react_query_1 = __webpack_require__(236);
class ObservableQueryBalanceNative extends balances_1.ObservableQueryBalanceInner {
    constructor(kvStore, chainId, chainGetter, denomHelper, nativeBalances) {
        super(kvStore, chainId, chainGetter, 
        // No need to set the url
        "", denomHelper);
        this.nativeBalances = nativeBalances;
        mobx_1.makeObservable(this);
    }
    canFetch() {
        return false;
    }
    get isFetching() {
        return this.nativeBalances.isFetching;
    }
    get error() {
        return this.nativeBalances.error;
    }
    get response() {
        return this.nativeBalances.response;
    }
    *fetch() {
        yield this.nativeBalances.fetch();
    }
    get balance() {
        const currency = this.currency;
        if (!this.nativeBalances.response) {
            return new unit_1.CoinPretty(currency, new unit_1.Int(0)).ready(false);
        }
        return common_2.StoreUtils.getBalanceFromCurrency(currency, this.nativeBalances.response.data.balances);
    }
}
__decorate([
    mobx_1.override
], ObservableQueryBalanceNative.prototype, "fetch", null);
__decorate([
    mobx_1.computed
], ObservableQueryBalanceNative.prototype, "balance", null);
exports.ObservableQueryBalanceNative = ObservableQueryBalanceNative;
class ObservableQueryCosmosBalances extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter, bech32Address, misesStore) {
        super(kvStore, chainId, chainGetter, `/cosmos/bank/v1beta1/balances/${bech32Address}?pagination.limit=1000`);
        this.duplicatedFetchCheck = true;
        this.QueryClient = new react_query_1.QueryClient();
        this.bech32Address = bech32Address;
        this.misesStore = misesStore;
        mobx_1.makeObservable(this);
    }
    canFetch() {
        // If bech32 address is empty, it will always fail, so don't need to fetch it.
        return this.bech32Address.length > 0;
    }
    *fetch() {
        var _a;
        this._isFetching = true;
        (_a = this.QueryClient) === null || _a === void 0 ? void 0 : _a.fetchQuery("getMisesBalance", () => this.getMisesBalance(), this.fetchConfig).then((result) => {
            this._isFetching = false;
            this.setResponse(result);
        }).catch((error) => {
            this._isFetching = false;
            this.setError(error);
        });
    }
    getMisesBalance() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const balance = yield ((_a = this.misesStore) === null || _a === void 0 ? void 0 : _a.getBalanceUMIS());
            const result = {
                status: 200,
                data: {
                    balances: [balance],
                },
                staled: true,
                timestamp: new Date().getTime(),
            };
            return result;
        });
    }
    setResponse(response) {
        super.setResponse(response);
        const chainInfo = this.chainGetter.getChain(this.chainId);
        // Attempt to register denom in the returned response.
        // If it's already registered anyway, it's okay because the method below doesn't do anything.
        // Better to set it all at once as an array to reduce computation.
        const denoms = response.data.balances.map((coin) => coin.denom);
        chainInfo.addUnknownCurrencies(...denoms);
    }
}
__decorate([
    mobx_1.override
], ObservableQueryCosmosBalances.prototype, "fetch", null);
exports.ObservableQueryCosmosBalances = ObservableQueryCosmosBalances;
class ObservableQueryCosmosBalanceRegistry {
    constructor(kvStore, misesStore) {
        this.kvStore = kvStore;
        this.misesStore = misesStore;
        this.nativeBalances = new Map();
    }
    getBalanceInner(chainId, chainGetter, bech32Address, minimalDenom) {
        const denomHelper = new common_1.DenomHelper(minimalDenom);
        if (denomHelper.type !== "native") {
            return;
        }
        const key = `${chainId}/${bech32Address}`;
        if (!this.nativeBalances.has(key)) {
            this.nativeBalances.set(key, new ObservableQueryCosmosBalances(this.kvStore, chainId, chainGetter, bech32Address, this.misesStore));
        }
        return new ObservableQueryBalanceNative(this.kvStore, chainId, chainGetter, denomHelper, 
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.nativeBalances.get(key));
    }
}
exports.ObservableQueryCosmosBalanceRegistry = ObservableQueryCosmosBalanceRegistry;
//# sourceMappingURL=balances.js.map

/***/ }),

/***/ 1451:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQuerySpendableBalances = exports.ObservableChainQuerySpendableBalances = void 0;
const chain_query_1 = __webpack_require__(59);
const unit_1 = __webpack_require__(26);
const mobx_1 = __webpack_require__(5);
class ObservableChainQuerySpendableBalances extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter, address) {
        super(kvStore, chainId, chainGetter, `/cosmos/bank/v1beta1/spendable_balances/${address}`);
    }
    get balances() {
        if (!this.response) {
            return [];
        }
        const res = [];
        const chainInfo = this.chainGetter.getChain(this.chainId);
        for (const bal of this.response.data.balances) {
            const currency = chainInfo.findCurrency(bal.denom);
            if (currency) {
                res.push(new unit_1.CoinPretty(currency, bal.amount));
            }
        }
        return res;
    }
}
__decorate([
    mobx_1.computed
], ObservableChainQuerySpendableBalances.prototype, "balances", null);
exports.ObservableChainQuerySpendableBalances = ObservableChainQuerySpendableBalances;
class ObservableQuerySpendableBalances extends chain_query_1.ObservableChainQueryMap {
    constructor(kvStore, chainId, chainGetter) {
        super(kvStore, chainId, chainGetter, (denom) => {
            return new ObservableChainQuerySpendableBalances(this.kvStore, this.chainId, this.chainGetter, denom);
        });
        this.kvStore = kvStore;
        this.chainId = chainId;
        this.chainGetter = chainGetter;
    }
    getQueryBech32Address(bech32Address) {
        return this.get(bech32Address);
    }
}
exports.ObservableQuerySpendableBalances = ObservableQuerySpendableBalances;
//# sourceMappingURL=spendable.js.map

/***/ }),

/***/ 1452:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 1453:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 1454:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 1455:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 1456:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CosmosQueriesImpl = exports.CosmosQueries = void 0;
const account_1 = __webpack_require__(1241);
const supply_1 = __webpack_require__(1240);
const staking_1 = __webpack_require__(1239);
const governance_1 = __webpack_require__(1235);
const ibc_1 = __webpack_require__(1242);
const sifchain_1 = __webpack_require__(1457);
const balance_1 = __webpack_require__(1243);
const iris_minting_1 = __webpack_require__(1458);
const osmosis_1 = __webpack_require__(1459);
const distribution_1 = __webpack_require__(1463);
const status_1 = __webpack_require__(1465);
const juno_1 = __webpack_require__(1467);
exports.CosmosQueries = {
    use(misesStore) {
        return (queriesSetBase, kvStore, chainId, chainGetter) => {
            return {
                cosmos: new CosmosQueriesImpl(queriesSetBase, kvStore, chainId, chainGetter, misesStore),
            };
        };
    },
};
class CosmosQueriesImpl {
    constructor(base, kvStore, chainId, chainGetter, misesStore) {
        this.queryRPCStatus = new status_1.ObservableQueryRPCStatus(kvStore, chainId, chainGetter);
        this.querySifchainAPY = new sifchain_1.ObservableQuerySifchainLiquidityAPY(kvStore, chainId);
        base.queryBalances.addBalanceRegistry(new balance_1.ObservableQueryCosmosBalanceRegistry(kvStore, misesStore));
        this.queryAccount = new account_1.ObservableQueryAccount(kvStore, chainId, chainGetter);
        this.querySpendableBalances = new balance_1.ObservableQuerySpendableBalances(kvStore, chainId, chainGetter);
        this.queryMint = new supply_1.ObservableQueryMintingInfation(kvStore, chainId, chainGetter);
        this.queryPool = new staking_1.ObservableQueryStakingPool(kvStore, chainId, chainGetter);
        this.queryStakingParams = new staking_1.ObservableQueryStakingParams(kvStore, chainId, chainGetter);
        this.querySupplyTotal = new supply_1.ObservableQuerySupplyTotal(kvStore, chainId, chainGetter);
        const osmosisMintParams = new osmosis_1.ObservableQueryOsmosisMintParmas(kvStore, chainId, chainGetter);
        this.queryDistributionParams = new distribution_1.ObservableQueryDistributionParams(kvStore, chainId, chainGetter);
        this.queryInflation = new supply_1.ObservableQueryInflation(chainId, chainGetter, this.queryMint, this.queryPool, this.querySupplyTotal, new iris_minting_1.ObservableQueryIrisMintingInfation(kvStore, chainId, chainGetter), this.querySifchainAPY, new osmosis_1.ObservableQueryOsmosisEpochs(kvStore, chainId, chainGetter), new osmosis_1.ObservableQueryOsmosisEpochProvisions(kvStore, chainId, chainGetter, osmosisMintParams), osmosisMintParams, new juno_1.ObservableQueryJunoAnnualProvisions(kvStore, chainId, chainGetter), this.queryDistributionParams);
        this.queryRewards = new staking_1.ObservableQueryRewards(kvStore, chainId, chainGetter, misesStore);
        this.queryDelegations = new staking_1.ObservableQueryDelegations(kvStore, chainId, chainGetter, misesStore);
        this.queryUnbondingDelegations = new staking_1.ObservableQueryUnbondingDelegations(kvStore, chainId, chainGetter, misesStore);
        this.queryValidators = new staking_1.ObservableQueryValidators(kvStore, chainId, chainGetter);
        this.queryGovernance = new governance_1.ObservableQueryGovernance(kvStore, chainId, chainGetter, this.queryPool);
        this.queryProposalVote = new governance_1.ObservableQueryProposalVote(kvStore, chainId, chainGetter);
        this.queryIBCClientState = new ibc_1.ObservableQueryIBCClientState(kvStore, chainId, chainGetter);
        this.queryIBCChannel = new ibc_1.ObservableQueryIBCChannel(kvStore, chainId, chainGetter);
        this.queryIBCDenomTrace = new ibc_1.ObservableQueryDenomTrace(kvStore, chainId, chainGetter);
    }
}
exports.CosmosQueriesImpl = CosmosQueriesImpl;
//# sourceMappingURL=queries.js.map

/***/ }),

/***/ 1457:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQuerySifchainLiquidityAPY = void 0;
const common_1 = __webpack_require__(119);
const axios_1 = __importDefault(__webpack_require__(60));
const mobx_1 = __webpack_require__(5);
class ObservableQuerySifchainLiquidityAPY extends common_1.ObservableQuery {
    constructor(kvStore, chainId) {
        const instance = axios_1.default.create({
            baseURL: "https://data.sifchain.finance/",
        });
        super(kvStore, instance, `beta/validator/stakingRewards`);
        this.chainId = chainId;
        mobx_1.makeObservable(this);
    }
    canFetch() {
        return this.chainId.startsWith("sifchain");
    }
    get liquidityAPY() {
        if (this.response) {
            return Number(this.response.data.rate) * 100;
        }
        return 0;
    }
}
__decorate([
    mobx_1.computed
], ObservableQuerySifchainLiquidityAPY.prototype, "liquidityAPY", null);
exports.ObservableQuerySifchainLiquidityAPY = ObservableQuerySifchainLiquidityAPY;
//# sourceMappingURL=sifchain.js.map

/***/ }),

/***/ 1458:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryIrisMintingInfation = void 0;
const chain_query_1 = __webpack_require__(59);
class ObservableQueryIrisMintingInfation extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter) {
        super(kvStore, chainId, chainGetter, "/mint/params");
    }
}
exports.ObservableQueryIrisMintingInfation = ObservableQueryIrisMintingInfation;
//# sourceMappingURL=iris-minting.js.map

/***/ }),

/***/ 1459:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(1460), exports);
__exportStar(__webpack_require__(1461), exports);
__exportStar(__webpack_require__(1462), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1460:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryOsmosisEpochs = exports.ObservableQueryOsmosisEpochsInner = void 0;
const chain_query_1 = __webpack_require__(59);
const mobx_1 = __webpack_require__(5);
class ObservableQueryOsmosisEpochsInner {
    constructor(identifier, queryEpochs) {
        this.identifier = identifier;
        this.queryEpochs = queryEpochs;
    }
    get epoch() {
        var _a;
        return (_a = this.queryEpochs.response) === null || _a === void 0 ? void 0 : _a.data.epochs.find((epoch) => epoch.identifier === this.identifier);
    }
    get duration() {
        if (!this.epoch) {
            return 0;
        }
        // Actually, the date type of golang protobuf is returned by the unit of seconds.
        return parseInt(this.epoch.duration.replace("s", ""));
    }
    get startTime() {
        if (!this.epoch) {
            return new Date(0);
        }
        return new Date(this.epoch.current_epoch_start_time);
    }
    get endTime() {
        const startTime = this.startTime;
        if (!this.duration) {
            return startTime;
        }
        return new Date(startTime.getTime() + this.duration * 1000);
    }
}
__decorate([
    mobx_1.computed
], ObservableQueryOsmosisEpochsInner.prototype, "epoch", null);
__decorate([
    mobx_1.computed
], ObservableQueryOsmosisEpochsInner.prototype, "duration", null);
__decorate([
    mobx_1.computed
], ObservableQueryOsmosisEpochsInner.prototype, "startTime", null);
__decorate([
    mobx_1.computed
], ObservableQueryOsmosisEpochsInner.prototype, "endTime", null);
exports.ObservableQueryOsmosisEpochsInner = ObservableQueryOsmosisEpochsInner;
class ObservableQueryOsmosisEpochs extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter) {
        super(kvStore, chainId, chainGetter, "/osmosis/epochs/v1beta1/epochs");
        this.map = new Map();
    }
    getEpoch(identifier) {
        if (!this.map.has(identifier)) {
            const inner = new ObservableQueryOsmosisEpochsInner(identifier, this);
            this.map.set(identifier, inner);
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.map.get(identifier);
    }
}
__decorate([
    mobx_1.observable.shallow
], ObservableQueryOsmosisEpochs.prototype, "map", void 0);
exports.ObservableQueryOsmosisEpochs = ObservableQueryOsmosisEpochs;
//# sourceMappingURL=epochs.js.map

/***/ }),

/***/ 1461:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryOsmosisEpochProvisions = void 0;
const chain_query_1 = __webpack_require__(59);
const mobx_1 = __webpack_require__(5);
const unit_1 = __webpack_require__(26);
class ObservableQueryOsmosisEpochProvisions extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter, queryMintParmas) {
        super(kvStore, chainId, chainGetter, `/osmosis/mint/v1beta1/epoch_provisions`);
        this.queryMintParmas = queryMintParmas;
        mobx_1.makeObservable(this);
    }
    get epochProvisions() {
        if (!this.response || !this.queryMintParmas.mintDenom) {
            return;
        }
        const chainInfo = this.chainGetter.getChain(this.chainId);
        const currency = chainInfo.currencies.find((cur) => cur.coinMinimalDenom === this.queryMintParmas.mintDenom);
        if (!currency) {
            throw new Error("Unknown currency");
        }
        let provision = this.response.data.epoch_provisions;
        if (provision.includes(".")) {
            provision = provision.slice(0, provision.indexOf("."));
        }
        return new unit_1.CoinPretty(currency, new unit_1.Int(provision));
    }
}
__decorate([
    mobx_1.computed
], ObservableQueryOsmosisEpochProvisions.prototype, "epochProvisions", null);
exports.ObservableQueryOsmosisEpochProvisions = ObservableQueryOsmosisEpochProvisions;
//# sourceMappingURL=epoch-provisions.js.map

/***/ }),

/***/ 1462:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryOsmosisMintParmas = void 0;
const chain_query_1 = __webpack_require__(59);
const mobx_1 = __webpack_require__(5);
const unit_1 = __webpack_require__(26);
class ObservableQueryOsmosisMintParmas extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter) {
        super(kvStore, chainId, chainGetter, `/osmosis/mint/v1beta1/params`);
        mobx_1.makeObservable(this);
    }
    get mintDenom() {
        var _a;
        return (_a = this.response) === null || _a === void 0 ? void 0 : _a.data.params.mint_denom;
    }
    get epochIdentifier() {
        var _a;
        return (_a = this.response) === null || _a === void 0 ? void 0 : _a.data.params.epoch_identifier;
    }
    get distributionProportions() {
        if (!this.response) {
            return {
                staking: new unit_1.Dec(0),
                poolIncentives: new unit_1.Dec(0),
                developerRewards: new unit_1.Dec(0),
            };
        }
        return {
            staking: new unit_1.Dec(this.response.data.params.distribution_proportions.staking),
            poolIncentives: new unit_1.Dec(this.response.data.params.distribution_proportions.pool_incentives),
            developerRewards: new unit_1.Dec(this.response.data.params.distribution_proportions.developer_rewards),
        };
    }
}
__decorate([
    mobx_1.computed
], ObservableQueryOsmosisMintParmas.prototype, "distributionProportions", null);
exports.ObservableQueryOsmosisMintParmas = ObservableQueryOsmosisMintParmas;
//# sourceMappingURL=params.js.map

/***/ }),

/***/ 1463:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(1464), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1464:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryDistributionParams = void 0;
const chain_query_1 = __webpack_require__(59);
const mobx_1 = __webpack_require__(5);
const unit_1 = __webpack_require__(26);
class ObservableQueryDistributionParams extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter) {
        super(kvStore, chainId, chainGetter, "/cosmos/distribution/v1beta1/params");
        mobx_1.makeObservable(this);
    }
    get communityTax() {
        if (!this.response) {
            return new unit_1.RatePretty(0);
        }
        return new unit_1.RatePretty(this.response.data.params.community_tax);
    }
}
__decorate([
    mobx_1.computed
], ObservableQueryDistributionParams.prototype, "communityTax", null);
exports.ObservableQueryDistributionParams = ObservableQueryDistributionParams;
//# sourceMappingURL=params.js.map

/***/ }),

/***/ 1465:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryRPCStatus = void 0;
const chain_rpc_query_1 = __webpack_require__(1466);
const unit_1 = __webpack_require__(26);
class ObservableQueryRPCStatus extends chain_rpc_query_1.ObservableChainQueryRPC {
    constructor(kvStore, chainId, chainGetter) {
        super(kvStore, chainId, chainGetter, "/status");
    }
    get network() {
        if (!this.response) {
            return undefined;
        }
        return this.response.data.result.node_info.network;
    }
    get latestBlockHeight() {
        if (!this.response) {
            return undefined;
        }
        return new unit_1.Int(this.response.data.result.sync_info.latest_block_height);
    }
}
exports.ObservableQueryRPCStatus = ObservableQueryRPCStatus;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1466:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableChainQueryRPCMap = exports.ObservableChainQueryRPC = void 0;
const common_1 = __webpack_require__(119);
const axios_1 = __importDefault(__webpack_require__(60));
const mobx_1 = __webpack_require__(5);
const common_2 = __webpack_require__(119);
class ObservableChainQueryRPC extends common_1.ObservableQuery {
    constructor(kvStore, chainId, chainGetter, url) {
        const chainInfo = chainGetter.getChain(chainId);
        const instance = axios_1.default.create(Object.assign({
            baseURL: chainInfo.rpc,
        }, chainInfo.rpcConfig));
        super(kvStore, instance, url);
        this._chainId = chainId;
        this.chainGetter = chainGetter;
    }
    get instance() {
        const chainInfo = this.chainGetter.getChain(this.chainId);
        return axios_1.default.create(Object.assign({
            baseURL: chainInfo.rpc,
        }, chainInfo.rpcConfig));
    }
    get chainId() {
        return this._chainId;
    }
}
__decorate([
    mobx_1.override
], ObservableChainQueryRPC.prototype, "instance", null);
exports.ObservableChainQueryRPC = ObservableChainQueryRPC;
class ObservableChainQueryRPCMap extends common_2.HasMapStore {
    constructor(kvStore, chainId, chainGetter, creater) {
        super(creater);
        this.kvStore = kvStore;
        this.chainId = chainId;
        this.chainGetter = chainGetter;
    }
}
exports.ObservableChainQueryRPCMap = ObservableChainQueryRPCMap;
//# sourceMappingURL=chain-rpc-query.js.map

/***/ }),

/***/ 1467:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(1468), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1468:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryJunoAnnualProvisions = void 0;
const chain_query_1 = __webpack_require__(59);
const mobx_1 = __webpack_require__(5);
const unit_1 = __webpack_require__(26);
class ObservableQueryJunoAnnualProvisions extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter) {
        super(kvStore, chainId, chainGetter, "/cosmos/mint/v1beta1/annual_provisions");
        mobx_1.makeObservable(this);
    }
    get annualProvisions() {
        if (!this.response) {
            return;
        }
        const chainInfo = this.chainGetter.getChain(this.chainId);
        return new unit_1.CoinPretty(chainInfo.stakeCurrency, new unit_1.Dec(this.response.data.annual_provisions));
    }
    get annualProvisionsRaw() {
        if (!this.response) {
            return;
        }
        return new unit_1.Dec(this.response.data.annual_provisions);
    }
}
__decorate([
    mobx_1.computed
], ObservableQueryJunoAnnualProvisions.prototype, "annualProvisions", null);
__decorate([
    mobx_1.computed
], ObservableQueryJunoAnnualProvisions.prototype, "annualProvisionsRaw", null);
exports.ObservableQueryJunoAnnualProvisions = ObservableQueryJunoAnnualProvisions;
//# sourceMappingURL=annual-provisions.js.map

/***/ }),

/***/ 1469:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CosmWasm = void 0;
__exportStar(__webpack_require__(1244), exports);
exports.CosmWasm = __importStar(__webpack_require__(1470));
__exportStar(__webpack_require__(1471), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1470:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 1471:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CosmwasmQueriesImpl = exports.CosmwasmQueries = void 0;
const cw20_contract_info_1 = __webpack_require__(1472);
const cw20_balance_1 = __webpack_require__(1244);
exports.CosmwasmQueries = {
    use() {
        return (queriesSetBase, kvStore, chainId, chainGetter) => {
            return {
                cosmwasm: new CosmwasmQueriesImpl(queriesSetBase, kvStore, chainId, chainGetter),
            };
        };
    },
};
class CosmwasmQueriesImpl {
    constructor(base, kvStore, chainId, chainGetter) {
        base.queryBalances.addBalanceRegistry(new cw20_balance_1.ObservableQueryCw20BalanceRegistry(kvStore));
        this.querycw20ContractInfo = new cw20_contract_info_1.ObservableQueryCw20ContractInfo(kvStore, chainId, chainGetter);
    }
}
exports.CosmwasmQueriesImpl = CosmwasmQueriesImpl;
//# sourceMappingURL=queries.js.map

/***/ }),

/***/ 1472:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryCw20ContractInfo = exports.ObservableQueryCw20ContactInfoInner = void 0;
const chain_query_1 = __webpack_require__(59);
const mobx_1 = __webpack_require__(5);
const contract_query_1 = __webpack_require__(1245);
class ObservableQueryCw20ContactInfoInner extends contract_query_1.ObservableCosmwasmContractChainQuery {
    constructor(kvStore, chainId, chainGetter, contractAddress) {
        super(kvStore, chainId, chainGetter, contractAddress, { token_info: {} });
        this.contractAddress = contractAddress;
    }
    get tokenInfo() {
        if (!this.response || !this.response.data) {
            return undefined;
        }
        return this.response.data;
    }
}
__decorate([
    mobx_1.computed
], ObservableQueryCw20ContactInfoInner.prototype, "tokenInfo", null);
exports.ObservableQueryCw20ContactInfoInner = ObservableQueryCw20ContactInfoInner;
class ObservableQueryCw20ContractInfo extends chain_query_1.ObservableChainQueryMap {
    constructor(kvStore, chainId, chainGetter) {
        super(kvStore, chainId, chainGetter, (contractAddress) => {
            return new ObservableQueryCw20ContactInfoInner(this.kvStore, this.chainId, this.chainGetter, contractAddress);
        });
        this.kvStore = kvStore;
        this.chainId = chainId;
        this.chainGetter = chainGetter;
    }
    getQueryContract(contractAddress) {
        return this.get(contractAddress);
    }
}
exports.ObservableQueryCw20ContractInfo = ObservableQueryCw20ContractInfo;
//# sourceMappingURL=cw20-contract-info.js.map

/***/ }),

/***/ 1473:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretWasm = void 0;
__exportStar(__webpack_require__(1246), exports);
__exportStar(__webpack_require__(1247), exports);
__exportStar(__webpack_require__(1249), exports);
exports.SecretWasm = __importStar(__webpack_require__(1474));
__exportStar(__webpack_require__(1475), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1474:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 1475:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretQueriesImpl = exports.SecretQueries = void 0;
const contract_hash_1 = __webpack_require__(1246);
const secret20_contract_info_1 = __webpack_require__(1476);
const secret20_balance_1 = __webpack_require__(1247);
exports.SecretQueries = {
    use(options) {
        return (queriesSetBase, kvStore, chainId, chainGetter) => {
            return {
                secret: new SecretQueriesImpl(queriesSetBase, kvStore, chainId, chainGetter, options.apiGetter),
            };
        };
    },
};
class SecretQueriesImpl {
    constructor(base, kvStore, chainId, chainGetter, apiGetter) {
        this.querySecretContractCodeHash = new contract_hash_1.ObservableQuerySecretContractCodeHash(kvStore, chainId, chainGetter);
        base.queryBalances.addBalanceRegistry(new secret20_balance_1.ObservableQuerySecret20BalanceRegistry(kvStore, apiGetter, this.querySecretContractCodeHash));
        this.querySecret20ContractInfo = new secret20_contract_info_1.ObservableQuerySecret20ContractInfo(kvStore, chainId, chainGetter, apiGetter, this.querySecretContractCodeHash);
    }
}
exports.SecretQueriesImpl = SecretQueriesImpl;
//# sourceMappingURL=queries.js.map

/***/ }),

/***/ 1476:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQuerySecret20ContractInfo = exports.ObservableQuerySecret20ContactInfoInner = void 0;
const chain_query_1 = __webpack_require__(59);
const mobx_1 = __webpack_require__(5);
const contract_query_1 = __webpack_require__(1248);
class ObservableQuerySecret20ContactInfoInner extends contract_query_1.ObservableSecretContractChainQuery {
    constructor(kvStore, chainId, chainGetter, apiGetter, contractAddress, querySecretContractCodeHash) {
        // Don't need to set the url initially because it can't request without encyption.
        super(kvStore, chainId, chainGetter, apiGetter, contractAddress, { token_info: {} }, querySecretContractCodeHash);
        this.apiGetter = apiGetter;
        this.contractAddress = contractAddress;
        this.querySecretContractCodeHash = querySecretContractCodeHash;
        mobx_1.makeObservable(this);
    }
    get error() {
        return (super.error ||
            this.querySecretContractCodeHash.getQueryContract(this.contractAddress)
                .error);
    }
    get tokenInfo() {
        if (!this.response) {
            return undefined;
        }
        return this.response.data.token_info;
    }
}
__decorate([
    mobx_1.computed
], ObservableQuerySecret20ContactInfoInner.prototype, "tokenInfo", null);
exports.ObservableQuerySecret20ContactInfoInner = ObservableQuerySecret20ContactInfoInner;
class ObservableQuerySecret20ContractInfo extends chain_query_1.ObservableChainQueryMap {
    constructor(kvStore, chainId, chainGetter, apiGetter, querySecretContractCodeHash) {
        super(kvStore, chainId, chainGetter, (contractAddress) => {
            return new ObservableQuerySecret20ContactInfoInner(this.kvStore, this.chainId, this.chainGetter, this.apiGetter, contractAddress, querySecretContractCodeHash);
        });
        this.kvStore = kvStore;
        this.chainId = chainId;
        this.chainGetter = chainGetter;
        this.apiGetter = apiGetter;
        this.querySecretContractCodeHash = querySecretContractCodeHash;
    }
    getQueryContract(contractAddress) {
        return this.get(contractAddress);
    }
}
exports.ObservableQuerySecret20ContractInfo = ObservableQuerySecret20ContractInfo;
//# sourceMappingURL=secret20-contract-info.js.map

/***/ }),

/***/ 1477:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxFeesBaseDenom = exports.TxFeesSpotPriceByDenom = exports.TxFeesFeeTokens = void 0;
__exportStar(__webpack_require__(1250), exports);
__exportStar(__webpack_require__(1251), exports);
__exportStar(__webpack_require__(1252), exports);
exports.TxFeesFeeTokens = __importStar(__webpack_require__(1478));
exports.TxFeesSpotPriceByDenom = __importStar(__webpack_require__(1479));
exports.TxFeesBaseDenom = __importStar(__webpack_require__(1480));
__exportStar(__webpack_require__(1481), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1478:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 1479:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 1480:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 1481:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.OsmosisQueriesImpl = exports.OsmosisQueries = void 0;
const fee_tokens_1 = __webpack_require__(1250);
const spot_price_by_denom_1 = __webpack_require__(1251);
const base_denom_1 = __webpack_require__(1252);
exports.OsmosisQueries = {
    use() {
        return (queriesSetBase, kvStore, chainId, chainGetter) => {
            return {
                osmosis: new OsmosisQueriesImpl(queriesSetBase, kvStore, chainId, chainGetter),
            };
        };
    },
};
class OsmosisQueriesImpl {
    constructor(_, kvStore, chainId, chainGetter) {
        this.queryTxFeesFeeTokens = new fee_tokens_1.ObservableQueryTxFeesFeeTokens(kvStore, chainId, chainGetter);
        this.queryTxFeesSpotPriceByDenom = new spot_price_by_denom_1.ObservableQueryTxFeesSpotPriceByDenom(kvStore, chainId, chainGetter);
        this.queryTxFeesBaseDenom = new base_denom_1.ObservableQueryTxFeesBaseDenom(kvStore, chainId, chainGetter);
    }
}
exports.OsmosisQueriesImpl = OsmosisQueriesImpl;
//# sourceMappingURL=queries.js.map

/***/ }),

/***/ 1482:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainStore = exports.ChainInfoInner = void 0;
const mobx_1 = __webpack_require__(5);
const cosmos_1 = __webpack_require__(16);
const mobx_utils_1 = __webpack_require__(201);
class ChainInfoInner {
    constructor(chainInfo) {
        this.unknownDenoms = [];
        this.registeredCurrencies = [];
        /**
         * 위의 unknownDenoms에 값이 들어오면 밑의 배열의 함수를 순차적으로 실행한다.
         * 만약 Currency 반환하면 그 registrar이 그 denom을 처리했다고 판단하고 순회를 멈춘다.
         * 또한 AppCurrency가 아니라 [AppCurrency, boolean]의 튜플을 반활할 수 있는데
         * 튜플을 반활할 경우 뒤의 boolean이 true일 때우(committed)까지 계속 observe한다.
         * IBC 토큰을 처리하는 경우처럼 쿼리가 다 되기 전에 raw한 currency를 반환할 필요가 있는 경우처럼
         * 등록된 currency가 나중에 replace될 수 있는 경우에 사용할 수 있다.
         */
        this.currencyRegistrars = [];
        this._chainInfo = chainInfo;
        mobx_1.makeObservable(this);
        mobx_utils_1.keepAlive(this, "currencyMap");
    }
    getCurrencyFromRegistrars(coinMinimalDenom) {
        for (let i = 0; i < this.currencyRegistrars.length; i++) {
            const registrar = this.currencyRegistrars[i];
            const currency = registrar(coinMinimalDenom);
            if (currency) {
                // AppCurrency일 경우
                if ("coinMinimalDenom" in currency) {
                    return [currency, true];
                }
                return currency;
            }
        }
        return undefined;
    }
    /*
     * 해당되는 denom의 currency를 모를 때 이 메소드를 사용해서 등록을 요청할 수 있다.
     * 이미 등록되어 있거나 등록을 시도 중이면 아무 행동도 하지 않는.
     * 예를들어 네이티브 balance 쿼리에서 모르는 denom이 나오거나
     * IBC denom의 등록을 요청할 때 쓸 수 있다.
     */
    addUnknownCurrencies(...coinMinimalDenoms) {
        for (const coinMinimalDenom of coinMinimalDenoms) {
            if (this.unknownDenoms.find((denom) => denom === coinMinimalDenom)) {
                continue;
            }
            if (this.currencyMap.has(coinMinimalDenom)) {
                continue;
            }
            this.unknownDenoms.push(coinMinimalDenom);
            const disposer = mobx_1.autorun(() => {
                const registered = this.getCurrencyFromRegistrars(coinMinimalDenom);
                if (registered) {
                    const [currency, committed] = registered;
                    mobx_1.runInAction(() => {
                        if (currency) {
                            const index = this.unknownDenoms.findIndex((denom) => denom === coinMinimalDenom);
                            if (index >= 0) {
                                this.unknownDenoms.splice(index, 1);
                            }
                            this.addOrReplaceCurrency(currency);
                        }
                        if (committed) {
                            disposer();
                        }
                    });
                }
                else {
                    disposer();
                }
            });
        }
    }
    registerCurrencyRegistrar(registrar) {
        this.currencyRegistrars.push(registrar);
    }
    setChainInfo(chainInfo) {
        this._chainInfo = chainInfo;
    }
    get raw() {
        return this._chainInfo;
    }
    get chainId() {
        return this._chainInfo.chainId;
    }
    get currencies() {
        return this._chainInfo.currencies.concat(this.registeredCurrencies);
    }
    get currencyMap() {
        const result = new Map();
        for (const currency of this.currencies) {
            result.set(currency.coinMinimalDenom, currency);
        }
        return result;
    }
    addCurrencies(...currencies) {
        const currencyMap = this.currencyMap;
        for (const currency of currencies) {
            if (!currencyMap.has(currency.coinMinimalDenom)) {
                this.registeredCurrencies.push(currency);
            }
        }
    }
    removeCurrencies(...coinMinimalDenoms) {
        const map = new Map();
        for (const coinMinimalDenom of coinMinimalDenoms) {
            map.set(coinMinimalDenom, true);
        }
        this.registeredCurrencies = this.registeredCurrencies.filter((currency) => !map.get(currency.coinMinimalDenom));
    }
    /**
     * Currency를 반환한다.
     * 만약 해당 Currency가 없다면 unknown currency에 추가한다.
     * @param coinMinimalDenom
     */
    findCurrency(coinMinimalDenom) {
        if (this.currencyMap.has(coinMinimalDenom)) {
            return this.currencyMap.get(coinMinimalDenom);
        }
        this.addUnknownCurrencies(coinMinimalDenom);
        // Unknown denom can be registered synchronously in some cases.
        // For this case, re-try to get currency.
        if (this.currencyMap.has(coinMinimalDenom)) {
            return this.currencyMap.get(coinMinimalDenom);
        }
    }
    /**
     * findCurrency와 비슷하지만 해당하는 currency가 존재하지 않을 경우 raw currency를 반환한다.
     * @param coinMinimalDenom
     */
    forceFindCurrency(coinMinimalDenom) {
        const currency = this.findCurrency(coinMinimalDenom);
        if (!currency) {
            return {
                coinMinimalDenom,
                coinDenom: coinMinimalDenom,
                coinDecimals: 0,
            };
        }
        return currency;
    }
    addOrReplaceCurrency(currency) {
        if (this.currencyMap.has(currency.coinMinimalDenom)) {
            const index = this.registeredCurrencies.findIndex((cur) => cur.coinMinimalDenom === currency.coinMinimalDenom);
            if (index >= 0) {
                this.registeredCurrencies.splice(index, 1, currency);
            }
        }
        else {
            this.registeredCurrencies.push(currency);
        }
    }
    get stakeCurrency() {
        return this.raw.stakeCurrency;
    }
    get alternativeBIP44s() {
        return this.raw.alternativeBIP44s;
    }
    get bech32Config() {
        return this.raw.bech32Config;
    }
    get beta() {
        return this.raw.beta;
    }
    get bip44() {
        return this.raw.bip44;
    }
    get chainName() {
        return this.raw.chainName;
    }
    get coinType() {
        return this.raw.coinType;
    }
    get features() {
        return this.raw.features;
    }
    get feeCurrencies() {
        return this.raw.feeCurrencies;
    }
    get rest() {
        return this.raw.rest;
    }
    get restConfig() {
        return this.raw.restConfig;
    }
    get rpc() {
        return this.raw.rpc;
    }
    get rpcConfig() {
        return this.raw.rpcConfig;
    }
    get walletUrl() {
        return this.raw.walletUrl;
    }
    get walletUrlForStaking() {
        return this.raw.walletUrlForStaking;
    }
}
__decorate([
    mobx_1.observable.ref
], ChainInfoInner.prototype, "_chainInfo", void 0);
__decorate([
    mobx_1.observable.shallow
], ChainInfoInner.prototype, "unknownDenoms", void 0);
__decorate([
    mobx_1.observable.shallow
], ChainInfoInner.prototype, "registeredCurrencies", void 0);
__decorate([
    mobx_1.observable
], ChainInfoInner.prototype, "currencyRegistrars", void 0);
__decorate([
    mobx_1.action
], ChainInfoInner.prototype, "addUnknownCurrencies", null);
__decorate([
    mobx_1.action
], ChainInfoInner.prototype, "registerCurrencyRegistrar", null);
__decorate([
    mobx_1.action
], ChainInfoInner.prototype, "setChainInfo", null);
__decorate([
    mobx_1.computed
], ChainInfoInner.prototype, "currencyMap", null);
__decorate([
    mobx_1.action
], ChainInfoInner.prototype, "addCurrencies", null);
__decorate([
    mobx_1.action
], ChainInfoInner.prototype, "removeCurrencies", null);
__decorate([
    mobx_1.action
], ChainInfoInner.prototype, "addOrReplaceCurrency", null);
exports.ChainInfoInner = ChainInfoInner;
class ChainStore {
    constructor(embedChainInfos) {
        this.setChainInfoHandlers = [];
        this._cachedChainInfosMap = new Map();
        this.setChainInfos(embedChainInfos);
        mobx_1.makeObservable(this);
    }
    get chainInfos() {
        return this._chainInfos;
    }
    getChain(chainId) {
        const chainIdentifier = cosmos_1.ChainIdHelper.parse(chainId);
        const find = this.chainInfos.find((info) => {
            return (cosmos_1.ChainIdHelper.parse(info.chainId).identifier ===
                chainIdentifier.identifier);
        });
        if (!find) {
            throw new Error(`Unknown chain info: ${chainId}`);
        }
        return find;
    }
    hasChain(chainId) {
        const chainIdentifier = cosmos_1.ChainIdHelper.parse(chainId);
        const find = this.chainInfos.find((info) => {
            return (cosmos_1.ChainIdHelper.parse(info.chainId).identifier ===
                chainIdentifier.identifier);
        });
        return find != null;
    }
    addSetChainInfoHandler(handler) {
        this.setChainInfoHandlers.push(handler);
        for (const chainInfo of this.chainInfos) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const cached = this._cachedChainInfosMap.get(chainInfo.chainId);
            handler(cached);
        }
    }
    setChainInfos(chainInfos) {
        const chainInfoInners = [];
        for (const chainInfo of chainInfos) {
            if (this._cachedChainInfosMap.has(chainInfo.chainId)) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const cached = this._cachedChainInfosMap.get(chainInfo.chainId);
                cached.setChainInfo(chainInfo);
                chainInfoInners.push(cached);
            }
            else {
                const chainInfoInner = new ChainInfoInner(chainInfo);
                this._cachedChainInfosMap.set(chainInfo.chainId, chainInfoInner);
                chainInfoInners.push(chainInfoInner);
                for (const handler of this.setChainInfoHandlers) {
                    handler(chainInfoInner);
                }
            }
        }
        this._chainInfos = chainInfoInners;
    }
}
__decorate([
    mobx_1.observable.ref
], ChainStore.prototype, "_chainInfos", void 0);
__decorate([
    mobx_1.action
], ChainStore.prototype, "setChainInfos", null);
exports.ChainStore = ChainStore;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1483:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(1484), exports);
__exportStar(__webpack_require__(1490), exports);
__exportStar(__webpack_require__(1491), exports);
__exportStar(__webpack_require__(1492), exports);
__exportStar(__webpack_require__(1493), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1484:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(1485), exports);
__exportStar(__webpack_require__(1487), exports);
__exportStar(__webpack_require__(1488), exports);
__exportStar(__webpack_require__(1489), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1485:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionStore = void 0;
const router_1 = __webpack_require__(3);
const background_1 = __webpack_require__(54);
const mobx_1 = __webpack_require__(5);
class InteractionStore {
    constructor(router, msgRequester) {
        this.router = router;
        this.msgRequester = msgRequester;
        this.datas = new Map();
        this.events = new Map();
        mobx_1.makeObservable(this);
        const service = new background_1.InteractionForegroundService(this);
        background_1.interactionForegroundInit(router, service);
    }
    getDatas(type) {
        var _a;
        return (_a = mobx_1.toJS(this.datas.get(type))) !== null && _a !== void 0 ? _a : [];
    }
    getEvents(type) {
        var _a;
        return ((_a = mobx_1.toJS(this.events.get(type))) !== null && _a !== void 0 ? _a : []);
    }
    onInteractionDataReceived(data) {
        if (!this.datas.has(data.type)) {
            this.datas.set(data.type, mobx_1.observable.array([], {
                deep: false,
            }));
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.datas.get(data.type).push(data);
    }
    onEventDataReceived(data) {
        if (!this.events.has(data.type)) {
            this.events.set(data.type, mobx_1.observable.array([], {
                deep: false,
            }));
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.events.get(data.type).push(data);
    }
    *approve(type, id, result) {
        this.removeData(type, id);
        yield this.msgRequester.sendMessage(router_1.BACKGROUND_PORT, new background_1.ApproveInteractionMsg(id, result));
    }
    /**
     * Approve the interaction without removing the data on the store.
     * Actually, this method is used for the sign interaction to wait the actual signing ends.
     * You should make sure that remove the data manually.
     * @param id
     * @param result
     */
    *approveWithoutRemovingData(id, result) {
        yield this.msgRequester.sendMessage(router_1.BACKGROUND_PORT, new background_1.ApproveInteractionMsg(id, result));
    }
    *reject(type, id) {
        this.removeData(type, id);
        yield this.msgRequester.sendMessage(router_1.BACKGROUND_PORT, new background_1.RejectInteractionMsg(id));
    }
    *rejectAll(type) {
        const datas = this.getDatas(type);
        for (const data of datas) {
            yield this.reject(data.type, data.id);
        }
    }
    removeData(type, id) {
        if (this.datas.has(type)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const find = this.datas.get(type).find((data) => {
                return data.id === id;
            });
            if (find) {
                this.datas.get(type).remove(find);
            }
        }
    }
    clearEvent(type) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (this.events.has(type) && this.events.get(type).length > 0) {
            this.events.set(type, mobx_1.observable.array([], {
                deep: false,
            }));
        }
    }
}
__decorate([
    mobx_1.observable.shallow
], InteractionStore.prototype, "datas", void 0);
__decorate([
    mobx_1.observable.shallow
], InteractionStore.prototype, "events", void 0);
__decorate([
    mobx_1.action
], InteractionStore.prototype, "onInteractionDataReceived", null);
__decorate([
    mobx_1.action
], InteractionStore.prototype, "onEventDataReceived", null);
__decorate([
    mobx_1.flow
], InteractionStore.prototype, "approve", null);
__decorate([
    mobx_1.flow
], InteractionStore.prototype, "approveWithoutRemovingData", null);
__decorate([
    mobx_1.flow
], InteractionStore.prototype, "reject", null);
__decorate([
    mobx_1.flow
], InteractionStore.prototype, "rejectAll", null);
__decorate([
    mobx_1.action
], InteractionStore.prototype, "removeData", null);
__decorate([
    mobx_1.action
], InteractionStore.prototype, "clearEvent", null);
exports.InteractionStore = InteractionStore;
//# sourceMappingURL=interaction.js.map

/***/ }),

/***/ 1487:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionStore = exports.BasicAccessPermissionInnerStore = exports.Secret20ViewingKeyPermissionInnerStore = void 0;
const background_1 = __webpack_require__(54);
const mobx_1 = __webpack_require__(5);
const common_1 = __webpack_require__(119);
const router_1 = __webpack_require__(3);
const common_2 = __webpack_require__(27);
class Secret20ViewingKeyPermissionInnerStore {
    constructor(chainId, contractAddress, requester) {
        this.chainId = chainId;
        this.contractAddress = contractAddress;
        this.requester = requester;
        this._origins = [];
        mobx_1.makeObservable(this);
        this.refreshOrigins();
    }
    get origins() {
        return this._origins;
    }
    *removeOrigin(origin) {
        yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.RemovePermissionOrigin(this.chainId, background_1.getSecret20ViewingKeyPermissionType(this.contractAddress), origin));
        yield this.refreshOrigins();
    }
    *refreshOrigins() {
        this._origins = yield* common_2.toGenerator(this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.GetPermissionOriginsMsg(this.chainId, background_1.getSecret20ViewingKeyPermissionType(this.contractAddress))));
    }
}
__decorate([
    mobx_1.observable.ref
], Secret20ViewingKeyPermissionInnerStore.prototype, "_origins", void 0);
__decorate([
    mobx_1.flow
], Secret20ViewingKeyPermissionInnerStore.prototype, "removeOrigin", null);
__decorate([
    mobx_1.flow
], Secret20ViewingKeyPermissionInnerStore.prototype, "refreshOrigins", null);
exports.Secret20ViewingKeyPermissionInnerStore = Secret20ViewingKeyPermissionInnerStore;
class BasicAccessPermissionInnerStore {
    constructor(chainId, requester) {
        this.chainId = chainId;
        this.requester = requester;
        this._origins = [];
        mobx_1.makeObservable(this);
        this.refreshOrigins();
    }
    get origins() {
        return this._origins;
    }
    *addOrigin(origin) {
        yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.AddPermissionOrigin(this.chainId, background_1.getBasicAccessPermissionType(), origin));
        yield this.refreshOrigins();
    }
    *removeOrigin(origin) {
        yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.RemovePermissionOrigin(this.chainId, background_1.getBasicAccessPermissionType(), origin));
        yield this.refreshOrigins();
    }
    *refreshOrigins() {
        this._origins = yield* common_2.toGenerator(this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.GetPermissionOriginsMsg(this.chainId, background_1.getBasicAccessPermissionType())));
    }
}
__decorate([
    mobx_1.observable.ref
], BasicAccessPermissionInnerStore.prototype, "_origins", void 0);
__decorate([
    mobx_1.flow
], BasicAccessPermissionInnerStore.prototype, "addOrigin", null);
__decorate([
    mobx_1.flow
], BasicAccessPermissionInnerStore.prototype, "removeOrigin", null);
__decorate([
    mobx_1.flow
], BasicAccessPermissionInnerStore.prototype, "refreshOrigins", null);
exports.BasicAccessPermissionInnerStore = BasicAccessPermissionInnerStore;
class PermissionStore extends common_1.HasMapStore {
    constructor(interactionStore, requester) {
        super((key) => {
            const data = JSON.parse(key);
            if (data.type === "basicAccess") {
                return new BasicAccessPermissionInnerStore(data.chainId, this.requester);
            }
            else {
                return new Secret20ViewingKeyPermissionInnerStore(data.chainId, data.contractAddress, this.requester);
            }
        });
        this.interactionStore = interactionStore;
        this.requester = requester;
        this._isLoading = false;
        mobx_1.makeObservable(this);
    }
    getBasicAccessInfo(chainId) {
        const key = JSON.stringify({
            type: "basicAccess",
            chainId,
            contractAddress: "",
        });
        return this.get(key);
    }
    getOriginPermittedChains(origin, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.GetOriginPermittedChainsMsg(origin, type));
        });
    }
    getSecret20ViewingKeyAccessInfo(chainId, contractAddress) {
        const key = JSON.stringify({
            type: "viewingKey",
            chainId,
            contractAddress,
        });
        return this.get(key);
    }
    get waitingBasicAccessPermissions() {
        const datas = this.waitingDatas;
        const result = [];
        for (const data of datas) {
            if (background_1.isBasicAccessPermissionType(data.data.type)) {
                result.push({
                    id: data.id,
                    data: {
                        chainIds: data.data.chainIds,
                        origins: data.data.origins,
                    },
                });
            }
        }
        return result;
    }
    get waitingSecret20ViewingKeyAccessPermissions() {
        const datas = this.waitingDatas;
        const result = [];
        for (const data of datas) {
            if (background_1.isSecret20ViewingKeyPermissionType(data.data.type)) {
                result.push({
                    id: data.id,
                    data: {
                        chainIds: data.data.chainIds,
                        contractAddress: background_1.splitSecret20ViewingKeyPermissionType(data.data.type),
                        origins: data.data.origins,
                    },
                });
            }
        }
        return result;
    }
    get waitingDatas() {
        return this.interactionStore.getDatas(background_1.INTERACTION_TYPE_PERMISSION);
    }
    *approve(id) {
        this._isLoading = true;
        try {
            yield this.interactionStore.approve(background_1.INTERACTION_TYPE_PERMISSION, id, {});
        }
        finally {
            this._isLoading = false;
        }
    }
    *reject(id) {
        this._isLoading = true;
        try {
            yield this.interactionStore.reject(background_1.INTERACTION_TYPE_PERMISSION, id);
        }
        finally {
            this._isLoading = false;
        }
    }
    *rejectAll() {
        this._isLoading = true;
        try {
            yield this.interactionStore.rejectAll(background_1.INTERACTION_TYPE_PERMISSION);
        }
        finally {
            this._isLoading = false;
        }
    }
    get isLoading() {
        return this._isLoading;
    }
}
__decorate([
    mobx_1.observable
], PermissionStore.prototype, "_isLoading", void 0);
__decorate([
    mobx_1.computed
], PermissionStore.prototype, "waitingBasicAccessPermissions", null);
__decorate([
    mobx_1.computed
], PermissionStore.prototype, "waitingSecret20ViewingKeyAccessPermissions", null);
__decorate([
    mobx_1.flow
], PermissionStore.prototype, "approve", null);
__decorate([
    mobx_1.flow
], PermissionStore.prototype, "reject", null);
__decorate([
    mobx_1.flow
], PermissionStore.prototype, "rejectAll", null);
exports.PermissionStore = PermissionStore;
//# sourceMappingURL=permission.js.map

/***/ }),

/***/ 1488:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInteractionStore = void 0;
const mobx_1 = __webpack_require__(5);
const cosmos_1 = __webpack_require__(16);
class SignInteractionStore {
    constructor(interactionStore) {
        this.interactionStore = interactionStore;
        this._isLoading = false;
        mobx_1.makeObservable(this);
        mobx_1.autorun(() => {
            // Reject all interactions that is not first one.
            // This interaction can have only one interaction at once.
            const datas = this.waitingDatas.slice();
            if (datas.length > 1) {
                for (let i = 1; i < datas.length; i++) {
                    this.rejectWithId(datas[i].id);
                }
            }
        });
    }
    get waitingDatas() {
        return this.interactionStore.getDatas("request-sign");
    }
    get waitingData() {
        const datas = this.waitingDatas;
        if (datas.length === 0) {
            return undefined;
        }
        const data = datas[0];
        const wrapper = data.data.mode === "amino"
            ? cosmos_1.SignDocWrapper.fromAminoSignDoc(data.data.signDoc)
            : cosmos_1.SignDocWrapper.fromDirectSignDocBytes(data.data.signDocBytes);
        return {
            id: data.id,
            type: data.type,
            isInternal: data.isInternal,
            data: {
                chainId: data.data.chainId,
                msgOrigin: data.data.msgOrigin,
                signer: data.data.signer,
                signDocWrapper: wrapper,
                signOptions: data.data.signOptions,
                isADR36WithString: "isADR36WithString" in data.data
                    ? data.data.isADR36WithString
                    : undefined,
                ethSignType: "ethSignType" in data.data ? data.data.ethSignType : undefined,
            },
        };
    }
    isEnded() {
        return this.interactionStore.getEvents("request-sign-end").length > 0;
    }
    clearEnded() {
        this.interactionStore.clearEvent("request-sign-end");
    }
    waitEnd() {
        if (this.isEnded()) {
            console.log("isEnded");
            return Promise.resolve();
        }
        return new Promise((resolve) => {
            const disposer = mobx_1.autorun(() => {
                if (this.isEnded()) {
                    console.log("disposer-isEnded");
                    resolve();
                    this.clearEnded();
                    disposer();
                }
                else {
                    console.log(this.interactionStore.getEvents("request-sign-end"));
                }
            });
        });
    }
    *approveAndWaitEnd(newSignDocWrapper) {
        if (this.waitingDatas.length === 0) {
            return;
        }
        console.log(this.waitingDatas);
        this._isLoading = true;
        const id = this.waitingDatas[0].id;
        try {
            const newSignDoc = newSignDocWrapper.mode === "amino"
                ? newSignDocWrapper.aminoSignDoc
                : newSignDocWrapper.protoSignDoc.toBytes();
            yield this.interactionStore.approveWithoutRemovingData(id, newSignDoc);
            console.log("newSignDoc");
        }
        finally {
            yield this.waitEnd();
            this.interactionStore.removeData("request-sign", id);
            this._isLoading = false;
            console.log("waitEnd");
        }
    }
    *reject() {
        if (this.waitingDatas.length === 0) {
            return;
        }
        this._isLoading = true;
        try {
            yield this.interactionStore.reject("request-sign", this.waitingDatas[0].id);
        }
        finally {
            this._isLoading = false;
        }
    }
    *rejectAll() {
        this._isLoading = true;
        try {
            yield this.interactionStore.rejectAll("request-sign");
        }
        finally {
            this._isLoading = false;
        }
    }
    *rejectWithId(id) {
        yield this.interactionStore.reject("request-sign", id);
    }
    get isLoading() {
        return this._isLoading;
    }
}
__decorate([
    mobx_1.observable
], SignInteractionStore.prototype, "_isLoading", void 0);
__decorate([
    mobx_1.computed
], SignInteractionStore.prototype, "waitingData", null);
__decorate([
    mobx_1.flow
], SignInteractionStore.prototype, "approveAndWaitEnd", null);
__decorate([
    mobx_1.flow
], SignInteractionStore.prototype, "reject", null);
__decorate([
    mobx_1.flow
], SignInteractionStore.prototype, "rejectAll", null);
__decorate([
    mobx_1.flow
], SignInteractionStore.prototype, "rejectWithId", null);
exports.SignInteractionStore = SignInteractionStore;
//# sourceMappingURL=sign.js.map

/***/ }),

/***/ 1489:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainSuggestStore = void 0;
const background_1 = __webpack_require__(54);
const mobx_1 = __webpack_require__(5);
class ChainSuggestStore {
    constructor(interactionStore) {
        this.interactionStore = interactionStore;
        this._isLoading = false;
        mobx_1.makeObservable(this);
    }
    get waitingSuggestedChainInfo() {
        const datas = this.interactionStore.getDatas(background_1.SuggestChainInfoMsg.type());
        if (datas.length > 0) {
            return datas[0];
        }
    }
    *approve() {
        this._isLoading = true;
        try {
            const data = this.waitingSuggestedChainInfo;
            if (data) {
                yield this.interactionStore.approve(data.type, data.id, {});
            }
        }
        finally {
            this._isLoading = false;
        }
    }
    *reject() {
        this._isLoading = true;
        try {
            const data = this.waitingSuggestedChainInfo;
            if (data) {
                yield this.interactionStore.reject(data.type, data.id);
            }
        }
        finally {
            this._isLoading = false;
        }
    }
    *rejectAll() {
        this._isLoading = true;
        try {
            yield this.interactionStore.rejectAll(background_1.SuggestChainInfoMsg.type());
        }
        finally {
            this._isLoading = false;
        }
    }
    get isLoading() {
        return this._isLoading;
    }
}
__decorate([
    mobx_1.observable
], ChainSuggestStore.prototype, "_isLoading", void 0);
__decorate([
    mobx_1.flow
], ChainSuggestStore.prototype, "approve", null);
__decorate([
    mobx_1.flow
], ChainSuggestStore.prototype, "reject", null);
__decorate([
    mobx_1.flow
], ChainSuggestStore.prototype, "rejectAll", null);
exports.ChainSuggestStore = ChainSuggestStore;
//# sourceMappingURL=chain-suggest.js.map

/***/ }),

/***/ 1490:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyRingStore = exports.KeyRingSelectablesStore = void 0;
const router_1 = __webpack_require__(3);
const background_1 = __webpack_require__(54);
const mobx_1 = __webpack_require__(5);
const common_1 = __webpack_require__(27);
class KeyRingSelectablesStore {
    constructor(chainGetter, requester, chainId, keyRingStore) {
        this.chainGetter = chainGetter;
        this.requester = requester;
        this.chainId = chainId;
        this.keyRingStore = keyRingStore;
        this.isInitializing = false;
        this._isKeyStoreCoinTypeSet = false;
        this._selectables = [];
        mobx_1.makeObservable(this);
        this.refresh();
    }
    get needSelectCoinType() {
        const chainInfo = this.chainGetter.getChain(this.chainId);
        if (!chainInfo.alternativeBIP44s ||
            chainInfo.alternativeBIP44s.length === 0) {
            return false;
        }
        return !this.isInitializing && !this._isKeyStoreCoinTypeSet;
    }
    get selectables() {
        return this._selectables;
    }
    *refresh() {
        var _a;
        // No need to set the coin type if the key store type is not mnemonic.
        if (this.keyRingStore.keyRingType !== "mnemonic") {
            this.isInitializing = false;
            this._isKeyStoreCoinTypeSet = true;
            this._selectables = [];
            return;
        }
        this.isInitializing = true;
        const chainInfo = this.chainGetter.getChain(this.chainId);
        const msg = new background_1.GetIsKeyStoreCoinTypeSetMsg(this.chainId, [
            chainInfo.bip44,
            ...((_a = chainInfo.alternativeBIP44s) !== null && _a !== void 0 ? _a : []),
        ]);
        const seletables = yield* common_1.toGenerator(this.requester.sendMessage(router_1.BACKGROUND_PORT, msg));
        if (seletables.length === 0) {
            this._isKeyStoreCoinTypeSet = true;
        }
        else if (seletables.length === 1) {
            yield this.keyRingStore.setKeyStoreCoinType(this.chainId, seletables[0].path.coinType);
            this._isKeyStoreCoinTypeSet = true;
        }
        else {
            this._selectables = seletables;
            this._isKeyStoreCoinTypeSet = false;
        }
        this.isInitializing = false;
    }
}
__decorate([
    mobx_1.observable
], KeyRingSelectablesStore.prototype, "isInitializing", void 0);
__decorate([
    mobx_1.observable
], KeyRingSelectablesStore.prototype, "_isKeyStoreCoinTypeSet", void 0);
__decorate([
    mobx_1.observable.ref
], KeyRingSelectablesStore.prototype, "_selectables", void 0);
__decorate([
    mobx_1.computed
], KeyRingSelectablesStore.prototype, "needSelectCoinType", null);
__decorate([
    mobx_1.flow
], KeyRingSelectablesStore.prototype, "refresh", null);
exports.KeyRingSelectablesStore = KeyRingSelectablesStore;
/*
 Actual key ring logic is managed in persistent background. Refer "src/common/message" and "src/background/keyring"
 This store only interact with key ring in persistent background.
 */
class KeyRingStore {
    constructor(eventDispatcher, defaultKdf, chainGetter, requester, interactionStore) {
        this.eventDispatcher = eventDispatcher;
        this.defaultKdf = defaultKdf;
        this.chainGetter = chainGetter;
        this.requester = requester;
        this.interactionStore = interactionStore;
        this.status = background_1.KeyRingStatus.NOTLOADED;
        this.multiKeyStoreInfo = [];
        this.selectablesMap = new Map();
        this.keyStoreChangedListeners = [];
        mobx_1.makeObservable(this);
        this.restore();
    }
    get keyRingType() {
        const keyStore = this.multiKeyStoreInfo.find((keyStore) => keyStore.selected);
        if (!keyStore) {
            return "none";
        }
        else {
            return background_1.KeyRing.getTypeOfKeyStore(keyStore);
        }
    }
    *createMnemonicKey(mnemonic, password, meta, bip44HDPath, kdf = this.defaultKdf) {
        const msg = new background_1.CreateMnemonicKeyMsg(kdf, mnemonic, password, meta, bip44HDPath);
        const result = yield* common_1.toGenerator(this.requester.sendMessage(router_1.BACKGROUND_PORT, msg));
        this.status = result.status;
        this.multiKeyStoreInfo = result.multiKeyStoreInfo;
    }
    *createPrivateKey(privateKey, password, meta, kdf = this.defaultKdf) {
        const msg = new background_1.CreatePrivateKeyMsg(kdf, privateKey, password, meta);
        const result = yield* common_1.toGenerator(this.requester.sendMessage(router_1.BACKGROUND_PORT, msg));
        this.status = result.status;
        this.multiKeyStoreInfo = result.multiKeyStoreInfo;
    }
    *addMnemonicKey(mnemonic, meta, bip44HDPath, kdf = this.defaultKdf) {
        const msg = new background_1.AddMnemonicKeyMsg(kdf, mnemonic, meta, bip44HDPath);
        this.multiKeyStoreInfo = (yield* common_1.toGenerator(this.requester.sendMessage(router_1.BACKGROUND_PORT, msg))).multiKeyStoreInfo;
    }
    *addPrivateKey(privateKey, meta, kdf = this.defaultKdf) {
        const msg = new background_1.AddPrivateKeyMsg(kdf, privateKey, meta);
        this.multiKeyStoreInfo = (yield* common_1.toGenerator(this.requester.sendMessage(router_1.BACKGROUND_PORT, msg))).multiKeyStoreInfo;
    }
    *changeKeyRing(index) {
        const msg = new background_1.ChangeKeyRingMsg(index);
        this.multiKeyStoreInfo = (yield* common_1.toGenerator(this.requester.sendMessage(router_1.BACKGROUND_PORT, msg))).multiKeyStoreInfo;
        // Emit the key store changed event manually.
        this.dispatchKeyStoreChangeEvent();
        this.selectablesMap.forEach((selectables) => selectables.refresh());
    }
    *lock() {
        const msg = new background_1.LockKeyRingMsg();
        const result = yield* common_1.toGenerator(this.requester.sendMessage(router_1.BACKGROUND_PORT, msg));
        this.status = result.status;
    }
    *unlock(password) {
        const msg = new background_1.UnlockKeyRingMsg(password);
        const result = yield* common_1.toGenerator(this.requester.sendMessage(router_1.BACKGROUND_PORT, msg));
        this.status = result.status;
        // Approve all waiting interaction for the enabling key ring.
        for (const interaction of this.interactionStore.getDatas("unlock")) {
            yield this.interactionStore.approve("unlock", interaction.id, {});
        }
        this.dispatchKeyStoreChangeEvent();
        this.selectablesMap.forEach((selectables) => selectables.refresh());
    }
    *rejectAll() {
        yield this.interactionStore.rejectAll("unlock");
    }
    *restore() {
        const msg = new background_1.RestoreKeyRingMsg();
        const result = yield* common_1.toGenerator(this.requester.sendMessage(router_1.BACKGROUND_PORT, msg));
        this.status = result.status;
        this.multiKeyStoreInfo = result.multiKeyStoreInfo;
    }
    showKeyRing(index, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = new background_1.ShowKeyRingMsg(index, password);
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, msg);
        });
    }
    *deleteKeyRing(index, password) {
        const selectedIndex = this.multiKeyStoreInfo.findIndex((keyStore) => keyStore.selected);
        const msg = new background_1.DeleteKeyRingMsg(index, password);
        const result = yield* common_1.toGenerator(this.requester.sendMessage(router_1.BACKGROUND_PORT, msg));
        this.status = result.status;
        this.multiKeyStoreInfo = result.multiKeyStoreInfo;
        // Selected keystore may be changed if the selected one is deleted.
        if (selectedIndex === index) {
            this.dispatchKeyStoreChangeEvent();
            this.selectablesMap.forEach((selectables) => selectables.refresh());
        }
    }
    *updateNameKeyRing(index, name) {
        const msg = new background_1.UpdateNameKeyRingMsg(index, name);
        const result = yield* common_1.toGenerator(this.requester.sendMessage(router_1.BACKGROUND_PORT, msg));
        this.multiKeyStoreInfo = result.multiKeyStoreInfo;
        const selectedIndex = this.multiKeyStoreInfo.findIndex((keyStore) => keyStore.selected);
        // If selectedIndex and index are same, name could be changed, so dispatch keystore event
        if (selectedIndex === index) {
            this.dispatchKeyStoreChangeEvent();
        }
    }
    checkPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.CheckPasswordMsg(password));
        });
    }
    getKeyStoreSelectables(chainId) {
        if (!this.selectablesMap.has(chainId)) {
            mobx_1.runInAction(() => {
                this.selectablesMap.set(chainId, new KeyRingSelectablesStore(this.chainGetter, this.requester, chainId, this));
            });
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.selectablesMap.get(chainId);
    }
    // Set the coin type to current key store.
    // And, save it, refresh the key store.
    *setKeyStoreCoinType(chainId, coinType) {
        const status = yield* common_1.toGenerator(this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.SetKeyStoreCoinTypeMsg(chainId, coinType)));
        this.multiKeyStoreInfo = (yield* common_1.toGenerator(this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.GetMultiKeyStoreInfoMsg()))).multiKeyStoreInfo;
        this.status = status;
        // Emit the key store changed event manually.
        this.dispatchKeyStoreChangeEvent();
        this.selectablesMap.forEach((selectables) => selectables.refresh());
    }
    exportKeyRingDatas(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.ExportKeyRingDatasMsg(password));
        });
    }
    dispatchKeyStoreChangeEvent() {
        this.eventDispatcher.dispatchEvent("mises_keystorechange");
        for (const listener of this.keyStoreChangedListeners) {
            listener();
        }
    }
    addKeyStoreChangedListener(listener) {
        this.keyStoreChangedListeners.push(listener);
    }
    removeKeyStoreChangedListener(listener) {
        const i = this.keyStoreChangedListeners.indexOf(listener);
        if (i >= 0) {
            this.keyStoreChangedListeners.splice(i, 1);
        }
    }
    addAccount(name, bip44HDPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.AddAccountMsg(name, bip44HDPath));
            this.multiKeyStoreInfo = result.multiKeyStoreInfo;
        });
    }
    migratorKeyRing(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.MigratorKeyRingMsg(password));
            this.multiKeyStoreInfo = result.multiKeyStoreInfo;
        });
    }
    restoreKeyStore() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.RestoreKeyStoreMsg());
        });
    }
}
__decorate([
    mobx_1.observable
], KeyRingStore.prototype, "status", void 0);
__decorate([
    mobx_1.observable
], KeyRingStore.prototype, "multiKeyStoreInfo", void 0);
__decorate([
    mobx_1.observable.shallow
], KeyRingStore.prototype, "selectablesMap", void 0);
__decorate([
    mobx_1.computed
], KeyRingStore.prototype, "keyRingType", null);
__decorate([
    mobx_1.flow
], KeyRingStore.prototype, "createMnemonicKey", null);
__decorate([
    mobx_1.flow
], KeyRingStore.prototype, "createPrivateKey", null);
__decorate([
    mobx_1.flow
], KeyRingStore.prototype, "addMnemonicKey", null);
__decorate([
    mobx_1.flow
], KeyRingStore.prototype, "addPrivateKey", null);
__decorate([
    mobx_1.flow
], KeyRingStore.prototype, "changeKeyRing", null);
__decorate([
    mobx_1.flow
], KeyRingStore.prototype, "lock", null);
__decorate([
    mobx_1.flow
], KeyRingStore.prototype, "unlock", null);
__decorate([
    mobx_1.flow
], KeyRingStore.prototype, "rejectAll", null);
__decorate([
    mobx_1.flow
], KeyRingStore.prototype, "restore", null);
__decorate([
    mobx_1.flow
], KeyRingStore.prototype, "deleteKeyRing", null);
__decorate([
    mobx_1.flow
], KeyRingStore.prototype, "updateNameKeyRing", null);
__decorate([
    mobx_1.flow
], KeyRingStore.prototype, "setKeyStoreCoinType", null);
exports.KeyRingStore = KeyRingStore;
//# sourceMappingURL=keyring.js.map

/***/ }),

/***/ 1491:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokensStore = exports.TokensStoreInner = void 0;
const common_1 = __webpack_require__(119);
const router_1 = __webpack_require__(3);
const background_1 = __webpack_require__(54);
const mobx_1 = __webpack_require__(5);
const common_2 = __webpack_require__(27);
const cosmos_1 = __webpack_require__(16);
class TokensStoreInner {
    constructor(eventListener, chainStore, chainId, requester) {
        this.eventListener = eventListener;
        this.chainStore = chainStore;
        this.chainId = chainId;
        this.requester = requester;
        this._tokens = [];
        mobx_1.makeObservable(this);
        this.refreshTokens();
        // If key store in the keplr extension is unlocked, this event will be dispatched.
        // This is needed becuase the token such as secret20 exists according to the account.
        this.eventListener.addEventListener("keplr_keystoreunlock", () => {
            this.refreshTokens();
        });
        // If key store in the keplr extension is changed, this event will be dispatched.
        // This is needed becuase the token such as secret20 exists according to the account.
        this.eventListener.addEventListener("mises_keystorechange", () => {
            this.refreshTokens();
        });
    }
    get tokens() {
        return this._tokens;
    }
    *refreshTokens() {
        const chainInfo = this.chainStore.getChain(this.chainId);
        if (chainInfo.features &&
            // Tokens service is only needed for secretwasm and cosmwasm,
            // so, there is no need to fetch the registered token if the chain doesn't support the secretwasm and cosmwasm.
            (chainInfo.features.includes("secretwasm") ||
                chainInfo.features.includes("cosmwasm"))) {
            const msg = new background_1.GetTokensMsg(this.chainId);
            this._tokens = yield* common_2.toGenerator(this.requester.sendMessage(router_1.BACKGROUND_PORT, msg));
        }
        else {
            this._tokens = [];
        }
    }
    *addToken(currency) {
        const msg = new background_1.AddTokenMsg(this.chainId, currency);
        yield this.requester.sendMessage(router_1.BACKGROUND_PORT, msg);
        yield this.refreshTokens();
    }
    *removeToken(currency) {
        const msg = new background_1.RemoveTokenMsg(this.chainId, currency);
        yield this.requester.sendMessage(router_1.BACKGROUND_PORT, msg);
        yield this.refreshTokens();
    }
}
__decorate([
    mobx_1.observable.ref
], TokensStoreInner.prototype, "_tokens", void 0);
__decorate([
    mobx_1.flow
], TokensStoreInner.prototype, "refreshTokens", null);
__decorate([
    mobx_1.flow
], TokensStoreInner.prototype, "addToken", null);
__decorate([
    mobx_1.flow
], TokensStoreInner.prototype, "removeToken", null);
exports.TokensStoreInner = TokensStoreInner;
class TokensStore extends common_1.HasMapStore {
    constructor(eventListener, chainStore, requester, interactionStore) {
        super((chainId) => {
            return new TokensStoreInner(this.eventListener, this.chainStore, chainId, this.requester);
        });
        this.eventListener = eventListener;
        this.chainStore = chainStore;
        this.requester = requester;
        this.interactionStore = interactionStore;
        this.prevTokens = new Map();
        mobx_1.makeObservable(this);
        this.chainStore.addSetChainInfoHandler((chainInfoInner) => {
            mobx_1.autorun(() => {
                var _a;
                const chainIdentifier = cosmos_1.ChainIdHelper.parse(chainInfoInner.chainId);
                // Tokens should be changed whenever the account changed.
                // But, the added currencies are not removed automatically.
                // So, we should remove the prev token currencies from the chain info.
                const prevToken = (_a = this.prevTokens.get(chainIdentifier.identifier)) !== null && _a !== void 0 ? _a : [];
                chainInfoInner.removeCurrencies(...prevToken.map((token) => token.coinMinimalDenom));
                const inner = this.getTokensOf(chainInfoInner.chainId);
                chainInfoInner.addCurrencies(...inner.tokens);
                this.prevTokens.set(chainIdentifier.identifier, inner.tokens);
            });
        });
    }
    getTokensOf(chainId) {
        return this.get(chainId);
    }
    get waitingSuggestedToken() {
        const datas = this.interactionStore.getDatas(background_1.SuggestTokenMsg.type());
        if (datas.length > 0) {
            return datas[0];
        }
    }
    *approveSuggestedToken(appCurrency) {
        const data = this.waitingSuggestedToken;
        if (data) {
            yield this.interactionStore.approve(background_1.SuggestTokenMsg.type(), data.id, appCurrency);
            yield this.getTokensOf(data.data.chainId).refreshTokens();
        }
    }
    *rejectSuggestedToken() {
        const data = this.waitingSuggestedToken;
        if (data) {
            yield this.interactionStore.reject(background_1.SuggestTokenMsg.type(), data.id);
        }
    }
    *rejectAllSuggestedTokens() {
        yield this.interactionStore.rejectAll(background_1.SuggestTokenMsg.type());
    }
}
__decorate([
    mobx_1.flow
], TokensStore.prototype, "approveSuggestedToken", null);
__decorate([
    mobx_1.flow
], TokensStore.prototype, "rejectSuggestedToken", null);
__decorate([
    mobx_1.flow
], TokensStore.prototype, "rejectAllSuggestedTokens", null);
exports.TokensStore = TokensStore;
//# sourceMappingURL=tokens.js.map

/***/ }),

/***/ 1492:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MisesStore = void 0;
const router_1 = __webpack_require__(3);
const mobx_1 = __webpack_require__(5);
const background_1 = __webpack_require__(54);
class MisesStore {
    constructor(requester) {
        this.requester = requester;
        this.isInitializing = false;
        this.autoLockAccountDuration = 0;
        mobx_1.makeObservable(this);
        this.initAutoLockAccountDuration();
    }
    getBalanceUMIS(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.BalanceUMISMsg(address));
        });
    }
    isMisesChain(chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.MisesChainMsg(chainId));
        });
    }
    getChainId() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.GetChainIdMsg());
        });
    }
    unbondingDelegations(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.UnbondingDelegationsMsg(address));
        });
    }
    delegations(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.DelegationsMsg(address));
        });
    }
    rewards(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.RewardsMsg(address));
        });
    }
    authAccounts(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.AuthAccountsMsg(address));
        });
    }
    broadcastTx(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.BroadcastTxMsg(tx));
        });
    }
    simulate(messages, memo, signer, sequence) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.SimulateMsg(messages, memo, signer, sequence));
        });
    }
    recentTransactions() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.RecentTransactionsMsg());
        });
    }
    activeUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.ActiveUserMsg());
        });
    }
    portForTx(txId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.PortForTxMsg(txId));
        });
    }
    getAutoLockAccountDuration() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.GetAutoLockAccountDurationMsg());
        });
    }
    initAutoLockAccountDuration() {
        this.getAutoLockAccountDuration().then((res) => (this.autoLockAccountDuration = res));
    }
    setLastActiveTime() {
        this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.StartAutoLockMonitoringMsg());
    }
    setLock() {
        this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.LockMsg());
    }
    saveTranstions(transactions) {
        this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.SaveTranstionsMsg(transactions));
    }
    getLocalCache(address) {
        return this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.GetLocalCacheMsg(address));
    }
    setLocalCache(params) {
        this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.SetLocalCacheMsg(params));
    }
}
__decorate([
    mobx_1.observable
], MisesStore.prototype, "isInitializing", void 0);
__decorate([
    mobx_1.observable
], MisesStore.prototype, "autoLockAccountDuration", void 0);
exports.MisesStore = MisesStore;
//# sourceMappingURL=mises.js.map

/***/ }),

/***/ 1493:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MisesSafeStore = void 0;
const background_1 = __webpack_require__(54);
const router_1 = __webpack_require__(3);
const mobx_1 = __webpack_require__(5);
class MisesSafeStore {
    constructor(requester) {
        this.requester = requester;
        this.isShouldVerify = true;
        mobx_1.makeObservable(this);
        this.initSafeConfig();
    }
    initSafeConfig() {
        this.getMisesSafeConfig().then((res) => (this.isShouldVerify = res));
    }
    getMisesSafeConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.GetIsShouldVerifyMsg());
        });
    }
    setMisesSafeConfig(state) {
        console.log(!!state, "setMisesSafeConfig");
        this.isShouldVerify = !!state;
        this.requester.sendMessage(router_1.BACKGROUND_PORT, new background_1.SetIsShouldVerifyMsg(state));
    }
}
__decorate([
    mobx_1.observable
], MisesSafeStore.prototype, "isShouldVerify", void 0);
exports.MisesSafeStore = MisesSafeStore;
//# sourceMappingURL=mises-safe.js.map

/***/ }),

/***/ 1494:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(1495), exports);
__exportStar(__webpack_require__(1496), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1495:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IBCChannelStore = exports.IBCChannelStoreInner = void 0;
const common_1 = __webpack_require__(27);
const mobx_1 = __webpack_require__(5);
const mobx_utils_1 = __webpack_require__(201);
const common_2 = __webpack_require__(119);
const cosmos_1 = __webpack_require__(16);
class IBCChannelStoreInner {
    constructor(kvStore, chainId) {
        this.kvStore = kvStore;
        this.chainId = chainId;
        // channelMap[portId][channelId]
        this.channelMap = new Map();
        this.getChannelsToPort = mobx_utils_1.computedFn((portId) => {
            if (!this.channelMap.has(portId)) {
                mobx_1.runInAction(() => {
                    this.channelMap.set(portId, mobx_1.observable.map({}, {
                        deep: false,
                    }));
                });
            }
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const channelMapOfPort = this.channelMap.get(portId);
            const channels = [];
            for (const channel of channelMapOfPort.values()) {
                channels.push(channel);
            }
            return channels;
        });
        this.getChannel = mobx_utils_1.computedFn((portId, channelId) => {
            var _a;
            return (_a = this.channelMap.get(portId)) === null || _a === void 0 ? void 0 : _a.get(channelId);
        });
        mobx_1.makeObservable(this);
        this.loadChannels();
    }
    getTransferChannels() {
        return this.getChannelsToPort("transfer");
    }
    *addChannel(channel) {
        if (!this.channelMap.has(channel.portId)) {
            this.channelMap.set(channel.portId, mobx_1.observable.map({}, {
                deep: false,
            }));
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.channelMap.get(channel.portId).set(channel.channelId, channel);
        yield this.saveChannels();
    }
    *loadChannels() {
        const obj = yield* common_1.toGenerator(this.kvStore.get(`${cosmos_1.ChainIdHelper.parse(this.chainId).identifier}-channels`));
        if (obj) {
            for (const portId of Object.keys(obj)) {
                const map = obj[portId];
                for (const channelId of Object.keys(map)) {
                    if (!this.channelMap.has(portId)) {
                        this.channelMap.set(portId, mobx_1.observable.map({}, { deep: false }));
                    }
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const innerMap = this.channelMap.get(portId);
                    innerMap.set(channelId, map[channelId]);
                }
            }
        }
    }
    saveChannels() {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = {};
            this.channelMap.forEach((v, portId) => {
                obj[portId] = (() => {
                    const obj = {};
                    v.forEach((channel, channelId) => {
                        obj[channelId] = channel;
                    });
                    return obj;
                })();
            });
            yield this.kvStore.set(`${cosmos_1.ChainIdHelper.parse(this.chainId).identifier}-channels`, obj);
        });
    }
}
__decorate([
    mobx_1.observable.shallow
], IBCChannelStoreInner.prototype, "channelMap", void 0);
__decorate([
    mobx_1.flow
], IBCChannelStoreInner.prototype, "addChannel", null);
__decorate([
    mobx_1.flow
], IBCChannelStoreInner.prototype, "loadChannels", null);
exports.IBCChannelStoreInner = IBCChannelStoreInner;
/**
 * IBCChannelStore saves the IBC channel infomations to the storage.
 */
class IBCChannelStore extends common_2.HasMapStore {
    constructor(kvStore) {
        super((chainId) => {
            return new IBCChannelStoreInner(kvStore, chainId);
        });
        this.kvStore = kvStore;
    }
    get(chainId) {
        return super.get(chainId);
    }
}
exports.IBCChannelStore = IBCChannelStore;
//# sourceMappingURL=channel.js.map

/***/ }),

/***/ 1496:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IBCCurrencyRegsitrar = exports.IBCCurrencyRegsitrarInner = void 0;
const mobx_1 = __webpack_require__(5);
const common_1 = __webpack_require__(27);
class IBCCurrencyRegsitrarInner {
    constructor(kvStore, cacheDuration, chainInfoInner, chainStore, accountStore, queriesStore, cosmwasmQueriesStore, coinDenomGenerator) {
        this.kvStore = kvStore;
        this.cacheDuration = cacheDuration;
        this.chainInfoInner = chainInfoInner;
        this.chainStore = chainStore;
        this.accountStore = accountStore;
        this.queriesStore = queriesStore;
        this.cosmwasmQueriesStore = cosmwasmQueriesStore;
        this.coinDenomGenerator = coinDenomGenerator;
        this.isInitialized = false;
        this.isInitializing = false;
        /**
         * Because the `QueryStore` returns the response from cache first if the last response exists, it takes the IO.
         * But, if many unknown currencies requested, this make many IO and queries occur at the same time.
         * This can make the performance issue, so to reduce this problem, use the alternative caching logic
         * and the denom trace shouldn't be changed in the normal case.
         * To decrease the number of IO, make sure that reading from storage should happen when the unknown currencies exist
         * and don't split the data with keys and as posible as combine them to one data structure and key.
         * @protected
         */
        this.cacheDenomTracePaths = new Map();
        mobx_1.makeObservable(this);
    }
    *restoreCache() {
        this.isInitializing = true;
        const key = `cache-ibc-denom-trace-paths/${this.chainInfoInner.chainId}`;
        const obj = yield* common_1.toGenerator(this.kvStore.get(key));
        if (obj) {
            for (const key of Object.keys(obj)) {
                this.cacheDenomTracePaths.set(key, obj[key]);
            }
        }
        this.isInitialized = true;
        this.isInitializing = false;
    }
    getCacheIBCDenomData(denomTraceHash) {
        const result = this.cacheDenomTracePaths.get(denomTraceHash);
        if (result && result.timestamp + this.cacheDuration > Date.now()) {
            return result;
        }
    }
    *setCacheIBCDenomData(denomTraceHash, data) {
        this.cacheDenomTracePaths.set(denomTraceHash, Object.assign(Object.assign({}, data), { timestamp: Date.now() }));
        const obj = {};
        this.cacheDenomTracePaths.forEach((value, key) => {
            obj[key] = value;
        });
        const key = `cache-ibc-denom-trace-paths/${this.chainInfoInner.chainId}`;
        yield this.kvStore.set(key, obj);
    }
    registerUnknownCurrencies(coinMinimalDenom) {
        const denomHelper = new common_1.DenomHelper(coinMinimalDenom);
        if (denomHelper.type !== "native" ||
            !denomHelper.denom.startsWith("ibc/")) {
            // IBC Currency's denom should start with "ibc/"
            return;
        }
        // When the unknown ibc denom is delivered, try to restore the cache from storage.
        if (!this.isInitialized) {
            this.restoreCache();
        }
        if (this.isInitializing) {
            return [undefined, false];
        }
        const queries = this.queriesStore.get(this.chainInfoInner.chainId);
        const hash = denomHelper.denom.replace("ibc/", "");
        const cached = this.getCacheIBCDenomData(hash);
        let counterpartyChainInfo;
        let originChainInfo;
        let denomTrace;
        if (cached) {
            denomTrace = cached.denomTrace;
            if (cached.originChainId &&
                this.chainStore.hasChain(cached.originChainId)) {
                originChainInfo = this.chainStore.getChain(cached.originChainId);
            }
            if (cached.counterpartyChainId &&
                this.chainStore.hasChain(cached.counterpartyChainId)) {
                counterpartyChainInfo = this.chainStore.getChain(cached.counterpartyChainId);
            }
        }
        else {
            const queryDenomTrace = queries.cosmos.queryIBCDenomTrace.getDenomTrace(hash);
            denomTrace = queryDenomTrace.denomTrace;
            if (denomTrace) {
                const paths = denomTrace.paths;
                // The previous chain id from current path.
                let chainIdBefore = this.chainInfoInner.chainId;
                for (const path of paths) {
                    const clientState = this.queriesStore
                        .get(chainIdBefore)
                        .cosmos.queryIBCClientState.getClientState(path.portId, path.channelId);
                    if (clientState.clientChainId &&
                        this.chainStore.hasChain(clientState.clientChainId)) {
                        chainIdBefore = clientState.clientChainId;
                        originChainInfo = this.chainStore.getChain(clientState.clientChainId);
                        if (!counterpartyChainInfo) {
                            counterpartyChainInfo = this.chainStore.getChain(clientState.clientChainId);
                        }
                    }
                    else {
                        originChainInfo = undefined;
                        break;
                    }
                }
                if (originChainInfo) {
                    this.setCacheIBCDenomData(hash, {
                        counterpartyChainId: counterpartyChainInfo === null || counterpartyChainInfo === void 0 ? void 0 : counterpartyChainInfo.chainId,
                        denomTrace,
                        originChainId: originChainInfo.chainId,
                    });
                }
            }
        }
        if (originChainInfo && denomTrace) {
            if (denomTrace.denom.split(/^(cw20):(\w+)$/).length === 4) {
                // If the origin currency is ics20-cw20.
                let cw20Currency = originChainInfo.currencies.find((cur) => denomTrace && cur.coinMinimalDenom.startsWith(denomTrace.denom));
                if (!cw20Currency && this.cosmwasmQueriesStore) {
                    const cosmwasmQuries = this.cosmwasmQueriesStore.get(originChainInfo.chainId);
                    const contractAddress = denomTrace.denom.replace("cw20:", "");
                    const contractInfo = cosmwasmQuries.cosmwasm.querycw20ContractInfo.getQueryContract(contractAddress);
                    if (contractInfo.response) {
                        cw20Currency = {
                            type: "cw20",
                            contractAddress,
                            coinDecimals: contractInfo.response.data.decimals,
                            coinDenom: contractInfo.response.data.symbol,
                            coinMinimalDenom: `cw20:${contractAddress}:${contractInfo.response.data.name}`,
                        };
                        originChainInfo.addCurrencies(cw20Currency);
                    }
                }
                if (cw20Currency) {
                    return [
                        {
                            coinDecimals: cw20Currency.coinDecimals,
                            coinGeckoId: cw20Currency.coinGeckoId,
                            coinImageUrl: cw20Currency.coinImageUrl,
                            coinMinimalDenom: denomHelper.denom,
                            coinDenom: this.coinDenomGenerator(denomTrace, originChainInfo, counterpartyChainInfo, cw20Currency),
                            paths: denomTrace.paths,
                            originChainId: originChainInfo.chainId,
                            originCurrency: cw20Currency,
                        },
                        true,
                    ];
                }
            }
            else {
                const currency = originChainInfo.findCurrency(denomTrace.denom);
                if (currency && !("paths" in currency)) {
                    return [
                        {
                            coinDecimals: currency.coinDecimals,
                            coinGeckoId: currency.coinGeckoId,
                            coinImageUrl: currency.coinImageUrl,
                            coinMinimalDenom: denomHelper.denom,
                            coinDenom: this.coinDenomGenerator(denomTrace, originChainInfo, counterpartyChainInfo, currency),
                            paths: denomTrace.paths,
                            originChainId: originChainInfo.chainId,
                            originCurrency: currency,
                        },
                        true,
                    ];
                }
            }
            // In this case, just show the raw currency.
            // But, it is possible to know the currency from query later.
            // So, let them to be observed.
            return [
                {
                    coinDecimals: 0,
                    coinMinimalDenom: denomHelper.denom,
                    coinDenom: this.coinDenomGenerator(denomTrace, originChainInfo, counterpartyChainInfo, undefined),
                    paths: denomTrace.paths,
                    originChainId: undefined,
                    originCurrency: undefined,
                },
                false,
            ];
        }
        return [undefined, false];
    }
}
__decorate([
    mobx_1.observable
], IBCCurrencyRegsitrarInner.prototype, "isInitialized", void 0);
__decorate([
    mobx_1.observable
], IBCCurrencyRegsitrarInner.prototype, "isInitializing", void 0);
__decorate([
    mobx_1.observable.shallow
], IBCCurrencyRegsitrarInner.prototype, "cacheDenomTracePaths", void 0);
__decorate([
    mobx_1.flow
], IBCCurrencyRegsitrarInner.prototype, "restoreCache", null);
__decorate([
    mobx_1.flow
], IBCCurrencyRegsitrarInner.prototype, "setCacheIBCDenomData", null);
exports.IBCCurrencyRegsitrarInner = IBCCurrencyRegsitrarInner;
/**
 * IBCCurrencyRegsitrar gets the native balances that exist on the chain itself (ex. atom, scrt...)
 * And, IBCCurrencyRegsitrar registers the currencies from IBC to the chain info.
 * In cosmos-sdk, the denomination of IBC token has the form of "ibc/{hash}".
 * And, its paths can be found by getting the denom trace from the node.
 * If the native balance querier's response have the token that is form of IBC token,
 * this will try to get the denom info by traversing the paths, and register the currency with the decimal and denom info.
 * But, if failed to traverse the paths, this will register the currency with 0 decimal and the minimal denom even though it is not suitable for human.
 */
class IBCCurrencyRegsitrar {
    constructor(kvStore, cacheDuration = 24 * 3600 * 1000, // 1 days
    chainStore, accountStore, queriesStore, cosmwasmQueriesStore, coinDenomGenerator = IBCCurrencyRegsitrar.defaultCoinDenomGenerator) {
        this.kvStore = kvStore;
        this.cacheDuration = cacheDuration;
        this.chainStore = chainStore;
        this.accountStore = accountStore;
        this.queriesStore = queriesStore;
        this.cosmwasmQueriesStore = cosmwasmQueriesStore;
        this.coinDenomGenerator = coinDenomGenerator;
        this.map = new Map();
        this.chainStore.addSetChainInfoHandler((chainInfoInner) => this.setChainInfoHandler(chainInfoInner));
    }
    static defaultCoinDenomGenerator(denomTrace, _, counterpartyChainInfo, originCurrency) {
        if (originCurrency) {
            return `${originCurrency.coinDenom} (${counterpartyChainInfo ? counterpartyChainInfo.chainName : "Unknown"}/${denomTrace.paths[0].channelId})`;
        }
        else {
            return `${denomTrace.denom} (${counterpartyChainInfo ? counterpartyChainInfo.chainName : "Unknown"}/${denomTrace.paths[0].channelId})`;
        }
    }
    setChainInfoHandler(chainInfoInner) {
        const inner = this.get(chainInfoInner);
        chainInfoInner.registerCurrencyRegistrar((coinMinimalDenom) => inner.registerUnknownCurrencies(coinMinimalDenom));
    }
    get(chainInfoInner) {
        if (!this.map.has(chainInfoInner.chainId)) {
            mobx_1.runInAction(() => {
                this.map.set(chainInfoInner.chainId, new IBCCurrencyRegsitrarInner(this.kvStore, this.cacheDuration, chainInfoInner, this.chainStore, this.accountStore, this.queriesStore, this.cosmwasmQueriesStore, this.coinDenomGenerator));
            });
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.map.get(chainInfoInner.chainId);
    }
}
__decorate([
    mobx_1.observable.shallow
], IBCCurrencyRegsitrar.prototype, "map", void 0);
exports.IBCCurrencyRegsitrar = IBCCurrencyRegsitrar;
//# sourceMappingURL=currency-registrar.js.map

/***/ }),

/***/ 1504:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.KeplrETCQueriesImpl = exports.KeplrETCQueries = void 0;
const erc20_1 = __webpack_require__(1257);
const axelar_1 = __webpack_require__(1258);
exports.KeplrETCQueries = {
    use(options) {
        return (queriesSetBase, kvStore, chainId, chainGetter) => {
            return {
                keplrETC: new KeplrETCQueriesImpl(queriesSetBase, kvStore, chainId, chainGetter, options.ethereumURL),
            };
        };
    },
};
class KeplrETCQueriesImpl {
    constructor(_base, kvStore, chainId, chainGetter, ethereumURL) {
        this.queryERC20Metadata = new erc20_1.ObservableQueryERC20Metadata(kvStore, ethereumURL);
        this.queryEVMTokenInfo = new axelar_1.ObservableQueryEVMTokenInfo(kvStore, chainId, chainGetter);
    }
}
exports.KeplrETCQueriesImpl = KeplrETCQueriesImpl;
//# sourceMappingURL=queries.js.map

/***/ }),

/***/ 1505:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryERC20Metadata = exports.ObservableQueryERC20MetadataInner = exports.ObservableQueryERC20MetadataDecimals = exports.ObservableQueryERC20MetadataSymbol = exports.ObservableQueryERC20MetadataName = void 0;
const stores_1 = __webpack_require__(43);
const axios_1 = __importDefault(__webpack_require__(60));
const abi_1 = __webpack_require__(1313);
const mobx_1 = __webpack_require__(5);
const erc20MetadataInterface = new abi_1.Interface([
    {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [
            {
                name: "",
                type: "string",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "symbol",
        outputs: [
            {
                name: "",
                type: "string",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [
            {
                name: "",
                type: "uint8",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
]);
class ObservableQueryERC20MetadataName extends stores_1.ObservableJsonRPCQuery {
    constructor(kvStore, ethereumURL, contractAddress) {
        const instance = axios_1.default.create(Object.assign({
            baseURL: ethereumURL,
        }));
        super(kvStore, instance, "", "eth_call", [
            {
                to: contractAddress,
                data: erc20MetadataInterface.encodeFunctionData("name"),
            },
            "latest",
        ]);
        mobx_1.makeObservable(this);
    }
    get name() {
        if (!this.response) {
            return undefined;
        }
        try {
            return erc20MetadataInterface.decodeFunctionResult("name", this.response.data)[0];
        }
        catch (e) {
            console.log(e);
        }
        return undefined;
    }
}
__decorate([
    mobx_1.computed
], ObservableQueryERC20MetadataName.prototype, "name", null);
exports.ObservableQueryERC20MetadataName = ObservableQueryERC20MetadataName;
class ObservableQueryERC20MetadataSymbol extends stores_1.ObservableJsonRPCQuery {
    constructor(kvStore, ethereumURL, contractAddress) {
        const instance = axios_1.default.create(Object.assign({
            baseURL: ethereumURL,
        }));
        super(kvStore, instance, "", "eth_call", [
            {
                to: contractAddress,
                data: erc20MetadataInterface.encodeFunctionData("symbol"),
            },
            "latest",
        ]);
        mobx_1.makeObservable(this);
    }
    get symbol() {
        if (!this.response) {
            return undefined;
        }
        try {
            return erc20MetadataInterface.decodeFunctionResult("symbol", this.response.data)[0];
        }
        catch (e) {
            console.log(e);
        }
        return undefined;
    }
}
__decorate([
    mobx_1.computed
], ObservableQueryERC20MetadataSymbol.prototype, "symbol", null);
exports.ObservableQueryERC20MetadataSymbol = ObservableQueryERC20MetadataSymbol;
class ObservableQueryERC20MetadataDecimals extends stores_1.ObservableJsonRPCQuery {
    constructor(kvStore, ethereumURL, contractAddress) {
        const instance = axios_1.default.create(Object.assign({
            baseURL: ethereumURL,
        }));
        super(kvStore, instance, "", "eth_call", [
            {
                to: contractAddress,
                data: erc20MetadataInterface.encodeFunctionData("decimals"),
            },
            "latest",
        ]);
        mobx_1.makeObservable(this);
    }
    get decimals() {
        if (!this.response) {
            return undefined;
        }
        try {
            return erc20MetadataInterface.decodeFunctionResult("decimals", this.response.data)[0];
        }
        catch (e) {
            console.log(e);
        }
        return undefined;
    }
}
__decorate([
    mobx_1.computed
], ObservableQueryERC20MetadataDecimals.prototype, "decimals", null);
exports.ObservableQueryERC20MetadataDecimals = ObservableQueryERC20MetadataDecimals;
class ObservableQueryERC20MetadataInner {
    constructor(kvStore, ethereumURL, contractAddress) {
        this._queryName = new ObservableQueryERC20MetadataName(kvStore, ethereumURL, contractAddress);
        this._querySymbol = new ObservableQueryERC20MetadataSymbol(kvStore, ethereumURL, contractAddress);
        this._queryDecimals = new ObservableQueryERC20MetadataDecimals(kvStore, ethereumURL, contractAddress);
    }
    get queryName() {
        return this._queryName;
    }
    get querySymbol() {
        return this._querySymbol;
    }
    get symbol() {
        return this._querySymbol.symbol;
    }
    get name() {
        return this._queryName.name;
    }
    get decimals() {
        return this._queryDecimals.decimals;
    }
}
exports.ObservableQueryERC20MetadataInner = ObservableQueryERC20MetadataInner;
/**
 * Query ERC20 metadata (https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#IERC20Metadata)
 * This is on temporal stage to implement currency registrar for gravity bridge and axelar network.
 * It is not possible to handle multiple networks on Ethereum at the same time.
 */
class ObservableQueryERC20Metadata extends stores_1.HasMapStore {
    constructor(kvStore, ethereumURL) {
        super((contractAddress) => {
            return new ObservableQueryERC20MetadataInner(this.kvStore, this.ethereumURL, contractAddress);
        });
        this.kvStore = kvStore;
        this.ethereumURL = ethereumURL;
    }
    get(contractAddress) {
        return super.get(contractAddress);
    }
}
exports.ObservableQueryERC20Metadata = ObservableQueryERC20Metadata;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1506:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxelarEVMBridgeCurrencyRegistrar = exports.AxelarEVMBridgeCurrencyRegistrarInner = void 0;
const mobx_1 = __webpack_require__(5);
class AxelarEVMBridgeCurrencyRegistrarInner {
    constructor(kvStore, chainInfoInner, chainStore, queriesStore, mainChain) {
        this.kvStore = kvStore;
        this.chainInfoInner = chainInfoInner;
        this.chainStore = chainStore;
        this.queriesStore = queriesStore;
        this.mainChain = mainChain;
    }
    registerUnknownCurrencies(coinMinimalDenom) {
        const chainInfo = this.chainStore.getChain(this.chainInfoInner.chainId);
        if (!chainInfo.features ||
            !chainInfo.features.includes("axelar-evm-bridge")) {
            return;
        }
        const queries = this.queriesStore.get(this.chainInfoInner.chainId);
        const tokenInfo = queries.keplrETC.queryEVMTokenInfo.getAsset(this.mainChain, coinMinimalDenom);
        if (tokenInfo.symbol &&
            tokenInfo.decimals != null &&
            tokenInfo.isConfirmed) {
            return [
                {
                    coinMinimalDenom,
                    coinDenom: tokenInfo.symbol,
                    coinDecimals: tokenInfo.decimals,
                },
                !tokenInfo.isFetching,
            ];
        }
        // There is no matching response after query completes,
        // there is no way to get the asset info.
        if (!tokenInfo.isFetching) {
            return;
        }
        return [undefined, false];
    }
}
exports.AxelarEVMBridgeCurrencyRegistrarInner = AxelarEVMBridgeCurrencyRegistrarInner;
class AxelarEVMBridgeCurrencyRegistrar {
    constructor(kvStore, chainStore, queriesStore, mainChain) {
        this.kvStore = kvStore;
        this.chainStore = chainStore;
        this.queriesStore = queriesStore;
        this.mainChain = mainChain;
        this.map = new Map();
        this.chainStore.addSetChainInfoHandler((chainInfoInner) => this.setChainInfoHandler(chainInfoInner));
    }
    setChainInfoHandler(chainInfoInner) {
        const inner = this.get(chainInfoInner);
        chainInfoInner.registerCurrencyRegistrar((coinMinimalDenom) => inner.registerUnknownCurrencies(coinMinimalDenom));
    }
    get(chainInfoInner) {
        if (!this.map.has(chainInfoInner.chainId)) {
            mobx_1.runInAction(() => {
                this.map.set(chainInfoInner.chainId, new AxelarEVMBridgeCurrencyRegistrarInner(this.kvStore, chainInfoInner, this.chainStore, this.queriesStore, this.mainChain));
            });
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.map.get(chainInfoInner.chainId);
    }
}
__decorate([
    mobx_1.observable.shallow
], AxelarEVMBridgeCurrencyRegistrar.prototype, "map", void 0);
exports.AxelarEVMBridgeCurrencyRegistrar = AxelarEVMBridgeCurrencyRegistrar;
//# sourceMappingURL=currency-registrar.js.map

/***/ }),

/***/ 1507:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryEVMTokenInfo = exports.ObservableQueryEVMTokenInfoInner = void 0;
const stores_1 = __webpack_require__(43);
class ObservableQueryEVMTokenInfoInner extends stores_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter, _chain, _denom) {
        super(kvStore, chainId, chainGetter, `/axelar/evm/v1beta1/token_info/${_chain}?asset=${_denom}`);
        this._chain = _chain;
        this._denom = _denom;
    }
    get chain() {
        return this._chain;
    }
    get denom() {
        return this._denom;
    }
    get tokenName() {
        var _a;
        return (_a = this.response) === null || _a === void 0 ? void 0 : _a.data.details.token_name;
    }
    get symbol() {
        var _a;
        return (_a = this.response) === null || _a === void 0 ? void 0 : _a.data.details.symbol;
    }
    get decimals() {
        var _a;
        return (_a = this.response) === null || _a === void 0 ? void 0 : _a.data.details.decimals;
    }
    get isConfirmed() {
        var _a;
        return (_a = this.response) === null || _a === void 0 ? void 0 : _a.data.confirmed;
    }
    get isExternal() {
        var _a;
        return (_a = this.response) === null || _a === void 0 ? void 0 : _a.data.is_external;
    }
}
exports.ObservableQueryEVMTokenInfoInner = ObservableQueryEVMTokenInfoInner;
class ObservableQueryEVMTokenInfo extends stores_1.ObservableChainQueryMap {
    constructor(kvStore, chainId, chainGetter) {
        super(kvStore, chainId, chainGetter, (key) => {
            const i = key.indexOf("/");
            const chain = key.slice(0, i);
            const denom = key.slice(i + 1);
            return new ObservableQueryEVMTokenInfoInner(this.kvStore, this.chainId, this.chainGetter, chain, denom);
        });
        this.kvStore = kvStore;
        this.chainId = chainId;
        this.chainGetter = chainGetter;
    }
    getAsset(chain, denom) {
        return this.get(`${chain}/${denom}`);
    }
}
exports.ObservableQueryEVMTokenInfo = ObservableQueryEVMTokenInfo;
//# sourceMappingURL=token-info.js.map

/***/ }),

/***/ 1508:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(1509), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1509:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GravityBridgeCurrencyRegsitrar = exports.GravityBridgeCurrencyRegsitrarInner = void 0;
const mobx_1 = __webpack_require__(5);
const common_1 = __webpack_require__(27);
class GravityBridgeCurrencyRegsitrarInner {
    constructor(kvStore, chainInfoInner, chainStore, queriesStore) {
        this.kvStore = kvStore;
        this.chainInfoInner = chainInfoInner;
        this.chainStore = chainStore;
        this.queriesStore = queriesStore;
    }
    registerUnknownCurrencies(coinMinimalDenom) {
        const denomHelper = new common_1.DenomHelper(coinMinimalDenom);
        if (denomHelper.type !== "native" ||
            !denomHelper.denom.startsWith("gravity0x")) {
            return;
        }
        const queries = this.queriesStore.get(this.chainInfoInner.chainId);
        const contractAddress = denomHelper.denom.replace("gravity", "");
        const erc20Metadata = queries.keplrETC.queryERC20Metadata.get(contractAddress);
        if (erc20Metadata.symbol && erc20Metadata.decimals != null) {
            return [
                {
                    coinMinimalDenom: denomHelper.denom,
                    coinDenom: erc20Metadata.symbol,
                    coinDecimals: erc20Metadata.decimals,
                },
                true,
            ];
        }
        return [undefined, false];
    }
}
exports.GravityBridgeCurrencyRegsitrarInner = GravityBridgeCurrencyRegsitrarInner;
class GravityBridgeCurrencyRegsitrar {
    constructor(kvStore, chainStore, queriesStore) {
        this.kvStore = kvStore;
        this.chainStore = chainStore;
        this.queriesStore = queriesStore;
        this.map = new Map();
        this.chainStore.addSetChainInfoHandler((chainInfoInner) => this.setChainInfoHandler(chainInfoInner));
    }
    setChainInfoHandler(chainInfoInner) {
        const inner = this.get(chainInfoInner);
        chainInfoInner.registerCurrencyRegistrar((coinMinimalDenom) => inner.registerUnknownCurrencies(coinMinimalDenom));
    }
    get(chainInfoInner) {
        if (!this.map.has(chainInfoInner.chainId)) {
            mobx_1.runInAction(() => {
                this.map.set(chainInfoInner.chainId, new GravityBridgeCurrencyRegsitrarInner(this.kvStore, chainInfoInner, this.chainStore, this.queriesStore));
            });
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.map.get(chainInfoInner.chainId);
    }
}
__decorate([
    mobx_1.observable.shallow
], GravityBridgeCurrencyRegsitrar.prototype, "map", void 0);
exports.GravityBridgeCurrencyRegsitrar = GravityBridgeCurrencyRegsitrar;
//# sourceMappingURL=currency-registrar.js.map

/***/ }),

/***/ 183:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRegistry = void 0;
class MessageRegistry {
    constructor() {
        this.registeredMsgType = new Map();
    }
    registerMessage(msgCls) {
        if (this.registeredMsgType.has(msgCls.type())) {
            throw new Error(`Already registered type ${msgCls.type()}`);
        }
        this.registeredMsgType.set(msgCls.type(), msgCls);
    }
    parseMessage(message) {
        if (!message.type) {
            throw new Error("Null type");
        }
        const msgCls = this.registeredMsgType.get(message.type);
        if (!msgCls) {
            throw new Error(`Unregistered msg type ${message.type}`);
        }
        return Object.setPrototypeOf(message.msg, msgCls.prototype);
    }
}
exports.MessageRegistry = MessageRegistry;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 184:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONUint8Array = void 0;
// The JSON encoder that supports the `Uint8Array`.
const hex_1 = __webpack_require__(326);
class JSONUint8Array {
    static parse(text) {
        return JSON.parse(text, (key, value) => {
            // Prevent potential prototype poisoning.
            if (key === "__proto__") {
                throw new Error("__proto__ is disallowed");
            }
            if (value &&
                typeof value === "string" &&
                value.startsWith("__uint8array__")) {
                return hex_1.fromHex(value.replace("__uint8array__", ""));
            }
            return value;
        });
    }
    static stringify(obj) {
        return JSON.stringify(obj, (key, value) => {
            // Prevent potential prototype poisoning.
            if (key === "__proto__") {
                throw new Error("__proto__ is disallowed");
            }
            if (value &&
                (value instanceof Uint8Array ||
                    (typeof value === "object" &&
                        "type" in value &&
                        "data" in value &&
                        value.type === "Buffer" &&
                        Array.isArray(value.data)))) {
                const array = value instanceof Uint8Array ? value : new Uint8Array(value.data);
                return `__uint8array__${hex_1.toHex(array)}`;
            }
            return value;
        });
    }
    static wrap(obj) {
        if (obj === undefined)
            return undefined;
        return JSON.parse(JSONUint8Array.stringify(obj));
    }
    static unwrap(obj) {
        if (obj === undefined)
            return undefined;
        return JSONUint8Array.parse(JSON.stringify(obj));
    }
}
exports.JSONUint8Array = JSONUint8Array;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 188:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeplrExtensionRouterId = void 0;
/**
 * getKeplrExtensionRouterId returns the `window.keplrExtensionRouterId`.
 * If the `window.keplrExtensionRouterId` is not initialized, it will be initialized and returned.
 */
function getKeplrExtensionRouterId() {
    const globalWindow = typeof window !== "undefined" ? window : chrome;
    if (globalWindow.keplrExtensionRouterId == null) {
        globalWindow.keplrExtensionRouterId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    }
    return globalWindow.keplrExtensionRouterId;
}
exports.getKeplrExtensionRouterId = getKeplrExtensionRouterId;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 267:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(583), exports);
__exportStar(__webpack_require__(584), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(325), exports);
__exportStar(__webpack_require__(327), exports);
__exportStar(__webpack_require__(328), exports);
__exportStar(__webpack_require__(329), exports);
__exportStar(__webpack_require__(330), exports);
__exportStar(__webpack_require__(331), exports);
__exportStar(__webpack_require__(332), exports);
__exportStar(__webpack_require__(183), exports);
__exportStar(__webpack_require__(184), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 325:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const encoding_1 = __webpack_require__(183);
const json_uint8_array_1 = __webpack_require__(184);
class Router {
    constructor(envProducer) {
        this.envProducer = envProducer;
        this.msgRegistry = new encoding_1.MessageRegistry();
        this.registeredHandler = new Map();
        this.guards = [];
        this.port = "";
    }
    registerMessage(msgCls) {
        this.msgRegistry.registerMessage(msgCls);
    }
    addHandler(route, handler) {
        if (this.registeredHandler.has(route)) {
            throw new Error(`Already registered type ${route}`);
        }
        this.registeredHandler.set(route, handler);
    }
    addGuard(guard) {
        this.guards.push(guard);
    }
    handleMessage(message, sender) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const msg = this.msgRegistry.parseMessage(json_uint8_array_1.JSONUint8Array.unwrap(message));
            const env = this.envProducer(sender, (_a = msg.routerMeta) !== null && _a !== void 0 ? _a : {});
            for (const guard of this.guards) {
                yield guard(env, msg, sender);
            }
            // Can happen throw
            msg.validateBasic();
            const route = msg.route();
            if (!route) {
                throw new Error("Null router");
            }
            const handler = this.registeredHandler.get(route);
            if (!handler) {
                throw new Error("Can't get handler");
            }
            return json_uint8_array_1.JSONUint8Array.wrap(yield handler(env, msg));
        });
    }
}
exports.Router = Router;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 326:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
  Belows are from @cosmjs/encoding library.
  To reduce the bundle size of provider, put them directly here.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromHex = exports.toHex = void 0;
function toHex(data) {
    let out = "";
    for (const byte of data) {
        out += ("0" + byte.toString(16)).slice(-2);
    }
    return out;
}
exports.toHex = toHex;
function fromHex(hexstring) {
    if (hexstring.length % 2 !== 0) {
        throw new Error("hex string length must be a multiple of 2");
    }
    const listOfInts = [];
    for (let i = 0; i < hexstring.length; i += 2) {
        const hexByteAsString = hexstring.substr(i, 2);
        if (!hexByteAsString.match(/[0-9a-f]{2}/i)) {
            throw new Error("hex string contains invalid characters");
        }
        listOfInts.push(parseInt(hexByteAsString, 16));
    }
    return new Uint8Array(listOfInts);
}
exports.fromHex = fromHex;
//# sourceMappingURL=hex.js.map

/***/ }),

/***/ 327:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=handler.js.map

/***/ }),

/***/ 328:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=interfaces.js.map

/***/ }),

/***/ 329:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 330:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.KeplrError = void 0;
class KeplrError extends Error {
    constructor(module, code, message) {
        super(message);
        this.module = module;
        this.code = code;
        Object.setPrototypeOf(this, KeplrError.prototype);
    }
}
exports.KeplrError = KeplrError;
//# sourceMappingURL=error.js.map

/***/ }),

/***/ 331:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
/**
 * This messaging system is influenced by cosmos-sdk.
 * The messages are processed in the following order:
 * "deserialize message -> approve external -> validate basic -> handler by routing".
 * This deserializing system has weak polymorphism feature.
 * Message would be converted to object according to their class and registered type.
 * But, nested class is not supported. Non primitivie types or array that includes non primitive types in message's fields
 * can't be decoded to their type properly. In this case, user should set thier prototype manually.
 */
class Message {
    /**
     * Ask for approval if message is sent externally.
     */
    approveExternal(_env, _sender) {
        return false;
    }
}
exports.Message = Message;
//# sourceMappingURL=message.js.map

/***/ }),

/***/ 332:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.WEBPAGE_PORT = exports.APP_PORT = exports.BACKGROUND_PORT = void 0;
exports.BACKGROUND_PORT = "background";
exports.APP_PORT = "popup";
exports.WEBPAGE_PORT = "webpage";
//# sourceMappingURL=constant.js.map

/***/ }),

/***/ 43:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(1412), exports);
__exportStar(__webpack_require__(119), exports);
__exportStar(__webpack_require__(1427), exports);
__exportStar(__webpack_require__(1428), exports);
__exportStar(__webpack_require__(1482), exports);
__exportStar(__webpack_require__(1483), exports);
__exportStar(__webpack_require__(1494), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 509:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableQueryBalances = exports.ObservableQueryBalancesInner = exports.ObservableQueryBalanceInner = void 0;
const chain_query_1 = __webpack_require__(59);
const common_1 = __webpack_require__(27);
const mobx_1 = __webpack_require__(5);
const unit_1 = __webpack_require__(26);
const common_2 = __webpack_require__(119);
const mobx_utils_1 = __webpack_require__(201);
class ObservableQueryBalanceInner extends chain_query_1.ObservableChainQuery {
    constructor(kvStore, chainId, chainGetter, url, denomHelper) {
        super(kvStore, chainId, chainGetter, url);
        this.denomHelper = denomHelper;
        mobx_1.makeObservable(this);
    }
    get currency() {
        const denom = this.denomHelper.denom;
        const chainInfo = this.chainGetter.getChain(this.chainId);
        const currency = chainInfo.findCurrency(denom);
        // TODO: Infer the currency according to its denom (such if denom is `uatom` -> `Atom` with decimal 6)?
        if (!currency) {
            throw new Error(`Unknown currency: ${denom}`);
        }
        return currency;
    }
}
__decorate([
    mobx_1.computed
], ObservableQueryBalanceInner.prototype, "currency", null);
exports.ObservableQueryBalanceInner = ObservableQueryBalanceInner;
class ObservableQueryBalancesInner {
    constructor(kvStore, chainId, chainGetter, balanceRegistries, bech32Address) {
        this.kvStore = kvStore;
        this.chainId = chainId;
        this.chainGetter = chainGetter;
        this.balanceRegistries = balanceRegistries;
        this.balanceMap = new Map();
        this.getBalanceFromCurrency = mobx_utils_1.computedFn((currency) => {
            const bal = this.balances.find((bal) => bal.currency.coinMinimalDenom === currency.coinMinimalDenom);
            if (bal) {
                return bal.balance;
            }
            return new unit_1.CoinPretty(currency, new unit_1.Int(0));
        });
        mobx_1.makeObservable(this);
        this.bech32Address = bech32Address;
    }
    fetch() {
        this.balanceMap.forEach((bal) => bal.fetch());
    }
    getBalanceInner(currency) {
        let key = currency.coinMinimalDenom;
        // If the currency is secret20, it will be different according to not only the minimal denom but also the viewing key of the currency.
        if ("type" in currency && currency.type === "secret20") {
            key = currency.coinMinimalDenom + "/" + currency.viewingKey;
        }
        if (!this.balanceMap.has(key)) {
            mobx_1.runInAction(() => {
                let balanceInner;
                for (const registry of this.balanceRegistries) {
                    balanceInner = registry.getBalanceInner(this.chainId, this.chainGetter, this.bech32Address, currency.coinMinimalDenom);
                    if (balanceInner) {
                        break;
                    }
                }
                if (balanceInner) {
                    this.balanceMap.set(key, balanceInner);
                }
                else {
                    throw new Error(`Failed to get and parse the balance for ${key}`);
                }
            });
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.balanceMap.get(key);
    }
    get stakable() {
        const chainInfo = this.chainGetter.getChain(this.chainId);
        return this.getBalanceInner(chainInfo.stakeCurrency);
    }
    /**
     * 알려진 모든 Currency들의 balance를 반환환다.
     */
    get balances() {
        const chainInfo = this.chainGetter.getChain(this.chainId);
        const result = [];
        for (let i = 0; i < chainInfo.currencies.length; i++) {
            const currency = chainInfo.currencies[i];
            result.push(this.getBalanceInner(currency));
        }
        return result;
    }
    /**
     * 알려진 모든 Currency들 중 0 이상의 잔고를 가진 balance를 반환환다.
     */
    get positiveBalances() {
        const balances = this.balances;
        return balances.filter((bal) => bal.balance.toDec().gt(new unit_1.Dec(0)));
    }
    /**
     * Returns that the balances that are not native tokens.
     * Native token means that the token that exists on the `bank` module.
     */
    get nonNativeBalances() {
        const balances = this.balances;
        return balances.filter((bal) => new common_1.DenomHelper(bal.currency.coinMinimalDenom).type !== "native");
    }
    /**
     * Returns that the balances that are native tokens with greater than 0 balance.
     * Native token means that the token that exists on the `bank` module.
     */
    get positiveNativeUnstakables() {
        const chainInfo = this.chainGetter.getChain(this.chainId);
        const balances = this.balances;
        return balances.filter((bal) => new common_1.DenomHelper(bal.currency.coinMinimalDenom).type === "native" &&
            bal.balance.toDec().gt(new unit_1.Dec(0)) &&
            bal.currency.coinMinimalDenom !==
                chainInfo.stakeCurrency.coinMinimalDenom);
    }
    get unstakables() {
        const chainInfo = this.chainGetter.getChain(this.chainId);
        const currencies = chainInfo.currencies.filter((cur) => cur.coinMinimalDenom !== chainInfo.stakeCurrency.coinMinimalDenom);
        const result = [];
        for (let i = 0; i < currencies.length; i++) {
            const currency = currencies[i];
            result.push(this.getBalanceInner(currency));
        }
        return result;
    }
}
__decorate([
    mobx_1.observable.shallow
], ObservableQueryBalancesInner.prototype, "balanceMap", void 0);
__decorate([
    mobx_1.computed
], ObservableQueryBalancesInner.prototype, "stakable", null);
__decorate([
    mobx_1.computed
], ObservableQueryBalancesInner.prototype, "balances", null);
__decorate([
    mobx_1.computed
], ObservableQueryBalancesInner.prototype, "positiveBalances", null);
__decorate([
    mobx_1.computed
], ObservableQueryBalancesInner.prototype, "nonNativeBalances", null);
__decorate([
    mobx_1.computed
], ObservableQueryBalancesInner.prototype, "positiveNativeUnstakables", null);
__decorate([
    mobx_1.computed
], ObservableQueryBalancesInner.prototype, "unstakables", null);
exports.ObservableQueryBalancesInner = ObservableQueryBalancesInner;
class ObservableQueryBalances extends common_2.HasMapStore {
    constructor(kvStore, chainId, chainGetter) {
        super((bech32Address) => {
            return new ObservableQueryBalancesInner(this.kvStore, this.chainId, this.chainGetter, this.balanceRegistries, bech32Address);
        });
        this.kvStore = kvStore;
        this.chainId = chainId;
        this.chainGetter = chainGetter;
        this.balanceRegistries = [];
    }
    addBalanceRegistry(registry) {
        this.balanceRegistries.push(registry);
    }
    getQueryBech32Address(bech32Address) {
        return this.get(bech32Address);
    }
}
exports.ObservableQueryBalances = ObservableQueryBalances;
//# sourceMappingURL=balances.js.map

/***/ }),

/***/ 56:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(581), exports);
__exportStar(__webpack_require__(267), exports);
__exportStar(__webpack_require__(585), exports);
__exportStar(__webpack_require__(588), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 581:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(582), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 582:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionRouter = void 0;
const router_1 = __webpack_require__(3);
const utils_1 = __webpack_require__(188);
class ExtensionRouter extends router_1.Router {
    constructor(envProducer) {
        super(envProducer);
        // You shouldn't set this handler as async funtion,
        // because mozila's extension polyfill deals with the message handler as resolved if it returns the `Promise`.
        // So, if this handler is async function, it always return the `Promise` if it returns `undefined` and it is dealt with as resolved.
        this.onMessage = (message, sender) => {
            var _a, _b;
            if (message.port !== this.port) {
                return;
            }
            // The receiverRouterId will be set when requesting an interaction from the background to the frontend.
            // If this value exists, it compares this value with the current router id and processes them only if they are the same.
            if (((_b = (_a = message.msg) === null || _a === void 0 ? void 0 : _a.routerMeta) === null || _b === void 0 ? void 0 : _b.receiverRouterId) &&
                message.msg.routerMeta.receiverRouterId !== utils_1.getKeplrExtensionRouterId()) {
                return;
            }
            return this.onMessageHandler(message, sender);
        };
    }
    listen(port) {
        if (!port) {
            throw new Error("Empty port");
        }
        this.port = port;
        browser.runtime.onMessage.addListener(this.onMessage);
        // Although security considerations cross-extension communication are in place,
        // we have put in additional security measures by disbling extension-to-extension communication until a formal security audit has taken place.
        /*
        if (browser.runtime.onMessageExternal) {
          browser.runtime.onMessageExternal.addListener(this.onMessage);
        }
         */
    }
    unlisten() {
        this.port = "";
        browser.runtime.onMessage.removeListener(this.onMessage);
        // Although security considerations cross-extension communication are in place,
        // we have put in additional security measures by disbling extension-to-extension communication until a formal security audit has taken place.
        /*
        if (browser.runtime.onMessageExternal) {
          browser.runtime.onMessageExternal.removeListener(this.onMessage);
        }
         */
    }
    onMessageHandler(message, sender) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.handleMessage(message, sender);
                return {
                    return: result,
                };
            }
            catch (e) {
                console.log(`Failed to process msg ${message.type}: ${(e === null || e === void 0 ? void 0 : e.message) || (e === null || e === void 0 ? void 0 : e.toString())}`);
                if (e instanceof router_1.KeplrError) {
                    return Promise.resolve({
                        error: {
                            code: e.code,
                            module: e.module,
                            message: e.message || e.toString(),
                        },
                    });
                }
                else if (e) {
                    return Promise.resolve({
                        error: e.message || e.toString(),
                    });
                }
                else {
                    return Promise.resolve({
                        error: "Unknown error, and error is null",
                    });
                }
            }
        });
    }
}
exports.ExtensionRouter = ExtensionRouter;
//# sourceMappingURL=extension.js.map

/***/ }),

/***/ 583:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InExtensionMessageRequester = void 0;
const router_1 = __webpack_require__(3);
const utils_1 = __webpack_require__(188);
class InExtensionMessageRequester {
    sendMessage(port, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            msg.validateBasic();
            // Set message's origin.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            msg["origin"] =
                typeof window !== "undefined"
                    ? window.location.origin
                    : `chrome-extension://${browser.runtime.id}`;
            msg.routerMeta = Object.assign(Object.assign({}, msg.routerMeta), { routerId: utils_1.getKeplrExtensionRouterId() });
            const result = router_1.JSONUint8Array.unwrap(yield new Promise((resolve) => {
                chrome.runtime.sendMessage({
                    port,
                    type: msg.type(),
                    msg: router_1.JSONUint8Array.wrap(msg),
                }, (result) => {
                    resolve(result);
                });
            }));
            if (!result) {
                throw new Error("Null result");
            }
            if (result.error) {
                if (typeof result.error === "string") {
                    throw new Error(result.error);
                }
                else {
                    throw new router_1.KeplrError(result.error.module, result.error.code, result.error.message);
                }
            }
            return result.return;
        });
    }
    static sendMessageToTab(tabId, port, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            msg.validateBasic();
            // Set message's origin.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            msg["origin"] =
                typeof window !== "undefined"
                    ? window.location.origin
                    : `chrome-extension://${browser.runtime.id}`;
            console.log(msg["origin"], "sendMessageToTab");
            msg.routerMeta = Object.assign(Object.assign({}, msg.routerMeta), { routerId: utils_1.getKeplrExtensionRouterId() });
            const result = router_1.JSONUint8Array.unwrap(yield new Promise((resolve) => {
                chrome.tabs.sendMessage(tabId, {
                    port,
                    type: msg.type(),
                    msg: router_1.JSONUint8Array.wrap(msg),
                }, (result) => {
                    console.log(result, "sendMessageToTab-result>>>>>>");
                    resolve(result);
                });
            }));
            if (!result) {
                throw new Error("Null result");
            }
            if (result.error) {
                if (typeof result.error === "string") {
                    throw new Error(result.error);
                }
                else {
                    throw new router_1.KeplrError(result.error.module, result.error.code, result.error.message);
                }
            }
            return result.return;
        });
    }
}
exports.InExtensionMessageRequester = InExtensionMessageRequester;
//# sourceMappingURL=extension.js.map

/***/ }),

/***/ 584:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentScriptMessageRequester = void 0;
const router_1 = __webpack_require__(3);
const utils_1 = __webpack_require__(188);
// The message requester to send the message to the content scripts.
// This will send message to the tab with the content script.
// And, this can't handle the result of the message sending.
// TODO: Research to improve this requester.
class ContentScriptMessageRequester {
    sendMessage(port, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            msg.validateBasic();
            // Set message's origin.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            msg["origin"] =
                typeof window !== "undefined"
                    ? window.location.origin
                    : `chrome-extension://${browser.runtime.id}`;
            msg.routerMeta = Object.assign(Object.assign({}, msg.routerMeta), { routerId: utils_1.getKeplrExtensionRouterId() });
            const wrappedMsg = router_1.JSONUint8Array.wrap(msg);
            const alltabs = yield browser.tabs.query({
                discarded: false,
                status: "complete",
            });
            const tabs = alltabs.filter((tab) => {
                if (tab.url) {
                    return ((tab.url.indexOf(browser.runtime.id) > -1 &&
                        tab.url.indexOf("interaction=true&interactionInternal=false") >
                            -1) ||
                        tab.url.indexOf("mises.site") > -1 ||
                        tab.url.indexOf("localhost") > -1);
                }
            });
            for (let i = 0; i < tabs.length; i++) {
                const tabId = tabs[i].id;
                if (tabId) {
                    try {
                        console.log(tabId);
                        chrome.tabs.sendMessage(tabId, {
                            port,
                            type: msg.type(),
                            msg: wrappedMsg,
                        }, (result) => {
                            console.log(result, "browser.tabs.sendMessage: success");
                        });
                        console.log(tabId, "browser.tabs.sendMessage");
                        // Ignore the failure
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            }
            // This requester can't handle the result of the message.
            return undefined;
        });
    }
}
exports.ContentScriptMessageRequester = ContentScriptMessageRequester;
//# sourceMappingURL=content-script.js.map

/***/ }),

/***/ 585:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(586), exports);
__exportStar(__webpack_require__(587), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 586:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionGuards = void 0;
class ExtensionGuards {
}
exports.ExtensionGuards = ExtensionGuards;
ExtensionGuards.checkOriginIsValid = (_, msg, sender) => {
    // TODO: When is a url undefined?
    if (!sender.url) {
        throw new Error("url is empty");
    }
    if (!msg.origin) {
        throw new Error("origin is empty");
    }
    const url = new URL(sender.url);
    if (url.origin !== msg.origin) {
        throw new Error("Invalid origin");
    }
    return Promise.resolve();
};
ExtensionGuards.checkMessageIsInternal = (env, msg, sender) => {
    if (!env.isInternalMsg && !msg.approveExternal(env, sender)) {
        throw new Error("Permission rejected");
    }
    return Promise.resolve();
};
//# sourceMappingURL=extension.js.map

/***/ }),

/***/ 587:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentScriptGuards = void 0;
class ContentScriptGuards {
}
exports.ContentScriptGuards = ContentScriptGuards;
// Router in content script will reject all messages that can be sent from the external.
ContentScriptGuards.checkMessageIsInternal = (env, msg, sender) => {
    if (!env.isInternalMsg || msg.approveExternal(env, sender)) {
        throw new Error("Content script can't handle the message that is able to be sent from external");
    }
    return Promise.resolve();
};
//# sourceMappingURL=content-script.js.map

/***/ }),

/***/ 588:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(589), exports);
__exportStar(__webpack_require__(590), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 589:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionEnv = void 0;
const router_1 = __webpack_require__(3);
const popup_1 = __webpack_require__(46);
const requester_1 = __webpack_require__(267);
class PromiseQueue {
    constructor() {
        this.workingOnPromise = false;
        this.queue = [];
    }
    enqueue(fn) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                fn,
                resolve,
                reject,
            });
            this.dequeue();
        });
    }
    dequeue() {
        if (this.workingOnPromise) {
            return;
        }
        const item = this.queue.shift();
        if (!item) {
            return;
        }
        this.workingOnPromise = true;
        item
            .fn()
            .then((result) => {
            item.resolve(result);
        })
            .catch((e) => {
            item.reject(e);
        })
            .finally(() => {
            this.workingOnPromise = false;
            this.dequeue();
        });
    }
}
const openPopupQueue = new PromiseQueue();
// To handle the opening popup more easily,
// just open the popup one by one.
function openPopupWindow(url, channel = "default") {
    return __awaiter(this, void 0, void 0, function* () {
        return yield openPopupQueue.enqueue(() => {
            return popup_1.isMobileStatus()
                ? popup_1.openPopupTab(url, channel)
                : popup_1.openPopupWindow(url, channel);
        });
    });
}
class ExtensionEnv {
}
exports.ExtensionEnv = ExtensionEnv;
ExtensionEnv.produceEnv = (sender, routerMeta) => {
    const isInternalMsg = ExtensionEnv.checkIsInternalMessage(sender, browser.runtime.id, browser.runtime.getURL("/"));
    // Add additional query string for letting the extension know it is for interaction.
    const queryString = `interaction=true&interactionInternal=${isInternalMsg}`;
    const openAndSendMsg = (url, msg, options) => __awaiter(void 0, void 0, void 0, function* () {
        if (url.startsWith("/")) {
            url = url.slice(1);
        }
        url = browser.runtime.getURL("/popup.html#/" + url);
        url += `${url.includes("?") ? "&" : "?"}${queryString}`;
        let tabId;
        const windowId = yield openPopupWindow(url, options === null || options === void 0 ? void 0 : options.channel);
        if (!popup_1.isMobileStatus()) {
            const window = yield browser.windows.get(windowId, {
                populate: true,
            });
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            tabId = window.tabs[0].id;
        }
        else {
            tabId = windowId;
        }
        // Wait until that tab is loaded
        yield (() => __awaiter(void 0, void 0, void 0, function* () {
            const tab = yield browser.tabs.get(tabId);
            if (tab.status === "complete") {
                console.log("openAndSendMsg-complete");
                return;
            }
            return new Promise((resolve) => {
                browser.tabs.onUpdated.addListener((_tabId, changeInfo) => {
                    if (tabId === _tabId && changeInfo.status === "complete") {
                        console.log("openAndSendMsg");
                        resolve();
                    }
                });
            });
        }))();
        return yield requester_1.InExtensionMessageRequester.sendMessageToTab(tabId, router_1.APP_PORT, msg);
    });
    if (!isInternalMsg) {
        // If msg is from external (probably from webpage), it opens the popup for extension and send the msg back to the tab opened.
        return {
            isInternalMsg,
            requestInteraction: openAndSendMsg,
        };
    }
    else {
        // If msg is from the extension itself, it can send the msg back to the extension itself.
        // In this case, this expects that there is only one extension popup have been opened.
        const requestInteraction = (url, msg, options) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (options === null || options === void 0 ? void 0 : options.forceOpenWindow) {
                return yield openAndSendMsg(url, msg, options);
            }
            if (url.startsWith("/")) {
                url = url.slice(1);
            }
            url = browser.runtime.getURL("/popup.html#/" + url);
            if (url.includes("?")) {
                url += "&" + queryString;
            }
            else {
                url += "?" + queryString;
            }
            if ((_a = sender.tab) === null || _a === void 0 ? void 0 : _a.id) {
                let tabs = yield browser.tabs.query({
                    discarded: false,
                    status: "complete",
                });
                tabs = tabs.filter((val) => val.url && val.url.indexOf(browser.runtime.id) > -1);
                if (tabs.length > 0) {
                    for (const tab of tabs) {
                        if (tab.id) {
                            browser.tabs.update(tab.id, {
                                url,
                            });
                        }
                    }
                }
            }
            // const backgroundPage = await browser.runtime.getBackgroundPage();
            // const views = browser.extension
            //   .getViews({
            //     // Request only for the same tab as the requested frontend.
            //     // But the browser popup itself has no information about tab.
            //     // Also, if user has multiple windows on, we need another way to distinguish them.
            //     // See the comment right below this part.
            //     tabId: sender.tab?.id,
            //   })
            //   .filter((window) => {
            //     // You need to request interaction with the frontend that requested the message.
            //     // It is difficult to achieve this with the browser api alone.
            //     // Check the router id under the window of each view
            //     // and process only the view that has the same router id of the requested frontend.
            //     return (
            //       window.location.href !== backgroundPage.location.href &&
            //       (routerMeta.routerId == null ||
            //         routerMeta.routerId === window.keplrExtensionRouterId)
            //     );
            //   });
            // if (views.length > 0) {
            //   for (const view of views) {
            //     view.location.href = url;
            //   }
            // }
            msg.routerMeta = Object.assign(Object.assign({}, msg.routerMeta), { receiverRouterId: routerMeta.routerId });
            return yield new requester_1.InExtensionMessageRequester().sendMessage(router_1.APP_PORT, msg);
        });
        return {
            isInternalMsg,
            requestInteraction,
        };
    }
};
ExtensionEnv.checkIsInternalMessage = (sender, extensionId, extensionUrl) => {
    if (!sender.url) {
        throw new Error("Empty sender url");
    }
    const url = new URL(sender.url);
    if (!url.origin || url.origin === "null") {
        throw new Error("Invalid sender url");
    }
    const browserURL = new URL(extensionUrl);
    if (!browserURL.origin || browserURL.origin === "null") {
        throw new Error("Invalid browser url");
    }
    if (url.origin !== browserURL.origin) {
        return false;
    }
    return sender.id === extensionId;
};
//# sourceMappingURL=extension.js.map

/***/ }),

/***/ 59:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableChainQueryMap = exports.ObservableChainQuery = void 0;
const common_1 = __webpack_require__(119);
const axios_1 = __importDefault(__webpack_require__(60));
const mobx_1 = __webpack_require__(5);
const common_2 = __webpack_require__(119);
class ObservableChainQuery extends common_1.ObservableQuery {
    constructor(kvStore, chainId, chainGetter, url) {
        const chainInfo = chainGetter.getChain(chainId);
        const instance = axios_1.default.create(Object.assign({
            baseURL: chainInfo.rest,
        }, chainInfo.restConfig));
        super(kvStore, instance, url);
        this._chainId = chainId;
        this.chainGetter = chainGetter;
        this.fetchConfig = {
            retry: 3,
            retryDelay: 1000,
        };
    }
    get instance() {
        const chainInfo = this.chainGetter.getChain(this.chainId);
        return axios_1.default.create(Object.assign({
            baseURL: chainInfo.rest,
        }, chainInfo.restConfig));
    }
    get chainId() {
        return this._chainId;
    }
}
__decorate([
    mobx_1.override
], ObservableChainQuery.prototype, "instance", null);
exports.ObservableChainQuery = ObservableChainQuery;
class ObservableChainQueryMap extends common_2.HasMapStore {
    constructor(kvStore, chainId, chainGetter, creater) {
        super(creater);
        this.kvStore = kvStore;
        this.chainId = chainId;
        this.chainGetter = chainGetter;
    }
}
exports.ObservableChainQueryMap = ObservableChainQueryMap;
//# sourceMappingURL=chain-query.js.map

/***/ }),

/***/ 590:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentScriptEnv = void 0;
// ContentScriptEnv only checks the id is same as the extension id.
// And, doesn't support the request interaction.
class ContentScriptEnv {
}
exports.ContentScriptEnv = ContentScriptEnv;
ContentScriptEnv.produceEnv = (sender) => {
    const isInternalMsg = sender.id === browser.runtime.id;
    return {
        isInternalMsg,
        requestInteraction: () => {
            throw new Error("ContentScriptEnv doesn't support `requestInteraction`");
        },
    };
};
//# sourceMappingURL=content-script.js.map

/***/ }),

/***/ 628:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.txEventsWithPreOnFulfill = void 0;
function txEventsWithPreOnFulfill(onTxEvents, preOnTxEvents) {
    const onBroadcasted = onTxEvents
        ? typeof onTxEvents === "function"
            ? undefined
            : onTxEvents.onBroadcasted
        : undefined;
    const onFulfill = onTxEvents
        ? typeof onTxEvents === "function"
            ? onTxEvents
            : onTxEvents.onFulfill
        : undefined;
    const onPreBroadcasted = preOnTxEvents
        ? typeof preOnTxEvents === "function"
            ? undefined
            : preOnTxEvents.onBroadcasted
        : undefined;
    const onPreFulfill = preOnTxEvents
        ? typeof preOnTxEvents === "function"
            ? preOnTxEvents
            : preOnTxEvents.onFulfill
        : undefined;
    if (!onBroadcasted && !onFulfill && !onPreBroadcasted && !onPreFulfill) {
        return undefined;
    }
    return {
        onBroadcasted: onBroadcasted || onPreBroadcasted
            ? (txHash) => {
                if (onPreBroadcasted) {
                    onPreBroadcasted(txHash);
                }
                if (onBroadcasted) {
                    onBroadcasted(txHash);
                }
            }
            : undefined,
        onFulfill: onFulfill || onPreFulfill
            ? (tx) => {
                if (onPreFulfill) {
                    onPreFulfill(tx);
                }
                if (onFulfill) {
                    onFulfill(tx);
                }
            }
            : undefined,
    };
}
exports.txEventsWithPreOnFulfill = txEventsWithPreOnFulfill;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 638:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(1504), exports);
__exportStar(__webpack_require__(1257), exports);
__exportStar(__webpack_require__(1508), exports);
__exportStar(__webpack_require__(1258), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 862:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountSetBaseSuper = exports.AccountSetBase = exports.WalletStatus = void 0;
const mobx_1 = __webpack_require__(5);
const common_1 = __webpack_require__(27);
const cosmos_1 = __webpack_require__(16);
var WalletStatus;
(function (WalletStatus) {
    WalletStatus["NotInit"] = "NotInit";
    WalletStatus["Loading"] = "Loading";
    WalletStatus["Loaded"] = "Loaded";
    WalletStatus["NotExist"] = "NotExist";
    WalletStatus["Rejected"] = "Rejected";
})(WalletStatus = exports.WalletStatus || (exports.WalletStatus = {}));
class AccountSetBase {
    constructor(eventListener, chainGetter, chainId, opts) {
        this.eventListener = eventListener;
        this.chainGetter = chainGetter;
        this.chainId = chainId;
        this.opts = opts;
        this._walletVersion = undefined;
        this._walletStatus = WalletStatus.NotInit;
        this._rejectionReason = undefined;
        this._name = "";
        this._bech32Address = "";
        this._isNanoLedger = false;
        this._txTypeInProgress = "";
        this._txNotification = "";
        this.hasInited = false;
        this.sendTokenFns = [];
        this.makeSendTokenTxFns = [];
        this.handleInit = () => this.init();
        mobx_1.makeObservable(this);
        this._pubKey = new Uint8Array();
        if (opts.autoInit) {
            this.init();
        }
    }
    getKeplr() {
        return this.opts.getKeplr();
    }
    registerSendTokenFn(fn) {
        this.sendTokenFns.push(fn);
    }
    registerMakeSendTokenFn(fn) {
        this.makeSendTokenTxFns.push(fn);
    }
    enable(keplr, chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chainInfo = this.chainGetter.getChain(chainId);
            if (this.opts.suggestChain) {
                if (this.opts.suggestChainFn) {
                    yield this.opts.suggestChainFn(keplr, chainInfo);
                }
                else {
                    yield this.suggestChain(keplr, chainInfo);
                }
            }
            yield keplr.enable(chainId);
        });
    }
    suggestChain(keplr, chainInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            yield keplr.experimentalSuggestChain(chainInfo.raw);
        });
    }
    *init() {
        // If wallet status is not exist, there is no need to try to init because it always fails.
        if (this.walletStatus === WalletStatus.NotExist) {
            return;
        }
        // If the store has never been initialized, add the event listener.
        if (!this.hasInited) {
            // If key store in the keplr extension is changed, this event will be dispatched.
            this.eventListener.addEventListener("mises_keystorechange", this.handleInit);
        }
        this.hasInited = true;
        // Set wallet status as loading whenever try to init.
        this._walletStatus = WalletStatus.Loading;
        const keplr = yield* common_1.toGenerator(this.getKeplr());
        if (!keplr) {
            this._walletStatus = WalletStatus.NotExist;
            return;
        }
        this._walletVersion = keplr.version;
        try {
            yield this.enable(keplr, this.chainId);
        }
        catch (e) {
            console.log(e, "extension init error: enable");
            this._walletStatus = WalletStatus.Rejected;
            this._rejectionReason = e;
            return;
        }
        try {
            const key = yield* common_1.toGenerator(keplr.getKey(this.chainId));
            this._bech32Address = key.bech32Address;
            this._isNanoLedger = key.isNanoLedger;
            this._name = key.name;
            this._pubKey = key.pubKey;
            // Set the wallet status as loaded after getting all necessary infos.
            this._walletStatus = WalletStatus.Loaded;
        }
        catch (e) {
            console.log(e, "extension init error: getKey");
            console.log(e);
            // Caught error loading key
            // Reset properties, and set status to Rejected
            this._bech32Address = "";
            this._isNanoLedger = false;
            this._name = "";
            this._pubKey = new Uint8Array(0);
            this._walletStatus = WalletStatus.Rejected;
            this._rejectionReason = e;
        }
        if (this._walletStatus !== WalletStatus.Rejected) {
            // Reset previous rejection error message
            this._rejectionReason = undefined;
        }
    }
    disconnect() {
        this._walletStatus = WalletStatus.NotInit;
        this.hasInited = false;
        this.eventListener.removeEventListener("mises_keystorechange", this.handleInit);
        this._bech32Address = "";
        this._isNanoLedger = false;
        this._name = "";
        this._pubKey = new Uint8Array(0);
        this._rejectionReason = undefined;
    }
    get walletVersion() {
        return this._walletVersion;
    }
    get isReadyToSendTx() {
        return (this.walletStatus === WalletStatus.Loaded && this.bech32Address !== "");
    }
    /**
     * @deprecated Use `isReadyToSendTx`
     */
    get isReadyToSendMsgs() {
        return (this.walletStatus === WalletStatus.Loaded && this.bech32Address !== "");
    }
    makeSendTokenTx(amount, currency, recipient) {
        for (let i = 0; i < this.makeSendTokenTxFns.length; i++) {
            const fn = this.makeSendTokenTxFns[i];
            const res = fn(amount, currency, recipient);
            if (res) {
                return res;
            }
        }
        const denomHelper = new common_1.DenomHelper(currency.coinMinimalDenom);
        throw new Error(`Unsupported type of currency (${denomHelper.type})`);
    }
    sendToken(amount, currency, recipient, memo = "", stdFee = {}, signOptions, onTxEvents) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < this.sendTokenFns.length; i++) {
                const fn = this.sendTokenFns[i];
                if (yield fn(amount, currency, recipient, memo, stdFee, signOptions, onTxEvents)) {
                    return;
                }
            }
            const denomHelper = new common_1.DenomHelper(currency.coinMinimalDenom);
            throw new Error(`Unsupported type of currency (${denomHelper.type})`);
        });
    }
    get walletStatus() {
        return this._walletStatus;
    }
    get rejectionReason() {
        return this._rejectionReason;
    }
    get name() {
        return this._name;
    }
    get bech32Address() {
        return this._bech32Address;
    }
    get pubKey() {
        return this._pubKey.slice();
    }
    get isNanoLedger() {
        return this._isNanoLedger;
    }
    /**
     * Returns the tx type in progress waiting to be committed.
     * If there is no tx type in progress, this returns an empty string ("").
     */
    get txTypeInProgress() {
        return this._txTypeInProgress;
    }
    get txNotification() {
        return this._txNotification;
    }
    /**
     * @deprecated Use `txTypeInProgress`
     */
    get isSendingMsg() {
        return this.txTypeInProgress;
    }
    get hasEthereumHexAddress() {
        var _a, _b;
        return ((_b = (_a = this.chainGetter
            .getChain(this.chainId)
            .features) === null || _a === void 0 ? void 0 : _a.includes("eth-address-gen")) !== null && _b !== void 0 ? _b : false);
    }
    get ethereumHexAddress() {
        if (this.bech32Address === "") {
            return "";
        }
        return cosmos_1.Bech32Address.fromBech32(this.bech32Address, this.chainGetter.getChain(this.chainId).bech32Config.bech32PrefixAccAddr).toHex(true);
    }
}
__decorate([
    mobx_1.observable
], AccountSetBase.prototype, "_walletVersion", void 0);
__decorate([
    mobx_1.observable
], AccountSetBase.prototype, "_walletStatus", void 0);
__decorate([
    mobx_1.observable.ref
], AccountSetBase.prototype, "_rejectionReason", void 0);
__decorate([
    mobx_1.observable
], AccountSetBase.prototype, "_name", void 0);
__decorate([
    mobx_1.observable
], AccountSetBase.prototype, "_bech32Address", void 0);
__decorate([
    mobx_1.observable
], AccountSetBase.prototype, "_isNanoLedger", void 0);
__decorate([
    mobx_1.observable
], AccountSetBase.prototype, "_txTypeInProgress", void 0);
__decorate([
    mobx_1.observable
], AccountSetBase.prototype, "_txNotification", void 0);
__decorate([
    mobx_1.flow
], AccountSetBase.prototype, "init", null);
__decorate([
    mobx_1.action
], AccountSetBase.prototype, "disconnect", null);
__decorate([
    mobx_1.computed
], AccountSetBase.prototype, "isReadyToSendTx", null);
__decorate([
    mobx_1.computed
], AccountSetBase.prototype, "isReadyToSendMsgs", null);
__decorate([
    mobx_1.computed
], AccountSetBase.prototype, "ethereumHexAddress", null);
exports.AccountSetBase = AccountSetBase;
class AccountSetBaseSuper extends AccountSetBase {
    constructor(...params) {
        super(...params);
        mobx_1.makeObservable(this);
    }
    setTxTypeInProgress(type) {
        this._txTypeInProgress = type;
    }
    setTxNotification(type) {
        this._txNotification = type;
    }
}
__decorate([
    mobx_1.action
], AccountSetBaseSuper.prototype, "setTxTypeInProgress", null);
__decorate([
    mobx_1.action
], AccountSetBaseSuper.prototype, "setTxNotification", null);
exports.AccountSetBaseSuper = AccountSetBaseSuper;
//# sourceMappingURL=base.js.map

/***/ }),

/***/ 863:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.BondStatus = void 0;
var BondStatus;
(function (BondStatus) {
    BondStatus["Unbonded"] = "Unbonded";
    BondStatus["Unbonding"] = "Unbonding";
    BondStatus["Bonded"] = "Bonded";
    BondStatus["Unspecified"] = "Unspecified";
})(BondStatus = exports.BondStatus || (exports.BondStatus = {}));
//# sourceMappingURL=types.js.map

/***/ })

}]);