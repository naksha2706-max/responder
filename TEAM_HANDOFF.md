# Team Handoff - Running the Sahayak AI Demo

This guide is for teammates who need to run the Sahayak AI prototype for video demos or testing.

## 1. Getting the Code
Since the project is already on GitHub, you can clone it:
```bash
git clone https://github.com/naksha2706-max/responder.git
cd responder
```

## 2. Setting Up the Frontend
The frontend is a React application located in the `frontend` folder.
```bash
cd frontend
npm install
npm start
```
- **URL**: http://localhost:3000
- **Note**: Ensure you have Node.js installed.

## 3. Setting Up the Backend (Optional for UI Demo)
The primary logic is handled by the `sahayak-ai` Next.js app or the AWS backend. To run the `sahayak-ai` assistant locally:
```bash
cd sahayak-ai
npm install
npm run dev
```
- **URL**: http://localhost:3001 (or as specified in the terminal)

## 4. Key Demo Features
- **Welcome Screen**: Select a crisis category to begin.
- **Chat Interface**: Multilingual support (try typing in Hindi or English).
- **Action Center**: Show the "Second Opinion," "Legal Rights," and "Evidence Capsule."
- **Theme**: Notice the uniform Blue/Purple theme designed for calm and trust.

## 5. Security & Credentials
- **Secrets**: AWS keys have been scrubbed for security.
- **Local Dev**: Contact the project owner if you need a `.env.local` file with active AWS credits for live AI responses. Without this, the system will use safe fallback responses.
