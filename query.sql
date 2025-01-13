CREATE TABLE missions (
    id SERIAL PRIMARY KEY,
    image BYTEA,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL
);
INSERT INTO missions (image, title, description)
VALUES (
  pg_read_binary_file('/Users/karels/Desktop/image2/Mission.jpg'), 
  'Mission Title', 
  'Mission Description'
);



-- Navbar data
DROP TABLE IF EXISTS navigation;
CREATE TABLE navigation (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    route VARCHAR(100) NOT NULL,
    icon VARCHAR(100) DEFAULT NULL
);
INSERT INTO navigation (name, route, icon)
VALUES
    ('Accueil', '/', NULL),
    ('Services', '/services', NULL),
    ('Tarification', '/tarification', NULL),
    ('Ressources', '/ressources', NULL),
    ('Nousjoindre', '/nousjoindre', NULL),
    ('Carrieres', '/carrieres', NULL),
    ('Profile', '/login', 'fa-solid fa-user');

DROP TABLE IF EXISTS service_data;
CREATE TABLE service_data (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255)
);
INSERT INTO  service_data(title, description, image)
VALUES ( 
  'Les atouts de nos Services:',
'Développer l''autonomie et responsabilisation du client<br>Création d''un meilleur lien de confiance<br>Implication totalement volontaire de l''usager<br>Mise en action spontanée,',
'/uploads/image2.jpg'
);

UPDATE TABLE mission 
SET ( title, description, image)=
WHERE id = 1

CREATE TABLE session (
    id SERIAL PRIMARY KEY,
    image VARCHAR(255) NOT NULL
);

CREATE TABLE principe (
    id SERIAL PRIMARY KEY,
    session_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    FOREIGN KEY (session_id) REFERENCES session(id)
);

INSERT INTO  session(image)
VALUES ('/uploads/image2.jpg');

INSERT INTO  principe(session_id, title, text)
VALUES 
( 
1,
'Approche positive, bienveillante:',
'Notre approche est axée sur des solutions concrètes...'
),
( 
1,
'Principe des 5 C:',
'Notre approche est axée sur des solutions concrètes...'
),
( 
1,
'Approche responsabilisante:',
'Notre approche est axée sur des solutions concrètes...'
);
SELECT FROM principe (title, text) JOIN session WHERE id=1;

SELECT principe.id, title, text, image
FROM principe
JOIN session
ON session.id = session_id
