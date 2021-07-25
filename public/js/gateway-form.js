Vue.component('GatewayForm', {
    props: ['gateway'],
    methods: {
        async saveGateway(gateway) {
            try {
                const response = await fetch(baseUrl + '/gateways/' + (gateway._id === undefined ? '' : gateway._id), {
                    method: gateway._id === undefined ? 'post' : 'put',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(gateway),
                });
                const data = await response.json();
                if (response.ok) {
                    this.$emit('gateway-processed');
                    this.$emit('gateway-loaded', data);
                } else {
                    alert(data.message);
                }
            } catch (e) {
                alert(e);
                console.error(e);
            }
        },
        async deleteGateway(gateway) {
            if (confirm('Delete gateway?')) {
                try {
                    const response = await fetch(baseUrl + '/gateways/' + gateway._id, {
                        'method': 'delete',
                    });
                    const data = await response.json();
                    if (response.ok) {
                        this.$emit('gateway-processed');
                        this.$emit('gateway-closed');
                    } else {
                        alert(data.message);
                    }
                } catch (e) {
                    alert(e);
                    console.error(e);
                }
            }
        }
    },
    template: `
        <form @submit.prevent="saveGateway(gateway)" action="/gateways" class="card-body mb-4">
            <div class="mb-3">
                <label for="gateway-name" class="form-label">Name</label>
                <input id="gateway-name" class=form-control type="text" v-model="gateway.name"/>
            </div>
            <div class="mb-3">
                <label for="gateway-serial" class="form-label">Serial</label>
                <input id="gateway-serial" class=form-control type="text" v-model="gateway.serial"/>
            </div>
            <div class="mb-3">
                <label for="gateway-ip" class="form-label">IP</label>
                <input id="gateway-ip" class=form-control type="text" v-model="gateway.ip"/>
            </div>
            <input id="btn-save-gateway" class="btn btn-primary" type="submit" value="Save"/>
            <button v-if="gateway._id" type="button" class="btn btn-danger" @click="deleteGateway(gateway)">
                Delete
            </button>
        </form>
    `
});

