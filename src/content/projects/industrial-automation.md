---
title: 'An editor for industrial automation'
description: 'A visual workflow editor connecting automation states to backend services, with real-time diagnostics.'
lang: en
translationKey: industrial-automation
category: Industrial software
technologies: [React, Node.js, RabbitMQ]
featured: true
order: 3
---

## Context

Drag a state into an editor, connect it to a service, and inspect what’s happening. That was the idea behind this industrial automation project: make the relationships between automation states and software services something people could work with visually.

## Challenge

Drawing the workflow was only part of it. The editor also needed to connect that representation to backend services and bring diagnostic information back to the interface in real time.

## My contribution

I built a drag-and-drop automation workflow editor using React, Node.js, and RabbitMQ. The editor enabled users to connect states to microservices visually and inspect real-time diagnostics.

## Architecture & technologies

React handled the visual editor, with Node.js and RabbitMQ supporting the backend service integration.

## Outcome

The result was an editor where users could connect automation states to services and inspect diagnostics in the same workflow. It brought the visual model and the running system into one interface.

## Related experience

Elsewhere in my industrial software work, I’ve connected equipment over TCP, serial connections, and MQTT, with Node.js gateways and React monitoring interfaces. The editor is one part of that wider background.
