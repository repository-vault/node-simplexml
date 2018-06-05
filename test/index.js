"use strict";

const expect = require('expect.js');
const get = require('mout/object/get');
const Simplexml = require('../');

describe("Minimal mock suite", function() {

  process.chdir(__dirname);
  var config = Simplexml.load_file("mock.xml");



  it("should check subfile", function() {
    expect(config.some.sub.list['value']).to.eql(1);
    expect(config.some.sub['down']).to.eql("child");
    expect(config.some.sub['up']).to.eql("master");
  });



  it("should create nodes", function() {
    expect(get(config, 'end.and.after')).not.to.be.ok();
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
  });



  it("should check cast as bool", function() {
    expect(Boolean(config.end.and)).to.eql(false);
  });










});
