const faker = require('faker');

const data = [];

for(var i = 0; i<20; i++){
    var user = {
        first: faker.name.firstName(),
        last: faker.name.lastName(),
        email: faker.internet.email()
    };
    data.push(user);
}

module.exports = data;
