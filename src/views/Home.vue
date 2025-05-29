<template>
  <div class="m-0 p-0">
    <b-jumbotron
      header="Mode Crypto Index"
      lead="Quickly invest in top 10 crypto projects in Mode ecosystem."
      class="bg-light p-5 m-0"
    >
      <p>Management Fee: 0.1% - Performance Fee: 0.1%</p>
    </b-jumbotron>
    <div class="row p-3 m-0">
      <div class="col-md-4 p-3">
        <div class="bg-light p-3">
          <h5>Buy Now (High gas fee)</h5>
          <p>Buy top 10 crypto projects on Mode ecosystem with one click.</p>
          <BigInput
            :max="max"
            placeholder="0.00"
            @change="amount_in_a"
          />
          <b-button
            block
            class="mt-3"
            variant="success"
            :disabled="amountA <= 0"
            >Buy</b-button
          >
        </div>
      </div>
      <div class="col-md-4 p-3">
        <div class="bg-light p-3">
          <h5>Batch Buying (Lower gas fee)</h5>
          <p>Last buy - 2 hrs ago</p>
          <p>Next buy in approximately 2 hrs</p>
          <BigInput
            :max="max"
            placeholder="0.00"
            @change="amount_in_b"
          />
          <b-button
            block
            class="mt-3"
            variant="success"
            :disabled="amountB <= 0"
            >Buy</b-button
          >
        </div>
      </div>
      <div class="col-md-4 p-3">
        <div class="bg-light p-3">
          <h5>Balance</h5>
          <p>Total Investment: $400</p>
          <p>Current Value: $623</p>
          <BigInput
            :max="max"
            @change="amount_in_c"
          />
          <b-button
            block
            class="mt-3"
            variant="success"
            :disabled="amountC <= 0"
            >Withdraw</b-button
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
const USDT_ADDRESS = "0x08a978a0399465621e667C49CD54CC874DC064Eb";
export default {
  name: "Home",
  components: {
    BigInput,
  },
  methods: {
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
        functionName: "balanceOf",
        params: {
          address: this.$moralis.ethAddress,
        },
      };
      this.callFunction(options).then((res) => {
        console.log(res);
      });
    },
    callFunction(params) {
      const options = {
        contractAddress: USDT_ADDRESS,
        abi: contractAbi,
        ...params,
      };
      return this.$moralis.executeFunction(options);
    },
  },
  data() {
    return {
      max: new BN(1000),
      amountA: 0,
      amountB: 0,
      amountC: 0,
    };
  },
  mounted() {
    // this.getBalance();
  },
};
</script>
