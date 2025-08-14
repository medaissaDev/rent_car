# Car Rental App (Tunisia)

Full-stack app for car rentals in Tunisia.

- Mobile: Expo React Native (iOS/Android/Web)
- Backend: Node.js (Express, MongoDB, Socket.IO, MQTT), Paymee payments

## Structure
- `server/`: API + realtime
- `mobile/`: Expo app (NativeBase UI)
- `mosquitto/` + `docker-compose.yml`: Dev services

## Prereqs
- Node.js 18+
- MongoDB and Mosquitto (or Docker)

## Backend
- Copy env: `cp server/.env.example server/.env`
- Install & run: `cd server && npm install && npm run dev`

## Mobile (Expo)
- Set `mobile/src/utils/config.ts` to your API URL
- Install & run: `cd mobile && npm install && npm start`

## Docker (optional)
- `docker compose up -d` to start MongoDB + Mosquitto

## Features
- Auth (user/company)
- Companies add cars (images, price TND, caution)
- Search/filter, rent (cash/card via Paymee)
- Realtime chat (Socket.IO + MQTT)