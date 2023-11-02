CREATE DATABASE fileserver;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
    user_id UUID DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY(user_id)
);


CREATE TABLE files(
    file_id SERIAL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (file_id)
);


CREATE TABLE mails_sent(
    mails_sent_id UUID,
    user_id UUID,
    user_email VARCHAR(255) NOT NULL,
    file_id numeric NOT NULL UNIQUE,
    image VARCHAR(255) NOT NULL,
    number_of_sent_files numeric NOT NULL
);

CREATE TABLE downloads(
    downloaded_files_id UUID,
    user_id UUID,
    user_email VARCHAR(255) NOT NULL,
    file_id numeric NOT NULL UNIQUE,
    image VARCHAR(255) NOT NULL,
    number_of_downloaded_files numeric NOT NULL
);

SELECT * FROM users;
DELETE FROM users WHERE user_name = 'richkid';

DROP TABLE users;
DROP DATABASE fileserver;
CREATE DATABASE fileserver;
UPDATE users SET is_admin = true WHERE user_name = 'fosu';