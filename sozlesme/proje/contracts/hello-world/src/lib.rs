#![no_std]

use soroban_sdk::{contract, contractimpl, Env, String, Vec};

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    pub fn hello(env: Env, name: String) -> Vec<String> {
        let mut v = Vec::new(&env);
        v.push_back(String::from_str(&env, "Hello"));
        v.push_back(name);
        v
    }
}
