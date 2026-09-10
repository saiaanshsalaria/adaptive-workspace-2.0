# Production deployment

## MongoDB Atlas

Create a production Atlas cluster, restrict network access to the backend service, create a least-privilege database user, and set `MONGODB_URI` in Render. Enable Atlas backups before accepting real user data.

## Backend on Render

Create the service from `render.yaml` or deploy the repository as a Docker web service. Set `CLIENT_ORIGIN` to the exact HTTPS Vercel URL. Configure SMTP credentials, `EMAIL_FROM`, and a generated `JWT_SECRET` in Render secrets.

## Frontend on Vercel

Import the `frontend` directory as the project root and set `VITE_API_URL` to the Render API URL. Redeploy after setting the variable.

Cookies are HTTP-only and use `SameSite=None` in production, so both deployments must use HTTPS. Do not expose SMTP, MongoDB, or JWT secrets to Vercel.
