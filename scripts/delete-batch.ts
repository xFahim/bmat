
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const BUCKET_NAME = 'memeBucket1';

async function main() {
  const sourceFolder = process.argv[2];

  if (!sourceFolder) {
    console.error('Usage: npm run clean-batch -- <sourceFolder>');
    console.error('Example: npm run clean-batch -- RajnoitikShitposting');
    process.exit(1);
  }

  console.log(`Searching for memes in source folder: "${sourceFolder}"...`);

  // Step 1: Query memes table
  const { data: memes, error: queryError } = await supabase
    .from('memes')
    .select('id, storage_path')
    .eq('source_folder', sourceFolder);

  if (queryError) {
    console.error('Error querying memes:', queryError);
    process.exit(1);
  }

  if (!memes || memes.length === 0) {
    console.log('No memes found for this source folder.');
    return;
  }

  console.log(`Found ${memes.length} memes to delete.`);

  // Step 2: Delete files from storage
  const filePaths = memes
    .map((m) => m.storage_path)
    .filter((path): path is string => !!path); // Type guard

  if (filePaths.length > 0) {
    console.log(`Deleting ${filePaths.length} files from storage bucket "${BUCKET_NAME}"...`);
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(filePaths);

    if (storageError) {
      console.error('Error deleting files from storage:', storageError);
      // We might want to continue to delete rows even if storage delete fails, 
      // or stop here. For now, let's warn and continue, as the rows are the main sync issue.
      // But typically, if storage fails, we might end up with orphaned rows if we don't delete them,
      // or orphaned files if we do. 
      // Let's stop to be safe.
      process.exit(1);
    }
    console.log('Storage files deleted successfully.');
  } else {
    console.log('No valid storage paths found in records, skipping storage deletion.');
  }

  // Step 3: Delete rows from table
  console.log('Deleting records from database...');
  const { error: deleteError } = await supabase
    .from('memes')
    .delete()
    .eq('source_folder', sourceFolder);

  if (deleteError) {
    console.error('Error deleting rows:', deleteError);
    process.exit(1);
  }

  console.log('Database records deleted successfully.');
  console.log('Cleanup complete!');
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
