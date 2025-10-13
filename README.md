!!Important. NodeJs Needed!
!!Important. SamCli Needed!
!!Important. You will need to have docker installed and runing to start

 For Frontend: `cd frontend`
- Recommended: `Node.js v20.x`
- **Install:** `npm i` or `yarn install`
- **Start:** `npm run dev` or `yarn dev`
- **Build:** `npm run build` or `yarn build`
- Open browser: `http://127.0.0.1:8000/`


For Backend: `cd backend`
- **Setting Local MongoDB:** `docker pull mongodb/mongodb-community-server`
- **For Data Persistance:** `docker volume create mongodb_data`
- **Run Services:** `docker run --name mongodb -d -p 27017:27017 -v mongodb_data:/data/db mongodb/mongodb-community-server`
- **Build:** `sam build --template api.yaml`
- **Start:** `sam local start-api`
- Api should be running on: `http://127.0.0.1:3000/`

!!Important. For Admin First Access
Create a new "users" collection to MongoDB on your configured database
Add default-admin-user.json to "users" collection

Default Credentials:
- **Email:** playstudios@admin.com
- **Password:** PlaystudiosAdmin123
