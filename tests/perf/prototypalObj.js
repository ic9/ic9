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
 * Base prototypal object for testing.
 */
function Obj1 (Name) {
    if (this === _global) { throw ("Attepmt to instantiate in global scope."); }
    this.name = Name;
};

Obj1.prototype.setName = function (Name) {
    this.name = Name;
    return this;
};
Obj1.prototype.getName = function () {
    return this.name;
};

/*
 * First prototypal inherited object.
 */
function Obj2 (Age) {
    Obj1.call(this, "austin");
    this.age = Age;
};
Obj2.prototype = new Obj1();
Obj2.prototype.setAge = function (Age) {
    this.age = Age;
    return this;
};
Obj2.prototype.getAge = function () {
    return this.age;
};
Obj2.prototype.constructor = Obj2;

function Obj3 (Email) {
    Obj2.call(this, 99);
    this.email = Email;
};
Obj3.prototype = new Obj2();
Obj3.prototype.setEmail = function (Email) {
    this.email = Email;
    return this;
};
Obj3.prototype.getEmail = function () {
    return this.email;
};
Obj3.prototype.constructor = Obj3;

function Obj4 (City) {
    Obj3.call(this, "lehman.austin@gmail.com");
    this.city = City;
};
Obj4.prototype = new Obj3();
Obj4.prototype.setCity = function (City) {
    this.city = City;
    return this;
};
Obj4.prototype.getCity = function () {
    return this.city;
};
Obj4.prototype.constructor = Obj4;