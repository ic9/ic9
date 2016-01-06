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
 * Base functional object for testing.
 */
function obj1(spec)
{
    var that = spec || {};

    that.setName = function (Name) {
        that.name = Name;
        return that;
    };

    that.getName = function () {
        return that.name;
    };

    return that;
}

/*
 * First functional inherited object.
 */
function obj2(spec)
{
    var that = spec || {};
    that.name = "austin";
    obj1(that);

    that.setAge = function (Age) {
        that.age = Age;
        return that;
    };

    that.getAge = function () {
        return that.age;
    };

    return that;
}

function obj3(spec)
{
    var that = spec || {};
    that.age = 99;
    obj2(that);

    that.setEmail = function (Email) {
        that.email = Email;
        return that;
    };

    that.getEmail = function () {
        return that.email;
    };

    return that;
}

function obj4(spec)
{
    var that = spec || {};
    that.email = "lehman.austin@gmail.com";
    obj3(that);

    that.setCity = function (City) {
        that.city = City;
        return that;
    };

    that.getCity = function () {
        return that.city;
    };

    return that;
}