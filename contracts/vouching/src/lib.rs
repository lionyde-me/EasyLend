#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Vec, symbol_short, Symbol};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Vouches(Address),    // Who vouches for this address
    Vouching(Address),   // Who this address is vouching for
    CreditScore(Address),
}

#[contract]
pub struct Vouching;

#[contractimpl]
impl Vouching {
    pub fn vouch(env: Env, voucher: Address, borrower: Address) {
        voucher.require_auth();
        if voucher == borrower {
            panic!("Cannot vouch for yourself");
        }

        let mut vouches: Vec<Address> = env.storage().persistent().get(&DataKey::Vouches(borrower.clone())).unwrap_or(Vec::new(&env));
        
        // Check if already vouched
        for v in vouches.iter() {
            if v == voucher {
                return; // Already vouched
            }
        }

        vouches.push_back(voucher.clone());
        env.storage().persistent().set(&DataKey::Vouches(borrower.clone()), &vouches);

        let mut vouching: Vec<Address> = env.storage().persistent().get(&DataKey::Vouching(voucher.clone())).unwrap_or(Vec::new(&env));
        vouching.push_back(borrower.clone());
        env.storage().persistent().set(&DataKey::Vouching(voucher.clone()), &vouching);

        // Update credit score
        let current_score: u32 = env.storage().persistent().get(&DataKey::CreditScore(borrower.clone())).unwrap_or(0);
        env.storage().persistent().set(&DataKey::CreditScore(borrower), &(current_score + 10));
    }

    pub fn get_vouches(env: Env, borrower: Address) -> Vec<Address> {
        env.storage().persistent().get(&DataKey::Vouches(borrower)).unwrap_or(Vec::new(&env))
    }

    pub fn get_credit_score(env: Env, borrower: Address) -> u32 {
        env.storage().persistent().get(&DataKey::CreditScore(borrower)).unwrap_or(0)
    }

    pub fn update_score_on_repayment(env: Env, borrower: Address) {
        // Only lending pool should ideally call this, but for simplicity:
        let current_score: u32 = env.storage().persistent().get(&DataKey::CreditScore(borrower.clone())).unwrap_or(0);
        env.storage().persistent().set(&DataKey::CreditScore(borrower), &(current_score + 5));
    }
}
