# DeliverYves-G2
[![Azure Static Web Apps CI/CD](https://github.com/ClarysseArthur/DeliverYves-G2/actions/workflows/azure-static-web-apps-blue-wave-09ce3da03.yml/badge.svg?branch=Main)](https://github.com/ClarysseArthur/DeliverYves-G2/actions/workflows/azure-static-web-apps-blue-wave-09ce3da03.yml)

[![Build and deploy container app to Azure Web App - dyg2api](https://github.com/ClarysseArthur/DeliverYves-G2/actions/workflows/Main_dyg2api.yml/badge.svg)](https://github.com/ClarysseArthur/DeliverYves-G2/actions/workflows/Main_dyg2api.yml)

## Installatie web app

Als u de voor geprogrammeerde web app wilt gebruiken, kan u die gemakkelijk hosten via een Azure Static Web App1. Om te beginnen maakt u een Static Web App aan in uw resource group in Azure, om de code te uploaden kan u kiezen tussen GitHub Actions, Azure DevOps en other. Als u de code gewoon wilt uploaden, kies dan other. Als er nog aanpassingen moeten gebeuren kan u voor GitHub Actions kiezen. Als u alle stappendoorlopen hebt, kan u via de gegenereerde URL naar uw website surfen.

Als u een eigen domeinnaam wilt koppelen aan de website, kan u dat doen via het tabblad “Custom domains”. Daar kan u op de optie “Add custom domain” klikken. Start met het domein “www.customdomain.be” toe te voegen. Daarna kan u het domein “customdomain.be” toe voegen. Volg de stappen om de DNS records bij uw domein provider aan te passen.

## Installatie API

Om de API op Azure te hosten kan u gebruik maken van een Web App voor Containers2. De verschillende stappen zijn gelijk aan de installatie van de website. Als je kiest voor GitHub Actions, moet je de locatie van de Dockerfile meegeven. Als de resource is aangemaakt, kan u via de “log stream” kijken naar de logs van de Docker Container.

De stappen om het de API aan een eigen domein toe te voegen, zijn hetzelfde als de installatie voor een web app. Als domein kan je bijvoorbeeld “api.customdomain.be”, i.p.v. www.

## Installatie IOT Hub

Om de camera’s te besturen gebruiken wij een Raspberry Pi 4b, je kan hiervoor elke microcontroller met 4 camera aansluitingen gebruiken. Om de besturing universeel te houden hebben we gekozen om met Azure IOT Hub3 te werken.
Start met een IOT Hub service aan te maken in Azure, maak dan een nieuw device aan. Per klant wordt er een device gebruikt, voeg in de device twin de gewenste eigenschappen toe. Bijvoorbeeld Naam, Id en IP-adres. Daarna kan de code van GitHub geïnstalleerd worden, begin met het volgende commando:

`sudo pip install -r requirements.txt`

Daarna kan je het python script instellen om op te starten als de pi boot. Dit doe je door in het bestand “/etc/rc.local” volgende code toe te voegen:

`sudo python /home/pi/sample.py &`

Nu is de controller klaar om via IOT Hub te communiceren.
