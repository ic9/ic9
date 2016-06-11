package com.test;

import com.test.person;

/*
 * This is simply for ant build testing.
 */
class main {
	public static void main(String[] args) {
		person p = new person("Austin", "Lehman");
		System.out.println(p.toString());
	}
}
