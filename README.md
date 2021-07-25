# Gateways

![test workflow](https://github.com/glpzzz/gateways/actions/workflows/test.yml/badge.svg)
![GitHub top language](https://img.shields.io/github/languages/top/glpzzz/gateways?style=flat)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/glpzzz/gateways?style=flat)
![Lines of code](https://img.shields.io/tokei/lines/github/glpzzz/gateways?style=flat)

## Description 

This sample project is managing gateways - master devices that control multiple peripheral devices. 

Your task is to create a REST service (JSON/HTTP) for storing information about these gateways and their associated devices. This information must be stored in the database. 

When storing a gateway, any field marked as “to be validated” must be validated and an error returned if it is invalid. Also, no more that 10 peripheral devices are allowed for a gateway.

The service must also offer an operation for displaying information about all stored gateways (and their devices) and an operation for displaying details for a single gateway. Finally, it must be possible to add and remove a device from a gateway.

Each gateway has:
- a unique serial number (string), 
- human-readable name (string),
- IPv4 address (to be validated),
- multiple associated peripheral devices. 

Each peripheral device has:
- a UID (number),
- vendor (string),
- date created,
- status - online/offline.

## Stack

- Frontend: Vue.js + Bootstrap 5
- Backend: NodeJS + Express + MongoDB REST API 

## How to?

1. Clone this repo: `git clone https://github.com/glpzzz/gateways`
2. Move to the cloned directory: `cd gateways`

### Production environment

1. Rename the file `.env.template` to `.env` and adjust the variables values properly
2. Run `docker-compose up`
3. The app should be ready on http://localhost

### Development environment

1. Rename the file `.env.template` to `.env` and adjust the variables values properly
2. Execute `npm install` to get all dependencies including dev ones
3. Run `docker-compose -f docker-compose.dev.yml up` which mounts a volume so you can make changes and the container 
stays in sync.
4. The app should be ready on http://localhost

### Testing environment
1. Rename the file `.env.template` to `.env-test` and adjust the variables values properly
2. Run `docker-compose -f docker-compose.test.yml run node npm run test`

#### Github action
A Github actions is configured to be executed on every push so tests must be passed for the push (or PR) to be 
effective.
