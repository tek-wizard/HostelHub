# 🚀 HostelHub Deployment Guide - Vercel

## Step-by-Step Deployment Process

### 1. 📋 Prerequisites
- GitHub account
- Vercel account (free tier available)
- MongoDB Atlas account (free tier available)

### 2. 🗄️ Set Up MongoDB Atlas Database

1. **Create MongoDB Atlas Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for free account
   - Create a new cluster (free tier: M0 Sandbox)

2. **Configure Database:**
   - Cluster Name: `hostelhub-cluster`
   - Database Name: `hostelhub`
   - Region: Choose closest to your users

3. **Create Database User:**
   - Go to Database Access
   - Add New Database User
   - Username: `hostelhub-user`
   - Password: Generate strong password
   - Grant `Atlas admin` or `Read and write to any database`

4. **Configure Network Access:**
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (Allow access from anywhere)
   - This is needed for Vercel deployment

5. **Get Connection String:**
   - Go to Clusters → Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Save this for environment variables

### 3. 📁 Prepare Your Repository

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

### 4. 🌐 Deploy to Vercel

1. **Connect to Vercel:**
   - Go to [Vercel](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your HostelHub repository

2. **Configure Project Settings:**
   - Framework Preset: "Other"
   - Root Directory: Leave as "." (root)
   - Build Settings: Keep defaults

3. **Set Environment Variables:**
   Click "Environment Variables" and add:
   ```
   MONGO_URI = your-mongodb-connection-string
   NODE_ENV = production
   PORT = 8000
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete (2-3 minutes)

### 5. 🔧 Post-Deployment Configuration

1. **Update CORS Origins:**
   - Once deployed, note your Vercel domain (e.g., `https://hostelhub-abc123.vercel.app`)
   - Update `Backend/server.js` CORS configuration:
   ```javascript
   const corsOptions = {
       origin: process.env.NODE_ENV === 'production' 
           ? ['https://hostelhub-abc123.vercel.app'] // Your actual domain
           : ['http://localhost:5173'],
       // ...
   };
   ```

2. **Test Deployment:**
   - Visit your Vercel URL
   - Test API health: `https://your-domain.vercel.app/api/health`
   - Test creating a washing machine session

### 6. 🎯 Custom Domain (Optional)

1. **Buy Domain:**
   - Purchase from any domain provider
   - Example: `hostelhub.com`

2. **Configure in Vercel:**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

### 7. 📊 Monitoring & Maintenance

1. **Vercel Dashboard:**
   - Monitor deployments
   - View logs and analytics
   - Set up alerts

2. **MongoDB Atlas:**
   - Monitor database usage
   - Set up alerts for performance
   - Regular backups (automatic in Atlas)

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Check CORS origins in `Backend/server.js`
   - Ensure your Vercel domain is included

2. **Database Connection:**
   - Verify MongoDB connection string
   - Check network access settings in Atlas
   - Ensure environment variables are set correctly

3. **Build Failures:**
   - Check Vercel build logs
   - Ensure all dependencies are in package.json
   - Verify file paths and imports

### 📞 Support Commands:

```bash
# Test locally before deployment
npm run dev          # Start development servers
npm run build        # Test production build
npm run preview      # Preview production build

# Vercel CLI (optional)
npm i -g vercel
vercel login
vercel --prod        # Deploy from command line
```

## 🎉 Success!

Your HostelHub app should now be live at:
`https://your-project-name.vercel.app`

The app includes:
- ✅ React frontend with real-time updates
- ✅ Node.js/Express backend API
- ✅ MongoDB database
- ✅ Responsive design for mobile/desktop
- ✅ Automatic deployments on Git push 