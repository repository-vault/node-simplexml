"use strict";

const fs    = require('fs');
const parse = require('xml-parser');


const SYMB_PARENT = Symbol("parent");
const SYMB_BODY   = Symbol("body");


class Config {

  constructor(config, parent) {
    var ret = new Proxy(this, this);
    this.load_xml(config);
    this[SYMB_PARENT] = parent;
    return ret;
  }


  get(obj, prop) {
    if(prop == Symbol.iterator) {
      //then we must have siblings
      var self = this;

      return function* () {
        for(var child of self[SYMB_PARENT][SYMB_BODY].children) {
          if(child.name == self[SYMB_BODY].name)
            yield new Config(child, self[SYMB_PARENT]);
        }
      };
    }

    //cast as string
    if(prop === Symbol.toPrimitive) {
      var args = [], list = this[SYMB_BODY].attributes || {};
      for(var k in list)
        args.push(`${k}="${list[k]}"`);

      return () => `<${this[SYMB_BODY].name}${args.length ? ' ' : ''}${args.join(' ')}/>`;
    }


    if(this[SYMB_BODY].attributes && this[SYMB_BODY].attributes[prop])
      return this[SYMB_BODY].attributes[prop];

    if(this[SYMB_BODY].children) {

      for(var key in this[SYMB_BODY].children) {
        let child = this[SYMB_BODY].children[key];
        if(child.name == prop)
          return new Config(child, this);
      }
    }

    return null;
    //return new Config({name : prop});
  }

  load_xml(body) {
    this[SYMB_BODY]  = body;
  }


  static load_file(config_path) {
    var body = fs.readFileSync(config_path, 'utf-8');
    return Config.load_string(body);
  }

  static load_string(body) {

    var config = new Config(parse(body).root);
    return config;
  }
}



module.exports = Config;
