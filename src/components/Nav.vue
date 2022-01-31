<template>
  <div>
    <b-navbar toggleable="lg" type="light" variant="warning">
      <b-navbar-brand to="/" class="ms-3">Pocket Index</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ms-auto me-3">
          <b-nav-item to="/">Home</b-nav-item>
          <b-nav-item to="/buy">Buy</b-nav-item>
          <b-nav-item to="/stake">Stake</b-nav-item>
          <b-nav-item to="/borrow">Borrow</b-nav-item>
          <b-button variant="success" pill @click="walletClick">
            <span v-if="user"> Logout </span>
            <span v-if="!user"> Connect Wallet </span>
          </b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: "Nav",
  data() {
    return {
      chainId: null,
    };
  },
  computed: {
    supportedNetwork() {
      return ["avalanche testnet", "0xa869", 43113].includes(this.chainId);
    },
    user() {
      return this.$moralis.User.current();
    },
  },
  methods: {
    walletClick() {
      if (this.user) {
        this.$moralis.User.logOut();
        return;
      }
      this.$moralis.authenticate({ signingMessage: "Log in to Pocket Index" });
    },
  },
  created() {
    this.$moralis.isMetaMaskInstalled().then((isInstalled) => {
      if (!isInstalled) {
        alert("Please install MetaMask");
      } else {
        if (this.$moralis.ensureWeb3IsInstalled()) {
          this.$moralis.getChainId().then((chainId) => {
            this.chainId = chainId;
            console.log(this.chainId)
          });
        } else {
          this.$moralis.enable();
        }
      }
    });
  },
};
</script>