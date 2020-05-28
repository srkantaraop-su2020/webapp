var expect = require('chai').expect;
var request = require('supertest');
var app = require('../server');

it('POST request sanity test', function(done) {
  request(app)
    .post('/v1/user')
    .send(
      {
        "firstName": "Pavan",
        "lastName": "Rao",
        "password": "abc@12QWER",
        "userName": "pavan.rao@example.com"
      }
    )
    .expect(function(res) {

      if (res.statusCode !== 200 && res.statusCode !== 400 && res.statusCode !== 500) {
        throw Error('unexpected status code: ' + res.statusCode);
      }
    })
    .expect('Content-Type', /json/)
    .end(function(err, res) {
          if (err) console.log(err);
       });
    done();
});