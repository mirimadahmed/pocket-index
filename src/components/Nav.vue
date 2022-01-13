<template>
  <div>
    <b-navbar toggleable="lg" type="light" variant="warning">
      <b-navbar-brand to="/" class="ms-3">Pocket Index</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ms-auto me-3">
          <b-nav-item to="/buy">Buy</b-nav-item>
          <b-nav-item to="/stake">Stake</b-nav-item>
          <b-nav-item to="/borrow">Borrow</b-nav-item>
          <b-button variant="success" pill>Connect Wallet</b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: "Nav",
};
</script>