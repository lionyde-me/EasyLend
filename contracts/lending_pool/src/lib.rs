#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol, token};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Token,
    PoolBalance,
    UserBalance(Address),
    Loan(Address),
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Loan {
    pub amount: i128,
    pub due_date: u64,
    pub active: bool,
}

#[contract]
pub struct LendingPool;

#[contractimpl]
impl LendingPool {
    pub fn initialize(env: Env, admin: Address, token: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Token, &token);
        env.storage().instance().set(&DataKey::PoolBalance, &0i128);
    }

    pub fn deposit(env: Env, from: Address, amount: i128) {
        from.require_auth();
        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let client = token::Client::new(&env, &token_addr);
        
        client.transfer(&from, &env.current_contract_address(), &amount);
        
        let pool_balance: i128 = env.storage().instance().get(&DataKey::PoolBalance).unwrap_or(0);
        env.storage().instance().set(&DataKey::PoolBalance, &(pool_balance + amount));
        
        let user_key = DataKey::UserBalance(from.clone());
        let user_balance: i128 = env.storage().persistent().get(&user_key).unwrap_or(0);
        env.storage().persistent().set(&user_key, &(user_balance + amount));
    }

    pub fn withdraw(env: Env, to: Address, amount: i128) {
        to.require_auth();
        let user_key = DataKey::UserBalance(to.clone());
        let user_balance: i128 = env.storage().persistent().get(&user_key).unwrap_or(0);
        
        if user_balance < amount {
            panic!("Insufficient balance");
        }
        
        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let client = token::Client::new(&env, &token_addr);
        client.transfer(&env.current_contract_address(), &to, &amount);
        
        env.storage().persistent().set(&user_key, &(user_balance - amount));
        let pool_balance: i128 = env.storage().instance().get(&DataKey::PoolBalance).unwrap_or(0);
        env.storage().instance().set(&DataKey::PoolBalance, &(pool_balance - amount));
    }

    pub fn borrow(env: Env, borrower: Address, amount: i128, duration: u64) {
        borrower.require_auth();
        
        // TODO: Integrate with Vouching contract to check borrowing limit
        
        let pool_balance: i128 = env.storage().instance().get(&DataKey::PoolBalance).unwrap_or(0);
        if pool_balance < amount {
            panic!("Insufficient pool liquidity");
        }

        let loan_key = DataKey::Loan(borrower.clone());
        if env.storage().persistent().has(&loan_key) {
            let existing_loan: Loan = env.storage().persistent().get(&loan_key).unwrap();
            if existing_loan.active {
                panic!("Existing active loan");
            }
        }

        let loan = Loan {
            amount,
            due_date: env.ledger().timestamp() + duration,
            active: true,
        };
        env.storage().persistent().set(&loan_key, &loan);

        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let client = token::Client::new(&env, &token_addr);
        client.transfer(&env.current_contract_address(), &borrower, &amount);
        
        env.storage().instance().set(&DataKey::PoolBalance, &(pool_balance - amount));
    }

    pub fn repay(env: Env, borrower: Address) {
        borrower.require_auth();
        let loan_key = DataKey::Loan(borrower.clone());
        let mut loan: Loan = env.storage().persistent().get(&loan_key).expect("No active loan");
        
        if !loan.active {
            panic!("Loan not active");
        }

        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let client = token::Client::new(&env, &token_addr);
        
        // Simple 5% interest for now
        let interest = loan.amount * 5 / 100;
        let total_repayment = loan.amount + interest;
        
        client.transfer(&borrower, &env.current_contract_address(), &total_repayment);
        
        loan.active = false;
        env.storage().persistent().set(&loan_key, &loan);
        
        let pool_balance: i128 = env.storage().instance().get(&DataKey::PoolBalance).unwrap_or(0);
        env.storage().instance().set(&DataKey::PoolBalance, &(pool_balance + total_repayment));
    }

    pub fn get_loan(env: Env, borrower: Address) -> Option<Loan> {
        env.storage().persistent().get(&DataKey::Loan(borrower))
    }
    
    pub fn get_pool_balance(env: Env) -> i128 {
        env.storage().instance().get(&DataKey::PoolBalance).unwrap_or(0)
    }
}
