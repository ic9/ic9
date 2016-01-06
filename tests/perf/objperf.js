/*
 * Copyright 2016 Austin Lehman
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * Runs performance test comparing instantiation and invocation of 
 * functional vs prototypal objects.
 */

var numCalls = 1000000, i, tmpf, tmpp;
var _global = this;

console.info("***************************************************");
console.info("Starting Object Performance Tests");
console.info("***************************************************\n");

console.info("Includes:");
console.info("***************************************************");

var incFunctObjStart = sys.getMills();
include("functionalObj.js");
var incFunctObjEnd = sys.getMills();

var incProtoObjStart = sys.getMills();
include("prototypalObj.js");
var incProtoObjEnd = sys.getMills();

console.info("Functional Object Include Elapsed: " + ((incFunctObjEnd - incFunctObjStart)/1000) + "s");
console.info("Prototypal Object Include Elapsed: " + ((incProtoObjEnd - incProtoObjStart)/1000) + "s\n");

function run() {
    console.info("Instantiate " + numCalls + " objects not inherited:");
    console.info("***************************************************");
    
    var instFunctObjStart = sys.getMills();
    for(i = 0; i < numCalls; i++) {
        tmpf = obj1({name: "austin"});
    }
    var instFunctObjEnd = sys.getMills();
    
    var instProtoObjStart = sys.getMills();
    for(i = 0; i < numCalls; i++) {
        tmpp = new Obj1("austin");
    }
    var instProtoObjEnd = sys.getMills();
    
    console.info("Functional obj1 Instantiate: " + ((instFunctObjEnd - instFunctObjStart)/1000) + "s");
    console.info("Prototypal Obj1 Instantiate: " + ((instProtoObjEnd - instProtoObjStart)/1000) + "s\n");
    
    
    console.info("Instantiate " + numCalls + " objects inherited:");
    console.info("***************************************************");
    
    var instFunctObjStartInh = sys.getMills();
    for(i = 0; i < numCalls; i++) {
        tmpf = obj2({ age: 99 });
    }
    var instFunctObjEndInh = sys.getMills();
    
    var instProtoObjStartInh = sys.getMills();
    for(i = 0; i < numCalls; i++) {
        tmpp = new Obj2(99);
    }
    var instProtoObjEndInh = sys.getMills();
    
    console.info("Functional obj2 Instantiate: " + ((instFunctObjEndInh - instFunctObjStartInh)/1000) + "s");
    console.info("Prototypal Obj2 Instantiate: " + ((instProtoObjEndInh - instProtoObjStartInh)/1000) + "s\n");
    
    console.info("Instantiate " + numCalls + " objects inherited 2:");
    console.info("***************************************************");
    
    var instFunctObjStartInh = sys.getMills();
    for(i = 0; i < numCalls; i++) {
        tmpf = obj3({ email: "lehman.austin@gmail.com" });
    }
    var instFunctObjEndInh = sys.getMills();
    
    var instProtoObjStartInh = sys.getMills();
    for(i = 0; i < numCalls; i++) {
        tmpp = new Obj3("lehman.austin@gmail.com");
    }
    var instProtoObjEndInh = sys.getMills();
    
    console.info("Functional obj3 Instantiate: " + ((instFunctObjEndInh - instFunctObjStartInh)/1000) + "s");
    console.info("Prototypal Obj3 Instantiate: " + ((instProtoObjEndInh - instProtoObjStartInh)/1000) + "s\n");
    
    
    console.info("Instantiate " + numCalls + " objects inherited 3:");
    console.info("***************************************************");
    
    var instFunctObjStartInh = sys.getMills();
    for(i = 0; i < numCalls; i++) {
        tmpf = obj4({ city: "Roseville" });
    }
    var instFunctObjEndInh = sys.getMills();
    
    var instProtoObjStartInh = sys.getMills();
    for(i = 0; i < numCalls; i++) {
        tmpp = new Obj4("Roseville");
    }
    var instProtoObjEndInh = sys.getMills();
    
    console.info("Functional obj4 Instantiate: " + ((instFunctObjEndInh - instFunctObjStartInh)/1000) + "s");
    console.info("Prototypal Obj4 Instantiate: " + ((instProtoObjEndInh - instProtoObjStartInh)/1000) + "s\n");
    
    console.info(numCalls + " method calls performed:");
    console.info("***************************************************");
    
    tmpf = obj4({ city: "Roseville" });
    var callFunctObjStartInh = sys.getMills();
    for(i = 0; i < numCalls; i++) {
        tmpf.setName("Austin");
        tmpf.getName();
        tmpf.setAge(99);
        tmpf.getAge();
        tmpf.setEmail("lehman.austin@gmail.com");
        tmpf.getEmail();
        tmpf.setCity("Roseville");
        tmpf.getCity();
    }
    var callFunctObjEndInh = sys.getMills();
    
    tmpp = new Obj4("Roseville");
    var callProtoObjStartInh = sys.getMills();
    for(i = 0; i < numCalls; i++) {
        tmpp.setName("Austin");
        tmpp.getName();
        tmpp.setAge(99);
        tmpp.getAge();
        tmpp.setEmail("lehman.austin@gmail.com");
        tmpp.getEmail();
        tmpp.setCity("Roseville");
        tmpp.getCity();
    }
    var callProtoObjEndInh = sys.getMills();
    
    console.info("Functional obj4 Calls: " + ((callFunctObjEndInh - callFunctObjStartInh)/1000) + "s");
    console.info("Prototypal Obj4 Calls: " + ((callProtoObjEndInh - callProtoObjStartInh)/1000) + "s\n");
}

console.info("Warmup:\n\n");
run();
console.info("Running:\n\n");
run();