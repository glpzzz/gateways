const express = require('express');
const router = express.Router();

const Gateway = require('../models/gateway');
const Peripheral = require('../models/peripheral');

router.get('/', async (req, res, next) => {
    try {
        const models = await Peripheral.find({}, [], {sort: {uid: 1}}).populate('gateway');
        res.status(200).json(models);
    } catch (e) {
        return res.status(500).json({message: e.message});
    }
});

router.get('/:id', findModel, async (req, res) => {
    await res.status(200).json(res.model);
});

router.post('/:gateway_id', async (req, res) => {
    let gateway;
    try {
        gateway = await Gateway.findById(req.params.gateway_id);
        if (gateway == null) {
            return res.status(404).json({message: 'Gateway not found.'});
        }
    } catch (e) {
        return res.status(500).json({message: e.message});
    }

    if (gateway.peripherals.length >= 10) {
        return res.status(400).json({message: 'Full gateway.'});
    }

    const model = new Peripheral({
        uid: req.body.uid,
        vendor: req.body.vendor,
        status: req.body.status,
        gateway: gateway._id,
    });
    try {
        const result = await model.save();
        gateway.peripherals.push(result._id);
        await gateway.save();
        res.status(201).json(result);
    } catch (e) {
        return res.status(400).json({message: e.message});
    }
});

router.put('/:id', findModel, async (req, res) => {
    if (req.body.uid != null) {
        res.model.uid = req.body.uid;
    }
    if (req.body.vendor != null) {
        res.model.vendor = req.body.vendor;
    }
    if (req.body.status != null) {
        res.model.status = req.body.status;
    }
    try {
        const result = await res.model.save();
        res.status(200).json(result);
    } catch (e) {
        return res.status(400).json({message: e.message});
    }
});

router.delete('/:id', findModel, async (req, res) => {
    try {
        const result = await res.model.remove();
        res.status(200).json(result);
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});

async function findModel(req, res, next) {
    let model = null;
    try {
        model = await Peripheral.findById(req.params.id).populate('gateway');
        if (model == null) {
            return res.status(404).json({message: 'Resource not found.'});
        }
    } catch (e) {
        return res.status(500).json({message: e.message});
    }
    res.model = model;
    next();
}

module.exports = router;
