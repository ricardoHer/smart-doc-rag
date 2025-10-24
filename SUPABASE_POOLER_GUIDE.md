# Supabase Session Pooler Configuration

## Problem

Supabase free tier is not compatible with IPv4 by default, causing error:

```
connect ENETUNREACH 2600:1f16:... - Local (:::0)
```

## Solution: Session Pooler

### 1. Get Session Pooler URL

In Supabase dashboard:

1. Project → Settings → Database
2. Connection Parameters
3. Copy the **Session pooler** URL (not Direct connection)

### 2. Identify the Difference

```bash
# ❌ Direct connection (problematic)
postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres

# ✅ Session pooler (works on Render)
postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:6543/postgres
```

**Main difference: port 6543 instead of 5432**

### 3. Configure on Render

1. Render Dashboard → Your backend service
2. Settings → Environment Variables
3. Edit `DATABASE_URL`
4. **Change `:5432` to `:6543`**
5. Save Changes (will auto-redeploy)

### 4. Verify Connection

After redeploy, check Render logs for:

```
Database connected successfully at: [timestamp]
```

### 5. Session Pooler Benefits

- ✅ IPv4 compatibility
- ✅ Better performance with pooled connections
- ✅ Reduces connection timeouts
- ✅ Keeps Supabase free tier

### 6. Limitations

- Maximum 15 simultaneous connections on free tier
- 300 second timeout per query
- Some extensions may not work

## Troubleshooting

If there are still problems:

1. Verify the URL is correct
2. Check if pgvector extension is enabled
3. Test local connection with new URL
