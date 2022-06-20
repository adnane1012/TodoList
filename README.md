`Mon Petit Placement - Test technique Symfony
==============================================

Environnement de développement crée
-------------

* PHP 7.4
* mariadb 10.8
* Symfony 5.4
* Api Platform 2.6
* Docker-compose


Bundles utilisés.
-------------
* lexik/jwt-authentication-bundle : pour le JWT authentification
* gesdinet/jwt-refresh-token-bundle: pour le Referesh Token.
* nelmio/cors-bundle : pour Cors, et timestampable avec doctrine.
* doctrine/doctrine-fixtures-bundle : pour la génération des données de tests (pour générer les utilisateurs.)
* symfony/apache-pack: A pack for Apache support in Symfony
* ..

Fonctionnalités traitées
-------------

Pour la Partie API

### Fonctionnalités

- [x] Se connecter via un identifiant (exemple : email / mot de passe)
- [x] Créer une todo-list et des tâches associées
- [x] Ajouter une tâche dans une todo-list existante
- [x] Seul le propriétaire de la todo-list peut la supprimer
- [x] Seul le propriétaire de la tâche ou de la todo-list parente peut la modifier/supprimer
- [x] Tous les autres utilisateurs peuvent voir les todo-list et tâches des autres
- [ ] Pouvoir filtrer les tâches/todo-list à afficher
- [ ] Bonus : Ajouter un système de status des tâches/todo-list
- [x] Bonus : Faire un front ? Web ? Mobile ? => n'est pas terminé.

Pour la Partie Front
- [x] Authentification / logout
- [x] Créer une todo-list / supprimer la todo-list


Résultat
--------

* 🕐 Temps passé dessus (approximativement) : 1 journée.
* 💼 Le repository GIT : 

Installation
--------

```bash
# builder les differents containers
docker-compose up -d
composer install

# dans le container 
docker exec  -it php7 /bin/bash

# executer ces comandes suivantes
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
php bin/console lexie:jwt:generate-keypair
php bin/console doctrine:fixtures:load
```

Pour Acceder à la documentation de l'API:
--------
http://localhost:8080/api/docs

Pour Acceder à la partie front de l'application :
--------
http://localhost:8080/

utilisateurs généré par doctrine fixtures :

username : user1@peritis.fr | password: peritis

username : user2@peritis.fr | password: peritis

username : user3@peritis.fr | password: peritis

username : user4@peritis.fr | password: peritis
