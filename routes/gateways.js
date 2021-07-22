const express = require('express');
const router = express.Router();

const Gateway = require('../models/gateway');

router.get('/', async (req, res, next) => {
    try {
        const models = await Gateway.find().populate('peripherals');
        res.json(models);
    } catch (e) {
        return res.status(500).json({message: e.message});
    }
});

router.get('/:id', findModel, async (req, res) => {
    await res.json(res.model);
});

router.post('/', async (req, res) => {
    const model = new Gateway({
        serial: req.body.serial,
        name: req.body.name,
        ip: req.body.ip,
    });
    try {
        const result = await model.save();
        res.status(201).json(result);
    } catch (e) {
        return res.status(400).json({message: e.message});
    }
});

router.patch('/:id', findModel, async (req, res) => {
    if (req.body.serial != null) {
        res.model.serial = req.body.serial;
    }
    if (req.body.name != null) {
        res.model.name = req.body.name;
    }
    if (req.body.ip != null) {
        res.model.ip = req.body.ip;
    }
    try {
        const result = await res.model.save();
        res.json(result);
    } catch (e) {
        return res.status(400).json({message: e.message});
    }
});

router.delete('/:id', findModel, async (req, res) => {
    try {
        const result = await res.model.remove();
        res.json(result);
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});

async function findModel(req, res, next) {
    let model = null;
    try {
        model = await Gateway.findById(req.params.id).populate('peripherals');
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
