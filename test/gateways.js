let mongoose = require("mongoose");
let Gateway = require('../models/gateway');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../bin/www');
let should = chai.should();

chai.use(chaiHttp);

//Our parent block
describe('Gateways', () => {

    beforeEach((done) => { //Before each test we empty the database
        collection = mongoose.connection.collection('gateways');
        return collection.drop(() => {
            done();
        });
    });

    /**
     * Test the /GET route
     */
    describe('/GET gateway', () => {
        it('it should GET all the gateways', (done) => {
            chai.request(server)
                .get('/gateways')
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
    describe('/POST gateway', () => {
        it('it should not POST a gateway with wrong IP', (done) => {
            let gateway = new Gateway({name: "Gateway 1", serial: "111111", ip: "192.168.0.1000"});
            chai.request(server)
                .post('/gateways')
                .send(gateway)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.should.have.property('message').equal('Gateway validation failed: ip: Invalid IPv4 address.');
                    done();
                });
        });
        it('it should POST a gateway', (done) => {
            let gateway = new Gateway({name: "Gateway 1", serial: "111111", ip: "192.168.0.1"});
            chai.request(server)
                .post('/gateways')
                .send(gateway)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('name');
                    res.body.should.have.property('serial');
                    res.body.should.have.property('ip');
                    done();
                });
        });
    });

    /**
     * Test the /GET/:id route
     */
    describe('/GET/:id gateway', () => {
        it('it should GET a gateway by the given id', (done) => {
            let gateway = new Gateway({name: "Gateway 1", serial: "111111", ip: "192.168.0.1"});
            gateway.save((err, gateway) => {
                chai.request(server)
                    .get('/gateways/' + gateway._id)
                    .send(gateway)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('name');
                        res.body.should.have.property('serial');
                        res.body.should.have.property('ip');
                        res.body.should.have.property('_id').eql(gateway.id);
                        done();
                    });
            });

        });
    });

    /**
     * Test the /PUT/:id route
     */
    describe('/PUT/:id gateway', () => {
        it('it should UPDATE a gateway given the id', (done) => {
            let gateway = new Gateway({name: "Gateway 1", serial: "111111", ip: "192.168.0.1"});
            gateway.save((err, gateway) => {
                chai.request(server)
                    .put('/gateways/' + gateway._id)
                    .send({name: "Gateway 2", serial: "222222", ip: "192.168.0.2"})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('ip').equal("192.168.0.2");
                        done();
                    });
            });
        });
    });

    /**
     * Test the /DELETE/:id route
     */
    describe('/DELETE/:id gateway', () => {
        it('it should DELETE a gateway given the id', (done) => {
            let gateway = new Gateway({name: "Gateway 1", serial: "111111", ip: "192.168.0.1"});
            gateway.save((err, gateway) => {
                chai.request(server)
                    .delete('/gateways/' + gateway._id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('_id').equal(gateway._id.toString());
                        done();
                    });
            });
        });
    });
});
