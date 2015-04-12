var _ = require('lodash');
var expect = require('chai').expect;
var Schemafy = require('../src/schemafy');

var groupSchema;
var Group;
var group;
var ExtendedSchema;
var errors;
var lambda;

function propertiesOnly(json) {
  return _.merge({}, json);
}

describe('Creating new schemas', function () {

  beforeEach(function () {
    groupSchema = undefined;
    Group = undefined;
    group = undefined;
    ExtendedSchema = undefined;
    errors = [];
    lambda = undefined;
  });

  describe('Given the Group schema', function(){
    beforeEach(function() {
      groupSchema = {
        "type": "object",
        "id": "group",
        "required": true,
        "additionalProperties": false,
        "properties": {
          "id": {
            "description": "Universally unique identifier",
            "type": "string",
            "required": true
          }
        }
      };
    });

    describe('when Schemafy creates Group schema', function () {
      beforeEach(function () {
        Group = new Schemafy(groupSchema);
      });

      describe('Group#schema', function () {
        it('is defined', function(){
          expect(Group.schema).to.exist;
        });

        it('is is a function', function(){
          expect(Group.schema).to.be.a('function');
        });

        it('returns original schema when called', function () {
          expect(Group.schema()).to.deep.equal({
            "type": "object",
            "id": "group",
            "required": true,
            "additionalProperties": false,
            "properties": {
              "id": {
                "description": "Universally unique identifier",
                "type": "string",
                "required": true
              }
            }
          });
        });

      }); // Group#schema

      describe('Group#extend', function () {
        it('is defined', function(){
          expect(Group.extend).to.exist;
        });

        it('is is a function', function(){
          expect(Group.extend).to.be.a('function');
        });

        describe('when called with additional properties', function(){
          beforeEach(function(){
            ExtendedSchema = Group.extend({
              "properties": {
                "foo": {
                  "type": "string"
                }
              }
            });
          });

          it('returns a new Schemafy constructor', function(){
            expect(Group.extend('ExtendedSchema', ExtendedSchema)).to.be.a('function');
          });

          describe('ExtendedSchema#schema', function(){
            it('returns new full extended schema', function(){
              expect(ExtendedSchema.schema()).to.deep.equal({
                "type": "object",
                "id": "group",
                "required": true,
                "additionalProperties": false,
                "properties": {
                  "id": {
                    "description": "Universally unique identifier",
                    "type": "string",
                    "required": true
                  },
                  "foo": {
                    "type": "string"
                  }
                }
              });
            });
          }); // Extendedschema#schema

        });

      }); // Group#extend

      describe('Group#validate', function () {
        it('is defined', function(){
          expect(Group.validate).to.exist;
        });

        it('is is a function', function(){
          expect(Group.validate).to.be.a('function');
        });

        describe('when called with an invalid JSON', function(){
          beforeEach(function(){
            errors = Group.validate({});
          });

          it('returns a list of errors', function(){
            expect(errors).to.deep.equal([
              'instance.id is required'
            ]);
          });


        });

      }); // Group#extend

      describe('Group#addValidation', function () {
        it('is defined', function(){
          expect(Group.addValidation).to.exist;
        });

        it('is is a function', function(){
          expect(Group.addValidation).to.be.a('function');
        });

        describe('when called with something not a function', function(){
          beforeEach(function(){
            lambda = function () {
              Group.addValidation("boom!");
            };
          });

          it('throws error', function(){
            expect(lambda).to.throw("Validators must be a function.");
          });
        });

        describe('when called with a function', function(){
          beforeEach(function(){
            lambda = function () {
              Group.addValidation(function(){

              });
            };
          });

          it('does not throw an error', function(){
            expect(lambda).to.not.throw();
          });
        });

      }); // Group#extend

    }); // when Schemafy creates Group schema

  }); // Given the Group schema

});