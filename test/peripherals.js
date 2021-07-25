let mongoose = require("mongoose");
let Gateway = require('../models/gateway');
let Peripheral = require('../models/peripheral');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../bin/www');
let should = chai.should();

chai.use(chaiHttp);

//Our parent block
describe('Peripherals', () => {

    beforeEach((done) => { //Before each test we empty the database
        collection = mongoose.connection.collection('peripherals');
        return collection.drop(() => {
            collection = mongoose.connection.collection('gateways');
            return collection.drop(() => {
                done();
            });
        });
    });

    after(() => {
        mongoose.connection.close();
    });

    /**
     * Test the /GET route
     */
    describe('/GET peripheral', () => {
        it('it should GET all the peripherals', (done) => {
            chai.request(server)
                .get('/peripherals')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    /**
     * Test the /POST route
     */
    describe('/POST peripheral', () => {
        it('it should not POST a peripheral with wrong status', (done) => {
            let gateway = new Gateway({name: "Gateway 1", serial: "111111", ip: "192.168.0.1"});
            gateway.save((err, gateway) => {
                let peripheral = {uid: "111111", vendor: "111111", status: 'good'};
                chai.request(server)
                    .post('/peripherals/' + gateway._id)
                    .send(peripheral)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message');
                        res.body.should.have.property('message').equal('Peripheral validation failed: status: Status must be `online` or `offline`.');
                        done();
                    });
            });
        });

        it('it should just allow to POST 10 peripherals per gateway', async () => {
            try {
                let gateway = new Gateway({name: "Gateway 1", serial: "111111", ip: "192.168.0.1"});
                gateway = await gateway.save();
                for (let i = 1; i <= 11; i += 1) {
                    let peripheral = {
                        uid: 1000 + i,
                        vendor: "Vendor " + i,
                        status: (i % 2 == 0) ? 'online' : 'offline'
                    };
                    if (i < 11) {
                        const res = await chai.request(server)
                            .post('/peripherals/' + gateway._id)
                            .send(peripheral);
                        res.should.have.status(201);
                        res.body.should.be.a('object');
                    } else {
                        const res = await chai.request(server)
                            .post('/peripherals/' + gateway._id)
                            .send(peripheral);
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message');
                        res.body.should.have.property('message').equal('Full gateway.');
                    }
                }
            } catch (e) {
                console.error(e);
            }
        });
    });

    /**
     * Test the /GET/:id route
     */
    describe('/GET/:id peripheral', () => {
        it('it should GET a peripheral by the given id', (done) => {
            let peripheral = new Peripheral({uid: 11111, vendor: "Vendor 1", status: "online"});
            peripheral.save((err, peripheral) => {
                chai.request(server)
                    .get('/peripherals/' + peripheral._id)
                    .send(peripheral)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('uid');
                        res.body.should.have.property('vendor');
                        res.body.should.have.property('status');
                        res.body.should.have.property('_id').eql(peripheral.id);
                        done();
                    });
            });

        });
    });

    /**
     * Test the /PUT/:id route
     */
    describe('/PUT/:id peripheral', () => {
        it('it should UPDATE a peripheral given the id', (done) => {
            let gateway = new Gateway({name: "Gateway 1", serial: "111111", ip: "192.168.0.1"});
            gateway.save((err, gateway) => {
                let peripheral = new Peripheral({
                    uid: 11111,
                    vendor: "Vendor 1",
                    status: "online",
                    gateway: gateway._id
                });
                peripheral.save((err, peripheral) => {
                    chai.request(server)
                        .put('/peripherals/' + peripheral._id)
                        .send({uid: 222222, vendor: "Vendor 2", status: "offline"})
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('status').equal("offline");
                            done();
                        });
                });
            });
        });
    });

    /**
     * Test the /DELETE/:id route
     */
    describe('/DELETE/:id peripheral', () => {
        it('it should DELETE a peripheral given the id', (done) => {
            let gateway = new Gateway({name: "Gateway 1", serial: "111111", ip: "192.168.0.1"});
            gateway.save((err, gateway) => {
                let peripheral = new Peripheral({
                    uid: 11111,
                    vendor: "Vendor 1",
                    status: "online",
                    gateway: gateway._id
                });
                peripheral.save((err, peripheral) => {
                    chai.request(server)
                        .delete('/peripherals/' + peripheral._id)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('_id').equal(peripheral._id.toString());
                            done();
                        });
                });
            });
        });
    });
});

