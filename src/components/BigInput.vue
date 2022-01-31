<template>
  <div class="row m-0 p-0">
    <div class="col-12 p-0 m-0">
      <b-input-group>
        <b-form-input
          @input="input"
          @change="change"
          @keydown.up="up"
          @keydown.down="down"
          min="0"
          v-model="raw"
          placeholder="Enter amount"
          type="text"
        ></b-form-input>
        <b-input-group-append>
          <b-button variant="success" @click.prevent="maxout">Max</b-button>
        </b-input-group-append>
      </b-input-group>
    </div>
  </div>
</template>

<script>
import Big from "big.js";
import BN from 'bn.js'
export default {
  props: {
    denomination: {
      type: Number,
      default: 18,
    },
    max: {
      type: [BN, null],
    },
    min: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      raw: "0",
      value: null,
    };
  },
  created() {
    this.value = new Big(0);
  },
  computed: {
    stepSize() {
      return Math.pow(10, -this.denomination);
    },
    bigMax() {
      if (this.max) {
        // this.max is a BN in satoshis
        let satoshi = Big(this.max);
        let divider = Big(10).pow(this.denomination);
        return satoshi.div(divider);
      }
      return null;
    },
    bigMin() {
      if (typeof this.min != "undefined") {
        return Big(this.min);
      }
      return null;
    },
  },
  mounted() {
    this.cleanInput();
  },

  methods: {
    // Emit in BN as satoshis!
    emit() {
      let tens = Big(10).pow(this.denomination);
      let satoshis = this.value.times(tens);
      let bn = new BN(satoshis.toFixed(0));
      this.$emit("change", bn);
    },
    change(ev) {
      console.log(ev);
      this.cleanInput();
    },
    input(ev) {
      console.log(ev)
      let data = ev.data;

      if (data !== null) {
        let num = parseInt(data);
        if (isNaN(num)) {
          this.cleanInput();
        }
      }
    },
    cleanInput() {
      let rawnum;
      // console.log('Raw:',this.raw);
      try {
        if (this.raw === "") this.raw = 0;
        rawnum = new Big(this.raw);
      } catch (err) {
        rawnum = this.value;
      }

      if (this.bigMax != null) {
        if (rawnum.gt(this.bigMax)) {
          rawnum = this.bigMax;
        } else if (rawnum.lt(this.bigMin)) {
          rawnum = this.bigMin;
        }
      }
      this.value = rawnum;
      this.raw = rawnum.toFixed(this.denomination);
      this.emit();
    },
    maxout() {
      if (this.bigMax) {
        this.value = this.bigMax;
        this.valueToRaw();
      }
    },
    up(ev) {
      console.log(ev);
      this.value = this.value.plus(this.stepSize);
      this.valueToRaw();
    },
    valueToRaw() {
      let val = this.value;
      if (this.bigMax != null) {
        if (val.gt(this.bigMax)) {
          val = this.bigMax;
          this.value = val;
        } else if (val.lt(this.bigMin)) {
          val = this.bigMin;
          this.value = val;
        }
      }
      this.raw = val.toFixed(this.denomination);
      this.emit();
    },
    down(ev) {
      console.log(ev);
      this.value = this.value.minus(this.stepSize);
      this.valueToRaw();
    },
  },
};
</script>

<style>
</style>