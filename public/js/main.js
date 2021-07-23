const baseUrl = 'http://localhost';

var app = new Vue({
    el: '#app',
    data: {
        current: null,
        currentPeripheral: null,
        gateways: [],
    },
    methods: {
        async list() {
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
        },
        async showGateway(gateway) {
            try {
                const response = await fetch(baseUrl + '/gateways/' + gateway._id);
                const data = await response.json();
                if (response.ok) {
                    this.current = data;
                } else {
                    alert(data.message);
                }
            } catch (e) {
                alert(e);
                console.error(e);
            }
        },
        newGateway() {
            this.current = {
                _id: undefined,
                name: 'New Gateway',
                serial: '',
                ip: '',
            }
        },
        async saveGateway(gateway) {
            console.log('START saveGateway');
            try {
                if (gateway._id !== undefined) {
                    const response = await fetch(baseUrl + '/gateways/' + gateway._id, {
                        method: 'put',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(gateway),
                    });
                    const data = await response.json();
                    if (response.ok) {
                        this.current = data;
                    } else {
                        alert(data.message);
                    }
                } else {
                    const response = await fetch(baseUrl + '/gateways', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(gateway),
                    });
                    const data = await response.json();
                    if (response.ok) {
                        this.current = data;
                    } else {
                        alert(data.message);
                    }
                }
                this.list();
                this.showGateway(this.current);
            } catch (e) {
                alert(e);
                console.error(e);
            }
            console.log('END saveGateway');
        },
        async deleteGateway(gateway) {
            if (confirm('Delete gateway?')) {
                try {
                    const response = await fetch(baseUrl + '/gateways/' + gateway._id, {
                        'method': 'delete',
                    });
                    const data = await response.json();
                    if (response.ok) {
                        this.current = null;
                        this.list();
                    } else {
                        alert(data.message);
                    }
                } catch (e) {
                    alert(e);
                    console.error(e);
                }
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
        },
        async savePeripheral(peripheral) {
            console.log('START savePeripheral');
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
            console.log('END savePeripheral');
        },
        async deletePeripheral(peripheral) {
            if (confirm('Delete peripheral?')) {
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
            }
        }
    },
    mounted() {
        this.list();
    }
});
