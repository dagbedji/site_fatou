CREATE TABLE missions (
    id SERIAL PRIMARY KEY,
    image text,
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



-- Offre data
CREATE TABLE offre (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    image TEXT NOT NULL
);

CREATE TABLE moreContent (
    id SERIAL PRIMARY KEY,
    offre_id INT NOT NULL REFERENCES offre(id),
    content TEXT NOT NULL
);

INSERT INTO offre (title, image) VALUES
('Famille/ étudiants :', '/assets/image/13.jpg'),
('Famille/ étudiants :', '/assets/image/13.jpg');
INSERT INTO moreContent (offre_id, content) VALUES
(1, 'Séances de conseil, d''écoute et de répit'),
(1, 'Préparation à l''accueil d''un nouveau membre (grossesse, naissance, postpartum)'),
(1, 'Soutien pour concilier travail et vie familiale'),
(1, 'Suivi personnalisé'),
(1, 'Création d''un réseau de soutien'),
(1, 'Référencement vers les organismes appropriées'),

INSERT INTO moreContent (offre_id, content) VALUES
(2, 'Séances de conseil, d''écoute et de répit'),
(2, 'Préparation à l''accueil d''un nouveau membre (grossesse, naissance, postpartum)'),
(2, 'Soutien pour concilier travail et vie familiale'),
(2, 'Suivi personnalisé'),
(2, 'Création d''un réseau de soutien'),
(2, 'Référencement vers les organismes appropriées');
