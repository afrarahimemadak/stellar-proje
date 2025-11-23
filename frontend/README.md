# StellarWork - Decentralized Freelance Marketplace

A Web3-powered freelancer marketplace built on the Stellar blockchain with Freighter wallet integration.

## Features

- Freighter wallet authentication with Stellar blockchain
- Dual user roles: Freelancer and Employer
- Real-time XLM wallet balance display
- FastAPI backend integration for dynamic data
- Secure XLM payments via smart contracts
- Modern, responsive UI with Tailwind CSS

## Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Stellar SDK v14.3.3
- Freighter API v2.0.0
- Axios for API requests

**Backend:**
- FastAPI (Python)
- Running on `http://localhost:8000`

## Prerequisites

1. **Freighter Wallet Extension**
   - Install from [freighter.app](https://www.freighter.app/)
   - Create or import a Stellar wallet
   - Switch to Testnet for development

2. **Backend API**
   - FastAPI backend running on port 8000
   - Endpoints must be accessible from frontend

## Getting Started

### 1. Clone and Install

\`\`\`bash
# Install dependencies (handled automatically by v0)
npm install
\`\`\`

### 2. Configure Backend URL

Create `.env.local` file:

\`\`\`env
NEXT_PUBLIC_API_URL=http://YOUR_BACKEND_IP:8000
\`\`\`

Replace `YOUR_BACKEND_IP` with your actual backend server IP address.

### 3. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## Usage Flow

### For Freelancers:

1. Click "Connect as Freelancer"
2. Approve Freighter wallet connection
3. If new user: Complete registration form with:
   - Personal info (name, email)
   - Professional title
   - Hourly rate in USD
   - Skills, equipment, and experience
4. Profile is created in backend via API
5. View marketplace to see available projects

### For Employers:

1. Click "Connect as Employer"
2. Approve Freighter wallet connection
3. If new user: Complete registration with:
   - Company information
   - Contact details
   - First project details (title, description, budget)
4. Profile and project posted to backend
5. Browse freelancers and make XLM payments

## API Integration

The frontend connects to FastAPI backend with these endpoints:

### Users
- `POST /users` - Create new user
- `GET /users` - List all users

### Freelancer Jobs
- `POST /freelancer/jobs` - Create freelancer profile
- `GET /freelancer/jobs` - List all freelancers

### Employer Jobs
- `POST /employer/jobs` - Create employer project
- `GET /employer/jobs` - List all projects

All API calls are handled in `lib/api.ts` using Axios.

## Stellar Integration

- **Network:** Testnet (switch to Mainnet for production)
- **Wallet:** Freighter extension
- **Token:** XLM native asset
- **Exchange Rate:** 1 XLM ≈ $0.10 (demo rate, update for production)

### Payment Flow

1. Employer clicks "Pay Hourly Rate"
2. Specifies number of hours
3. Amount converted from USD to XLM
4. Freighter popup opens for transaction signing
5. Payment sent on Stellar blockchain
6. Transaction hash returned on success

## Environment Variables

Required variables in `.env.local`:

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8000  # Backend API URL
\`\`\`

## Backend Setup

Your FastAPI backend should implement these models:

\`\`\`python
# User model
{
  "full_name": str,
  "wallet_address": str,
  "email": str,
  "user_type": "freelancer" | "employer"
}

# Freelancer job model
{
  "user_id": int,
  "title": str,
  "description": str,
  "budget": float,
  "skills": List[str],
  "hourly_rate": float,
  "availability": str,
  "equipment": str,
  "experience": str
}

# Employer job model
{
  "user_id": int,
  "title": str,
  "description": str,
  "salary": float,
  "duration": str,
  "skills": List[str]
}
\`\`\`

## Troubleshooting

### Freighter Not Detected

- Ensure extension is installed and enabled
- Refresh the page after installing
- Check browser console for errors
- Try disconnecting and reconnecting

### API Connection Failed

- Verify backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure CORS is enabled on backend
- Check network tab for failed requests

### Payment Fails

- Ensure you have XLM balance in Freighter wallet
- Use Stellar Testnet friendbot to get test XLM
- Verify recipient wallet address is valid
- Check transaction in Stellar Explorer

## Production Deployment

1. Update `.env.local` with production API URL
2. Change Stellar network to Mainnet in `lib/stellar.ts`:
   \`\`\`typescript
   export const SERVER = new StellarSdk.Horizon.Server("https://horizon.stellar.org")
   export const NETWORK_PASSPHRASE = StellarSdk.Networks.PUBLIC
   \`\`\`
3. Update XLM exchange rate with real-time data
4. Deploy to Vercel or your preferred hosting

## Security Notes

- Never commit `.env.local` to version control
- Keep API keys and secrets secure
- Use environment variables for sensitive data
- Implement rate limiting on backend
- Add wallet address validation
- Use HTTPS in production

## License

MIT License - Built with v0 by Vercel
\`\`\`

```typescript file="" isHidden
