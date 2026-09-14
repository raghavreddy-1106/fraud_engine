-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    kyc_status VARCHAR(20) DEFAULT 'PENDING',
    risk_profile VARCHAR(20) DEFAULT 'LOW'
);

-- Transactions table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    destination_country VARCHAR(5) NOT NULL,
    risk_score INTEGER DEFAULT 0,
    risk_level VARCHAR(10) DEFAULT 'LOW',
    status VARCHAR(20) DEFAULT 'PENDING',
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);