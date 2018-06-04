"use strict";

const path = require('path');
const expect = require('expect.js');
const Simplexml = require('../');

describe("Minimal mock suite", function() {


  var config = Simplexml.load_file(path.join(__dirname, "mock.xml"));


  it("should create nodes", function() {
    expect(config.end.and.after).to.be.ok();
  });


  it("should test minimal parsing", function() {
    expect(config.some.secured.node['port']).to.eql(43);
    expect(config.some.secured.password).to.eql("foo de bar");
  });


  it("should test iterator", function() {
    var ours = [];
    for(var node of config.some.secured.node)
      ours.push(node['port']);
    expect(ours).to.eql([43, 42, 41, 40]);
  });


  it("should serialize ", function() {
    expect(String(config.some.secured.node)).to.eql(`<node port="43"/>`);
    expect(String(config.end.and)).to.eql(`<and/>`);
  });










});
