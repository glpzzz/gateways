const baseUrl = 'http://localhost';

Vue.component('GatewayListItem', {
    props: ['gateway'],
    methods: {
        async showGateway(gateway) {
            // this.isLoading = true;
            try {
                const response = await fetch(baseUrl + '/gateways/' + gateway._id);
                const data = await response.json();
                if (response.ok) {
                    this.$emit('gateway-loaded', data);
                } else {
                    alert(data.message);
                }
            } catch (e) {
                alert(e);
                console.error(e);
            }
            // this.isLoading = false;
        },
    },
    template: `
        <li @click="showGateway(gateway)" class="list-group-item d-flex justify-content-between align-items-start" style="cursor: pointer">
            <span class="ms-2 me-auto">{{gateway.name}}</span>
            <span class="badge bg-primary rounded-pill">{{gateway.peripherals.length}}</span>
        </li>
    `
});

