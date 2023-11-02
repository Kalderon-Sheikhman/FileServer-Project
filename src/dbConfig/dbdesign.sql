-- Select all records from the users table
SELECT * FROM users;

-- TITBITS ABOUT THE USAGE OF A POSTGRES DB

-- Drop the fileserver database
DROP DATABASE fileserver;

-- Delete a record from the users table where the user_name is 'specify'
DELETE FROM users WHERE user_name = 'specify';

-- Drop the users table
DROP TABLE users;





-- Create the fileserver database again
CREATE DATABASE backendfilestorage;

-- Update the users table, setting is_admin to true where the user_name is 'kduah'
UPDATE users SET is_admin = true WHERE user_name = 'kduah';




-- Create a new database called fileserver
CREATE DATABASE fileserver;

-- Enable the uuid-ossp extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the users table
CREATE TABLE users(
    user_id UUID DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY(user_id)
);

-- Create the files table
CREATE TABLE files(
    file_id SERIAL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (file_id)
);

-- Create the mails_sent table
CREATE TABLE mails_sent(
    mails_sent_id UUID,
    user_id UUID,
    user_email VARCHAR(255) NOT NULL,
    file_id numeric NOT NULL UNIQUE,
    image VARCHAR(255) NOT NULL,
    number_of_sent_files numeric NOT NULL
);

-- Create the downloads table
CREATE TABLE downloads(
    downloaded_files_id UUID,
    user_id UUID,
    user_email VARCHAR(255) NOT NULL,
    file_id numeric NOT NULL UNIQUE,
    image VARCHAR(255) NOT NULL,
    number_of_downloaded_files numeric NOT NULL
);

