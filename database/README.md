# Database Schema

This folder contains database schema files and migration scripts for Chronicle.

## Files

- `supabase-schema.sql` - Original Supabase database schema
- `supabase-schema-fixed.sql` - Updated/fixed version of the schema

## Database Structure

Chronicle uses a hybrid storage approach:

### Local Storage (MVP)
- **Web**: Browser localStorage
- **Mobile**: Native device storage via Capacitor
- **Format**: JSON objects stored by feature type

### Supabase (Optional Enhancement)
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth
- **Real-time**: Live updates across devices
- **Backup**: Cloud storage for data safety

## Tables

### Core Tables
- `achievements` - User achievements and milestones
- `resources` - Saved notes, links, and references
- `goals` - Personal goals and progress tracking
- `tasks` - Todo items and task management
- `routines` - Recurring daily/weekly activities

### System Tables
- `profiles` - User profile information
- `user_settings` - Application preferences

## Usage

### Development
```sql
-- Run schema in Supabase dashboard or CLI
psql -h your-host -d your-db -f database/supabase-schema-fixed.sql
```

### Local Development
The app works without a database using localStorage. Database integration is optional for enhanced features.

## Migration Strategy

1. **Phase 1**: localStorage only (current)
2. **Phase 2**: Hybrid localStorage + Supabase sync
3. **Phase 3**: Full cloud storage with offline support

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Authentication required for all operations
- Data validation at application and database level