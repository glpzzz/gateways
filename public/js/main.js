var app = new Vue({
    el: '#app',
    data: {
        current: null,
        currentPeripheral: null,
        gateways: [],
        isLoading: false,
    },
    methods: {
        async list() {
            this.isLoading = true;
            try {
                const response = await fetch(baseUrl + '/gateways');
                const data = await response.json();
                if (response.ok) {
                    this.gateways = data;
                } else {
                    alert(data.message);
                }
            } catch (e) {
                alert(e);
                console.error(e);
            }
            this.isLoading = false;
        },
        onGatewayLoaded(gateway) {
            this.current = gateway;
        },
        newGateway() {
            this.current = {
                _id: undefined,
                name: 'New Gateway',
                serial: '',
                ip: '',
            }
        },
        newPeripheral() {
            this.currentPeripheral = {
                _id: undefined,
                uid: '',
                vendor: '',
                status: ''
            };
        },
        async showPeripheral(peripheral) {
            this.isLoading = true;
            try {
                const response = await fetch(baseUrl + '/peripherals/' + peripheral._id);
                const data = await response.json();
                if (response.ok) {
                    this.currentPeripheral = data;
                } else {
                    alert(data.message);
                }
            } catch (e) {
                alert(e);
                console.error(e);
            }
            this.isLoading = false;
        },
        async savePeripheral(peripheral) {
            console.log('START savePeripheral');
            this.isLoading = true;
            try {
                if (peripheral._id !== undefined) {
                    const response = await fetch(baseUrl + '/peripherals/' + peripheral._id, {
                        method: 'put',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(peripheral),
                    });
                    const data = await response.json();
                    if (response.ok) {
                        this.currentPeripheral = null;
                    } else {
                        alert(data.message);
                    }
                } else {
                    const response = await fetch(baseUrl + '/peripherals/' + this.current._id, {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(peripheral),
                    });
                    const data = await response.json();
                    if (response.ok) {
                        this.currentPeripheral = null;
                    } else {
                        alert(data.message);
                    }
                }
                this.showGateway(this.current);
            } catch (e) {
                alert(e);
                console.error(e);
            }
            this.isLoading = false;
            console.log('END savePeripheral');
        },
        async deletePeripheral(peripheral) {
            if (confirm('Delete peripheral?')) {
                this.isLoading = true;
                try {
                    const response = await fetch(baseUrl + '/peripherals/' + peripheral._id, {
                        method: 'delete',
                    });
                    const data = await response.json();
                    if (response.ok) {
                        this.currentPeripheral = null;
                        this.showGateway(this.current);
                    } else {
                        alert(data.message);
                    }
                } catch (e) {
                    alert(e);
                    console.error(e);
                }
                this.isLoading = false;
            }
        }
    },
    mounted() {
        this.list();
    }
});
