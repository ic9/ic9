package com.test;

/*
 * This is simply for ant build testing.
 */
public class person {
	String firstName = "";
	String lastName = "";
	public person(String FirstName, String LastName) {
		this.firstName = FirstName;
		this.lastName = LastName;
	}

	public String toString() {
		return this.firstName + " " + this.lastName;
	}
}
