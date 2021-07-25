Vue.component('GatewayCard', {
    props: ['gateway'],
    methods: {
        closeGateway() {
            this.$emit('gateway-closed');
        }
    },
    template: `
        <section class="card">
            <header class="card-header d-flex justify-content-between">
                <h2 class="h5 mb-0">{{gateway.name}}'s Properties</h2>
                <button @click="closeGateway" class="btn btn-sm btn-danger py-0">×</button>
            </header>
            <slot></slot>
        </section>
    `
});

