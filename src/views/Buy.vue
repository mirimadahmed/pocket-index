<template>
  <div class="m-0 p-0">
    <b-jumbotron
      header="AVAX Crypto Index"
      lead="Quickly invest in top 10 crypto projects in AVAX ecosystem."
      class="bg-light p-5 m-0"
    >
      <p>Management Fee: 0.1% - Performance Fee: 0.1%</p>
    </b-jumbotron>
    <div class="row p-3 m-0">
      <div class="col-md-3 p-3">
        <div class="bg-light p-3">
          <h5>Batch Buying (e.USDT) - {{ balance }}</h5>
          <BigInput
            :max="maxBalance"
            placeholder="0.00"
            @change="amount_in_b"
          />
          <b-button
            block
            class="mt-3"
            variant="success"
            v-if="balance > approval"
            @click="approve"
            >Approve</b-button
          >
          <b-button block class="mt-3" variant="success" @click="buy"
            >Buy</b-button
          >
        </div>
      </div>
      <div class="col-md-3 p-3">
        <div class="bg-light p-3">
          <h5>Forfeitable Balance</h5>
          <p>(e.USDT) - {{ withdrawableUSDTBalance }}</p>
          <BigInput :max="indexUSDTBalance" @change="amount_in_c" />
          <b-button block class="mt-3" variant="success" @click="withdraw"
            >Forfeit</b-button
          >
        </div>
      </div>
      <div class="col-md-3 p-3">
        <div class="bg-light p-3">
          <h5>LP Balance</h5>
          <p>(Index LP) - {{ lpbalance }}</p>
          <BigInput :max="maxlpBalance" @change="amount_in_a" />
          <b-button
            block
            class="mt-3"
            variant="success"
            v-if="lpbalance > lpapproval"
            @click="lpApprove"
            >Approve</b-button
          >
          <b-button
            block
            class="mt-3"
            variant="success"
            @click="sellAndWithdraw"
            >Sell and Withdraw</b-button
          >
        </div>
      </div>
      <div class="col-md-3 p-3">
        <div class="bg-light p-3">
          <h5>Disolve Index Position Directly</h5>
          <b-button block class="mt-3" variant="success" @click="disolve"
            >Disolve My Position</b-button
          >
        </div>
      </div>
      <div class="col-md-6 p-3">
        <div class="bg-light p-3">
          <h5>ADMIN</h5>
          <b-button block class="mt-3" variant="success" @click="bulkBuy"
            >Bulk Buy</b-button
          >
        </div>
      </div>
      <div class="col-md-6 p-3">
        <div class="bg-light p-3">
          <h5>ADMIN</h5>
          <b-button block class="mt-3" variant="success" @click="bulkApprove"
            >Approve All Before Disolving</b-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BigInput from "@/components/BigInput.vue";
import BN from "bn.js";
import contractAbi from "@/abi.js";
import indexAbi from "@/cabi.js";
import lpAbi from "@/lpabi.js";
const USDT_ADDRESS = "0x08a978a0399465621e667C49CD54CC874DC064Eb";
const LP_ADDRESS = "0xE745a72DF0AD6F8496c418e24cdee95819F5356b";
const CONTRACT_ADDRESS = "0x3182239686581a07407ad59eAA06c87342B26532";
export default {
  name: "Buy",
  components: {
    BigInput,
  },
  data() {
    return {
      maxBalance: new BN(1000),
      indexUSDTBalance: new BN(1000),
      maxlpBalance: new BN(1000),
      amountA: 0,
      amountB: 0,
      amountC: 0,
      balance: null,
      approval: null,
      withdrawableUSDTBalance: null,
      lpbalance: null,
      lpapproval: null,
    };
  },
  methods: {
    sellAndWithdraw() {
      const value = Number(this.amountA).toString();
      const approveOptions = {
        contractAddress: CONTRACT_ADDRESS,
        functionName: "disolveWithLP",
        params: {
          amount: value,
        },
        abi: indexAbi,
      };
      this.callFunction(approveOptions).then((res) => {
        console.log(res);
      });
    },
    disolve() {
      const balanceOptions = {
        contractAddress: CONTRACT_ADDRESS,
        functionName: "disolvePosition",
        abi: indexAbi,
      };
      this.callFunction(balanceOptions).then((res) => {
        console.log(res);
      });
    },
    lpBalance() {
      const options = {
        contractAddress: LP_ADDRESS,
        functionName: "balanceOf",
        params: {
          account: this.$moralis.User.current().get("ethAddress"),
        },
        abi: lpAbi,
      };
      this.callFunction(options).then((res) => {
        this.lpbalance = this.$web3.utils.fromWei(res);
        this.maxlpBalance = new BN(res);
      });
      const optionsApproval = {
        contractAddress: LP_ADDRESS,
        functionName: "allowance",
        params: {
          owner: this.$moralis.User.current().get("ethAddress"),
          spender: CONTRACT_ADDRESS,
        },
        abi: lpAbi,
      };
      this.callFunction(optionsApproval).then((res) => {
        this.lpapproval = this.$web3.utils.fromWei(res);
      });
    },
    indexBalance() {
      const balanceOptions = {
        contractAddress: CONTRACT_ADDRESS,
        functionName: "getUSDTBalance",
        params: {
          user: this.$moralis.User.current().get("ethAddress"),
        },
        abi: indexAbi,
      };
      this.callFunction(balanceOptions).then((res) => {
        this.withdrawableUSDTBalance = this.$web3.utils.fromWei(res);
        this.indexUSDTBalance = new BN(res);
      });
    },
    bulkApprove() {
      const approveOptions = {
        contractAddress: CONTRACT_ADDRESS,
        functionName: "approveEverything",
        abi: indexAbi,
      };
      this.callFunction(approveOptions).then((res) => {
        console.log(res);
      });
    },
    bulkBuy() {
      const withdrawOptions = {
        contractAddress: CONTRACT_ADDRESS,
        functionName: "bulkBuy",
        abi: indexAbi,
      };
      this.callFunction(withdrawOptions).then((res) => {
        console.log(res);
      });
    },
    withdraw() {
      const value = Number(this.amountC).toString();
      console.log(value);
      const withdrawOptions = {
        contractAddress: CONTRACT_ADDRESS,
        functionName: "withdrawUSDTBalance",
        params: {
          user: this.$moralis.User.current().get("ethAddress"),
          amount: value,
        },
        abi: indexAbi,
      };
      this.callFunction(withdrawOptions).then((res) => {
        console.log(res);
      });
    },
    buy() {
      const value = Number(this.amountB).toString();
      console.log(value);
      const approveOptions = {
        contractAddress: CONTRACT_ADDRESS,
        functionName: "pitchAmount",
        params: {
          amount: value,
        },
        abi: indexAbi,
      };
      console.log(approveOptions);
      this.callFunction(approveOptions).then((res) => {
        console.log(res);
      });
    },
    lpApprove() {
      const value = Number(this.amountA).toString();
      const approveOptions = {
        contractAddress: LP_ADDRESS,
        functionName: "approve",
        params: {
          spender: CONTRACT_ADDRESS,
          amount: value,
        },
        abi: lpAbi,
      };
      this.callFunction(approveOptions).then((res) => {
        console.log(res);
      });
    },
    approve() {
      const value = Number(this.amountB).toString();
      const approveOptions = {
        contractAddress: USDT_ADDRESS,
        functionName: "approve",
        params: {
          _spender: CONTRACT_ADDRESS,
          _value: value,
        },
        abi: contractAbi,
      };
      this.callFunction(approveOptions).then((res) => {
        console.log(res);
      });
    },
    amount_in_a(val) {
      this.amountA = val;
    },
    amount_in_b(val) {
      this.amountB = val;
    },
    amount_in_c(val) {
      this.amountC = val;
    },
    getBalance() {
      const options = {
        contractAddress: USDT_ADDRESS,
        functionName: "balanceOf",
        params: {
          _owner: this.$moralis.User.current().get("ethAddress"),
        },
        abi: contractAbi,
      };
      this.callFunction(options).then((res) => {
        this.balance = this.$web3.utils.fromWei(res);
        this.maxBalance = new BN(res);
      });
      const optionsApproval = {
        contractAddress: USDT_ADDRESS,
        functionName: "allowance",
        params: {
          _owner: this.$moralis.User.current().get("ethAddress"),
          _spender: CONTRACT_ADDRESS,
        },
        abi: contractAbi,
      };
      this.callFunction(optionsApproval).then((res) => {
        this.approval = this.$web3.utils.fromWei(res);
        console.log(this.approval);
      });
    },
    callFunction(params) {
      const options = {
        ...params,
      };
      return this.$moralis.executeFunction(options);
    },
  },
  created() {
    this.$moralis.enableWeb3().then(() => {
      this.getBalance();
      this.indexBalance();
      this.lpBalance();
    });
  },
};
</script>
