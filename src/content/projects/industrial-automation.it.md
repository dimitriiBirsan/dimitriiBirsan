---
title: 'Un editor per l’automazione industriale'
description: 'Un editor visuale che collega stati di automazione e servizi backend, con diagnostica in tempo reale.'
lang: it
translationKey: industrial-automation
category: Software industriale
technologies: [React, Node.js, RabbitMQ]
featured: true
order: 3
---

## Contesto

Trascinare uno stato nell’editor, collegarlo a un servizio e vedere cosa succede. L’idea del progetto era questa: rendere visuali e modificabili le relazioni tra stati di automazione e servizi software.

## Problema tecnico

Disegnare il flusso era solo una parte. L’editor doveva anche collegare quella rappresentazione ai servizi backend e riportare le informazioni diagnostiche nell’interfaccia in tempo reale.

## Il mio contributo

Ho sviluppato un editor drag-and-drop per i flussi di automazione con React, Node.js e RabbitMQ. L’editor permetteva di collegare visivamente gli stati ai microservizi e consultare la diagnostica in tempo reale.

## Architettura e tecnologie

React gestiva l’editor visuale, mentre Node.js e RabbitMQ supportavano l’integrazione con i servizi backend.

## Risultato

Il risultato è stato un editor in cui collegare stati di automazione e servizi, consultando la diagnostica nello stesso flusso di lavoro. Il modello visuale e il sistema in esecuzione erano riuniti in un’unica interfaccia.

## Esperienze correlate

In altri progetti industriali ho collegato macchinari tramite TCP, connessioni seriali e MQTT, con gateway Node.js e interfacce di monitoraggio React. L’editor è una parte di questo percorso più ampio.
